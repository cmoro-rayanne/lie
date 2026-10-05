# admin-auth Validation

**Date**: 2026-10-04
**Spec**: `.specs/features/admin-auth/spec.md`
**Diff range**: `13946ce..8556370` (`git log --oneline 13946ce..HEAD`; HEAD validado `8556370`, branch `feat/admin-auth`)
**Verifier**: independent sub-agent (author != verifier), rodada final após T9. Leitura da árvore real; sensor em `git worktree --detach` temporário em `%TEMP%`, removido ao final. `git status --porcelain` da árvore real: `?? .specs/features/admin-auth/validation.md` antes e depois (idêntico).

> **Restrição de segurança desta rodada:** `server/repo/neon.test.ts` e qualquer teste com `TEST_DATABASE_URL` **não foram executados**. Os ACs de SQL real foram verificados por leitura do código e do teste; a prova foi feita pelo worker com o banco de produção, conforme autorizado.

---

## Validation: admin-auth - FAIL ❌

**Veredito:** FAIL. Três pontos bloqueiam PASS, e nenhum depende de banco:

1. **AUTH-29, cláusula de URL em log: sem teste e com mutante sobrevivente (M7).** O código não loga a URL, mas nada impede a regressão. Além disso, há uma questão de design aberta: o token vai na query `/admin/redefinir-senha?token=`, e o log de requisições da plataforma tende a registrar a URL completa. A spec precisa decidir (por exemplo, token em fragmento `#`, que não chega ao servidor) ou aceitar o risco por escrito.
2. **AUTH-31, fiação 503 não testada (M8 sobreviveu).** Todos os testes de rota montam o próprio `withErrors(createXHandler(...))`. Nenhum teste importa o `POST`/`GET` exportado. Se o `withErrors` sair do export, nenhum teste falha. O mesmo padrão vale para signup, forgot e reset (inferido pelo código, não mutado nesta rodada; M3 e M9 da rodada anterior confirmam o padrão para reset e login).
3. **Limite por IP forjável.** `server/auth/rateLimit.ts:19-21` usa o primeiro valor de `x-forwarded-for`. Se a plataforma não sobrescrever esse cabeçalho, o cliente escolhe a chave e contorna o limite do login (AUTH-10 por IP) e o do convite. Sem teste. Verificar o comportamento da Vercel antes do go-live.

**Condições explícitas (o que não foi executado nesta verificação):**

- **SQL real (AUTH-01 unicidade, AUTH-10 janela, AUTH-25, AUTH-26, AUTH-31 com banco):** as asserções existem em `server/repo/neon.test.ts` e a prova foi feita pelo worker com o banco de produção, conforme autorizado. **Não reexecutado aqui** por restrição de segurança.
- **AUTH-22 no SQL real:** `server/repo/neon.ts:76-84` (`replaceResetToken`) não tem teste de banco. O `neon.test.ts` não exercita esse método. A asserção de AUTH-22 existe só no dublê.
- **Gate de build e lint não rodados nesta verificação.** Os testes executados foram o subconjunto sem banco (ver Sensor). A última rodada completa de `npm run build` e `npx eslint` é de `2dfbbc2` (validação anterior), não de `8556370`.
- **Testes com banco:** `server/repo/neon.test.ts` grava no banco configurado em `TEST_DATABASE_URL` e limpa só o que criou (`neon.test.ts:42-50`). Confirmar que esse banco é o de teste antes de qualquer nova execução.

---

## Conclusão das tarefas

| Tarefa | Status | Evidência |
| ------ | ------ | --------- |
| T1 a T8 | Feitas | commits `68d5aca` a `0af34e7` |
| T9 (repositório Neon) | Feita e presente em HEAD | `8556370`; `server/repo/neon.ts`; `server/deps.ts:12` usa `createNeonRepo(getConfig().databaseUrl)`. A lacuna da rodada anterior (`getRepo()` sempre lançando) está fechada no código. Testes de banco executados pelo worker, não por este Verifier |
| T10 a T30 | Feitas | commits `5432783` a `1a544a7`; correções `ba82045`, `da88acc`, `7d75dba`, `e89cd2e`, `dfa9eef`, `2dfbbc2` |
| T14, T19 (gates de fase) | Commits de gate presentes | `eb38b60`, `ba82045`, `da88acc`; checkboxes ainda desmarcadas em `tasks.md:446-448` e `587-589` |

