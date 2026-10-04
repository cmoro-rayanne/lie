// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { hashPassword } from '../../server/auth/password';
import { createSession } from '../../server/auth/session';
import { withErrors } from '../../server/http';
import { createMemoryRepo } from '../../server/repo/memory';
import type { AdminRepo } from '../../server/repo/types';
import { createMeHandler } from './me';

const EMAIL = 'eliana@exemplo.com';
const NAME = 'Eliana Lino';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

afterEach(() => {
  vi.useRealTimers();
});

async function signedInCookie(repo: AdminRepo): Promise<string> {
  const created = await repo.createUser({ name: NAME, email: EMAIL, passwordHash: await hashPassword('senha12345') });
  if (!created.ok) throw new Error('falha no setup');
  const { cookie } = await createSession(repo, created.user.id);
  return cookie.split(';')[0];
}

function meRequest(cookie?: string): Request {
  return new Request('https://ilelino.example/api/admin/me', {
    headers: cookie === undefined ? {} : { cookie },
  });
}

describe('GET /api/admin/me', () => {
  it('sem cookie responde 401 e não retorna dados (AUTH-14)', async () => {
    const GET = withErrors(createMeHandler({ repo: () => createMemoryRepo() }));
    const res = await GET(meRequest());

    expect(res.status).toBe(401);
    expect(await res.json()).not.toHaveProperty('email');
  });

  it('sessão válida responde 200 com name e email, sem id nem hash (AUTH-30)', async () => {
    const repo = createMemoryRepo();
    const cookie = await signedInCookie(repo);
    const GET = withErrors(createMeHandler({ repo: () => repo }));
    const res = await GET(meRequest(cookie));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ name: NAME, email: EMAIL });
  });

  it('sessão expirada há 1 segundo responde 401 e expira o cookie (AUTH-16, AUTH-19)', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-04T12:00:00Z'));
    const repo = createMemoryRepo();
    const cookie = await signedInCookie(repo);

    vi.setSystemTime(new Date(Date.parse('2026-10-04T12:00:00Z') + SEVEN_DAYS_MS + 1000));
    const GET = withErrors(createMeHandler({ repo: () => repo }));
    const res = await GET(meRequest(cookie));

    expect(res.status).toBe(401);
    expect(await res.json()).not.toHaveProperty('email');
    expect(res.headers.get('set-cookie')).toContain('Max-Age=0');
  });

  it('cookie adulterado responde 401 e expira o cookie (AUTH-19)', async () => {
    const GET = withErrors(createMeHandler({ repo: () => createMemoryRepo() }));
    const res = await GET(meRequest('admin_session=token-adulterado'));

    expect(res.status).toBe(401);
    expect(res.headers.get('set-cookie')).toContain('Max-Age=0');
  });
});
