import { describe, expect, it } from 'vitest';
import { IMAGE_KEY, MAX_IMAGE_BYTES, checkImage, imagesInUse, newImageKey } from '../worker/images';
import { embedded } from '../src/content/embedded';
import { SiteContent } from '../src/content/schema';

const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0]);
const jpg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0, 0]);
const webp = new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]);

describe('checkImage', () => {
  it('aceita JPEG, PNG e WebP com assinatura correta', () => {
    expect(checkImage('image/png', png)).toEqual({ ok: true, ext: 'png' });
    expect(checkImage('image/jpeg', jpg)).toEqual({ ok: true, ext: 'jpg' });
    expect(checkImage('image/webp', webp)).toEqual({ ok: true, ext: 'webp' });
  });
  it('recusa tipo diferente (SVG, HTML, vazio)', () => {
    expect(checkImage('image/svg+xml', png).ok).toBe(false);
    expect(checkImage('text/html', png).ok).toBe(false);
    expect(checkImage(null, png).ok).toBe(false);
  });
  it('recusa quando a assinatura não confere com o tipo declarado', () => {
    expect(checkImage('image/png', jpg).ok).toBe(false);
    expect(checkImage('image/webp', new TextEncoder().encode('<script>alert(1)</script>')).ok).toBe(
      false,
    );
  });
  it('recusa arquivo vazio e acima de 2 MB', () => {
    expect(checkImage('image/png', new Uint8Array()).ok).toBe(false);
    const big = new Uint8Array(MAX_IMAGE_BYTES + 1);
    big.set(png);
    expect(checkImage('image/png', big)).toEqual({ ok: false, error: 'A imagem passa de 2 MB.' });
  });
});

describe('nome do arquivo', () => {
  it('é aleatório, casa com o padrão de leitura e com o contrato do site', () => {
    const k = newImageKey('webp');
    expect(IMAGE_KEY.test(k)).toBe(true);
    expect(newImageKey('webp')).not.toBe(k);
    const images = { ...embedded.images, about: { ...embedded.images.about, src: `/img/${k}` } };
    expect(SiteContent.safeParse({ ...embedded, images }).success).toBe(true);
    expect(IMAGE_KEY.test('../segredo.png')).toBe(false);
  });
});

describe('imagesInUse', () => {
  it('acha as imagens citadas no rascunho e no publicado', () => {
    const a = `${'a'.repeat(32)}.webp`;
    const b = `${'b'.repeat(32)}.jpg`;
    const used = imagesInUse([
      JSON.stringify({ clients: [{ image: `/img/${a}` }], images: {} }),
      JSON.stringify({ images: { og: `/img/${b}` } }),
    ]);
    expect([...used].sort()).toEqual([a, b]);
    expect(used.has(`${'c'.repeat(32)}.png`)).toBe(false);
  });
});
