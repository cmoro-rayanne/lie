import type { AdminRepo } from '../repo/types';

const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60 * 1000;

/** True quando a chave tem 5 ou mais falhas nos últimos 15 minutos. */
export async function isLimited(repo: AdminRepo, key: string): Promise<boolean> {
  const since = new Date(Date.now() - WINDOW_MS);
  return (await repo.countFailures(key, since)) >= MAX_FAILURES;
}

export async function recordFailure(repo: AdminRepo, key: string): Promise<void> {
  await repo.recordFailure(key, new Date());
}

export async function clear(repo: AdminRepo, key: string): Promise<void> {
  await repo.clearFailures(key);
}
