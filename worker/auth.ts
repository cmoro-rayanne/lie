import type { AttemptsRepo } from './ports';

export const SESSION_COOKIE = 'ile_sessao';
export const SESSION_SECONDS = 12 * 60 * 60;
export const MAX_FAILURES = 8;
export const WINDOW_MS = 15 * 60 * 1000;

const enc = new TextEncoder();

function toB64Url(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64Url(s: string): Uint8Array | null {
  try {
    const bin = atob(s.replace(/-/g, '+').replace(/_/g, '/'));
    return Uint8Array.from(bin, (c) => c.charCodeAt(0));
  } catch {
    return null;
  }
}

async function hmac(
  keyBytes: Uint8Array<ArrayBuffer>,
  data: string,
): Promise<Uint8Array<ArrayBuffer>> {
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

/** Chave de assinatura derivada da senha: trocar a senha invalida todas as sessões. */
async function signingKey(password: string): Promise<Uint8Array<ArrayBuffer>> {
  return hmac(enc.encode(password), 'ile-sessao-v1');
}

function equalBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

/** Comparação em tempo constante (compara HMACs de tamanho fixo). */
export async function safeCompare(a: string, b: string): Promise<boolean> {
  const key = crypto.getRandomValues(new Uint8Array(32));
  return equalBytes(await hmac(key, a), await hmac(key, b));
}

export async function createSession(password: string, nowSec: number): Promise<string> {
  const payload = String(nowSec + SESSION_SECONDS);
  const sig = await hmac(await signingKey(password), payload);
  return `${payload}.${toB64Url(sig)}`;
}

export async function verifySession(
  token: string | undefined,
  password: string,
  nowSec: number,
): Promise<boolean> {
  if (!token || !password) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig || !/^\d{1,12}$/.test(payload)) return false;
  const given = fromB64Url(sig);
  if (!given) return false;
  const expected = await hmac(await signingKey(password), payload);
  if (!equalBytes(given, expected)) return false;
  return Number(payload) > nowSec;
}

export function readCookie(header: string | null, name: string): string | undefined {
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k === name) return rest.join('=');
  }
  return undefined;
}

export type LoginResult =
  { ok: true; token: string } | { ok: false; reason: 'senha' | 'bloqueado' };

export async function login(
  attempts: AttemptsRepo,
  ip: string,
  given: string,
  password: string,
  nowMs: number,
): Promise<LoginResult> {
  if (!password) return { ok: false, reason: 'senha' };
  if ((await attempts.count(ip, nowMs - WINDOW_MS)) >= MAX_FAILURES)
    return { ok: false, reason: 'bloqueado' };
  if (!(await safeCompare(given, password))) {
    await attempts.add(ip, nowMs);
    return { ok: false, reason: 'senha' };
  }
  return { ok: true, token: await createSession(password, Math.floor(nowMs / 1000)) };
}
