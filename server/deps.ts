import { getConfig } from './config';
import { createNeonRepo } from './repo/neon';
import type { AdminRepo } from './repo/types';

let repo: AdminRepo | undefined;

/**
 * Ponto de troca do repositório das rotas. Usa o Neon com `DATABASE_URL`; se a configuração
 * estiver incompleta, `getConfig()` lança e o `withErrors` responde 503.
 */
export function getRepo(): AdminRepo {
  repo ??= createNeonRepo(getConfig().databaseUrl);
  return repo;
}
