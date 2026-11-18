import type { Plugin } from 'vite';
import { embedded } from './src/content/embedded';
import { SiteContent } from './src/content/schema';

const VIRTUAL_ID = 'virtual:site-content';
const RESOLVED_ID = '\0' + VIRTUAL_ID;
const PRODUCTION_URL = 'https://elianalino.com.br';

/** Foto original de cada seção (`src/assets/fotos/web/`), usada enquanto o painel não envia outra. */
const DEFAULT_PHOTOS: Record<string, string> = {
  'IMG_1486-web.jpg': 'about',
  'IMG_1131-web.jpg': 'groups',
  'IMG_1390-web.jpg': 'projects',
  'IMG_1108-web.jpg': 'cta',
};

export interface LoadedContent {
  content: SiteContent;
  source: string;
}

/**
 * Busca o conteúdo publicado no painel (`GET {base}/api/public/site`). Sem endereço, com demora
 * ou com resposta fora do contrato, devolve o conteúdo embutido: o build nunca quebra por isso.
 */
export async function loadSiteContent(
  base: string | undefined,
  fetcher: typeof fetch = fetch,
): Promise<LoadedContent> {
  const fallback = SiteContent.parse(embedded);
  if (!base) return { content: fallback, source: 'embutido' };
  try {
    const res = await fetcher(`${base.replace(/\/+$/, '')}/api/public/site`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return { content: fallback, source: `embutido (painel respondeu ${res.status})` };
    const body = (await res.json()) as { version?: number; content?: unknown };
    // Conteúdo publicado antes de uma seção existir no contrato: completa com o embutido.
    const merged =
      body.content && typeof body.content === 'object'
        ? { ...fallback, ...body.content }
        : body.content;
    const parsed = SiteContent.safeParse(merged);
    if (!parsed.success) {
      return { content: fallback, source: 'embutido (conteúdo do painel fora do formato)' };
    }
    return { content: parsed.data, source: `painel, versão ${body.version ?? '?'}` };
  } catch {
    return { content: fallback, source: 'embutido (painel não respondeu)' };
  }
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Entrega o conteúdo às seções pelo módulo `virtual:site-content` e preenche o título e a
 * descrição do `index.html` (`%SEO_TITLE%`, `%SEO_DESCRIPTION%`).
 *
 * No build, lê do painel em produção; `SITE_API_URL` troca o endereço (ou, vazio, desliga a
 * busca). Em `vite dev` e nos testes usa o embutido, a menos que `SITE_API_URL` esteja definido.
 */
export function siteContent(): Plugin {
  let loaded: Promise<LoadedContent> | undefined;
  let isBuild = false;
  const load = () =>
    (loaded ??= loadSiteContent(
      process.env.SITE_API_URL ?? (isBuild ? PRODUCTION_URL : undefined),
    ).then((r) => {
      console.log(`[conteúdo] ${r.source}`);
      return r;
    }));

  return {
    name: 'site-content',
    config(_config, env) {
      isBuild = env.command === 'build' && process.env.VITEST === undefined;
    },
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : undefined;
    },
    async load(id) {
      if (id !== RESOLVED_ID) return undefined;
      return `export default ${JSON.stringify((await load()).content)};`;
    },
    // Diz ao painel onde estão as fotos originais (o build põe um código no nome do arquivo).
    generateBundle(_options, bundle) {
      const originals: Record<string, string> = {};
      for (const file of Object.values(bundle)) {
        if (file.type !== 'asset') continue;
        for (const original of file.originalFileNames) {
          const section = DEFAULT_PHOTOS[original.split('/').pop() ?? ''];
          if (section) originals[section] = `/${file.fileName}`;
        }
      }
      this.emitFile({
        type: 'asset',
        fileName: 'admin/fotos-originais.json',
        source: JSON.stringify(originals),
      });
    },
    async transformIndexHtml(html) {
      const { seo } = (await load()).content;
      return html
        .replaceAll('%SEO_TITLE%', escapeHtml(seo.title))
        .replaceAll('%SEO_DESCRIPTION%', escapeHtml(seo.description));
    },
  };
}
