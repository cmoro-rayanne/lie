import type { AdminRepo } from '../repo/types';

const MAX_FAILURES = 5;
/** Teto por IP no login: maior que o do e-mail, para não punir um IP com vários usuários legítimos. */
export const LOGIN_IP_MAX_FAILURES = 20;
const WINDOW_MS = 15 * 60 * 1000;

/** True quando a chave tem `max` falhas ou mais nos últimos 15 minutos. */
export async function isLimited(
  repo: AdminRepo,
  key: string,
  max = MAX_FAILURES,
): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);
  return (await repo.countFailures(key, since)) >= max;
}

/**
 * IP do cliente. Usa o ÚLTIMO valor de x-forwarded-for: é o hop que a plataforma anexa.
 * O primeiro valor vem do próprio cliente e pode ser forjado para contornar o limite.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const last = forwarded.split(',').pop()?.trim();
    if (last) return last;
  }
  return request.headers.get('x-real-ip') ?? 'desconhecido';
}

export async function recordFailure(repo: AdminRepo, key: string): Promise<void> {
  await repo.recordFailure(key, new Date());
}

export async function clear(repo: AdminRepo, key: string): Promise<void> {
  await repo.clearFailures(key);
}
