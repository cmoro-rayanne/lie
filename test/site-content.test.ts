import { describe, expect, it } from 'vitest';
import { embedded } from '../src/content/embedded';
import { splitEmphasis } from '../src/content/emphasis';
import type { SiteContent } from '../src/content/schema';
import { loadSiteContent } from '../vite-plugin-site-content';

const respond = (body: unknown, status = 200) =>
  (async () => new Response(JSON.stringify(body), { status })) as unknown as typeof fetch;

describe('conteúdo na hora do build', () => {
  it('sem endereço do painel usa o embutido', async () => {
    expect(await loadSiteContent(undefined)).toEqual({ content: embedded, source: 'embutido' });
  });

  it('usa o que o painel publicou e completa seção que falta', async () => {
    const published: Partial<SiteContent> = {
      ...embedded,
      hero: { ...embedded.hero, title: 'Do painel' },
    };
    delete published.footer;
    const r = await loadSiteContent(
      'https://exemplo.test/',
      respond({ version: 7, content: published }),
    );
    expect(r.source).toBe('painel, versão 7');
    expect(r.content.hero.title).toBe('Do painel');
    expect(r.content.footer).toEqual(embedded.footer);
  });

  it('painel fora do ar, com erro ou com conteúdo inválido não quebra o build', async () => {
    const offline = (async () => {
      throw new Error('rede');
    }) as unknown as typeof fetch;
    expect((await loadSiteContent('https://exemplo.test', offline)).content).toEqual(embedded);
    expect((await loadSiteContent('https://exemplo.test', respond({}, 404))).source).toBe(
      'embutido (painel respondeu 404)',
    );
    const invalid = { version: 2, content: { hero: { title: '' } } };
    const r = await loadSiteContent('https://exemplo.test', respond(invalid));
    expect(r).toEqual({
      content: embedded,
      source: 'embutido (conteúdo do painel fora do formato)',
    });
  });
});

describe('destaque em títulos', () => {
  it('separa o trecho entre asteriscos', () => {
    expect(splitEmphasis('Como posso *caminhar* ao seu lado')).toEqual([
      { text: 'Como posso ', em: false },
      { text: 'caminhar', em: true },
      { text: ' ao seu lado', em: false },
    ]);
    expect(splitEmphasis('Sem destaque')).toEqual([{ text: 'Sem destaque', em: false }]);
    expect(splitEmphasis('*Tudo*')).toEqual([{ text: 'Tudo', em: true }]);
  });
});
