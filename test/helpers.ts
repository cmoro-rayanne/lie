import type {
  AccountRepo,
  AccountRow,
  MailMessage,
  Mailer,
  AttemptsRepo,
  ContentRepo,
  ContentState,
  HistoryItem,
  Publisher,
} from '../worker/ports';

export class MemoryRepo implements ContentRepo {
  state: ContentState | null = null;
  history: { id: number; version: number; json: string; createdAt: string }[] = [];
  failHistory = false;

  async get() {
    return this.state ? { ...this.state } : null;
  }
  async init(json: string, now: string) {
    this.state ??= {
      draft: json,
      draftVersion: 1,
      published: json,
      publishedVersion: 1,
      publishedFromDraft: 1,
      updatedAt: now,
      publishedAt: now,
    };
  }
  async saveDraft(json: string, expected: number, now: string) {
    if (!this.state || this.state.draftVersion !== expected) return null;
    this.state.draft = json;
    this.state.draftVersion += 1;
    this.state.updatedAt = now;
    return this.state.draftVersion;
  }
  async publish(expected: number, now: string) {
    if (!this.state || this.state.draftVersion !== expected) return null;
    this.state.published = this.state.draft;
    this.state.publishedVersion += 1;
    this.state.publishedFromDraft = this.state.draftVersion;
    this.state.publishedAt = now;
    return this.state.publishedVersion;
  }
  async addHistory(version: number, json: string, now: string) {
    if (this.failHistory) throw new Error('falha');
    this.history.push({ id: this.history.length + 1, version, json, createdAt: now });
  }
  async listHistory(limit: number): Promise<HistoryItem[]> {
    return [...this.history]
      .reverse()
      .slice(0, limit)
      .map((h) => ({ id: h.id, version: h.version, createdAt: h.createdAt }));
  }
  async getHistory(id: number) {
    return this.history.find((h) => h.id === id)?.json ?? null;
  }
}

export class FakePublisher implements Publisher {
  calls = 0;
  mode: 'ok' | 'false' | 'throw' = 'ok';
  async trigger() {
    this.calls += 1;
    if (this.mode === 'throw') throw new Error('rede');
    return this.mode === 'ok';
  }
}

export class MemoryAttempts implements AttemptsRepo {
  rows: { ip: string; at: number }[] = [];
  async count(ip: string, since: number) {
    return this.rows.filter((r) => r.ip === ip && r.at > since).length;
  }
  async add(ip: string, at: number) {
    this.rows.push({ ip, at });
  }
}

export class MemoryAccount implements AccountRepo {
  row: AccountRow | null = null;
  resets: { tokenHash: string; expiresAt: number; usedAt: number | null }[] = [];

  async get() {
    return this.row ? { ...this.row } : null;
  }
  async saveProfile(name: string, email: string | null) {
    this.row = { passwordHash: null, passwordSalt: null, ...this.row, name, email };
  }
  async savePassword(hash: string, salt: string) {
    this.row = { name: '', email: null, ...this.row, passwordHash: hash, passwordSalt: salt };
    this.resets = [];
  }
  async createReset(tokenHash: string, expiresAt: number) {
    this.resets = [{ tokenHash, expiresAt, usedAt: null }];
  }
  async consumeReset(tokenHash: string, nowMs: number) {
    const r = this.resets.find(
      (x) => x.tokenHash === tokenHash && x.usedAt === null && x.expiresAt > nowMs,
    );
    if (!r) return false;
    r.usedAt = nowMs;
    return true;
  }
}

export class FakeMailer implements Mailer {
  configured = true;
  sent: MailMessage[] = [];
  async send(message: MailMessage) {
    this.sent.push(message);
    return true;
  }
}
