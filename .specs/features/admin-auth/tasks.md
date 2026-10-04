# Autenticação do Painel Administrativo Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, adequacy review, Verifier, discrimination sensor).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/admin-auth/design.md`
**Spec**: `.specs/features/admin-auth/spec.md`
**Status**: Draft (aguardando aprovação)

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: `vitest.config.ts` (jsdom, globals, `src/test/setup.ts`), `package.json` (`test`: `vitest run`), `CLAUDE.md` (validar com `npm run build` e lint; sem suíte de testes até agora). Nenhum guia de testes específico; strong defaults aplicados.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| `server/config.ts`, `server/validation.ts`, `server/auth/*.ts`, `server/mail.ts`, `server/http.ts` | unit | Todos os ramos; 1:1 com ACs da spec; todos os edge cases listados | `server/**/*.test.ts` | `npm test -- server` |
| `server/repo/neon.ts` | integration | Consultas-chave e caminhos de erro (unique em e-mail, transação de redefinição) | `server/repo/neon.test.ts` | `npm test -- server/repo` (exige `TEST_DATABASE_URL`) |
| `api/admin/*.ts` | integration | Todas as rotas: happy path, edge cases, erros (400/401/403/409/410/429/503) | `api/admin/*.test.ts` | `npm test -- api` |
| `src/admin/**/*.tsx`, `src/admin/*.ts` | unit (componente) | Cada AC de tela; redirecionamentos; mensagens | `src/admin/**/*.test.tsx` | `npm test -- src/admin` |
| `server/schema.sql`, `server/repo/types.ts`, `server/repo/memory.ts`, `scripts/db-migrate.mjs`, `vercel.json`, `README.md` | none | - (build gate) | - | build gate only |

> `server/repo/memory.ts` é dublê de teste. Não tem teste próprio: é exercitado diretamente pelos testes de `api/admin/*` (T15 a T18).

## Gate Check Commands

> Generated from codebase - confirm before Execute.

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Tasks com teste unitário apenas | `npm test -- <caminho do teste da task>` |
| Full | Tasks com teste de integração (rotas, repositório) | `npm test` |
| Build | Fim de fase, ou tasks só de config/schema | `npm run build && npx eslint <arquivos da task ou da fase> && npm test` |

> **Lint:** `npm run lint` tem um erro conhecido em `src/init.ts` (documentado em `CLAUDE.md`). O gate usa `npx eslint` nos arquivos da task ou da fase para não bloquear por erro pré-existente.

---

## Execution Plan

Fases executadas em ordem; dentro de cada fase, as tasks rodam em sequência.

### Phase 1: Fundação (config, schema, validação, criptografia, HTTP)

```
T1 → T2 → T3 → T4 → T5 → T6 → T7
```

### Phase 2: Repositório e serviços de domínio

```
T8 → T9 → T10 → T11 → T12 → T13 → T14
```

### Phase 3: Rotas da API

```
T15 → T16 → T17 → T18 → T19
```

### Phase 4: Interface do painel

```
T20 → T21 → T22 → T23 → T24 → T25 → T26 → T27 → T28 → T29 → T30
```

---

## Phase Execution Map

```
Phase 1 → Phase 2 → Phase 3 → Phase 4

Phase 1:  T1 → T2 → T3 → T4 → T5 → T6 → T7
Phase 2:  T8 → T9 → T10 → T11 → T12 → T13 → T14
Phase 3:  T15 → T16 → T17 → T18 → T19
Phase 4:  T20 → T21 → T22 → T23 → T24 → T25 → T26 → T27 → T28 → T29 → T30
```

Execução estritamente sequencial. Um agente (ou worker de lote) faz uma task por vez.

**Pacotes:** 30 tasks. Com o orçamento de ~7 tasks por worker, empacotando fases inteiras, o trabalho fica em 4 lotes (um por fase, com a Fase 1 e a Fase 2 podendo ocupar um lote cada). A escolha de modo de execução está no fim do documento.

---

## Task Breakdown

### Phase 1: Fundação

### T1: Dependências e variáveis de ambiente

**What**: Adicionar `@neondatabase/serverless` e o script `db:migrate`; criar `.env.example` com os nomes das variáveis, sem valores.
**Where**: `package.json`
**Depends on**: None
**Reuses**: scripts existentes em `package.json`
**Requirement**: AUTH-31 (variáveis ausentes), AD-001

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `npm install` conclui sem erro e `@neondatabase/serverless` aparece em `dependencies`
- [x] `.env.example` lista `DATABASE_URL`, `RESEND_API_KEY`, `APP_URL`, `ADMIN_INVITE_CODE`, `MAIL_FROM` sem valores reais
- [x] `.env` continua no `.gitignore`
- [x] Gate build passa

**Tests**: none (config)
**Gate**: build

**Commit**: `build(auth): adiciona driver do Neon e variáveis de ambiente do painel`

---