---

## Gate (subconjunto sem banco, cópia em `8556370`)

- `npm test -- api server/auth server/validation server/http server/mail server/config`: **15 arquivos, 109/109 testes passam** (linha de base do sensor, M0).
- `server/repo/neon.test.ts` e `server/bundleIsolation.test.ts` fora deste subconjunto (o primeiro exige `TEST_DATABASE_URL`; o segundo roda `vite build` e grava em `dist/`).
- Não executados nesta rodada: `npm run build`, `npx eslint`, `src/admin` (cobertos por leitura, ver tabela).

---

## Cobertura por AC (`arquivo:linha` + asserção)

Legenda: **PASS** = asserção com o valor exato da spec. **PASS\*** = prova de SQL real citada, executada pelo worker, não reexecutada aqui. **PASS†** = dublê `server/repo/memory.ts`, sem prova de SQL real. **PRECISÃO** = spec não define o valor exato. **PARCIAL** = parte do AC sem evidência.

Caminhos abreviados: `api/admin/` = `A/`, `server/` = `S/`, `src/admin/` = `U/`.

### P1: Cadastro

| AC | Resultado esperado (spec) | Evidência (`arquivo:linha` + asserção) | Status |
| -- | ------------------------- | -------------------------------------- | ------ |
| AUTH-01 | 201, cria conta, sessão, redireciona `/admin` | `A/signup.test.ts:40` `toBe(201)`; `:41` `toEqual({name, email})`; `:44-45` cookie `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`. Unicidade real: `S/repo/neon.test.ts:61` `toEqual({ok:false, reason:'duplicate_email'})`; `:72` `rejects.toMatchObject({code:'23505'})`. `U/pages/SignupPage.test.tsx:117` `pathname toBe('/admin')` | PASS* |
| AUTH-02 | 403 "Código de convite inválido", sem conta | `A/signup.test.ts:57-58` (`403`; `toEqual({message, field:'inviteCode'})`); `:59` sem usuário; `:68-69` (código ausente) | PASS |
| AUTH-03 | 409 "Já existe uma conta com este e-mail", sem nova conta | `A/signup.test.ts:78` `toBe(409)`; `:79` `toEqual({message})`; `:80` nome original mantido | PASS† (SQL: `neon.test.ts:61`) |
| AUTH-04 | 400 com a regra violada, sem criar | `A/signup.test.ts:87-89` (`400`; `field` 'password'); `:90` `toContain('10 caracteres')`; `:101` `toContain('letra e número')`. Regras em `S/validation.ts:14-18` | PRECISÃO: spec não define o texto; asserção por substring |
| AUTH-05 | 400 com erro de campo (nome 2-120, e-mail válido) | `A/signup.test.ts:108-109` (name 1 char); `:116-117` (name 121); `:124-125` (email). `S/validation.test.ts:49-56` (name 1, 121 rejeitados; 120 aceito); `:44-47` (e-mail sem domínio) | PASS |
| AUTH-06 | hash scrypt, sal 16 bytes | `A/signup.test.ts:49` `startsWith('scrypt$16384$8$1$')`; `:50` `not.toContain(senha)`. `S/auth/password.test.ts:13` `toBe(16)` (bytes do sal) | PASS |
| AUTH-07 | e-mail normalizado em minúsculas, sem espaços | `A/signup.test.ts:38-41` (entrada `'  Eliana@Exemplo.COM '`; `:41` resposta `'eliana@exemplo.com'`); `:47` usuário gravado; `S/validation.test.ts:66` `toBe('ana@exemplo.com')`; `:72` `normalizeEmail` | PASS |

### P1: Login e logout

