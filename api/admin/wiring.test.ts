// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';

// AUTH-31: os exports reais (POST/GET) das rotas respondem 503 genérico quando o banco falha.
// Mockamos só o ponto de troca do repositório (`getRepo`); o withErrors do export é o de produção.
vi.mock('../../server/deps', () => ({
  getRepo: vi.fn(() => {
    throw new Error('connection to db-host:5432 refused');
  }),
}));

import { GET as meGET } from './me';
import { POST as forgotPOST } from './forgot-password';
import { POST as loginPOST } from './login';
import { POST as logoutPOST } from './logout';
import { POST as resetPOST } from './reset-password';
import { POST as signupPOST } from './signup';

const UNAVAILABLE = { message: 'Serviço temporariamente indisponível' };

function jsonRequest(method: string, body?: unknown): Request {
  return new Request('https://ilelino.example/api/admin/x', {
    method,
    headers: body === undefined ? {} : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

async function expectUnavailable(response: Response): Promise<void> {
  expect(response.status).toBe(503);
  const text = await response.text();
  expect(JSON.parse(text)).toEqual(UNAVAILABLE);
  expect(text).not.toContain('db-host');
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('exports reais das rotas /api/admin com banco indisponível (AUTH-31)', () => {
  it('POST /api/admin/signup responde 503 genérico', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expectUnavailable(
      await signupPOST(
        jsonRequest('POST', {
          name: 'Ana Souza',
          email: 'ana@exemplo.com',
          password: 'senha12345',
          inviteCode: 'convite',
        }),
      ),
    );
  });

  it('POST /api/admin/login responde 503 genérico', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expectUnavailable(
      await loginPOST(jsonRequest('POST', { email: 'ana@exemplo.com', password: 'senha12345' })),
    );
  });

  it('POST /api/admin/logout responde 503 genérico', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expectUnavailable(await logoutPOST(jsonRequest('POST')));
  });

  it('GET /api/admin/me responde 503 genérico', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expectUnavailable(await meGET(jsonRequest('GET')));
  });

  it('POST /api/admin/forgot-password responde 503 genérico', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expectUnavailable(
      await forgotPOST(jsonRequest('POST', { email: 'ana@exemplo.com' })),
    );
  });

  it('POST /api/admin/reset-password responde 503 genérico', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await expectUnavailable(
      await resetPOST(jsonRequest('POST', { token: 'a'.repeat(43), password: 'senha12345' })),
    );
  });
});