### T2: Schema SQL e script de migração

**What**: Criar `server/schema.sql` (tabelas `users`, `sessions`, `password_reset_tokens`, `failed_logins` e índices, com `if not exists`) e `scripts/db-migrate.mjs` que executa o arquivo.
**Where**: `server/schema.sql`
**Depends on**: T1
**Reuses**: —
**Requirement**: AUTH-01 (e-mail único), AUTH-12 (validade da sessão), AUTH-19, AUTH-31

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `users.email` é `unique` e `check (email = lower(email))`
- [x] `sessions` e `password_reset_tokens` têm `on delete cascade` para `users`
- [x] `failed_logins` tem índice em `(key, attempted_at)`
- [x] `scripts/db-migrate.mjs` lê `DATABASE_URL` e falha com mensagem clara se ausente
- [x] Gate build passa

**Tests**: none (schema)
**Gate**: build

**Commit**: `feat(auth): adiciona schema do banco e script de migração`

---

### T3: Leitura e validação de configuração

**What**: Criar `server/config.ts` com `getConfig()` que lê as cinco variáveis e lança erro nomeando a que falta.
**Where**: `server/config.ts`
**Depends on**: T2
**Reuses**: —
**Requirement**: AUTH-31 (edge: variável ausente)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] Com as cinco variáveis definidas, retorna objeto tipado com os mesmos valores
- [x] Com `ADMIN_INVITE_CODE` ausente, lança erro cuja mensagem contém `ADMIN_INVITE_CODE`
- [x] Com `APP_URL` sem protocolo, lança erro (URL inválida)
- [x] Testes passam: `npm test -- server/config`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(auth): valida variáveis de ambiente do painel`

---

### T4: Schemas de validação compartilhados

**What**: Criar `server/validation.ts` com `signupSchema`, `loginSchema`, `forgotSchema`, `resetSchema`, `passwordRule` e `normalizeEmail`.
**Where**: `server/validation.ts`
**Depends on**: T3
**Reuses**: `zod` (já em `dependencies`)
**Requirement**: AUTH-01, AUTH-04, AUTH-05, AUTH-07, AUTH-24, AUTH-27

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] Senha com 9 caracteres falha; com 10 caracteres e letra e número passa (AUTH-04)
- [x] Senha de 10 caracteres só com letras falha (AUTH-04)
- [x] E-mail `ana@exemplo` falha; `ana@exemplo.com` passa (AUTH-05)
- [x] Nome de 1 caractere falha; nome de 121 caracteres falha (AUTH-05)
- [x] `normalizeEmail('  Ana@Exemplo.COM ')` retorna `ana@exemplo.com` (AUTH-07)
- [x] Testes passam: `npm test -- server/validation`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(auth): adiciona validação de cadastro, login e senha`

---

### T5: Hash de senha com scrypt

**What**: Criar `server/auth/password.ts` com `hashPassword`, `verifyPassword` e `DUMMY_HASH`.
**Where**: `server/auth/password.ts`
**Depends on**: T4
**Reuses**: `node:crypto`
**Requirement**: AUTH-06 (hash, sal de 16 bytes), AUTH-13 (verificação com DUMMY_HASH)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] Hash começa com `scrypt$16384$8$1$` e o sal decodificado tem 16 bytes (AUTH-06)
- [x] Dois hashes da mesma senha são diferentes (sal aleatório)
- [x] `verifyPassword` retorna true para a senha certa e false para outra
- [x] `verifyPassword(qualquerSenha, DUMMY_HASH)` retorna false sem lançar erro (AUTH-13)
- [x] Testes passam: `npm test -- server/auth/password`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(auth): adiciona hash de senha com scrypt`

---

### T6: Tokens opacos e hash SHA-256

**What**: Criar `server/auth/tokens.ts` com `newToken()` e `hashToken()`.
**Where**: `server/auth/tokens.ts`
**Depends on**: T5
**Reuses**: `node:crypto`
**Requirement**: AUTH-19 (token opaco), AUTH-26 (uso único via hash)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `newToken().token` decodifica de base64url para 32 bytes
- [x] `hash` é `hashToken(token)` e tem 64 caracteres hexadecimais
- [x] `hashToken` é determinístico; tokens diferentes geram hashes diferentes
- [x] Testes passam: `npm test -- server/auth/tokens`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(auth): adiciona tokens opacos com hash SHA-256`

---

### T7: Respostas JSON, erros de campo e captura de exceções

**What**: Criar `server/http.ts` com `json`, `fail` e `withErrors`. Fecha a Fase 1 com build.
**Where**: `server/http.ts`
**Depends on**: T6
**Reuses**: `Response` padrão do runtime Web
**Requirement**: AUTH-31 (503 genérico), AUTH-09 (mensagem genérica)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] `fail(400, 'msg', 'password')` responde 400 com corpo `{ message: 'msg', field: 'password' }`
- [x] `withErrors` converte exceção em 503 com `{ message: 'Serviço temporariamente indisponível' }`, sem vazar o erro (AUTH-31)
- [x] `withErrors` registra a exceção com `console.error` (verificado com spy e conteúdo da mensagem)
- [x] `withErrors` não altera respostas que já são `Response`
- [x] Testes passam: `npm test -- server/http`
- [x] Gate build passa ao fim da fase

