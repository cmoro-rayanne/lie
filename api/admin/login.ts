import { getRepo } from '../../server/deps';
import { DUMMY_HASH, verifyPassword } from '../../server/auth/password';
import { clear, isLimited, recordFailure } from '../../server/auth/rateLimit';
import { createSession } from '../../server/auth/session';
import { fail, json, withErrors } from '../../server/http';
import type { AdminRepo } from '../../server/repo/types';
import { loginSchema } from '../../server/validation';

const LIMIT_MESSAGE = 'Muitas tentativas. Tente novamente em 15 minutos';
const INVALID_MESSAGE = 'E-mail ou senha incorretos';

export interface LoginDeps {
  repo: () => AdminRepo;
}

export function createLoginHandler(deps: LoginDeps) {
  return async (request: Request): Promise<Response> => {
    const repo = deps.repo();
    const body: unknown = await request.json().catch(() => undefined);
    if (typeof body !== 'object' || body === null) return fail(400, 'Requisição inválida');

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return fail(400, issue.message, String(issue.path[0]));
    }
    const { email, password } = parsed.data;

    if (await isLimited(repo, email)) return fail(429, LIMIT_MESSAGE);

    const user = await repo.findUserByEmail(email);
    const valid = await verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
    if (user === null || !valid) {
      await recordFailure(repo, email);
      return fail(401, INVALID_MESSAGE);
    }

    await clear(repo, email);
    const { cookie } = await createSession(repo, user.id);
    return json(200, { name: user.name, email: user.email }, { 'Set-Cookie': cookie });
  };
}

export const POST = withErrors(createLoginHandler({ repo: () => getRepo() }));
