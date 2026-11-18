import type { AttemptsRepo, ContentRepo, ContentState, HistoryItem, Publisher } from './ports';

const HISTORY_KEEP = 30;

export class D1ContentRepo implements ContentRepo {
  constructor(private readonly db: D1Database) {}

  async get(): Promise<ContentState | null> {
    const r = await this.db
      .prepare(
        'SELECT draft, draft_version, published, published_version, published_from_draft, updated_at, published_at FROM site_content WHERE id = 1',
      )
      .first<Record<string, string | number>>();
    if (!r) return null;
    return {
      draft: r.draft as string,
      draftVersion: r.draft_version as number,
      published: r.published as string,
      publishedVersion: r.published_version as number,
      publishedFromDraft: r.published_from_draft as number,
      updatedAt: r.updated_at as string,
      publishedAt: r.published_at as string,
    };
  }

  async init(json: string, now: string): Promise<void> {
    await this.db
      .prepare(
        'INSERT OR IGNORE INTO site_content (id, draft, draft_version, published, published_version, published_from_draft, updated_at, published_at) VALUES (1, ?1, 1, ?1, 1, 1, ?2, ?2)',
      )
      .bind(json, now)
      .run();
  }

  async saveDraft(json: string, expectedVersion: number, now: string): Promise<number | null> {
    const r = await this.db
      .prepare(
        'UPDATE site_content SET draft = ?1, draft_version = draft_version + 1, updated_at = ?2 WHERE id = 1 AND draft_version = ?3 RETURNING draft_version',
      )
      .bind(json, now, expectedVersion)
      .first<{ draft_version: number }>();
    return r ? r.draft_version : null;
  }

  async publish(expectedDraftVersion: number, now: string): Promise<number | null> {
    const r = await this.db
      .prepare(
        'UPDATE site_content SET published = draft, published_version = published_version + 1, published_from_draft = draft_version, published_at = ?1 WHERE id = 1 AND draft_version = ?2 RETURNING published_version',
      )
      .bind(now, expectedDraftVersion)
      .first<{ published_version: number }>();
    return r ? r.published_version : null;
  }

  async addHistory(version: number, json: string, now: string): Promise<void> {
    await this.db.batch([
      this.db
        .prepare('INSERT INTO content_history (version, json, created_at) VALUES (?1, ?2, ?3)')
        .bind(version, json, now),
      this.db
        .prepare(
          'DELETE FROM content_history WHERE id NOT IN (SELECT id FROM content_history ORDER BY id DESC LIMIT ?1)',
        )
        .bind(HISTORY_KEEP),
    ]);
  }

  async listHistory(limit: number): Promise<HistoryItem[]> {
    const r = await this.db
      .prepare('SELECT id, version, created_at FROM content_history ORDER BY id DESC LIMIT ?1')
      .bind(limit)
      .all<{ id: number; version: number; created_at: string }>();
    return r.results.map((x) => ({ id: x.id, version: x.version, createdAt: x.created_at }));
  }

  async getHistory(id: number): Promise<string | null> {
    const r = await this.db
      .prepare('SELECT json FROM content_history WHERE id = ?1')
      .bind(id)
      .first<{ json: string }>();
    return r ? r.json : null;
  }
}

export class D1AttemptsRepo implements AttemptsRepo {
  constructor(private readonly db: D1Database) {}

  async count(ip: string, sinceMs: number): Promise<number> {
    const r = await this.db
      .prepare('SELECT COUNT(*) AS n FROM login_attempts WHERE ip = ?1 AND at > ?2')
      .bind(ip, sinceMs)
      .first<{ n: number }>();
    return r?.n ?? 0;
  }

  async add(ip: string, atMs: number): Promise<void> {
    await this.db.batch([
      this.db.prepare('INSERT INTO login_attempts (ip, at) VALUES (?1, ?2)').bind(ip, atMs),
      this.db.prepare('DELETE FROM login_attempts WHERE at < ?1').bind(atMs - 24 * 60 * 60 * 1000),
    ]);
  }
}

export class DeployHookPublisher implements Publisher {
  constructor(private readonly url: string | undefined) {}

  async trigger(): Promise<boolean> {
    if (!this.url) return false;
    const res = await fetch(this.url, { method: 'POST', signal: AbortSignal.timeout(8000) });
    return res.ok;
  }
}