**Tests**: unit
**Gate**: build (último da fase)

**Commit**: `feat(auth): adiciona helpers de resposta e captura de erros`

---

### Phase 2: Repositório e serviços de domínio

### T8: Interface do repositório

**What**: Criar `server/repo/types.ts` com `AdminRepo` (usuários, sessões, tokens de redefinição, tentativas falhas) e a transação de redefinição.
**Where**: `server/repo/types.ts`
**Depends on**: T7
**Reuses**: `SessionUser` do design
**Requirement**: AUTH-25 (transação), AUTH-10 (repositório de tentativas)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] Interface cobre: `createUser`, `findUserByEmail`, `findUserById`, `createSession`, `findSession`, `deleteSession`, `deleteSessionsForUser`, `replaceResetToken`, `findResetToken`, `resetPasswordTx`, `recordFailure`, `countFailures`, `clearFailures`
- [x] `resetPasswordTx` recebe hash do token e hash de senha novo e devolve `'ok' | 'invalid'`
- [x] `tsc` sem erro

**Tests**: none (interface)
**Gate**: build

**Commit**: `feat(auth): define interface do repositório do painel`

---

### T9: Repositório Neon

**What**: Criar `server/repo/neon.ts` implementando `AdminRepo` sobre `@neondatabase/serverless`; `resetPasswordTx` usa `sql.transaction`.
**Where**: `server/repo/neon.ts`
**Depends on**: T8
**Reuses**: `server/config.ts` (T3)
**Requirement**: AUTH-01 (unique em e-mail → 409 na rota), AUTH-25 (transação), AUTH-31

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Inserir dois usuários com o mesmo e-mail lança erro de unicidade (código 23505)
- [ ] `resetPasswordTx` com token já usado retorna `'invalid'` e não altera a senha
- [ ] `resetPasswordTx` com token válido altera o hash, marca `used_at` e apaga as sessões do usuário na mesma transação
- [ ] `countFailures` conta apenas registros dentro da janela de 15 minutos
- [ ] Testes passam contra o banco de testes: `npm test -- server/repo` com `TEST_DATABASE_URL` definido

**Tests**: integration (`server/repo/neon.test.ts`)
**Gate**: full

**Commit**: `feat(auth): implementa repositório do painel no Neon`

> **Bloqueio:** esta task exige um banco Neon de teste (`TEST_DATABASE_URL`). Sem a variável, o teste falha ao iniciar com mensagem explícita; não é pulado.

---

### T10: Dublê de repositório em memória

**What**: Criar `server/repo/memory.ts` implementando `AdminRepo` em memória, usado pelos testes de `api/admin/*`.
**Where**: `server/repo/memory.ts`
**Depends on**: T9
**Reuses**: `AdminRepo` (T8)
**Requirement**: — (infraestrutura de teste; exercitado por T15 a T18)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [x] Implementa todos os métodos de `AdminRepo`
- [x] `resetPasswordTx` tem a mesma semântica do Neon (`'invalid'` para token usado, expirado ou inexistente)
- [x] `tsc` sem erro

**Tests**: none (test double; exercitado por T15 a T18)
**Gate**: build

**Commit**: `test(auth): adiciona repositório em memória para testes de rota`

---

### T11: Serviço de sessão

**What**: Criar `server/auth/session.ts` com `createSession`, `getSessionUser` e `destroySession`, recebendo o repositório por parâmetro.
**Where**: `server/auth/session.ts`
**Depends on**: T10
**Reuses**: `tokens.ts` (T6), `memory.ts` (T10)
**Requirement**: AUTH-12 (validade fixa), AUTH-16 (sessão expirada), AUTH-19 (cookie inválido), AUTH-11 (logout remove sessão)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `createSession` grava `expires_at` exatamente 7 dias após `created_at` (AUTH-12)
- [ ] `getSessionUser` com sessão expirada há 1 segundo retorna `null` (AUTH-16)
- [ ] `getSessionUser` com cookie de token inexistente retorna `null` (AUTH-19)
- [ ] `destroySession` remove a sessão do repositório e devolve cookie com `Max-Age=0` (AUTH-11)
- [ ] Cookie gerado contém `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`
- [ ] Testes passam: `npm test -- server/auth/session`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(auth): adiciona serviço de sessão com validade fixa`

---

### T12: Limite de tentativas

**What**: Criar `server/auth/rateLimit.ts` com `isLimited`, `recordFailure` e `clear` sobre o repositório.
**Where**: `server/auth/rateLimit.ts`
**Depends on**: T11
**Reuses**: `memory.ts` (T10)
**Requirement**: AUTH-10 (5 falhas em 15 min bloqueiam)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Quatro falhas não bloqueiam; a quinta bloqueia (AUTH-10)
- [ ] Após `clear(key)`, a chave volta a ser liberada
- [ ] Falhas com mais de 15 minutos não contam
- [ ] Testes passam: `npm test -- server/auth/rateLimit`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(auth): adiciona limite de tentativas de login`

