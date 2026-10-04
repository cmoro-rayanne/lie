// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { hashPassword } from '../../server/auth/password';
import { createSession } from '../../server/auth/session';
import { hashToken } from '../../server/auth/tokens';
import { withErrors } from '../../server/http';
import { createMemoryRepo } from '../../server/repo/memory';
import type { AdminRepo } from '../../server/repo/types';
import { createLogoutHandler } from './logout';

const EMAIL = 'eliana@exemplo.com';

afterEach(() => {
  vi.restoreAllMocks();
});

async function signedInCookie(repo: AdminRepo): Promise<string> {
  const created = await repo.createUser({
    name: 'Eliana Lino',
    email: EMAIL,
    passwordHash: await hashPassword('senha12345'),
  });
  if (!created.ok) throw new Error('falha no setup');
  const { cookie } = await createSession(repo, created.user.id);
  return cookie.split(';')[0];
}

describe('POST /api/admin/logout', () => {
  it('remove a sessão do repositório, responde 200 e expira o cookie (AUTH-11)', async () => {
    const repo = createMemoryRepo();
    const pair = await signedInCookie(repo);
    const token = pair.slice('admin_session='.length);
    expect(await repo.findSession(hashToken(token))).not.toBeNull();

    const POST = withErrors(createLogoutHandler({ repo: () => repo }));
    const res = await POST(
      new Request('https://ilelino.example/api/admin/logout', { method: 'POST', headers: { cookie: pair } }),
    );

    expect(res.status).toBe(200);
    const setCookie = res.headers.get('set-cookie') ?? '';
    expect(setCookie).toMatch(/^admin_session=;/);
    expect(setCookie).toContain('Max-Age=0');
    expect(await repo.findSession(hashToken(token))).toBeNull();
  });
});
