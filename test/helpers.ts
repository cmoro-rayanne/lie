import type {
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
