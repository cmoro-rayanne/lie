import type { AdminRepo, SessionUser } from '../repo/types';
import { hashToken, newToken } from './tokens';

export const SESSION_COOKIE = 'admin_session';

const SESSION_MAX_AGE_S = 7 * 24 * 60 * 60;
const SESSION_MS = SESSION_MAX_AGE_S * 1000;
const COOKIE_ATTRIBUTES = 'HttpOnly; Secure; SameSite=Lax; Path=/';

function readToken(request: Request): string | null {
  const header = request.headers.get('cookie') ?? '';
  for (const part of header.split(';')) {
    const trimmed = part.trim();
    if (trimmed.startsWith(`${SESSION_COOKIE}=`)) {
      return trimmed.slice(SESSION_COOKIE.length + 1) || null;
    }
  }
  return null;
}

/** Cookie que expira a sessão no navegador. */
export function expiredSessionCookie(): string {
  return `${SESSION_COOKIE}=; ${COOKIE_ATTRIBUTES}; Max-Age=0`;
}

/** Cria a sessão de 7 dias fixos (sem renovação) e devolve o `Set-Cookie`. */
export async function createSession(repo: AdminRepo, userId: string): Promise<{ cookie: string }> {
  const { token, hash } = newToken();
  const createdAt = new Date();
  await repo.createSession({
    tokenHash: hash,
    userId,
    createdAt,
    expiresAt: new Date(createdAt.getTime() + SESSION_MS),
  });
  return { cookie: `${SESSION_COOKIE}=${token}; ${COOKIE_ATTRIBUTES}; Max-Age=${SESSION_MAX_AGE_S}` };
}

/** Usuário da sessão do cookie; null se não houver cookie, sessão, sessão expirada ou conta removida. */
export async function getSessionUser(repo: AdminRepo, request: Request): Promise<SessionUser | null> {
  const token = readToken(request);
  if (token === null) return null;

  const session = await repo.findSession(hashToken(token));
  if (session === null || session.expiresAt.getTime() <= Date.now()) return null;

  return repo.findUserById(session.userId);
}

/** Remove a sessão do cookie (se houver) e devolve o cookie expirado. */
export async function destroySession(repo: AdminRepo, request: Request): Promise<string> {
  const token = readToken(request);
  if (token !== null) {
    await repo.deleteSession(hashToken(token));
  }
  return expiredSessionCookie();
}