| AC | Resultado esperado | Evidência | Status |
| -- | ------------------ | --------- | ------ |
| AUTH-08 | 200, define cookie | `A/login.test.ts:56` `toBe(200)`; `:58-60` regex `^admin_session=[^;]+; HttpOnly; Secure; SameSite=Lax`; `U/pages/LoginPage.test.tsx:68` `pathname toBe('/admin')` | PASS |
| AUTH-09 | 401 "E-mail ou senha incorretos", sem indicar campo | `A/login.test.ts:70-71` (401 x2); `:73` `toEqual({message})`; `:74` corpos iguais; `:75` `set-cookie` null | PASS |
| AUTH-10 | 5 falhas em 15 min: 429, sem validar senha | `A/login.test.ts:89-104` (5x 401 em `:92`; sexta `toBe(429)` em `:98`; mensagem exata `:99-101`; `:103` `verifyPassword not.toHaveBeenCalled()`). `S/auth/rateLimit.test.ts:24-30` (4 não bloqueia, 5 bloqueia); `:45-51` (janela). Janela real: `S/repo/neon.test.ts:77-87` `toBe(2)` em `:86` | PASS* |
| AUTH-11 | logout remove sessão, expira cookie, 200 | `A/logout.test.ts:40` `toBe(200)`; `:42-43` `^admin_session=;` e `Max-Age=0`; `:44` `findSession` null. `S/auth/session.test.ts:111-117` (`Max-Age=0`) | PASS |
| AUTH-12 | exatamente 7 dias, sem renovação deslizante | `S/auth/session.test.ts:44` `toBe(START + 7d)`; `:52` cookie `Max-Age=604800`. **Sem teste de "sem renovação"**: `:63-70` cobre só a fronteira de 1 s antes | PASS com gap menor |
| AUTH-13 | e-mail inexistente executa hash com DUMMY_HASH | `A/login.test.ts:84` `toHaveBeenCalledWith('qualquersenha1', DUMMY_HASH)`; `:85-86` 401 idêntico. `S/auth/password.test.ts:37` `resolves.toBe(false)` | PASS |

### P1: Área /admin protegida

| AC | Resultado esperado | Evidência | Status |
| -- | ------------------ | --------- | ------ |
| AUTH-14 | `/api/admin/*` sem cookie: 401 sem dados; painel não renderiza | `A/me.test.ts:36-37` (`401`; `not.toHaveProperty('email')`); `U/ProtectedRoute.test.tsx:31-37` (`queryByText` null em `loading`); `U/pages/DashboardPage.test.tsx:74-81` | PASS |
| AUTH-15 | `/admin` sem sessão redireciona para `/admin/entrar` | `U/ProtectedRoute.test.tsx:50-51` (`pathname toBe('/admin/entrar')`; filhos ausentes); `U/AdminApp.test.tsx:42-43` | PASS |
| AUTH-16 | sessão expirada conta como inexistente | `S/auth/session.test.ts:72-78` `toBeNull()` em `:77`; `A/me.test.ts:50-62` (`401` em `:60`; `Max-Age=0` em `:62`) | PASS |
| AUTH-17 | conteúdo do painel fora do HTML e do bundle da landing | `S/bundleIsolation.test.ts:45-48` (`not.toContain` no chunk principal em `:46`; `toContain` no chunk `AdminApp` em `:47`); `src/main.tsx:16` `lazy(() => import('./admin/AdminApp'))`. Ressalva: só duas strings (`S/bundleIsolation.test.ts:15`); `index.html` não é asserido | PASS com ressalva |
| AUTH-18 | logado em `/admin/entrar` vai para `/admin` | `U/pages/LoginPage.test.tsx:98-108` (`pathname toBe('/admin')` em `:107`) | PASS |
| AUTH-19 | cookie adulterado: 401 e expira cookie | `A/me.test.ts:65-71` (`401` em `:69`; `Max-Age=0` em `:70`); `S/auth/session.test.ts:87-94` (`toBeNull()` em `:93`) | PASS |

### P2: Esqueci minha senha

