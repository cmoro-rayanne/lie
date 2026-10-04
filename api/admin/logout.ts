import { getRepo } from '../../server/deps';
import { destroySession } from '../../server/auth/session';
import { json, withErrors } from '../../server/http';
import type { AdminRepo } from '../../server/repo/types';

export interface LogoutDeps {
  repo: () => AdminRepo;
}

export function createLogoutHandler(deps: LogoutDeps) {
  return async (request: Request): Promise<Response> => {
    const cookie = await destroySession(deps.repo(), request);
    return json(200, { ok: true }, { 'Set-Cookie': cookie });
  };
}

export const POST = withErrors(createLogoutHandler({ repo: () => getRepo() }));
