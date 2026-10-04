// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const VARS = ['DATABASE_URL', 'RESEND_API_KEY', 'APP_URL', 'ADMIN_INVITE_CODE', 'MAIL_FROM'] as const;

const saved: Partial<Record<string, string | undefined>> = {};

beforeEach(() => {
  for (const name of VARS) saved[name] = process.env[name];
  vi.resetModules();
});

afterEach(() => {
  for (const name of VARS) {
    if (saved[name] === undefined) delete process.env[name];
    else process.env[name] = saved[name];
  }
});

describe('inicialização do ponto de troca do repositório (Edge Cases: env ausente)', () => {
  it.each(VARS)('importar deps sem %s falha na inicialização nomeando a variável', async (name) => {
    delete process.env[name];
    await expect(import('./deps')).rejects.toThrow(name);
  });

  it('importar deps com a configuração completa não lança e expõe getRepo', async () => {
    for (const name of VARS) process.env[name] = `valor-de-${name.toLowerCase()}`;
    process.env.APP_URL = 'https://ilelino.example';

    const mod = await import('./deps');
    expect(typeof mod.getRepo).toBe('function');
  });
});
