export interface ContentState {
  draft: string;
  draftVersion: number;
  published: string;
  publishedVersion: number;
  /** Versão do rascunho que está publicada hoje. */
  publishedFromDraft: number;
  updatedAt: string;
  publishedAt: string;
}

export interface HistoryItem {
  id: number;
  version: number;
  createdAt: string;
}

export interface ContentRepo {
  get(): Promise<ContentState | null>;
  /** Cria a linha única só se ainda não existir. */
  init(json: string, now: string): Promise<void>;
  /** Grava o rascunho se a versão atual for `expectedVersion`; devolve a nova versão ou null (conflito). */
  saveDraft(json: string, expectedVersion: number, now: string): Promise<number | null>;
  /** Publica o rascunho se a versão dele for `expectedDraftVersion`; devolve a versão pública ou null (conflito). */
  publish(expectedDraftVersion: number, now: string): Promise<number | null>;
  addHistory(version: number, json: string, now: string): Promise<void>;
  listHistory(limit: number): Promise<HistoryItem[]>;
  getHistory(id: number): Promise<string | null>;
}

export interface Publisher {
  /** Pede ao Cloudflare para gerar o site de novo. Devolve false se não deu certo. */
  trigger(): Promise<boolean>;
}

export interface AttemptsRepo {
  count(ip: string, sinceMs: number): Promise<number>;
  add(ip: string, atMs: number): Promise<void>;
}
