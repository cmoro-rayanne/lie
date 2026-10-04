// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { fail, json, withErrors } from './http';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('fail', () => {
  it('responde 400 com message e field no corpo', async () => {
    const res = fail(400, 'msg', 'password');
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ message: 'msg', field: 'password' });
  });

  it('omite field quando não informado', async () => {
    const res = fail(401, 'E-mail ou senha incorretos');
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ message: 'E-mail ou senha incorretos' });
  });
});

describe('json', () => {
  it('responde com o status e o corpo JSON informados', async () => {
    const res = json(200, { ok: true });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('application/json');
    expect(await res.json()).toEqual({ ok: true });
  });
});

describe('withErrors (AUTH-31)', () => {
  it('converte exceção em 503 com mensagem genérica, sem vazar o erro técnico', async () => {
    const handler = withErrors<[Request]>(async () => {
      throw new Error('connection to db-host:5432 refused');
    });
    const res = await handler(new Request('https://ilelino.example/api/admin/login'));
    expect(res.status).toBe(503);
    const text = await res.text();
    expect(JSON.parse(text)).toEqual({ message: 'Serviço temporariamente indisponível' });
    expect(text).not.toContain('db-host');
  });

  it('registra a exceção com console.error contendo a mensagem original', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const handler = withErrors<[Request]>(async () => {
      throw new Error('connection to db-host:5432 refused');
    });
    await handler(new Request('https://ilelino.example/api/admin/login'));
    expect(spy).toHaveBeenCalled();
    const logged = spy.mock.calls.flat().map((arg) => String(arg instanceof Error ? arg.message : arg)).join(' ');
    expect(logged).toContain('connection to db-host:5432 refused');
  });

  it('devolve a mesma Response quando o handler já responde', async () => {
    const original = json(201, { ok: true });
    const handler = withErrors<[Request]>(async () => original);
    const res = await handler(new Request('https://ilelino.example/api/admin/signup'));
    expect(res).toBe(original);
  });
});