| AC | Resultado esperado | Evidência | Status |
| -- | ------------------ | --------- | ------ |
| AUTH-20 | 200 com mensagem igual para conta existente e inexistente | `A/forgot-password.test.ts:60-63` (`200` x2; `toEqual({message})` x2); `:64-65` só a existente recebe e-mail; `U/pages/ForgotPasswordPage.test.tsx:41` | PASS |
| AUTH-21 | token de 30 min; e-mail com `APP_URL/admin/redefinir-senha?token=` | `A/forgot-password.test.ts:77` regex do link; `:79` 32 bytes; `:82` `expiresAt toBe(start + 30min)`; `S/mail.test.ts:29` `toContain(LINK)` | PASS† |
| AUTH-22 | novo pedido invalida token anterior | `A/forgot-password.test.ts:94` `toBeNull()` (anterior); `:95` `not.toBeNull()` (novo). SQL real (`S/repo/neon.ts:76-84`) **sem teste** | PASS† (SQL real pendente) |
| AUTH-23 | falha no envio: logada, resposta 200 | `A/forgot-password.test.ts:104` `200`; `:105` mensagem exata; `:106` `toHaveBeenCalledTimes(1)`; `:109` contém `'Resend respondeu 500'` | PASS |
| AUTH-24 | e-mail inválido: 400 "Informe um e-mail válido" | `A/forgot-password.test.ts:117-119` (`400`; `toMatchObject({message})`; sem envio); `S/validation.test.ts:86-91` (mensagem em `:90`); `U/pages/ForgotPasswordPage.test.tsx:54-55` | PASS |

### P2: Redefinir senha

| AC | Resultado esperado | Evidência | Status |
| -- | ------------------ | --------- | ------ |
| AUTH-25 | token válido: troca hash, marca uso, remove sessões, 200 | Dublê: `A/reset-password.test.ts:84` `200`; `:85` nova senha `true`; `:86` antiga `false`; `:87` `usedAt instanceof Date`; `:88` `findSession` null. Real: `S/repo/neon.test.ts:117-124` (`toBe('ok')` em `:119`; hash `:121`; `usedAt` `:123`; sessões null `:124-125`) | PASS* |
| AUTH-26 | inexistente, usado ou expirado: 410 com mensagem exata | Dublê: `A/reset-password.test.ts:99-102` (`410`; `toEqual({message})` exato; senha inalterada); `:110-111` (inexistente); `:125-126` (expirado). Real: `S/repo/neon.test.ts:138` `'invalid'` (usado); `:148` `'invalid'` (expirado); `:140`, `:150` senha inalterada | PASS* |
| AUTH-27 | senha fraca: 400 e token continua válido | `A/reset-password.test.ts:136-137` (`400`; `toMatchObject({field:'password'})`); `:141` retry `toBe(200)`; `S/validation.test.ts:98-101`; `U/pages/ResetPasswordPage.test.tsx:84-94` (`fetch` não chamado em `:93`) | PASS |
| AUTH-28 | aviso de troca; falha de envio não desfaz | `A/reset-password.test.ts:151` `toEqual([{to, name}])`; `:162-163` (`200`; senha trocada com falha de envio); `S/mail.test.ts:49-58` (sem token nem link; `:56-58`) | PASS |
| AUTH-29 | cliente lê token, `replaceState`, envia no corpo; servidor não registra URL com token | Cliente: `U/pages/ResetPasswordPage.test.tsx:43-44` (sem token em `search`/`href`); `:56-58` (URL do POST sem token; body `toEqual({token, password})`). Implementação: `U/pages/ResetPasswordPage.tsx:72` `history.replaceState`. Servidor, token em log: `A/reset-password.test.ts:185-207` (`not.toContain(token)` em `:206`, `console.error` e `console.log`). **Cláusula de URL em log: sem teste** (M7 sobreviveu) | PARCIAL |
| AUTH-30 | cabeçalho mostra nome e e-mail | `A/me.test.ts:46-47` (`toEqual({name, email})`); `S/auth/session.test.ts:60` (`id` presente só no domínio); `U/pages/DashboardPage.test.tsx:56-58`; `U/auth.test.tsx:45-46` | PASS |
| AUTH-31 | banco indisponível: 503 genérico, sem detalhe técnico | Helper: `S/http.test.ts:32-41` (`toEqual({message})` em `:40`; `not.toContain('db-host')` em `:41`); log `:44-52`. Rotas (com `withErrors` próprio, não o export): login `A/login.test.ts:202-218` (`:214`, `:216-217`); cadastro `A/signup.test.ts:138-153` (`:149`, `:151-152`) e `:155-166` (`:164`); reset `A/reset-password.test.ts:166-183` (`:179-182`); esqueci `A/forgot-password.test.ts:122-141` (`:137`, `:139-140`). Real: `S/repo/neon.test.ts:158` `rejects.toThrow()`; `:167-168` 503 com mensagem exata. **Fiação do export não testada** (M8 sobreviveu) | PARCIAL (fiação) + PASS* (helper e SQL) |

