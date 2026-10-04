import { getConfig } from './config';
import { createNeonRepo } from './repo/neon';
import type { AdminRepo } from './repo/types';

// Valida a configuração ao carregar o módulo: se faltar variável, a função falha na inicialização
// com erro nomeando a variável (aparece nos logs), em vez de responder 503 a cada requisição.
const config = getConfig();
let repo: AdminRepo | undefined;

/** Ponto de troca do repositório das rotas. Usa o Neon com `DATABASE_URL`. */
export function getRepo(): AdminRepo {
  repo ??= createNeonRepo(config.databaseUrl);
  return repo;
}
