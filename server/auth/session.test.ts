// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryRepo } from '../repo/memory';
import type { AdminRepo, SessionUser } from '../repo/types';
import { hashToken } from './tokens';
import { createSession, destroySession, getSessionUser } from './session';

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const START = new Date('2026-10-04T12:00:00.000Z');

async function seedUser(repo: AdminRepo): Promise<SessionUser> {
  const result = await repo.createUser({ name: 'Ana Souza', email: 'ana@exemplo.com', passwordHash: 'scrypt$x' });
  if (!result.ok) throw new Error('seed falhou');
  return result.user;
}

function tokenFrom(cookie: string): string {
  return cookie.slice('admin_session='.length).split(';')[0] ?? '';
}

function requestWith(cookie: string | null): Request {
  const headers: Record<string, string> = cookie === null ? {} : { cookie };
  return new Request('https://ilelino.example/api/admin/me', { headers });
}

describe('serviço de sessão', () => {
  let repo: AdminRepo;

  beforeEach(() => {
    repo = createMemoryRepo();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(START);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('createSession grava expires_at exatamente 7 dias após a criação (AUTH-12)', async () => {
    const user = await seedUser(repo);
    const { cookie } = await createSession(repo, user.id);

    const stored = await repo.findSession(hashToken(tokenFrom(cookie)));
    expect(stored?.expiresAt.getTime()).toBe(START.getTime() + SEVEN_DAYS_MS);
  });

  it('cookie de sessão tem HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800 (AUTH-12)', async () => {
    const user = await seedUser(repo);
    const { cookie } = await createSession(repo, user.id);

    expect(cookie.startsWith('admin_session=')).toBe(true);
    expect(cookie).toContain('; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800');
  });

  it('getSessionUser devolve nome, e-mail e id da conta com sessão válida (AUTH-30)', async () => {
    const user = await seedUser(repo);
    const { cookie } = await createSession(repo, user.id);

    const found = await getSessionUser(repo, requestWith(cookie));
    expect(found).toEqual({ id: user.id, name: 'Ana Souza', email: 'ana@exemplo.com' });
  });

  it('getSessionUser ainda aceita a sessão um segundo antes de completar 7 dias', async () => {
    const user = await seedUser(repo);
    const { cookie } = await createSession(repo, user.id);

    vi.setSystemTime(new Date(START.getTime() + SEVEN_DAYS_MS - 1000));
    const found = await getSessionUser(repo, requestWith(cookie));
    expect(found?.id).toBe(user.id);
  });

  it('uso da sessão não renova expires_at: não há renovação deslizante (AUTH-12)', async () => {
    const user = await seedUser(repo);
    const { cookie } = await createSession(repo, user.id);
    const hash = hashToken(tokenFrom(cookie));
    const before = (await repo.findSession(hash))?.expiresAt.getTime();

    vi.setSystemTime(new Date(START.getTime() + 3 * 24 * 60 * 60 * 1000));
    expect((await getSessionUser(repo, requestWith(cookie)))?.id).toBe(user.id);

    const after = (await repo.findSession(hash))?.expiresAt.getTime();
    expect(before).toBe(START.getTime() + SEVEN_DAYS_MS);
    expect(after).toBe(before);
  });

  it('getSessionUser devolve null para sessão expirada há 1 segundo (AUTH-16)', async () => {
    const user = await seedUser(repo);
    const { cookie } = await createSession(repo, user.id);

    vi.setSystemTime(new Date(START.getTime() + SEVEN_DAYS_MS + 1000));
    expect(await getSessionUser(repo, requestWith(cookie))).toBeNull();
  });

  it('getSessionUser devolve null para cookie com token inexistente (AUTH-19)', async () => {
    await seedUser(repo);
    const cookie = 'admin_session=token-que-nunca-foi-emitido';

    expect(await getSessionUser(repo, requestWith(cookie))).toBeNull();
  });

  it('getSessionUser devolve null para token adulterado (AUTH-19)', async () => {
    const user = await seedUser(repo);
    const { cookie } = await createSession(repo, user.id);
    const token = tokenFrom(cookie);
    const tampered = `${token.slice(0, -1)}${token.endsWith('A') ? 'B' : 'A'}`;

    expect(await getSessionUser(repo, requestWith(`admin_session=${tampered}`))).toBeNull();
  });

  it('getSessionUser devolve null sem cookie de sessão (AUTH-14)', async () => {
    expect(await getSessionUser(repo, requestWith(null))).toBeNull();
  });

  it('destroySession remove a sessão do repositório (AUTH-11)', async () => {
    const user = await seedUser(repo);
    const { cookie } = await createSession(repo, user.id);
    const request = requestWith(cookie);

    await destroySession(repo, request);

    expect(await repo.findSession(hashToken(tokenFrom(cookie)))).toBeNull();
    expect(await getSessionUser(repo, request)).toBeNull();
  });

  it('destroySession devolve cookie expirado com Max-Age=0 (AUTH-11)', async () => {
    const user = await seedUser(repo);
    const { cookie } = await createSession(repo, user.id);

    const expired = await destroySession(repo, requestWith(cookie));
    expect(expired.startsWith('admin_session=;')).toBe(true);
    expect(expired).toContain('Max-Age=0');
  });
});