### P3

| AC | Resultado esperado | Evidência | Status |
| -- | ------------------ | --------- | ------ |
| AUTH-30 | cabeçalho com nome e e-mail | ver acima (linha de P2) | PASS |

### Edge cases

| Caso | Evidência | Status |
| ---- | --------- | ------ |
| Banco indisponível no login | AUTH-31 (`A/login.test.ts:202-218`) | PARCIAL (fiação) |
| Cookie adulterado | `A/me.test.ts:65-71`; `S/auth/session.test.ts:87-94` | PASS |
| Dois links de redefinição: vale só o mais novo | `A/forgot-password.test.ts:86-96` | PASS† |
| Dois cadastros simultâneos (23505 vira 409) | Mapeamento `S/repo/neon.ts:35-36`; prova real `S/repo/neon.test.ts:61` (sequencial, não concorrente) | PASS* (sem teste concorrente) |
| Variável de ambiente ausente | `S/config.test.ts:42-45` (`toThrow(name)`); `:49` (`/APP_URL/`). Implementação lança por requisição via `getConfig()` (`S/deps.ts:12`, exports de `A/*.ts`), capturado pelo `withErrors` como 503 | PRECISÃO: spec pede falha na inicialização; implementado como 503 por requisição |
| Sem `ADMIN_INVITE_CODE`: nunca conta aberta | `A/signup.test.ts:155-166` (`503`; sem usuário) | PASS |

**Resumo dos 31 ACs:** 28 PASS (com ressalvas: AUTH-01, 10, 25, 26 dependem de SQL real executado pelo worker; AUTH-12, 17, 22 com gaps menores ou SQL real sem teste); 1 PRECISÃO (AUTH-04); 2 PARCIAIS (AUTH-29, AUTH-31). Todos os 31 têm `arquivo:linha`.

---

## Discrimination Sensor

Cópia isolada em `git worktree --detach` a partir de `8556370`, `node_modules` por junção (removida com `rmdir`, sem `/s`, antes de `git worktree remove --force`). Cada mutante: troca de texto com verificação de ocorrência única, suíte `npm test -- api server/auth server/validation server/http server/mail server/config`, arquivo restaurado com `git checkout` dentro da cópia. Sem `git stash`. Execução sequencial (uma mutação por vez).

| # | Arquivo:linha | Mutação | Resultado | Testes que reagiram |
| - | ------------- | ------- | --------- | ------------------- |
| M0 | - | linha de base, sem mutação | 109/109 passam | - |
| M1 | `A/login.ts:37` | remove o limite por IP | **MORTO** (2) | `A/login.test.ts:126-151` (21ª 429); `:172-200` (contador do IP) |
| M2 | `A/reset-password.ts:30` | loga o token no `console.log` antes da transação | **MORTO** (1) | `A/reset-password.test.ts:185-207` (AUTH-29) |
| M3 | `A/signup.ts:39` | 409 vira 400 no e-mail duplicado | **MORTO** (1) | `A/signup.test.ts:73-81` (AUTH-03) |
| M4 | `S/auth/session.ts:8` | cookie sem `HttpOnly` | **MORTO** (3) | `A/login.test.ts:52-61` (AUTH-08); `A/signup.test.ts:36-51` (AUTH-01); `S/auth/session.test.ts:47-53` (AUTH-12) |
| M5 | `S/auth/session.ts:6` | sessão de 8 dias em vez de 7 | **MORTO** (5) | `A/me.test.ts:50-63` (AUTH-16); `S/auth/session.test.ts:39-45, 63-78` (AUTH-12, AUTH-16); `A/signup.test.ts:36-51` |
| M6 | `S/repo/memory.ts:76` (dublê) | não invalida tokens anteriores | **MORTO** (1) | `A/forgot-password.test.ts:86-96` (AUTH-22). Ressalva: mutou o dublê; o `DELETE` do Neon (`S/repo/neon.ts:77-78`) não é mutado por depender de banco |
| M7 | `A/reset-password.ts:20` | loga `request.url` (sonda da cláusula de URL) | **SOBREVIVEU** | nenhum: a URL de teste não contém token |
| M8 | `A/login.ts:53` | export `POST` sem `withErrors` (503 genérico removido) | **SOBREVIVEU** | nenhum: testes montam o próprio `withErrors` |

