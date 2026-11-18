import { SiteContent } from '../src/content/schema';
import { formatIssues } from './errors';
import type { ContentRepo, ContentState, HistoryItem, Publisher } from './ports';

export interface DraftView {
  content: SiteContent;
  version: number;
  publishedVersion: number;
  unpublished: boolean;
  updatedAt: string;
  publishedAt: string;
}

export type SaveResult =
  | { ok: true; version: number }
  | { ok: false; kind: 'invalido'; errors: string[] }
  | { ok: false; kind: 'conflito' };

export type PublishResult =
  { ok: true; publishedVersion: number; buildTriggered: boolean } | { ok: false; kind: 'conflito' };

export type RestoreResult = SaveResult | { ok: false; kind: 'inexistente' };

const HISTORY_LIMIT = 30;

export class ContentService {
  constructor(
    private readonly repo: ContentRepo,
    private readonly publisher: Publisher,
    private readonly seed: SiteContent,
    private readonly clock: () => string = () => new Date().toISOString(),
  ) {}

  private async state(): Promise<ContentState> {
    const current = await this.repo.get();
    if (current) return current;
    await this.repo.init(JSON.stringify(this.seed), this.clock());
    const created = await this.repo.get();
    if (!created) throw new Error('não foi possível criar o conteúdo inicial');
    return created;
  }

  /** Conteúdo guardado antes de uma seção existir no contrato: completa com o conteúdo inicial. */
  private read(json: string): SiteContent {
    return { ...this.seed, ...(JSON.parse(json) as Partial<SiteContent>) };
  }

  /** Rascunho e versão publicada como estão guardados (para saber quais imagens estão em uso). */
  async rawContents(): Promise<string[]> {
    const s = await this.state();
    return [s.draft, s.published];
  }

  async getDraft(): Promise<DraftView> {
    const s = await this.state();
    return {
      content: this.read(s.draft),
      version: s.draftVersion,
      publishedVersion: s.publishedVersion,
      unpublished: s.draftVersion > s.publishedFromDraft,
      updatedAt: s.updatedAt,
      publishedAt: s.publishedAt,
    };
  }

  async getPublished(): Promise<{ version: number; content: SiteContent }> {
    const s = await this.state();
    return { version: s.publishedVersion, content: this.read(s.published) };
  }

  async saveDraft(input: unknown, expectedVersion: number): Promise<SaveResult> {
    const parsed = SiteContent.safeParse(input);
    if (!parsed.success)
      return { ok: false, kind: 'invalido', errors: formatIssues(parsed.error.issues, input) };
    await this.state();
    const version = await this.repo.saveDraft(
      JSON.stringify(parsed.data),
      expectedVersion,
      this.clock(),
    );
    return version === null ? { ok: false, kind: 'conflito' } : { ok: true, version };
  }

  async publish(expectedDraftVersion: number): Promise<PublishResult> {
    await this.state();
    const now = this.clock();
    const publishedVersion = await this.repo.publish(expectedDraftVersion, now);
    if (publishedVersion === null) return { ok: false, kind: 'conflito' };
    const s = await this.state();
    try {
      await this.repo.addHistory(publishedVersion, s.published, now);
    } catch {
      // histórico é secundário: a publicação já valeu
    }
    // Falha ao avisar o Cloudflare não desfaz a publicação.
    const buildTriggered = await this.publisher.trigger().catch(() => false);
    return { ok: true, publishedVersion, buildTriggered };
  }

  async history(): Promise<HistoryItem[]> {
    await this.state();
    return this.repo.listHistory(HISTORY_LIMIT);
  }

  /** Copia uma versão publicada antes para o rascunho; o histórico não é apagado. */
  async restore(id: number): Promise<RestoreResult> {
    const json = await this.repo.getHistory(id);
    if (json === null) return { ok: false, kind: 'inexistente' };
    const s = await this.state();
    const version = await this.repo.saveDraft(json, s.draftVersion, this.clock());
    return version === null ? { ok: false, kind: 'conflito' } : { ok: true, version };
  }
}
