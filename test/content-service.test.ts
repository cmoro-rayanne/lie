import { beforeEach, describe, expect, it } from 'vitest';
import { embedded } from '../src/content/embedded';
import { SiteContent } from '../src/content/schema';
import { ContentService } from '../worker/content-service';
import { FakePublisher, MemoryRepo } from './helpers';

const seed = SiteContent.parse(embedded);
const clone = () => structuredClone(seed);

let repo: MemoryRepo;
let pub: FakePublisher;
let svc: ContentService;
beforeEach(() => {
  repo = new MemoryRepo();
  pub = new FakePublisher();
  svc = new ContentService(repo, pub, seed, () => '2026-11-18T00:00:00.000Z');
});

describe('conteúdo inicial', () => {
  it('o conteúdo embutido respeita o contrato', () => {
    expect(SiteContent.safeParse(embedded).success).toBe(true);
  });
  it('primeiro acesso carrega o embutido como rascunho e como publicado, sem pendência', async () => {
    const d = await svc.getDraft();
    expect(d.version).toBe(1);
    expect(d.unpublished).toBe(false);
    expect((await svc.getPublished()).content).toEqual(seed);
  });
});

describe('salvar rascunho', () => {
  it('salva sem mexer no que está publicado e marca pendência', async () => {
    const c = clone();
    c.hero.title = 'Novo título';
    const r = await svc.saveDraft(c, 1);
    expect(r).toEqual({ ok: true, version: 2 });
    expect((await svc.getDraft()).unpublished).toBe(true);
    expect((await svc.getPublished()).content.hero.title).toBe(seed.hero.title);
  });

  it('aponta seção, item e campo em português', async () => {
    const c = clone();
    c.areas.items[1]!.lead = '';
    c.about.paragraphs = [];
    const r = await svc.saveDraft(c, 1);
    expect(r.ok).toBe(false);
    if (!r.ok && r.kind === 'invalido') {
      expect(r.errors).toContain('Atuação › Áreas › Pathwork › Resumo: não pode ficar vazio');
      expect(r.errors).toContain('Sobre › Parágrafos: precisa ter ao menos 1 item(ns)');
    }
  });

  it('explica limite de tamanho e formato', async () => {
    const c = clone();
    c.hero.eyebrow = 'x'.repeat(81);
    c.contact.whatsapp = '48999212332';
    c.contact.instagram = 'http://instagram.com/eliana_lino';
    const r = await svc.saveDraft(c, 1);
    expect(r.ok).toBe(false);
    if (!r.ok && r.kind === 'invalido') {
      expect(r.errors).toContain('Início › Chamada acima do título: máximo de 80 caracteres');
      expect(r.errors.some((e) => e.startsWith('Contato › WhatsApp: WhatsApp com DDI'))).toBe(true);
      expect(r.errors).toContain('Contato › Instagram: precisa começar com https://');
    }
    expect((await svc.getDraft()).version).toBe(1);
  });

  it('versão antiga dá conflito e não altera o rascunho', async () => {
    const a = clone();
    a.hero.title = 'Aba A';
    const b = clone();
    b.hero.title = 'Aba B';
    expect((await svc.saveDraft(a, 1)).ok).toBe(true);
    expect(await svc.saveDraft(b, 1)).toEqual({ ok: false, kind: 'conflito' });
    expect((await svc.getDraft()).content.hero.title).toBe('Aba A');
  });

  it('aceita foto enviada pelo painel e recusa caminho de fora', async () => {
    const ok = clone();
    ok.images.about.src = `/img/${'a'.repeat(32)}.webp`;
    expect((await svc.saveDraft(ok, 1)).ok).toBe(true);
    const bad = clone();
    bad.images.about.src = 'https://outro.site/x.png';
    const r = await svc.saveDraft(bad, 2);
    expect(r.ok).toBe(false);
    if (!r.ok && r.kind === 'invalido')
      expect(r.errors[0]).toBe('Fotos › Sobre › Foto: imagem inválida');
  });

  it('conteúdo guardado antes de uma seção existir é completado com o inicial', async () => {
    const antigo: Partial<SiteContent> = clone();
    delete antigo.footer;
    await repo.init(JSON.stringify(antigo), '2026-11-01T00:00:00.000Z');
    const d = await svc.getDraft();
    expect(SiteContent.safeParse(d.content).success).toBe(true);
    expect(d.content.footer).toEqual(seed.footer);
  });
});

describe('publicar', () => {
  it('copia o rascunho, grava histórico e chama o hook', async () => {
    const c = clone();
    c.hero.title = 'Publicado';
    await svc.saveDraft(c, 1);
    const r = await svc.publish(2);
    expect(r).toEqual({ ok: true, publishedVersion: 2, buildTriggered: true });
    expect(pub.calls).toBe(1);
    expect((await svc.getPublished()).content.hero.title).toBe('Publicado');
    expect((await svc.getDraft()).unpublished).toBe(false);
    expect(await svc.history()).toHaveLength(1);
  });

  it('falha ou erro do hook não desfaz a publicação', async () => {
    const c = clone();
    c.hero.title = 'Mesmo assim';
    await svc.saveDraft(c, 1);
    pub.mode = 'throw';
    const r = await svc.publish(2);
    expect(r).toEqual({ ok: true, publishedVersion: 2, buildTriggered: false });
    expect((await svc.getPublished()).content.hero.title).toBe('Mesmo assim');
  });

  it('falha ao gravar histórico não impede a publicação', async () => {
    repo.failHistory = true;
    const r = await svc.publish(1);
    expect(r.ok).toBe(true);
  });

  it('rascunho que mudou nesse meio tempo dá conflito e não chama o hook', async () => {
    await svc.saveDraft(clone(), 1);
    expect(await svc.publish(1)).toEqual({ ok: false, kind: 'conflito' });
    expect(pub.calls).toBe(0);
  });
});

describe('voltar versão', () => {
  it('cria novo rascunho com o conteúdo antigo e mantém o histórico', async () => {
    const v2 = clone();
    v2.hero.title = 'Segunda';
    await svc.saveDraft(v2, 1);
    await svc.publish(2);
    const v3 = clone();
    v3.hero.title = 'Terceira';
    await svc.saveDraft(v3, 2);
    await svc.publish(3);
    const items = await svc.history();
    expect(items).toHaveLength(2);
    const r = await svc.restore(items[1]!.id);
    expect(r).toEqual({ ok: true, version: 4 });
    expect((await svc.getDraft()).content.hero.title).toBe('Segunda');
    expect((await svc.getPublished()).content.hero.title).toBe('Terceira');
    expect(await svc.history()).toHaveLength(2);
  });

  it('versão que não existe', async () => {
    expect(await svc.restore(99)).toEqual({ ok: false, kind: 'inexistente' });
  });
});
