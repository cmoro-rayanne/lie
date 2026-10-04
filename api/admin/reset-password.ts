import { getConfig } from '../../server/config';
import { getRepo } from '../../server/deps';
import { hashPassword } from '../../server/auth/password';
import { hashToken } from '../../server/auth/tokens';
import { createMailer, type Mailer } from '../../server/mail';
import { fail, json, withErrors } from '../../server/http';
import type { AdminRepo } from '../../server/repo/types';
import { resetSchema } from '../../server/validation';

const INVALID_MESSAGE = 'Este link não é mais válido. Solicite um novo';

export interface ResetDeps {
  repo: () => AdminRepo;
  mailer: () => Mailer;
}

export function createResetPasswordHandler(deps: ResetDeps) {
  return async (request: Request): Promise<Response> => {
    const repo = deps.repo();
    const mailer = deps.mailer();

    const body: unknown = await request.json().catch(() => undefined);
    if (typeof body !== 'object' || body === null) return fail(400, 'Requisição inválida');

    const parsed = resetSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return fail(400, issue.message, String(issue.path[0]));
    }
    const { token, password } = parsed.data;

    const tokenHash = hashToken(token);
    const passwordHash = await hashPassword(password);
    const result = await repo.resetPasswordTx({ tokenHash, passwordHash, now: new Date() });
    if (result === 'invalid') return fail(410, INVALID_MESSAGE);

    const record = await repo.findResetToken(tokenHash);
    const user = record === null ? null : await repo.findUserById(record.userId);
    if (user !== null) {
      try {
        await mailer.sendPasswordChanged(user.email, user.name);
      } catch (error) {
        console.error(error);
      }
    }

    return json(200, { ok: true });
  };
}

export const POST = withErrors(
  createResetPasswordHandler({
    repo: () => getRepo(),
    mailer: () => {
      const config = getConfig();
      return createMailer({ apiKey: config.resendApiKey, from: config.mailFrom });
    },
  }),
);
