-- Conta do painel e "esqueci minha senha" (docs/specs/0002-conta-e-senha.md).
-- Já aplicada no banco de produção. Local: npx wrangler d1 migrations apply elianalino-conteudo --local
CREATE TABLE admin_account (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  password_hash TEXT,
  password_salt TEXT,
  updated_at INTEGER NOT NULL
);

CREATE TABLE password_resets (
  token_hash TEXT PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  used_at INTEGER
);
