// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { hashPassword, verifyPassword } from '../../server/auth/password';
import { createSession } from '../../server/auth/session';
import { hashToken, newToken } from '../../server/auth/tokens';
import { withErrors } from '../../server/http';
import type { Mailer } from '../../server/mail';
import { createMemoryRepo } from '../../server/repo/memory';
import type { AdminRepo } from '../../server/repo/types';
import { createForgotPasswordHandler } from './forgot-password';
import { createResetPasswordHandler } from './reset-password';

const APP_URL = 'https://ilelino.example';
const EMAIL = 'eliana@exemplo.com';
const NAME = 'Eliana Lino';
const OLD_PASSWORD = 'senha12345';
const NEW_PASSWORD = 'novasenha999';
const INVALID_MESSAGE = 'Este link não é mais válido. Solicite um novo';
const THIRTY_MIN_MS = 30 * 60 * 1000;

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function fakeMailer(options: { failChanged?: boolean } = {}) {
  const resets: Array<{ to: string; name: string; link: string }> = [];
  const changes: Array<{ to: string; name: string }> = [];
  const mailer: Mailer = {
    async sendPasswordReset(to, name, link) {
      resets.push({ to, name, link });
    },
    async sendPasswordChanged(to, name) {
      if (options.failChanged) throw new Error('Falha ao enviar e-mail: Resend respondeu 500');
      changes.push({ to, name });
    },
  };
  return { mailer, resets, changes };
}

async function setup(mailer: Mailer) {
  const repo = createMemoryRepo();
  await repo.createUser({ name: NAME, email: EMAIL, passwordHash: await hashPassword(OLD_PASSWORD) });
  const forgot = withErrors(createForgotPasswordHandler({ repo: () => repo, mailer: () => mailer, appUrl: () => APP_URL }));
  const reset = withErrors(createResetPasswordHandler({ repo: () => repo, mailer: () => mailer }));
  return { repo, forgot, reset };
}

async function requestToken(forgot: (r: Request) => Promise<Response>, resets: Array<{ link: string }>): Promise<string> {
  await forgot(
    new Request('https://ilelino.example/api/admin/forgot-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email: EMAIL }),
    }),
  );
  return new URL(resets[resets.length - 1].link).searchParams.get('token') ?? '';
}