**Resultado: 6/8 mutantes mortos, 2 sobreviventes (M7, M8), ambos relevantes.** Profundidade: manual, 8 mutantes nos ramos de auth (P0), acima do mínimo de 5. Sobreviventes viram fix tasks antes de a feature ser dada como pronta. Não foi rodado mutante nas rotas de signup, forgot e reset para o padrão de fiação (inferido de M8 e das rodadas anteriores).

**Isolamento:** `git status --porcelain` antes e depois do sensor: `?? .specs/features/admin-auth/validation.md` (idêntico). `node_modules` real presente após a limpeza. `git worktree list` mostra só a árvore real.

---

## Gaps (ranqueados)

1. **[Alto] AUTH-29, cláusula de URL em log (M7 sobreviveu).** Sem teste. Decisão de design em aberto: o `GET` de `/admin/redefinir-senha?token=...` leva o token na query, e o log da plataforma pode registrá-lo. Ação: (a) decidir o formato do link (token em fragmento `#`, que não chega ao servidor) ou registrar o risco na spec; (b) teste que dispara `POST /api/admin/reset-password?token=<token>` e confirma que nenhum log contém o token.
2. **[Alto] AUTH-31, fiação 503 não testada (M8 sobreviveu; M3 e M9 da rodada anterior).** Ação: teste que importa o `POST`/`GET` exportado (mockando `server/deps`) e confirma 503 genérico em signup, login, forgot e reset.
3. **[Alto] Limite por IP forjável.** `S/auth/rateLimit.ts:19-21` usa o primeiro valor de `x-forwarded-for`. Sem teste. Ação: confirmar o cabeçalho que a Vercel injeta e usar esse valor (ou o último da cadeia); testar com cabeçalho forjado.
4. **[Médio] AUTH-22, SQL real sem teste.** `S/repo/neon.ts:76-84`. Ação: caso em `S/repo/neon.test.ts` para `replaceResetToken` (token anterior não usado vira inválido).
5. **[Médio] AUTH-04 sem texto exato na spec.** Asserção por substring (`A/signup.test.ts:90`, `:101`). Ação: fechar as mensagens na spec e asserir igualdade.
6. **[Médio] Env ausente diverge da spec.** Spec pede falha na inicialização; implementado como 503 por requisição (`S/deps.ts:12`; exports de `A/*.ts`). Ação: registrar o desvio no design ou ajustar a spec.
7. **[Baixo] AUTH-12 sem teste de "sem renovação deslizante"** (`S/auth/session.test.ts`). Ação: teste que lê a sessão após X dias e confirma `expires_at` inalterado.
8. **[Baixo] AUTH-17 com duas strings e sem `index.html`.** `S/bundleIsolation.test.ts:15`. Ação: ampliar a lista ou asserir `index.html`.
9. **[Baixo] Drift de `tasks.md`.** Checkboxes de T14 e T19 desmarcadas (`tasks.md:446-448`, `587-589`), embora os commits de gate existam.
10. **[Info] Gate de build e lint não rodados nesta rodada.** Ação: rodar `npm run build` e `npx eslint api server src/admin scripts` na cópia ou no `HEAD` antes do merge.
11. **[Info] Lições não registradas.** Há sinal (gaps 1 a 3 e os sobreviventes M7 e M8). O Verifier é somente leitura; registrar via `lessons.py` na próxima etapa do orquestrador.

