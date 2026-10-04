// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { forgotSchema, loginSchema, normalizeEmail, passwordRule, resetSchema, signupSchema } from './validation';

const validSignup = {
  name: 'Ana Souza',
  email: 'ana@exemplo.com',
  password: 'senha12345',
  inviteCode: 'convite',
};

function failedFields(result: { success: boolean; error?: { issues: { path: PropertyKey[] }[] } }): string[] {
  return result.success ? [] : (result.error?.issues.map((i) => String(i.path[0])) ?? []);
}

describe('passwordRule (AUTH-04)', () => {
  it('rejeita senha com 9 caracteres', () => {
    expect(passwordRule.safeParse('senha1234').success).toBe(false);
  });

  it('aceita senha com 10 caracteres contendo letra e número', () => {
    expect(passwordRule.safeParse('senha12345').success).toBe(true);
  });

  it('rejeita senha de 10 caracteres só com letras', () => {
    expect(passwordRule.safeParse('abcdefghij').success).toBe(false);
  });

  it('rejeita senha de 10 caracteres só com números', () => {
    expect(passwordRule.safeParse('1234567890').success).toBe(false);
  });
});

describe('signupSchema', () => {
  it('aceita cadastro com todos os campos válidos', () => {
    expect(signupSchema.safeParse(validSignup).success).toBe(true);
  });

  it('rejeita senha de 9 caracteres com field password (AUTH-04)', () => {
    const result = signupSchema.safeParse({ ...validSignup, password: 'senha1234' });
    expect(failedFields(result)).toEqual(['password']);
  });

  it('rejeita e-mail sem domínio completo e aceita e-mail válido (AUTH-05)', () => {
    expect(failedFields(signupSchema.safeParse({ ...validSignup, email: 'ana@exemplo' }))).toEqual(['email']);
    expect(signupSchema.safeParse(validSignup).success).toBe(true);
  });

  it('rejeita nome de 1 caractere com field name (AUTH-05)', () => {
    expect(failedFields(signupSchema.safeParse({ ...validSignup, name: 'A' }))).toEqual(['name']);
  });

  it('rejeita nome de 121 caracteres com field name e aceita 120 (AUTH-05)', () => {
    expect(failedFields(signupSchema.safeParse({ ...validSignup, name: 'A'.repeat(121) }))).toEqual(['name']);
    expect(signupSchema.safeParse({ ...validSignup, name: 'A'.repeat(120) }).success).toBe(true);
  });

  it('aceita ausência de código de convite para que a rota responda 403 (AUTH-02)', () => {
    const semCodigo: Partial<typeof validSignup> = { ...validSignup };
    delete semCodigo.inviteCode;
    expect(signupSchema.safeParse(semCodigo).success).toBe(true);
  });

  it('grava e-mail normalizado em minúsculas, sem espaços nas bordas (AUTH-07)', () => {
    const result = signupSchema.safeParse({ ...validSignup, email: '  Ana@Exemplo.COM ' });
    expect(result.success && result.data.email).toBe('ana@exemplo.com');
  });
});

describe('normalizeEmail (AUTH-07)', () => {
  it('retorna e-mail em minúsculas sem espaços nas bordas', () => {
    expect(normalizeEmail('  Ana@Exemplo.COM ')).toBe('ana@exemplo.com');
  });
});

describe('loginSchema (AUTH-08)', () => {
  it('rejeita e-mail inválido com field email', () => {
    expect(failedFields(loginSchema.safeParse({ email: 'ana@exemplo', password: 'qualquer' }))).toEqual(['email']);
  });

  it('rejeita senha vazia com field password', () => {
    expect(failedFields(loginSchema.safeParse({ email: 'ana@exemplo.com', password: '' }))).toEqual(['password']);
  });
});

describe('forgotSchema (AUTH-24)', () => {
  it('rejeita e-mail inválido com a mensagem "Informe um e-mail válido"', () => {
    const result = forgotSchema.safeParse({ email: 'ana@exemplo' });
    expect(result.success).toBe(false);
    expect(!result.success && result.error.issues[0]?.message).toBe('Informe um e-mail válido');
  });

  it('aceita e-mail válido', () => {
    expect(forgotSchema.safeParse({ email: 'ana@exemplo.com' }).success).toBe(true);
  });
});

describe('resetSchema (AUTH-27)', () => {
  it('rejeita senha fraca com field password (AUTH-27)', () => {
    expect(failedFields(resetSchema.safeParse({ token: 'abc', password: 'senha1234' }))).toEqual(['password']);
  });

  it('aceita token e senha que atendem à regra', () => {
    expect(resetSchema.safeParse({ token: 'abc', password: 'senha12345' }).success).toBe(true);
  });
});
