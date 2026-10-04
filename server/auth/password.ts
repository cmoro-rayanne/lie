import { randomBytes, scrypt as scryptCb, timingSafeEqual } from 'node:crypto';

const N = 16384;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

// Hash fixo de uma senha descartável: usado para executar scrypt quando a conta não existe (AUTH-13).
export const DUMMY_HASH =
  'scrypt$16384$8$1$IBS1up7xbyJPh2JcpJssUA==$tW0g+vmHIvfCZj8IP2MwSnUD45eRthEAut4dnDH8mVYso8aYWU5PH2YIxem90Ze0SV4NBaToct/YJJP8r2VtvQ==';

function deriveKey(password: string, salt: Buffer, keyLength: number, n: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCb(password, salt, keyLength, { N: n, r, p }, (err, key) => (err ? reject(err) : resolve(key)));
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const key = await deriveKey(password, salt, KEY_LENGTH, N, R, P);
  return `scrypt$${N}$${R}$${P}$${salt.toString('base64')}$${key.toString('base64')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const [, n, r, p, saltB64, hashB64] = parts;
  const expected = Buffer.from(hashB64 ?? '', 'base64');
  const key = await deriveKey(password, Buffer.from(saltB64 ?? '', 'base64'), expected.length, Number(n), Number(r), Number(p));
  return key.length === expected.length && timingSafeEqual(key, expected);
}