---

## Requirement Traceability (proposta de atualização para spec.md)

| Requisito | Status anterior (2dfbbc2) | Novo status (8556370) |
| --------- | ------------------------- | --------------------- |
| AUTH-02, 05, 06, 07, 08, 09, 11, 13, 14, 15, 16, 18, 19, 20, 23, 24, 27, 28, 30 | In Design / Verified | Verified |
| AUTH-01, 10, 25, 26 | Verified (dublê); SQL pendente de T9 | Verified (SQL real citado; executado pelo worker, não reexecutado aqui) |
| AUTH-03, 21 | Verified (dublê) | Verified (dublê) |
| AUTH-12 | Verified com gap menor | Partial: falta "sem renovação" |
| AUTH-17 | Needs Fix / Verified (ressalva) | Verified (ressalva de duas strings) |
| AUTH-22 | Verified (dublê) | Verified (dublê); SQL real sem teste (gap 4) |
| AUTH-04 | Precisão | Precisão (gap 5) |
| AUTH-29 | Partial | Partial: cláusula de URL sem teste (gap 1) |
| AUTH-31 | Partial | Partial: fiação 503 (gap 2) |

---

## Mudanças desde o relatório anterior (2dfbbc2)

| Item | Antes (2dfbbc2) | Agora (8556370) |
| ---- | --------------- | --------------- |
| T9 (Neon) | Ausente; `getRepo()` sempre lançava | Presente: `S/repo/neon.ts`; `S/deps.ts:12`; testes de banco em `S/repo/neon.test.ts` (executados pelo worker) |
| Gap 1 (T9 não verificado) | Crítico | Fechado no código; prova de banco pelo worker, não reexecutada aqui |
| AUTH-29 (log) | Parcial: token em log coberto; URL não | Igual: token coberto (`A/reset-password.test.ts:185-207`); URL sem teste (M7 sobreviveu) |
| AUTH-31 (fiação) | M3 e M9 sobreviveram | M8 sobreviveu (login); mesmo padrão nas outras rotas |
| Limite por IP | Coberto (M1, M5 mortos) | Igual: M1 morto (2 falhas); `x-forwarded-for` forjável (gap 3) |

---

## Summary

**Overall**: ❌ Not Ready (FAIL)

**Spec-anchored check**: 31 ACs com `arquivo:linha`; 28 PASS (com ressalvas), 1 PRECISÃO (AUTH-04), 2 PARCIAIS (AUTH-29, AUTH-31).
**Sensor**: 8 mutantes (M0 baseline + M1 a M8): 6 mortos, 2 sobreviventes (M7, M8).
**Gate**: subconjunto sem banco 109/109 (`api server/auth server/validation server/http server/mail server/config`). Build e lint não rodados nesta rodada.

**What works**: cadastro com código de convite; login com limite por e-mail e por IP; DUMMY_HASH; logout; sessão de 7 dias fixa; cookie adulterado e sessão expirada; esqueci e redefinir (em dublê, com SQL real citado para unicidade, janela, transação e 410); isolamento do bundle; token fora da URL e do corpo no cliente; aviso de troca com falha tolerada; 503 genérico nos helpers.

**Issues found**: gaps 1 a 3. Os dois sobreviventes (M7, M8) e a falta de teste para o `x-forwarded-for` são o que impede PASS. Os ACs de SQL real são aceitos com base na prova do worker, sem reexecução aqui.

**Next steps**: (1) decidir o formato do link de redefinição e a cláusula de URL (gap 1); (2) testes de fiação dos exports `POST`/`GET` (gap 2); (3) confirmar o cabeçalho de IP da Vercel e testar com cabeçalho forjado (gap 3); (4) teste de SQL real para `replaceResetToken` (gap 4); (5) rodar `npm run build` e `npx eslint` no `HEAD`; (6) re-verificar. O veredito esperado depois dos gaps 1 a 3 é PASS, com os ACs de banco dependendo da prova do worker.
