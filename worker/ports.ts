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

export interface AccountRow {
  name: string;
  email: string | null;
  passwordHash: string | null;
  passwordSalt: string | null;
}

export interface AccountRepo {
  get(): Promise<AccountRow | null>;
  saveProfile(name: string, email: string | null, nowMs: number): Promise<void>;
  savePassword(hash: string, salt: string, nowMs: number): Promise<void>;
  /** Guarda o pedido de redefinição e descarta os anteriores. */
  createReset(tokenHash: string, expiresAtMs: number): Promise<void>;
  /** Marca o pedido como usado se ele existe, não venceu e ainda não foi usado. */
  consumeReset(tokenHash: string, nowMs: number): Promise<boolean>;
}

export interface MailMessage {
  to: string;
  subject: string;
  text: string;
}

export interface Mailer {
  /** false = sem servidor de e-mail configurado. */
  readonly configured: boolean;
  /** Devolve false se o envio falhou. */
  send(message: MailMessage): Promise<boolean>;
}
