import { getConfig } from '../../server/config';
import { getRepo } from '../../server/deps';
import { hashPassword } from '../../server/auth/password';
import { clientIp, isLimited, recordFailure } from '../../server/auth/rateLimit';
import { createSession } from '../../server/auth/session';
import { fail, json, withErrors } from '../../server/http';
import type { AdminRepo } from '../../server/repo/types';
import { signupSchema } from '../../server/validation';

const LIMIT_MESSAGE = 'Muitas tentativas. Tente novamente em 15 minutos';

export interface SignupDeps {
  repo: () => AdminRepo;
  inviteCode: () => string;
}

export function createSignupHandler(deps: SignupDeps) {
  return async (request: Request): Promise<Response> => {
    const repo = deps.repo();
    const body: unknown = await request.json().catch(() => undefined);

    const key = `invite:${clientIp(request)}`;
    if (await isLimited(repo, key)) return fail(429, LIMIT_MESSAGE);

    const invite = isRecord(body) ? body.inviteCode : undefined;
    if (invite !== deps.inviteCode()) {
      await recordFailure(repo, key);
      return fail(403, 'Código de convite inválido', 'inviteCode');
    }

    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return fail(400, issue.message, String(issue.path[0]));
    }
    const { name, email, password } = parsed.data;

    const created = await repo.createUser({ name, email, passwordHash: await hashPassword(password) });
    if (!created.ok) return fail(409, 'Já existe uma conta com este e-mail');

    const { cookie } = await createSession(repo, created.user.id);
    return json(201, { name: created.user.name, email: created.user.email }, { 'Set-Cookie': cookie });
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export const POST = withErrors(
  createSignupHandler({
    repo: () => getRepo(),
    inviteCode: () => getConfig().inviteCode,
  }),
);
