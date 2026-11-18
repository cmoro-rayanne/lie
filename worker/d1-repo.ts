import type {
  AccountRepo,
  AccountRow,
  AttemptsRepo,
  ContentRepo,
  ContentState,
  HistoryItem,
  Publisher,
} from './ports';

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

export class D1AccountRepo implements AccountRepo {
  constructor(private readonly db: D1Database) {}

  async get(): Promise<AccountRow | null> {
    const r = await this.db
      .prepare('SELECT name, email, password_hash, password_salt FROM admin_account WHERE id = 1')
      .first<{
        name: string;
        email: string | null;
        password_hash: string | null;
        password_salt: string | null;
      }>();
    if (!r) return null;
    return {
      name: r.name,
      email: r.email,
      passwordHash: r.password_hash,
      passwordSalt: r.password_salt,
    };
  }

  async saveProfile(name: string, email: string | null, nowMs: number): Promise<void> {
    await this.db
      .prepare(
        'INSERT INTO admin_account (id, name, email, updated_at) VALUES (1, ?1, ?2, ?3) ON CONFLICT (id) DO UPDATE SET name = ?1, email = ?2, updated_at = ?3',
      )
      .bind(name, email, nowMs)
      .run();
  }

  /** Senha nova encerra também os pedidos de redefinição pendentes. */
  async savePassword(hash: string, salt: string, nowMs: number): Promise<void> {
    await this.db.batch([
      this.db
        .prepare(
          "INSERT INTO admin_account (id, name, password_hash, password_salt, updated_at) VALUES (1, '', ?1, ?2, ?3) ON CONFLICT (id) DO UPDATE SET password_hash = ?1, password_salt = ?2, updated_at = ?3",
        )
        .bind(hash, salt, nowMs),
      this.db.prepare('DELETE FROM password_resets'),
    ]);
  }

  async createReset(tokenHash: string, expiresAtMs: number): Promise<void> {
    await this.db.batch([
      this.db.prepare('DELETE FROM password_resets'),
      this.db
        .prepare('INSERT INTO password_resets (token_hash, expires_at) VALUES (?1, ?2)')
        .bind(tokenHash, expiresAtMs),
    ]);
  }

  async consumeReset(tokenHash: string, nowMs: number): Promise<boolean> {
    const r = await this.db
      .prepare(
        'UPDATE password_resets SET used_at = ?2 WHERE token_hash = ?1 AND used_at IS NULL AND expires_at > ?2 RETURNING token_hash',
      )
      .bind(tokenHash, nowMs)
      .first<{ token_hash: string }>();
    return r !== null;
  }
}
