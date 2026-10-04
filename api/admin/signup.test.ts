// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { withErrors } from '../../server/http';
import { createMemoryRepo } from '../../server/repo/memory';
import type { AdminRepo } from '../../server/repo/types';
import { createSignupHandler } from './signup';

const INVITE = 'convite-de-teste-com-mais-de-vinte-caracteres';
const VALID = {
  name: 'Eliana Lino',
  email: 'eliana@exemplo.com',
  password: 'senha12345',
  inviteCode: INVITE,
};

afterEach(() => {
  vi.restoreAllMocks();
});

function setup(overrides: { repo?: AdminRepo; inviteCode?: () => string } = {}) {
  const repo = overrides.repo ?? createMemoryRepo();
  const inviteCode = overrides.inviteCode ?? (() => INVITE);
  const POST = withErrors(createSignupHandler({ repo: () => repo, inviteCode }));
  return { repo, POST };
}

function signupRequest(body: unknown, ip = '203.0.113.10'): Request {
  return new Request('https://ilelino.example/api/admin/signup', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': ip },
    body: JSON.stringify(body),
  });
}

describe('POST /api/admin/signup', () => {
  it('cadastro válido responde 201, define admin_session e grava e-mail normalizado com senha em scrypt (AUTH-01, AUTH-06, AUTH-07)', async () => {
    const { repo, POST } = setup();
    const res = await POST(signupRequest({ ...VALID, email: '  Eliana@Exemplo.COM ' }));

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ name: 'Eliana Lino', email: 'eliana@exemplo.com' });

    const cookie = res.headers.get('set-cookie') ?? '';
    expect(cookie).toMatch(/^admin_session=[^;]+; /);
    expect(cookie).toContain('HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800');

    const user = await repo.findUserByEmail('eliana@exemplo.com');
    expect(user).not.toBeNull();
    expect(user?.passwordHash.startsWith('scrypt$16384$8$1$')).toBe(true);
    expect(user?.passwordHash).not.toContain(VALID.password);
  });

  it('código de convite errado responde 403 com mensagem e campo, e não cria usuário (AUTH-02)', async () => {
    const { repo, POST } = setup();
    const res = await POST(signupRequest({ ...VALID, inviteCode: 'codigo-errado' }));

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ message: 'Código de convite inválido', field: 'inviteCode' });
    expect(await repo.findUserByEmail('eliana@exemplo.com')).toBeNull();
  });

  it('código de convite ausente responde 403 e não cria usuário (AUTH-02)', async () => {
    const { repo, POST } = setup();
    const withoutCode: Partial<typeof VALID> = { ...VALID };
    delete withoutCode.inviteCode;
    const res = await POST(signupRequest(withoutCode));

    expect(res.status).toBe(403);
    expect(await res.json()).toEqual({ message: 'Código de convite inválido', field: 'inviteCode' });
    expect(await repo.findUserByEmail('eliana@exemplo.com')).toBeNull();
  });

  it('e-mail já existente responde 409 com a mensagem da spec e mantém a conta original (AUTH-03)', async () => {
    const { repo, POST } = setup();
    expect((await POST(signupRequest(VALID))).status).toBe(201);

    const res = await POST(signupRequest({ ...VALID, name: 'Outra Pessoa' }));
    expect(res.status).toBe(409);
    expect(await res.json()).toEqual({ message: 'Já existe uma conta com este e-mail' });
    expect((await repo.findUserByEmail('eliana@exemplo.com'))?.name).toBe('Eliana Lino');
  });

  it('senha com 9 caracteres responde 400 com field password e não cria usuário (AUTH-04)', async () => {
    const { repo, POST } = setup();
    const res = await POST(signupRequest({ ...VALID, password: 'senha1234' }));

    expect(res.status).toBe(400);
    const body = (await res.json()) as { message: string; field: string };
    expect(body.field).toBe('password');
    expect(body.message).toContain('10 caracteres');
    expect(await repo.findUserByEmail('eliana@exemplo.com')).toBeNull();
  });

  it('senha de 10 caracteres só com letras responde 400 com field password (AUTH-04)', async () => {
    const { POST } = setup();
    const res = await POST(signupRequest({ ...VALID, password: 'senhasemnumero' }));

    expect(res.status).toBe(400);
    const body = (await res.json()) as { message: string; field: string };
    expect(body.field).toBe('password');
    expect(body.message).toContain('letra e número');
  });

  it('nome de 1 caractere responde 400 com field name (AUTH-05)', async () => {
    const { POST } = setup();
    const res = await POST(signupRequest({ ...VALID, name: 'E' }));

    expect(res.status).toBe(400);
    expect((await res.json()) as { field: string }).toMatchObject({ field: 'name' });
  });

  it('nome de 121 caracteres responde 400 com field name (AUTH-05)', async () => {
    const { POST } = setup();
    const res = await POST(signupRequest({ ...VALID, name: 'a'.repeat(121) }));

    expect(res.status).toBe(400);
    expect((await res.json()) as { field: string }).toMatchObject({ field: 'name' });
  });

  it('e-mail sem domínio válido responde 400 com field email (AUTH-05)', async () => {
    const { POST } = setup();
    const res = await POST(signupRequest({ ...VALID, email: 'ana@exemplo' }));

    expect(res.status).toBe(400);
    expect((await res.json()) as { field: string }).toMatchObject({ field: 'email' });
  });

  it('após 5 códigos errados do mesmo IP, a sexta tentativa responde 429; outro IP segue com 403', async () => {
    const { POST } = setup();
    for (let i = 0; i < 5; i++) {
      expect((await POST(signupRequest({ ...VALID, inviteCode: 'errado' }))).status).toBe(403);
    }

    expect((await POST(signupRequest({ ...VALID, inviteCode: 'errado' }))).status).toBe(429);
    expect((await POST(signupRequest({ ...VALID, inviteCode: 'errado' }, '198.51.100.7'))).status).toBe(403);
  });

  it('erro do repositório responde 503 sem detalhe técnico (AUTH-31)', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const repo: AdminRepo = {
      ...createMemoryRepo(),
      createUser: async () => {
        throw new Error('connection to db-host:5432 refused');
      },
    };
    const { POST } = setup({ repo });
    const res = await POST(signupRequest(VALID));

    expect(res.status).toBe(503);
    const text = await res.text();
    expect(JSON.parse(text)).toEqual({ message: 'Serviço temporariamente indisponível' });
    expect(text).not.toContain('db-host');
  });

  it('sem ADMIN_INVITE_CODE configurado responde 503 e nunca cria conta aberta', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { repo, POST } = setup({
      inviteCode: () => {
        throw new Error('Variáveis de ambiente ausentes: ADMIN_INVITE_CODE');
      },
    });
    const res = await POST(signupRequest(VALID));

    expect(res.status).toBe(503);
    expect(await repo.findUserByEmail('eliana@exemplo.com')).toBeNull();
  });
});