---

### T13: Cliente de e-mail

**What**: Criar `server/mail.ts` com `sendPasswordReset` e `sendPasswordChanged` chamando a API REST do Resend via `fetch` injetável.
**Where**: `server/mail.ts`
**Depends on**: T12
**Reuses**: `config.ts` (T3)
**Requirement**: AUTH-21 (link no formato `APP_URL/admin/redefinir-senha?token=`), AUTH-28 (aviso de troca)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] O corpo enviado contém o link `APP_URL/admin/redefinir-senha?token=<token>` (AUTH-21)
- [ ] O cabeçalho `Authorization` usa `Bearer` com `RESEND_API_KEY`
- [ ] Resposta não-2xx faz a função lançar erro com o status
- [ ] `sendPasswordChanged` não inclui token nem link
- [ ] Testes passam: `npm test -- server/mail`

**Tests**: unit
**Gate**: quick

**Commit**: `feat(auth): adiciona envio de e-mails transacionais`

---

### T14: Build da Fase 2

**What**: Rodar o gate completo da fase e corrigir o que falhar, sem alterar testes.
**Where**: —
**Depends on**: T13
**Reuses**: —
**Requirement**: —

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `npm run build` passa
- [ ] `npx eslint server scripts` sem erro nos arquivos da fase
- [ ] `npm test` passa, ou o relatório registra a falha de `server/repo` por `TEST_DATABASE_URL` ausente (bloqueio, não pulo)

**Tests**: none (verificação de fase)
**Gate**: build

**Commit**: — (somente se houver correção: `fix(auth): ...` próprio)

---

### Phase 3: Rotas da API

Cada rota exporta `POST` (ou `GET`) em Web-standard. Lógica injetável para teste: `createXHandler(deps)`; a exportação padrão usa as dependências reais. Testes em `api/admin/*.test.ts` com `// @vitest-environment node`.

### T15: POST /api/admin/signup

**What**: Criar `api/admin/signup.ts`: valida, checa código de convite (`ADMIN_INVITE_CODE`, com rate limit por IP), cria usuário, sessão e responde 201.
**Where**: `api/admin/signup.ts`
**Depends on**: T14
**Reuses**: `validation.ts`, `password.ts`, `session.ts`, `rateLimit.ts`, `http.ts`, `memory.ts`
**Requirement**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06, AUTH-07

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Cadastro válido responde 201, define `admin_session`, e o usuário gravado tem e-mail normalizado e senha em `scrypt$...` (AUTH-01, AUTH-06, AUTH-07)
- [ ] Código errado responde 403 com `"Código de convite inválido"` e não cria usuário (AUTH-02)
- [ ] E-mail já existente responde 409 com `"Já existe uma conta com este e-mail"` (AUTH-03)
- [ ] Senha de 9 caracteres responde 400 com `field: 'password'` (AUTH-04)
- [ ] Nome de 1 caractere responde 400 com `field: 'name'` (AUTH-05)
- [ ] Após 5 códigos errados do mesmo IP, responde 429 (limite por IP, risco do design)
- [ ] Erro do repositório responde 503 sem detalhe técnico (AUTH-31)
- [ ] Testes passam: `npm test -- api/admin/signup`

**Tests**: integration (`api/admin/signup.test.ts`)
**Gate**: full

**Commit**: `feat(auth): adiciona rota de cadastro com código de convite`

---

### T16: POST /api/admin/login

**What**: Criar `api/admin/login.ts`: valida, checa limite por e-mail, verifica senha (sempre, com `DUMMY_HASH` quando não há conta), cria sessão.
**Where**: `api/admin/login.ts`
**Depends on**: T15
**Reuses**: `password.ts` (T5), `session.ts` (T11), `rateLimit.ts` (T12)
**Requirement**: AUTH-08, AUTH-09, AUTH-10, AUTH-13

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Credenciais certas respondem 200 e definem `admin_session` (AUTH-08)
- [ ] E-mail inexistente e senha errada respondem 401 com mensagem idêntica `"E-mail ou senha incorretos"` (AUTH-09)
- [ ] Após 5 falhas do mesmo e-mail, a sexta tentativa responde 429 sem chamar `verifyPassword` (AUTH-10)
- [ ] Login de sucesso zera as falhas do e-mail
- [ ] E-mail inexistente executa `verifyPassword` contra `DUMMY_HASH` (AUTH-13); o teste confere a chamada pelo resultado e pela resposta 401 idêntica ao caso de senha errada
- [ ] Testes passam: `npm test -- api/admin/login`

