import { afterEach, describe, expect, it, vi } from 'vitest';
import { api, ApiError } from './api';

function stubFetch(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response);
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('api (cliente HTTP do painel)', () => {
  it('retorna o corpo JSON tipado em resposta 2xx', async () => {
    stubFetch(jsonResponse({ name: 'Ana Souza', email: 'ana@exemplo.com' }, 200));

    const body = await api.get<{ name: string; email: string }>('/api/admin/me');

    expect(body).toEqual({ name: 'Ana Souza', email: 'ana@exemplo.com' });
  });

  it('envia o corpo como JSON com credenciais same-origin no POST', async () => {
    const fetchMock = stubFetch(jsonResponse({ name: 'Ana', email: 'a@exemplo.com' }, 200));

    await api.post('/api/admin/login', { email: 'a@exemplo.com', password: 'senha123456' });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/admin/login');
    expect(init.method).toBe('POST');
    expect(init.credentials).toBe('same-origin');
    expect(JSON.parse(init.body as string)).toEqual({
      email: 'a@exemplo.com',
      password: 'senha123456',
    });
  });

  it('lança ApiError com status e message do corpo em resposta não-2xx', async () => {
    stubFetch(jsonResponse({ message: 'E-mail ou senha incorretos' }, 401));

    const error = await api.post('/api/admin/login', { email: 'a@exemplo.com', password: 'x' }).catch(
      (e: unknown) => e,
    );

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(401);
    expect((error as ApiError).message).toBe('E-mail ou senha incorretos');
  });

  it('preserva field quando o corpo do erro traz field', async () => {
    stubFetch(jsonResponse({ message: 'A senha deve ter pelo menos 10 caracteres', field: 'password' }, 400));

    const error = await api.post('/api/admin/signup', {}).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).status).toBe(400);
    expect((error as ApiError).field).toBe('password');
  });

  it('deixa field indefinido quando o corpo do erro não traz field', async () => {
    stubFetch(jsonResponse({ message: 'Já existe uma conta com este e-mail' }, 409));

    const error = await api.post('/api/admin/signup', {}).catch((e: unknown) => e);

    expect((error as ApiError).status).toBe(409);
    expect((error as ApiError).field).toBeUndefined();
  });
});
