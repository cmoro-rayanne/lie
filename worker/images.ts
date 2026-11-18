export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;

const TYPES: Record<string, 'webp' | 'jpg' | 'png'> = {
  'image/webp': 'webp',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};

export type ImageCheck = { ok: true; ext: 'webp' | 'jpg' | 'png' } | { ok: false; error: string };

function startsWith(bytes: Uint8Array, sig: number[], offset = 0): boolean {
  return sig.every((b, i) => bytes[offset + i] === b);
}

function signatureMatches(ext: 'webp' | 'jpg' | 'png', b: Uint8Array): boolean {
  if (ext === 'png') return startsWith(b, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  if (ext === 'jpg') return startsWith(b, [0xff, 0xd8, 0xff]);
  return startsWith(b, [0x52, 0x49, 0x46, 0x46]) && startsWith(b, [0x57, 0x45, 0x42, 0x50], 8);
}

export function checkImage(contentType: string | null, bytes: Uint8Array): ImageCheck {
  const ext = TYPES[(contentType ?? '').split(';')[0]!.trim().toLowerCase()];
  if (!ext) return { ok: false, error: 'Envie uma imagem JPEG, PNG ou WebP.' };
  if (bytes.byteLength === 0) return { ok: false, error: 'O arquivo está vazio.' };
  if (bytes.byteLength > MAX_IMAGE_BYTES) return { ok: false, error: 'A imagem passa de 2 MB.' };
  if (!signatureMatches(ext, bytes))
    return { ok: false, error: 'O arquivo não parece ser uma imagem válida.' };
  return { ok: true, ext };
}

export function newImageKey(ext: string): string {
  const raw = crypto.getRandomValues(new Uint8Array(16));
  return `${Array.from(raw, (b) => b.toString(16).padStart(2, '0')).join('')}.${ext}`;
}

export const IMAGE_KEY = /^[a-f0-9]{16,64}\.(webp|jpg|png)$/;

/** Arquivos (`<hash>.<ext>`) citados como `/img/...` em algum dos conteúdos (JSON em texto). */
export function imagesInUse(jsons: string[]): Set<string> {
  const used = new Set<string>();
  for (const json of jsons) {
    for (const m of json.matchAll(/\/img\/([a-f0-9]{16,64}\.(?:webp|jpg|png))/g)) used.add(m[1]!);
  }
  return used;
}
