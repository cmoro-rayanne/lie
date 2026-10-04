// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { hashPassword } from '../../server/auth/password';
import { hashToken } from '../../server/auth/tokens';
import { withErrors } from '../../server/http';
import type { Mailer } from '../../server/mail';
import { createMemoryRepo } from '../../server/repo/memory';
import { createForgotPasswordHandler } from './forgot-password';

const APP_URL = 'https://ilelino.example';
const EMAIL = 'eliana@exemplo.com';
const SENT_MESSAGE = 'Se o e-mail estiver cadastrado, você receberá um link em instantes';
const THIRTY_MIN_MS = 30 * 60 * 1000;

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function fakeMailer(options: { failReset?: boolean } = {}) {
  const resets: Array<{ to: string; name: string; link: string }> = [];
  const mailer: Mailer = {
    async sendPasswordReset(to, name, link) {
      if (options.failReset) throw new Error('Falha ao enviar e-mail: Resend respondeu 500');
      resets.push({ to, name, link });
    },
    async sendPasswordChanged() {},
  };
  return { mailer, resets };
}

async function setup(mailer: Mailer) {
  const repo = createMemoryRepo();
  await repo.createUser({ name: 'Eliana Lino', email: EMAIL, passwordHash: await hashPassword('senha12345') });
  const POST = withErrors(
    createForgotPasswordHandler({ repo: () => repo, mailer: () => mailer, appUrl: () => APP_URL }),
  );
  return { repo, POST };
}

function forgotRequest(body: unknown): Request {
  return new Request('https://ilelino.example/api/admin/forgot-password', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function tokenFrom(link: string): string {
  return new URL(link).searchParams.get('token') ?? '';
}

describe('POST /api/admin/forgot-password', () => {
  it('conta existente e inexistente recebem 200 com a mesma mensagem, e só a existente recebe e-mail (AUTH-20)', async () => {
    const { mailer, resets } = fakeMailer();
    const { POST } = await setup(mailer);
    const existing = await POST(forgotRequest({ email: EMAIL }));
    const missing = await POST(forgotRequest({ email: 'ninguem@exemplo.com' }));

    expect(existing.status).toBe(200);
    expect(missing.status).toBe(200);
    expect(await existing.json()).toEqual({ message: SENT_MESSAGE });
    expect(await missing.json()).toEqual({ message: SENT_MESSAGE });
    expect(resets).toHaveLength(1);
    expect(resets[0].to).toBe(EMAIL);
  });

  it('conta existente recebe token com validade de 30 minutos e e-mail com o link (AUTH-21)', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    const start = new Date('2026-10-04T12:00:00Z');
    vi.setSystemTime(start);
    const { mailer, resets } = fakeMailer();
    const { repo, POST } = await setup(mailer);
    const res = await POST(forgotRequest({ email: EMAIL }));

    expect(res.status).toBe(200);
    expect(resets[0].link).toMatch(new RegExp(`^${APP_URL}/admin/redefinir-senha\\?token=[A-Za-z0-9_-]+$`));
    const token = tokenFrom(resets[0].link);
    expect(Buffer.from(token, 'base64url').length).toBe(32);

    const record = await repo.findResetToken(hashToken(token));
    expect(record?.expiresAt.getTime()).toBe(start.getTime() + THIRTY_MIN_MS);
    expect(record?.usedAt).toBeNull();
  });

  it('novo pedido invalida o token anterior ainda não usado (AUTH-22)', async () => {
    const { mailer, resets } = fakeMailer();
    const { repo, POST } = await setup(mailer);
    await POST(forgotRequest({ email: EMAIL }));
    await POST(forgotRequest({ email: EMAIL }));

    const first = tokenFrom(resets[0].link);
    const second = tokenFrom(resets[1].link);
    expect(await repo.findResetToken(hashToken(first))).toBeNull();
    expect(await repo.findResetToken(hashToken(second))).not.toBeNull();
  });

  it('falha no envio é registrada no log e a resposta continua 200 (AUTH-23)', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const { mailer } = fakeMailer({ failReset: true });
    const { POST } = await setup(mailer);
    const res = await POST(forgotRequest({ email: EMAIL }));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ message: SENT_MESSAGE });
    expect(spy).toHaveBeenCalledTimes(1);
    const logged = spy.mock.calls[0][0];
    expect(logged).toBeInstanceOf(Error);
    expect((logged as Error).message).toContain('Resend respondeu 500');
  });

  it('e-mail inválido responde 400 com "Informe um e-mail válido" e não envia nada (AUTH-24)', async () => {
    const { mailer, resets } = fakeMailer();
    const { POST } = await setup(mailer);
    const res = await POST(forgotRequest({ email: 'ana@exemplo' }));

    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ message: 'Informe um e-mail válido' });
    expect(resets).toHaveLength(0);
  });

  it('banco indisponível responde 503 com mensagem genérica, sem detalhe técnico (AUTH-31)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { mailer } = fakeMailer();
    const repo = createMemoryRepo();
    const broken = {
      ...repo,
      findUserByEmail: async () => {
        throw new Error('connection to db-host:5432 refused');
      },
    };
    const POST = withErrors(
      createForgotPasswordHandler({ repo: () => broken, mailer: () => mailer, appUrl: () => APP_URL }),
    );
    const res = await POST(forgotRequest({ email: EMAIL }));

    expect(res.status).toBe(503);
    const text = await res.text();
    expect(JSON.parse(text)).toEqual({ message: 'Serviço temporariamente indisponível' });
    expect(text).not.toContain('db-host');
  });
});
