// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { DUMMY_HASH, hashPassword, verifyPassword } from './password';

describe('hashPassword (AUTH-06)', () => {
  it('gera hash no formato scrypt com parâmetros N=16384, r=8, p=1', async () => {
    const hash = await hashPassword('senha12345');
    expect(hash.startsWith('scrypt$16384$8$1$')).toBe(true);
  });

  it('usa sal aleatório de 16 bytes', async () => {
    const [, , , , saltB64] = (await hashPassword('senha12345')).split('$');
    expect(Buffer.from(saltB64 ?? '', 'base64').length).toBe(16);
  });

  it('gera hashes diferentes para a mesma senha (sal aleatório)', async () => {
    const a = await hashPassword('senha12345');
    const b = await hashPassword('senha12345');
    expect(a).not.toBe(b);
  });
});

describe('verifyPassword', () => {
  it('retorna true para a senha certa', async () => {
    const hash = await hashPassword('senha12345');
    expect(await verifyPassword('senha12345', hash)).toBe(true);
  });

  it('retorna false para outra senha', async () => {
    const hash = await hashPassword('senha12345');
    expect(await verifyPassword('senha54321', hash)).toBe(false);
  });
});

describe('DUMMY_HASH (AUTH-13)', () => {
  it('verifica qualquer senha contra DUMMY_HASH retornando false sem lançar erro', async () => {
    await expect(verifyPassword('qualquer-senha', DUMMY_HASH)).resolves.toBe(false);
  });
});