**Tests**: integration (`api/admin/login.test.ts`)
**Gate**: full

**Commit**: `feat(auth): adiciona rota de login com limite de tentativas`

---

### T17: POST /api/admin/logout e GET /api/admin/me

**What**: Criar `api/admin/logout.ts` (remove sessão, expira cookie, 200) e `api/admin/me.ts` (retorna usuário ou 401 expirando cookie inválido).
**Where**: `api/admin/logout.ts`, `api/admin/me.ts`
**Depends on**: T16
**Reuses**: `session.ts` (T11), `http.ts` (T7)
**Requirement**: AUTH-11, AUTH-14, AUTH-16, AUTH-19, AUTH-30

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `me` sem cookie responde 401 e não retorna dados (AUTH-14)
- [ ] `me` com sessão válida responde 200 com `{ name, email }` sem `id` nem hash (AUTH-30)
- [ ] `me` com cookie de sessão expirada responde 401 e `Set-Cookie` com `Max-Age=0` (AUTH-16, AUTH-19)
- [ ] `logout` remove a sessão do repositório e responde 200 com `Max-Age=0` (AUTH-11)
- [ ] Testes passam: `npm test -- api/admin/logout api/admin/me`

**Tests**: integration (`api/admin/logout.test.ts`, `api/admin/me.test.ts`)
**Gate**: full

**Commit**: `feat(auth): adiciona rotas de logout e sessão atual`

---

### T18: Esqueci a senha e redefinir senha

**What**: Criar `api/admin/forgot-password.ts` (sempre 200 com mensagem fixa; token e e-mail se a conta existe) e `api/admin/reset-password.ts` (valida token, troca senha em transação, revoga sessões, envia aviso).
**Where**: `api/admin/forgot-password.ts`, `api/admin/reset-password.ts`
**Depends on**: T17
**Reuses**: `tokens.ts` (T6), `mail.ts` (T13), `validation.ts` (T4), `memory.ts` (T10)
**Requirement**: AUTH-20, AUTH-21, AUTH-22, AUTH-23, AUTH-24, AUTH-25, AUTH-26, AUTH-27, AUTH-28, AUTH-29

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `forgot-password` responde 200 com a mesma mensagem para conta existente e inexistente (AUTH-20)
- [ ] Conta existente recebe token com `expires_at` 30 minutos adiante e e-mail com o link (AUTH-21)
- [ ] Novo pedido invalida o token anterior ainda não usado (AUTH-22)
- [ ] Falha no envio é logada e a resposta continua 200 (AUTH-23)
- [ ] E-mail inválido responde 400 `"Informe um e-mail válido"` (AUTH-24)
- [ ] `reset-password` com token válido responde 200, troca o hash, marca `used_at` e remove todas as sessões (AUTH-25)
- [ ] Token inexistente, usado ou expirado responde 410 `"Este link não é mais válido. Solicite um novo"` sem alterar a senha (AUTH-26)
- [ ] Senha fraca responde 400 e o token continua válido (AUTH-27/AC3)
- [ ] Falha no aviso de troca não desfaz a redefinição (AUTH-28)
- [ ] Testes passam: `npm test -- api/admin/forgot-password api/admin/reset-password`

**Tests**: integration (`api/admin/forgot-password.test.ts`, `api/admin/reset-password.test.ts`)
**Gate**: full

**Commit**: `feat(auth): adiciona recuperação e redefinição de senha`

---

### T19: Build da Fase 3

**What**: Rodar o gate completo da fase e corrigir falhas, sem alterar testes.
**Where**: —
**Depends on**: T18
**Reuses**: —
**Requirement**: —

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `npm run build` passa
- [ ] `npx eslint api server` sem erro nos arquivos da fase
- [ ] `npm test` passa, ou o relatório registra a falha de `server/repo` por `TEST_DATABASE_URL` ausente

**Tests**: none (verificação de fase)
**Gate**: build

**Commit**: — (somente se houver correção)

---

### Phase 4: Interface do painel

### T20: Cliente HTTP do painel

**What**: Criar `src/admin/api.ts` com `api.get`, `api.post` e `ApiError` (status e `field`), usando `fetch` com `credentials: 'same-origin'`.
**Where**: `src/admin/api.ts`
**Depends on**: T19
**Reuses**: formato de erro de `http.ts` (T7)
**Requirement**: AUTH-14 (cliente), AUTH-09 (mensagem exibida)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Resposta 2xx retorna o corpo JSON tipado
- [ ] Resposta não-2xx lança `ApiError` com `status` e `message` do corpo
- [ ] `field` é preservado quando presente
- [ ] Testes passam: `npm test -- src/admin/api`

**Tests**: unit (`src/admin/api.test.ts`)
**Gate**: quick

