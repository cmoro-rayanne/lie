// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { getConfig } from './config';

const VARS = ['DATABASE_URL', 'RESEND_API_KEY', 'APP_URL', 'ADMIN_INVITE_CODE', 'MAIL_FROM'] as const;

const VALID_ENV: Record<(typeof VARS)[number], string> = {
  DATABASE_URL: 'postgres://usuario:senha@host.neon.tech/painel',
  RESEND_API_KEY: 're_chave_de_teste',
  APP_URL: 'https://ilelino.example',
  ADMIN_INVITE_CODE: 'convite-de-teste-com-24-caracteres',
  MAIL_FROM: 'Ilê <contato@ilelino.example>',
};

const saved: Partial<Record<string, string>> = {};

beforeEach(() => {
  for (const name of VARS) {
    saved[name] = process.env[name];
    process.env[name] = VALID_ENV[name];
  }
});

afterEach(() => {
  for (const name of VARS) {
    if (saved[name] === undefined) delete process.env[name];
    else process.env[name] = saved[name];
  }
});

describe('getConfig', () => {
  it('retorna objeto tipado com os valores das cinco variáveis', () => {
    expect(getConfig()).toEqual({
      databaseUrl: VALID_ENV.DATABASE_URL,
      resendApiKey: VALID_ENV.RESEND_API_KEY,
      appUrl: VALID_ENV.APP_URL,
      inviteCode: VALID_ENV.ADMIN_INVITE_CODE,
      mailFrom: VALID_ENV.MAIL_FROM,
    });
  });

  it.each(VARS)('lança erro nomeando %s quando ela está ausente', (name) => {
    delete process.env[name];
    expect(() => getConfig()).toThrow(name);
  });

  it('lança erro quando APP_URL não tem protocolo', () => {
    process.env.APP_URL = 'ilelino.example';
    expect(() => getConfig()).toThrow(/APP_URL/);
  });
});
