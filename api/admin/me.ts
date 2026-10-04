import { getRepo } from '../../server/deps';
import { expiredSessionCookie, getSessionUser } from '../../server/auth/session';
import { json, withErrors } from '../../server/http';
import type { AdminRepo } from '../../server/repo/types';

export interface MeDeps {
  repo: () => AdminRepo;
}

export function createMeHandler(deps: MeDeps) {
  return async (request: Request): Promise<Response> => {
    const user = await getSessionUser(deps.repo(), request);
    if (user === null) {
      return json(401, { message: 'Sessão inexistente ou expirada' }, { 'Set-Cookie': expiredSessionCookie() });
    }
    return json(200, { name: user.name, email: user.email });
  };
}

export const GET = withErrors(createMeHandler({ repo: () => getRepo() }));
