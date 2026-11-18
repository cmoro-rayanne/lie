/** Senha guardada como PBKDF2-SHA256 com sal aleatório; nunca em texto. */
const ITERATIONS = 100_000; // máximo aceito pelo WebCrypto dos Workers
const enc = new TextEncoder();

export const MIN_PASSWORD = 10;
export const MAX_PASSWORD = 200;

const toHex = (bytes: Uint8Array) =>
  Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

function fromHex(hex: string): Uint8Array<ArrayBuffer> {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i += 1) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}

async function derive(password: string, salt: Uint8Array<ArrayBuffer>): Promise<string> {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: ITERATIONS },
    key,
    256,
  );
  return toHex(new Uint8Array(bits));
}

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return { hash: await derive(password, salt), salt: toHex(salt) };
}

export async function verifyPassword(
  password: string,
  hash: string,
  salt: string,
): Promise<boolean> {
  if (!/^[a-f0-9]{64}$/.test(hash) || !/^[a-f0-9]{32}$/.test(salt)) return false;
  const given = await derive(password, fromHex(salt));
  let diff = 0;
  for (let i = 0; i < hash.length; i += 1) diff |= given.charCodeAt(i) ^ hash.charCodeAt(i);
  return diff === 0;
}

/** Devolve a regra violada, ou null se a senha nova serve. */
export function passwordProblem(password: unknown): string | null {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD) {
    return `A senha nova precisa ter ao menos ${MIN_PASSWORD} caracteres.`;
  }
  if (password.length > MAX_PASSWORD)
    return `A senha nova pode ter no máximo ${MAX_PASSWORD} caracteres.`;
  if (!/[A-Za-zÀ-ÿ]/.test(password) || !/\d/.test(password)) {
    return 'A senha nova precisa ter letras e números.';
  }
  return null;
}

export async function sha256Hex(text: string): Promise<string> {
  return toHex(new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(text))));
}

export function randomToken(): string {
  return toHex(crypto.getRandomValues(new Uint8Array(32)));
}