**Commit**: `feat(admin): adiciona cliente HTTP do painel`

---

### T21: Roteador mínimo

**What**: Criar `src/admin/router.ts` com `usePathname` (via `useSyncExternalStore`) e `navigate`.
**Where**: `src/admin/router.ts`
**Depends on**: T20
**Reuses**: —
**Requirement**: AUTH-15 (redirecionamento)

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `navigate('/admin/entrar')` atualiza `window.location.pathname` e notifica o hook
- [ ] `navigate(..., { replace: true })` usa `replaceState`
- [ ] Evento `popstate` atualiza o valor retornado por `usePathname`
- [ ] Testes passam: `npm test -- src/admin/router`

**Tests**: unit (`src/admin/router.test.tsx`)
**Gate**: quick

**Commit**: `feat(admin): adiciona roteador mínimo do painel`

---

### T22: Estado de sessão no painel

**What**: Criar `src/admin/auth.tsx` com `AuthProvider` e `useAuth` (chama `/api/admin/me` no mount; `status` `loading | in | out`; `logout()`).
**Where**: `src/admin/auth.tsx`
**Depends on**: T21
**Reuses**: `api.ts` (T20)
**Requirement**: AUTH-14, AUTH-30

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Com `me` 200, `status` vira `'in'` e expõe `user`
- [ ] Com `me` 401, `status` vira `'out'`
- [ ] `logout()` chama `POST /api/admin/logout` e muda `status` para `'out'`
- [ ] Testes passam: `npm test -- src/admin/auth`

**Tests**: unit (`src/admin/auth.test.tsx`)
**Gate**: quick

**Commit**: `feat(admin): adiciona estado de sessão do painel`

---

### T23: Rota protegida

**What**: Criar `src/admin/ProtectedRoute.tsx`: com `loading` não renderiza conteúdo; com `out` redireciona para `/admin/entrar`; com `in` renderiza filhos.
**Where**: `src/admin/ProtectedRoute.tsx`
**Depends on**: T22
**Reuses**: `auth.tsx` (T22), `router.ts` (T21)
**Requirement**: AUTH-14, AUTH-15

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Com `status = 'loading'`, nenhum texto dos filhos aparece no DOM (AUTH-14)
- [ ] Com `status = 'out'`, navega para `/admin/entrar` e não renderiza filhos (AUTH-15)
- [ ] Com `status = 'in'`, renderiza filhos
- [ ] Testes passam: `npm test -- src/admin/ProtectedRoute`

**Tests**: unit (`src/admin/ProtectedRoute.test.tsx`)
**Gate**: quick

**Commit**: `feat(admin): adiciona rota protegida do painel`

---

### T24: Tela de login

**What**: Criar `src/admin/pages/LoginPage.tsx` (`/admin/entrar`) com e-mail, senha, mensagens de erro e redirecionamento para `/admin` quando já logado.
**Where**: `src/admin/pages/LoginPage.tsx`
**Depends on**: T23
**Reuses**: design system `Button`, `Input` (via `window.ElianaLinoDesignSystem_6994f2`), tokens de cor, `api.ts` (T20)
**Requirement**: AUTH-08, AUTH-09, AUTH-10, AUTH-18

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Login com sucesso navega para `/admin`
- [ ] Erro 401 mostra `"E-mail ou senha incorretos"`
- [ ] Erro 429 mostra `"Muitas tentativas. Tente novamente em 15 minutos"`
- [ ] Usuário já logado é redirecionado para `/admin` (AUTH-18)
- [ ] Testes passam: `npm test -- src/admin/pages/LoginPage`

**Tests**: unit (`src/admin/pages/LoginPage.test.tsx`)
**Gate**: quick

**Commit**: `feat(admin): adiciona tela de login`

---

### T25: Tela de cadastro

**What**: Criar `src/admin/pages/SignupPage.tsx` (`/admin/cadastro`) com nome, e-mail, senha, código de convite e erros por campo.
**Where**: `src/admin/pages/SignupPage.tsx`
**Depends on**: T24
**Reuses**: `validation.ts` (T4) para validação no cliente, `api.ts` (T20), DS `Input`/`Button`
**Requirement**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Erro com `field: 'password'` aparece no campo de senha
- [ ] Erro 403 aparece no campo de código de convite
- [ ] Erro 409 mostra `"Já existe uma conta com este e-mail"`
- [ ] Sucesso (201) navega para `/admin`
- [ ] Testes passam: `npm test -- src/admin/pages/SignupPage`

**Tests**: unit (`src/admin/pages/SignupPage.test.tsx`)
**Gate**: quick

**Commit**: `feat(admin): adiciona tela de cadastro`

---

### T26: Tela de esqueci minha senha

