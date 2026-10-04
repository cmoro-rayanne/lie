// @vitest-environment node
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

// AUTH-17: o conteúdo do painel não entra no HTML nem no bundle principal da landing.
// O build é rodado aqui para que o teste sempre meça o artefato atual.

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const viteBin = resolve(root, 'node_modules', 'vite', 'bin', 'vite.js');

const ADMIN_ONLY_STRINGS = ['Esqueci minha senha', 'redefinir-senha'];

function mainChunkPath(): string {
  const html = readFileSync(resolve(dist, 'index.html'), 'utf8');
  const match = html.match(/<script[^>]+type="module"[^>]+src="\/?(assets\/[^"]+\.js)"/);
  if (!match) throw new Error('index.html sem script de entrada');
  return resolve(dist, match[1]);
}

function adminChunkPath(): string {
  const assets = resolve(dist, 'assets');
  const file = readdirSync(assets).find((name) => /^AdminApp-.*\.js$/.test(name));
  if (!file) throw new Error('chunk AdminApp-*.js não encontrado em dist/assets');
  return resolve(assets, file);
}

describe('isolamento do painel no build (AUTH-17)', () => {
  it(
    'o chunk principal da landing não contém strings do painel; o chunk AdminApp as contém',
    () => {
      execFileSync(process.execPath, [viteBin, 'build'], {
        cwd: root,
        stdio: 'pipe',
        timeout: 110_000,
      });
      expect(existsSync(resolve(dist, 'index.html'))).toBe(true);

      const html = readFileSync(resolve(dist, 'index.html'), 'utf8');
      const mainSource = readFileSync(mainChunkPath(), 'utf8');
      const adminSource = readFileSync(adminChunkPath(), 'utf8');

      // O HTML da landing referencia o script de entrada e não carrega conteúdo do painel.
      expect(html).toMatch(/<script[^>]+type="module"[^>]+src="\/?assets\/[^"]+\.js"/);
      for (const text of ADMIN_ONLY_STRINGS) {
        expect(html).not.toContain(text);
        expect(mainSource).not.toContain(text);
        expect(adminSource).toContain(text);
      }
    },
    120_000,
  );
});
