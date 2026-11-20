import { describe, expect, it } from 'vitest';
import {
  MAX_FAILURES,
  WINDOW_MS,
  createSession,
  login,
  readCookie,
  safeCompare,
  verifySession,
} from '../worker/auth';
import { MemoryAttempts } from './helpers';

const NOW = 1_800_000_000;

const entrar = (a: MemoryAttempts, ip: string, given: string, nowMs: number) =>
  login(a, ip, async () => given === 'segredo', 'segredo', nowMs);

describe('sessão', () => {
  it('aceita sessão válida e recusa expirada', async () => {
    const t = await createSession('segredo', NOW);
    expect(await verifySession(t, 'segredo', NOW + 60)).toBe(true);
    expect(await verifySession(t, 'segredo', NOW + 13 * 3600)).toBe(false);
  });
  it('recusa token adulterado, vazio ou de outra senha', async () => {
    const t = await createSession('segredo', NOW);
    const [payload, sig] = t.split('.');
    expect(await verifySession(`${Number(payload) + 99999}.${sig}`, 'segredo', NOW)).toBe(false);
    expect(await verifySession(t, 'outra-senha', NOW)).toBe(false);
    expect(await verifySession(undefined, 'segredo', NOW)).toBe(false);
    expect(await verifySession('lixo', 'segredo', NOW)).toBe(false);
    expect(await verifySession(t, '', NOW)).toBe(false);
  });
});

describe('safeCompare', () => {
  it('compara igual e diferente', async () => {
    expect(await safeCompare('abc', 'abc')).toBe(true);
    expect(await safeCompare('abc', 'abd')).toBe(false);
    expect(await safeCompare('abc', 'abcd')).toBe(false);
  });
});

describe('login', () => {
  it('senha certa gera sessão; errada não gera', async () => {
    const a = new MemoryAttempts();
    const ok = await entrar(a, '1.1.1.1', 'segredo', NOW * 1000);
    expect(ok.ok).toBe(true);
    const ruim = await entrar(a, '1.1.1.1', 'errada', NOW * 1000);
    expect(ruim).toEqual({ ok: false, reason: 'senha' });
  });
  it('sem senha configurada ninguém entra', async () => {
    expect(await login(new MemoryAttempts(), 'ip', async () => true, '', NOW * 1000)).toEqual({
      ok: false,
      reason: 'senha',
    });
  });
  it('bloqueia depois de 8 erros, até a janela passar, mesmo com a senha certa', async () => {
    const a = new MemoryAttempts();
    for (let i = 0; i < MAX_FAILURES; i += 1) await entrar(a, '2.2.2.2', 'x', NOW * 1000);
    expect(await entrar(a, '2.2.2.2', 'segredo', NOW * 1000)).toEqual({
      ok: false,
      reason: 'bloqueado',
    });
    expect((await entrar(a, '3.3.3.3', 'segredo', NOW * 1000)).ok).toBe(true);
    expect((await entrar(a, '2.2.2.2', 'segredo', NOW * 1000 + WINDOW_MS + 1)).ok).toBe(true);
  });
});

describe('cookie', () => {
  it('lê o cookie certo entre vários', () => {
    expect(readCookie('a=1; rm_sessao=abc.def; b=2', 'rm_sessao')).toBe('abc.def');
    expect(readCookie(null, 'rm_sessao')).toBeUndefined();
  });
});
