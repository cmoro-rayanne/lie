// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DUMMY_HASH, hashPassword, verifyPassword } from '../../server/auth/password';
import { withErrors } from '../../server/http';
import { createMemoryRepo } from '../../server/repo/memory';
import type { AdminRepo } from '../../server/repo/types';
import { createLoginHandler } from './login';

// Envolve verifyPassword sem mudar o comportamento, para conferir o hash usado (AUTH-13).
vi.mock('../../server/auth/password', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../server/auth/password')>();
  return { ...actual, verifyPassword: vi.fn(actual.verifyPassword) };
});

const EMAIL = 'eliana@exemplo.com';
const PASSWORD = 'senha12345';
const WRONG = { email: EMAIL, password: 'senhaerrada9' };
const INVALID_MESSAGE = 'E-mail ou senha incorretos';

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

async function setup(repo: AdminRepo = createMemoryRepo()) {
  await repo.createUser({
    name: 'Eliana Lino',
    email: EMAIL,
    passwordHash: await hashPassword(PASSWORD),
  });
  const POST = withErrors(createLoginHandler({ repo: () => repo }));
  return { repo, POST };
}

function loginRequest(body: unknown): Request {
  return new Request('https://ilelino.example/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

function loginRequestFrom(ip: string, body: unknown): Request {
  return new Request('https://ilelino.example/api/admin/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}

describe('POST /api/admin/login', () => {
  it('credenciais corretas respondem 200 e definem admin_session (AUTH-08)', async () => {
    const { POST } = await setup();
    const res = await POST(loginRequest({ email: EMAIL, password: PASSWORD }));

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ name: 'Eliana Lino', email: EMAIL });
    expect(res.headers.get('set-cookie')).toMatch(
      /^admin_session=[^;]+; HttpOnly; Secure; SameSite=Lax/,
    );
  });

  it('e-mail inexistente e senha errada respondem 401 com mensagem idêntica, sem campo (AUTH-09)', async () => {
    const { POST } = await setup();
    const wrongPassword = await POST(loginRequest(WRONG));
    const unknownEmail = await POST(
      loginRequest({ email: 'ninguem@exemplo.com', password: PASSWORD }),
    );

    expect(wrongPassword.status).toBe(401);
    expect(unknownEmail.status).toBe(401);
    const wrongBody = await wrongPassword.json();
    expect(wrongBody).toEqual({ message: INVALID_MESSAGE });
    expect(await unknownEmail.json()).toEqual(wrongBody);
    expect(unknownEmail.headers.get('set-cookie')).toBeNull();
  });

  it('e-mail inexistente executa verifyPassword com DUMMY_HASH e responde como senha errada (AUTH-13)', async () => {
    const { POST } = await setup();
    const res = await POST(
      loginRequest({ email: 'ninguem@exemplo.com', password: 'qualquersenha1' }),
    );

    expect(verifyPassword).toHaveBeenCalledWith('qualquersenha1', DUMMY_HASH);
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ message: INVALID_MESSAGE });
  });

  it('5 falhas do mesmo e-mail fazem a sexta tentativa responder 429 sem validar a senha (AUTH-10)', async () => {
    const { POST } = await setup();
    for (let i = 0; i < 5; i++) {
      expect((await POST(loginRequest(WRONG))).status).toBe(401);
    }

    vi.mocked(verifyPassword).mockClear();
    const res = await POST(loginRequest({ email: EMAIL, password: PASSWORD }));

    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({
      message: 'Muitas tentativas. Tente novamente em 15 minutos',
    });
    expect(res.headers.get('set-cookie')).toBeNull();
    expect(verifyPassword).not.toHaveBeenCalled();
  });

  it('login de sucesso zera as falhas do e-mail', async () => {
    const { POST } = await setup();
    for (let i = 0; i < 4; i++) {
      expect((await POST(loginRequest(WRONG))).status).toBe(401);
    }
    expect((await POST(loginRequest({ email: EMAIL, password: PASSWORD }))).status).toBe(200);

    for (let i = 0; i < 4; i++) {
      expect((await POST(loginRequest(WRONG))).status).toBe(401);
    }
  });

  it('body sem e-mail responde 400 com field email', async () => {
    const { POST } = await setup();
    const res = await POST(loginRequest({ password: PASSWORD }));

    expect(res.status).toBe(400);
    expect(await res.json()).toMatchObject({ field: 'email' });
  });

  it('20 falhas do mesmo IP com e-mails diferentes fazem a 21ª tentativa responder 429 (IP, design Risks)', async () => {
    const { POST } = await setup();
    for (let i = 0; i < 20; i++) {
      expect(
        (
          await POST(
            loginRequestFrom('203.0.113.7', {
              email: `pessoa${i}@exemplo.com`,
              password: 'senhaerrada9',
            }),
          )
        ).status,
      ).toBe(401);
    }

    vi.mocked(verifyPassword).mockClear();
    const res = await POST(
      loginRequestFrom('203.0.113.7', { email: 'nova@exemplo.com', password: 'senhaerrada9' }),
    );

    expect(res.status).toBe(429);
    expect(await res.json()).toEqual({
      message: 'Muitas tentativas. Tente novamente em 15 minutos',
    });
    expect(verifyPassword).not.toHaveBeenCalled();
  });

  it('falhas de outro IP não contam no limite do IP (IP, design Risks)', async () => {
    const { POST } = await setup();
    for (let i = 0; i < 20; i++) {
      await POST(
        loginRequestFrom('203.0.113.7', {
          email: `pessoa${i}@exemplo.com`,
          password: 'senhaerrada9',
        }),
      );
    }

    const res = await POST(
      loginRequestFrom('198.51.100.9', { email: 'outra@exemplo.com', password: 'senhaerrada9' }),
    );

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ message: INVALID_MESSAGE });
  });

  it('login de sucesso não zera o contador do IP (IP, design Risks)', async () => {
    const { POST } = await setup();
    for (let i = 0; i < 19; i++) {
      await POST(
        loginRequestFrom('203.0.113.7', {
          email: `pessoa${i}@exemplo.com`,
          password: 'senhaerrada9',
        }),
      );
    }
    expect(
      (await POST(loginRequestFrom('203.0.113.7', { email: EMAIL, password: PASSWORD }))).status,
    ).toBe(200);

    expect(
      (
        await POST(
          loginRequestFrom('203.0.113.7', {
            email: 'ultima@exemplo.com',
            password: 'senhaerrada9',
          }),
        )
      ).status,
    ).toBe(401);
    const blocked = await POST(
      loginRequestFrom('203.0.113.7', { email: 'bloqueada@exemplo.com', password: 'senhaerrada9' }),
    );
    expect(blocked.status).toBe(429);
  });

  it('erro do repositório responde 503 sem detalhe técnico (AUTH-31)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { repo } = await setup();
    const broken: AdminRepo = {
      ...repo,
      findUserByEmail: async () => {
        throw new Error('connection to db-host:5432 refused');
      },
    };
    const POST = withErrors(createLoginHandler({ repo: () => broken }));
    const res = await POST(loginRequest(WRONG));

    expect(res.status).toBe(503);
    const text = await res.text();
    expect(JSON.parse(text)).toEqual({ message: 'Serviço temporariamente indisponível' });
    expect(text).not.toContain('db-host');
  });
});
