-- Painel de conteúdo (docs/specs/0001-painel-conteudo.md). Já aplicada no banco de produção (elianalino-conteudo).
-- Local: npx wrangler d1 migrations apply elianalino-conteudo --local
CREATE TABLE site_content (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  draft TEXT NOT NULL,
  draft_version INTEGER NOT NULL DEFAULT 1,
  published TEXT NOT NULL,
  published_version INTEGER NOT NULL DEFAULT 1,
  published_from_draft INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL,
  published_at TEXT NOT NULL
);

CREATE TABLE content_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  version INTEGER NOT NULL,
  json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE login_attempts (
  ip TEXT NOT NULL,
  at INTEGER NOT NULL
);
CREATE INDEX login_attempts_ip_at ON login_attempts (ip, at);
