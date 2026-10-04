// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createMemoryRepo } from '../repo/memory';
import type { AdminRepo } from '../repo/types';
import { clear, clientIp, isLimited, recordFailure } from './rateLimit';

const FIFTEEN_MIN_MS = 15 * 60 * 1000;
const START = new Date('2026-10-04T12:00:00.000Z');
const EMAIL = 'ana@exemplo.com';

describe('limite de tentativas de login', () => {
  let repo: AdminRepo;

  beforeEach(() => {
    repo = createMemoryRepo();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(START);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('quatro falhas não bloqueiam e a quinta bloqueia (AUTH-10)', async () => {
    for (let i = 0; i < 4; i++) await recordFailure(repo, EMAIL);
    expect(await isLimited(repo, EMAIL)).toBe(false);

    await recordFailure(repo, EMAIL);
    expect(await isLimited(repo, EMAIL)).toBe(true);
  });

  it('o bloqueio é por chave: falhas de outro e-mail não bloqueiam este (AUTH-10)', async () => {
    for (let i = 0; i < 5; i++) await recordFailure(repo, 'outra@exemplo.com');
    expect(await isLimited(repo, EMAIL)).toBe(false);
  });

  it('clear libera a chave bloqueada', async () => {
    for (let i = 0; i < 5; i++) await recordFailure(repo, EMAIL);
    expect(await isLimited(repo, EMAIL)).toBe(true);

    await clear(repo, EMAIL);
    expect(await isLimited(repo, EMAIL)).toBe(false);
  });

  it('clientIp usa o último hop de x-forwarded-for, não o forjável pelo cliente (AUTH-10)', () => {
    const req = new Request('https://ilelino.example/api/admin/login', {
      headers: { 'x-forwarded-for': '1.1.1.1, 2.2.2.2' },
    });
    expect(clientIp(req)).toBe('2.2.2.2');
  });

  it('clientIp com um único valor em x-forwarded-for devolve esse valor', () => {
    const req = new Request('https://ilelino.example/api/admin/login', {
      headers: { 'x-forwarded-for': '203.0.113.7' },
    });
    expect(clientIp(req)).toBe('203.0.113.7');
  });

  it('clientIp sem x-forwarded-for usa x-real-ip', () => {
    const req = new Request('https://ilelino.example/api/admin/login', {
      headers: { 'x-real-ip': '198.51.100.9' },
    });
    expect(clientIp(req)).toBe('198.51.100.9');
  });

  it('falhas com mais de 15 minutos não contam', async () => {
    for (let i = 0; i < 5; i++) await recordFailure(repo, EMAIL);
    expect(await isLimited(repo, EMAIL)).toBe(true);

    vi.setSystemTime(new Date(START.getTime() + FIFTEEN_MIN_MS + 1000));
    expect(await isLimited(repo, EMAIL)).toBe(false);
  });
});