**What**: Criar `src/admin/pages/ForgotPasswordPage.tsx` (`/admin/esqueci-senha`) que mostra sempre a mesma mensagem de sucesso após envio válido.
**Where**: `src/admin/pages/ForgotPasswordPage.tsx`
**Depends on**: T25
**Reuses**: `api.ts` (T20), DS `Input`/`Button`
**Requirement**: AUTH-20, AUTH-24

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Após envio, aparece `"Se o e-mail estiver cadastrado, você receberá um link em instantes"`
- [ ] E-mail inválido mostra `"Informe um e-mail válido"` sem chamar a API
- [ ] Testes passam: `npm test -- src/admin/pages/ForgotPasswordPage`

**Tests**: unit (`src/admin/pages/ForgotPasswordPage.test.tsx`)
**Gate**: quick

**Commit**: `feat(admin): adiciona tela de esqueci minha senha`

---

### T27: Tela de redefinição de senha

**What**: Criar `src/admin/pages/ResetPasswordPage.tsx` (`/admin/redefinir-senha`): lê `token` da URL, remove o parâmetro com `history.replaceState`, envia no corpo do POST, trata 410.
**Where**: `src/admin/pages/ResetPasswordPage.tsx`
**Depends on**: T26
**Reuses**: `api.ts` (T20), `validation.ts` (T4)
**Requirement**: AUTH-25, AUTH-26, AUTH-27, AUTH-29

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Após carregar, `window.location.search` não contém `token` (AUTH-29/AC5)
- [ ] O POST envia `token` no corpo, não na URL da requisição (AUTH-29/AC5)
- [ ] Sucesso mostra confirmação e link para `/admin/entrar`
- [ ] Erro 410 mostra `"Este link não é mais válido. Solicite um novo"` com link para `/admin/esqueci-senha`
- [ ] Senha fraca mostra erro no campo e mantém o formulário
- [ ] Testes passam: `npm test -- src/admin/pages/ResetPasswordPage`

**Tests**: unit (`src/admin/pages/ResetPasswordPage.test.tsx`)
**Gate**: quick

**Commit**: `feat(admin): adiciona tela de redefinição de senha`

---

### T28: Painel e cabeçalho

**What**: Criar `src/admin/AdminLayout.tsx` (cabeçalho com nome, e-mail e botão sair) e `src/admin/pages/DashboardPage.tsx` (`/admin`, dentro de `ProtectedRoute`).
**Where**: `src/admin/pages/DashboardPage.tsx`
**Depends on**: T27
**Reuses**: `auth.tsx` (T22), `ProtectedRoute.tsx` (T23), tokens
**Requirement**: AUTH-14, AUTH-30

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Cabeçalho mostra nome e e-mail do usuário (AUTH-30)
- [ ] Botão sair chama logout e navega para `/admin/entrar`
- [ ] Sem sessão, a página não renderiza o conteúdo do painel (AUTH-14)
- [ ] Testes passam: `npm test -- src/admin/pages/DashboardPage`

**Tests**: unit (`src/admin/pages/DashboardPage.test.tsx`)
**Gate**: quick

**Commit**: `feat(admin): adiciona painel protegido com cabeçalho`

---

### T29: Roteamento do app, lazy load e rewrites

**What**: Criar `src/admin/AdminApp.tsx` (AuthProvider + roteador entre as páginas); em `src/main.tsx`, carregar `AdminApp` com `React.lazy` quando `pathname` começa com `/admin`; criar `vercel.json` com rewrite para `index.html` fora de `/api`.
**Where**: `src/admin/AdminApp.tsx`
**Depends on**: T28
**Reuses**: `router.ts` (T21), páginas T24 a T28
**Requirement**: AUTH-15, AUTH-17 (conteúdo do painel fora da landing), AD-002

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] `AdminApp` em `/admin/entrar` renderiza a tela de login
- [ ] `src/main.tsx` não importa `AdminApp` estaticamente
- [ ] `vercel.json` contém a regra `/((?!api/).*)` → `/index.html`
- [ ] Build gera chunk separado para o painel em `dist/assets`
- [ ] Testes passam: `npm test -- src/admin/AdminApp`

**Tests**: unit (`src/admin/AdminApp.test.tsx`)
**Gate**: build

**Commit**: `feat(admin): liga rotas do painel com carregamento sob demanda`

---

### T30: Documentação de desenvolvimento

**What**: Atualizar `README.md` com as variáveis de ambiente, `npm run db:migrate` e o uso de `vercel dev` para testar `/api` localmente. Fecha a Fase 4 com build.
**Where**: `README.md`
**Depends on**: T29
**Reuses**: —
**Requirement**: AD-001

**Tools**:
- MCP: NONE
- Skill: NONE

**Done when**:
- [ ] Lista as cinco variáveis com descrição, sem valores
- [ ] Explica que `npm run dev` não serve `/api` e indica `vercel dev`
- [ ] Gate build passa

**Tests**: none (documentação)
**Gate**: build

**Commit**: `docs(auth): documenta configuração e execução do painel`

---

## Task Granularity Check

