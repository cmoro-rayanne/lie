import { getConfig } from '../../server/config';
import { getRepo } from '../../server/deps';
import { newToken } from '../../server/auth/tokens';
import { createMailer, type Mailer } from '../../server/mail';
import { fail, json, withErrors } from '../../server/http';
import type { AdminRepo } from '../../server/repo/types';
import { forgotSchema } from '../../server/validation';

const SENT_MESSAGE = 'Se o e-mail estiver cadastrado, você receberá um link em instantes';
const TOKEN_TTL_MS = 30 * 60 * 1000;

export interface ForgotDeps {
  repo: () => AdminRepo;
  mailer: () => Mailer;
  appUrl: () => string;
}

export function createForgotPasswordHandler(deps: ForgotDeps) {
  return async (request: Request): Promise<Response> => {
    const repo = deps.repo();
    const mailer = deps.mailer();
    const appUrl = deps.appUrl();

    const body: unknown = await request.json().catch(() => undefined);
    const parsed = forgotSchema.safeParse(body);
    if (!parsed.success) return fail(400, 'Informe um e-mail válido', 'email');

    const user = await repo.findUserByEmail(parsed.data.email);
    if (user !== null) {
      const { token, hash } = newToken();
      const now = new Date();
      await repo.replaceResetToken({
        userId: user.id,
        tokenHash: hash,
        createdAt: now,
        expiresAt: new Date(now.getTime() + TOKEN_TTL_MS),
      });
      try {
        await mailer.sendPasswordReset(user.email, user.name, `${appUrl}/admin/redefinir-senha#token=${token}`);
      } catch (error) {
        console.error(error);
      }
    }

    return json(200, { message: SENT_MESSAGE });
  };
}

export const POST = withErrors(
  createForgotPasswordHandler({
    repo: () => getRepo(),
    mailer: () => {
      const config = getConfig();
      return createMailer({ apiKey: config.resendApiKey, from: config.mailFrom });
    },
    appUrl: () => getConfig().appUrl,
  }),
);