function resetRequest(body: unknown): Request {
  return new Request('https://ilelino.example/api/admin/reset-password', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

async function passwordOf(repo: AdminRepo, password: string): Promise<boolean> {
  const user = await repo.findUserByEmail(EMAIL);
  return user !== null && (await verifyPassword(password, user.passwordHash));
}

describe('POST /api/admin/reset-password', () => {
  it('token válido responde 200, troca a senha, marca o token como usado e remove as sessões (AUTH-25)', async () => {
    const { mailer, resets } = fakeMailer();
    const { repo, forgot, reset } = await setup(mailer);
    const token = await requestToken(forgot, resets);
    const user = await repo.findUserByEmail(EMAIL);
    const { cookie } = await createSession(repo, user!.id);
    const sessionToken = cookie.split(';')[0].slice('admin_session='.length);

    const res = await reset(resetRequest({ token, password: NEW_PASSWORD }));

    expect(res.status).toBe(200);
    expect(await passwordOf(repo, NEW_PASSWORD)).toBe(true);
    expect(await passwordOf(repo, OLD_PASSWORD)).toBe(false);
    expect((await repo.findResetToken(hashToken(token)))?.usedAt).toBeInstanceOf(Date);
    expect(await repo.findSession(hashToken(sessionToken))).toBeNull();
  });

  it('token já usado responde 410 e não altera a senha de novo (AUTH-26)', async () => {
    const { mailer, resets } = fakeMailer();
    const { repo, forgot, reset } = await setup(mailer);
    const token = await requestToken(forgot, resets);
    expect((await reset(resetRequest({ token, password: NEW_PASSWORD }))).status).toBe(200);

    const res = await reset(resetRequest({ token, password: 'outrasenha777' }));

    expect(res.status).toBe(410);
    expect(await res.json()).toEqual({ message: INVALID_MESSAGE });
    expect(await passwordOf(repo, NEW_PASSWORD)).toBe(true);
    expect(await passwordOf(repo, 'outrasenha777')).toBe(false);
  });

  it('token inexistente responde 410 e não altera a senha (AUTH-26)', async () => {
    const { mailer } = fakeMailer();
    const { repo, reset } = await setup(mailer);
    const res = await reset(resetRequest({ token: newToken().token, password: NEW_PASSWORD }));

    expect(res.status).toBe(410);
    expect(await res.json()).toEqual({ message: INVALID_MESSAGE });
    expect(await passwordOf(repo, OLD_PASSWORD)).toBe(true);
  });

  it('token expirado há 1 segundo responde 410 e não altera a senha (AUTH-26)', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-04T12:00:00Z'));
    const { mailer, resets } = fakeMailer();
    const { repo, forgot, reset } = await setup(mailer);
    const token = await requestToken(forgot, resets);

    vi.setSystemTime(new Date(Date.parse('2026-10-04T12:00:00Z') + THIRTY_MIN_MS + 1000));
    const res = await reset(resetRequest({ token, password: NEW_PASSWORD }));

    expect(res.status).toBe(410);
    expect(await res.json()).toEqual({ message: INVALID_MESSAGE });
    expect(await passwordOf(repo, OLD_PASSWORD)).toBe(true);
  });

  it('senha fraca responde 400 com field password e o token continua válido (AUTH-27)', async () => {
    const { mailer, resets } = fakeMailer();
    const { repo, forgot, reset } = await setup(mailer);
    const token = await requestToken(forgot, resets);

    const weak = await reset(resetRequest({ token, password: 'fraca' }));
    expect(weak.status).toBe(400);
    expect(await weak.json()).toMatchObject({ field: 'password' });
    expect(await passwordOf(repo, OLD_PASSWORD)).toBe(true);

    const retry = await reset(resetRequest({ token, password: NEW_PASSWORD }));
    expect(retry.status).toBe(200);
    expect(await passwordOf(repo, NEW_PASSWORD)).toBe(true);
  });

  it('envia aviso de troca ao e-mail da conta, sem token nem link', async () => {
    const { mailer, resets, changes } = fakeMailer();
    const { forgot, reset } = await setup(mailer);
    const token = await requestToken(forgot, resets);
    await reset(resetRequest({ token, password: NEW_PASSWORD }));

    expect(changes).toEqual([{ to: EMAIL, name: NAME }]);
  });

  it('falha no aviso de troca não desfaz a redefinição e responde 200 (AUTH-28)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { mailer, resets } = fakeMailer({ failChanged: true });
    const { repo, forgot, reset } = await setup(mailer);
    const token = await requestToken(forgot, resets);

    const res = await reset(resetRequest({ token, password: NEW_PASSWORD }));

    expect(res.status).toBe(200);
    expect(await passwordOf(repo, NEW_PASSWORD)).toBe(true);
  });

  it('banco indisponível responde 503 com mensagem genérica, sem detalhe técnico (AUTH-31)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { mailer } = fakeMailer();
    const { repo } = await setup(mailer);
    const broken: AdminRepo = {
      ...repo,
      resetPasswordTx: async () => {
        throw new Error('connection to db-host:5432 refused');
      },
    };
    const reset = withErrors(createResetPasswordHandler({ repo: () => broken, mailer: () => mailer }));
    const res = await reset(resetRequest({ token: 'a'.repeat(43), password: NEW_PASSWORD }));

    expect(res.status).toBe(503);
    const text = await res.text();
    expect(JSON.parse(text)).toEqual({ message: 'Serviço temporariamente indisponível' });
    expect(text).not.toContain('db-host');
  });

  it('o token de redefinição não aparece em nenhum log do servidor, nem no caminho de erro (AUTH-29)', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { mailer } = fakeMailer();
    const { repo } = await setup(mailer);
    const { token } = newToken();
    const broken: AdminRepo = {
      ...repo,
      resetPasswordTx: async () => {
        throw new Error('connection to db-host:5432 refused');
      },
    };
    const reset = withErrors(createResetPasswordHandler({ repo: () => broken, mailer: () => mailer }));
    const res = await reset(resetRequest({ token, password: NEW_PASSWORD }));

    expect(res.status).toBe(503);
    expect(errorSpy).toHaveBeenCalled();
    const logged = [...errorSpy.mock.calls, ...logSpy.mock.calls]
      .flat()
      .map((arg) => (arg instanceof Error ? `${arg.message}\n${arg.stack ?? ''}` : String(arg)))
      .join('\n');
    expect(logged).not.toContain(token);
  });

  it('a URL com ?token= não aparece em nenhum log do servidor no caminho de erro (AUTH-29)', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { mailer } = fakeMailer();
    const { repo } = await setup(mailer);
    const { token } = newToken();
    const broken: AdminRepo = {
      ...repo,
      resetPasswordTx: async () => {
        throw new Error('connection to db-host:5432 refused');
      },
    };
    const reset = withErrors(createResetPasswordHandler({ repo: () => broken, mailer: () => mailer }));
    const request = new Request(`https://ilelino.example/api/admin/reset-password?token=${token}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token, password: NEW_PASSWORD }),
    });
    const res = await reset(request);

    expect(res.status).toBe(503);
    const logged = [...errorSpy.mock.calls, ...logSpy.mock.calls]
      .flat()
      .map((arg) => (arg instanceof Error ? `${arg.message}\n${arg.stack ?? ''}` : String(arg)))
      .join('\n');
    expect(logged).not.toContain(token);
    expect(logged).not.toContain('?token=');
  });
});