| Task | Scope | Status |
| ---- | ----- | ------ |
| T1 a T13 | 1 arquivo de código por task (testes em arquivo próprio ao lado) | ✅ Granular |
| T14, T19 | verificação de fase, sem arquivos | ✅ Granular |
| T15, T16 | 1 handler de API | ✅ Granular |
| T17 | 2 handlers pequenos e coesos (logout e me) | ⚠️ Cohesive |
| T18 | 2 handlers (esqueci e redefinir), mesma lógica de token | ⚠️ Cohesive |
| T20 a T28 | 1 componente ou página por task | ✅ Granular |
| T29 | `AdminApp`, `main.tsx`, `vercel.json` | ⚠️ Cohesive: o roteamento só funciona com as três mudanças juntas |
| T30 | docs | ✅ Granular |

---

## Diagram-Definition Cross-Check

Dependências de corpo e diagrama são as mesmas: cada task depende da task imediatamente anterior na sua fase (ou da última task da fase anterior), e a primeira de cada fase depende da última da fase anterior.

| Task | Depends On (task body) | Diagram Shows | Status |
| ---- | ---------------------- | ------------- | ------ |
| T2 | T1 | T1 → T2 | ✅ Match |
| T3 | T2 | T2 → T3 | ✅ Match |
| T4 | T3 | T3 → T4 | ✅ Match |
| T5 | T4 | T4 → T5 | ✅ Match |
| T6 | T5 | T5 → T6 | ✅ Match |
| T7 | T6 | T6 → T7 | ✅ Match |
| T8 | T7 | T7 → T8 (início da Fase 2) | ✅ Match |
| T9 | T8 | T8 → T9 | ✅ Match |
| T10 | T9 | T9 → T10 | ✅ Match |
| T11 | T10 | T10 → T11 | ✅ Match |
| T12 | T11 | T11 → T12 | ✅ Match |
| T13 | T12 | T12 → T13 | ✅ Match |
| T14 | T13 | T13 → T14 | ✅ Match |
| T15 | T14 | T14 → T15 (início da Fase 3) | ✅ Match |
| T16 | T15 | T15 → T16 | ✅ Match |
| T17 | T16 | T16 → T17 | ✅ Match |
| T18 | T17 | T17 → T18 | ✅ Match |
| T19 | T18 | T18 → T19 | ✅ Match |
| T20 | T19 | T19 → T20 (início da Fase 4) | ✅ Match |
| T21 a T30 | predecessora imediata | cadeia linear do diagrama | ✅ Match |

**Regras verificadas:** nenhuma task depende de task de fase posterior; toda dependência tem seta correspondente.

---

## Test Co-location Validation

| Task | Code Layer Created/Modified | Matrix Requires | Task Says | Status |
| ---- | --------------------------- | --------------- | --------- | ------ |
| T1 | config | none | none | ✅ OK |
| T2 | schema | none | none | ✅ OK |
| T3 | `server/config.ts` | unit | unit | ✅ OK |
| T4 | `server/validation.ts` | unit | unit | ✅ OK |
| T5 | `server/auth/password.ts` | unit | unit | ✅ OK |
| T6 | `server/auth/tokens.ts` | unit | unit | ✅ OK |
| T7 | `server/http.ts` | unit | unit | ✅ OK |
| T8 | interface | none | none | ✅ OK |
| T9 | `server/repo/neon.ts` | integration | integration | ✅ OK |
| T10 | `server/repo/memory.ts` (dublê) | none | none | ✅ OK |
| T11 | `server/auth/session.ts` | unit | unit | ✅ OK |
| T12 | `server/auth/rateLimit.ts` | unit | unit | ✅ OK |
| T13 | `server/mail.ts` | unit | unit | ✅ OK |
| T14 | verificação | none | none | ✅ OK |
| T15 a T18 | `api/admin/*.ts` | integration | integration | ✅ OK |
| T19 | verificação | none | none | ✅ OK |
| T20 a T28 | `src/admin/**` | unit | unit | ✅ OK |
| T29 | `AdminApp` (componente) | unit | unit | ✅ OK |
| T30 | docs | none | none | ✅ OK |

---

## Pontos para aprovação

1. **Modo de execução:** 30 tasks em 4 fases. Acima de ~8 tasks, a skill oferece sub-agentes em lotes (um lote por fase). Escolha: **inline** (eu executo na sessão) ou **sub-agentes por fase**.
2. **Bloqueio externo:** T9 exige banco Neon de teste (`TEST_DATABASE_URL`), e o envio real do Resend exige domínio verificado. O restante roda sem essas contas.
3. **Ferramentas por task:** nenhuma MCP ou skill extra necessária. Confirme se quer outra ferramenta.
4. **Branch:** os commits vão para `feat/admin-auth`, criada a partir de `fix/acessibilidade-landing`, sem incluir as alterações não rastreadas pré-existentes.
