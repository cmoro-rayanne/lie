import type { AdminRepo } from './repo/types';

/**
 * Ponto de troca do repositório das rotas. Enquanto o Neon (T9) não existe, lança erro e
 * o `withErrors` responde 503. Quando a T9 entrar, esta função passa a devolver o repositório Neon.
 */
export function getRepo(): AdminRepo {
  throw new Error('Repositório Neon ainda não configurado');
}
