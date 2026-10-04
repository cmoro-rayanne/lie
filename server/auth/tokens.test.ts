// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { hashToken, newToken } from './tokens';

describe('newToken (AUTH-19)', () => {
  it('gera token que decodifica de base64url para 32 bytes', () => {
    const { token } = newToken();
    expect(Buffer.from(token, 'base64url').length).toBe(32);
  });

  it('o hash devolvido é hashToken(token) com 64 caracteres hexadecimais (AUTH-26)', () => {
    const { token, hash } = newToken();
    expect(hash).toBe(hashToken(token));
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('gera tokens diferentes a cada chamada', () => {
    expect(newToken().token).not.toBe(newToken().token);
  });
});

describe('hashToken (AUTH-26)', () => {
  it('é determinístico para o mesmo token', () => {
    expect(hashToken('abc')).toBe(hashToken('abc'));
  });

  it('gera hashes diferentes para tokens diferentes', () => {
    expect(hashToken('abc')).not.toBe(hashToken('abd'));
  });

  it('não devolve o token em texto puro', () => {
    const { token, hash } = newToken();
    expect(hash).not.toContain(token);
  });
});
