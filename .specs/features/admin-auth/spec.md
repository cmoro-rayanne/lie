# Autenticação do Painel Administrativo Specification

## Problem Statement

O site é uma landing estática sem backend, então não há como a psicóloga gerenciar o conteúdo sem editar código. Este feature cria a base de acesso do painel administrativo: cadastro, login, recuperação e redefinição de senha por link enviado por e-mail, e uma área `/admin` acessível apenas com sessão válida. A gestão do conteúdo em si fica para um feature posterior.

## Goals

- [ ] Uma pessoa autorizada consegue criar conta, entrar, sair e recuperar a senha sem suporte técnico
- [ ] Nenhuma rota de `/admin` (exceto as de autenticação) responde conteúdo sem sessão válida
- [ ] Senhas e tokens nunca são armazenados em texto puro

## Out of Scope

| Feature                                  | Reason                                                                 |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| Edição de conteúdo do site (textos, fotos, projetos) | Feature separado, depende deste acesso                    |
| Login social (Google, Apple)             | Não solicitado; o painel é usado por uma pessoa                        |
| Autenticação de dois fatores             | Não solicitado; pode ser adicionado depois                             |
| Gestão de papéis (admin, editor, leitor) | Todos os contas autenticadas têm o mesmo acesso nesta versão           |
| Página de gestão de usuários (listar, excluir outros) | Não solicitado nesta versão                              |
| Alteração de e-mail da conta             | Fluxo adicional sem demanda imediata                                   |
| Backend próprio fora da Vercel           | Stack já hospedada na Vercel; Functions cobrem o necessário            |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Banco de dados | Neon Postgres via Vercel Marketplace | Discovery da skill `marketplace` (categoria `storage`) indicou Neon como opção Postgres serverless e integra env vars automaticamente | n |
| Provedor de e-mail | Resend via Vercel Marketplace | Discovery da categoria `messaging` retornou Resend como provedor disponível | n |
| Implementação de auth | Própria (sem Clerk/Auth0) | O pedido exige telas próprias e cadastro completo; provedores externos imporiam o fluxo deles | n |
| Quem pode se cadastrar | Cadastro exige código de convite definido em `ADMIN_INVITE_CODE` | Cadastro aberto permitiria que qualquer pessoa acessasse o painel; o código limita a criação de contas | n |
| Hash de senha | `scrypt` do módulo `node:crypto` | Evita dependência nativa; padrão recomendado pelo OWASP quando argon2 não está disponível | y |
| Sessão | Cookie `HttpOnly; Secure; SameSite=Lax`, token opaco aleatório de 32 bytes, armazenado como SHA-256 no banco, validade de 7 dias | Sem JWT para não precisar revogar; sessão revogável no logout | n |
| Token de redefinição | 32 bytes aleatórios, armazenado como SHA-256, validade de 30 minutos, uso único | Link de e-mail não pode durar indefinidamente | n |
| Resposta de "esqueci minha senha" | Mensagem idêntica para e-mail existente e inexistente | Evita enumeração de contas | y |
| Limite de tentativas de login | 5 falhas por e-mail em 15 minutos bloqueiam novas tentativas por 15 minutos | Proteção contra força bruta sem depender de serviço externo | n |
| Verificação de e-mail no cadastro | Não exigida nesta versão | Código de convite já limita o cadastro; reduz dependência do envio para criar conta | n |
| Roteamento | Caminhos `/admin/*` tratados no cliente; `vercel.json` reescreve para `index.html` fora de `/api` | O projeto não tem roteador; adiciona-se o mínimo necessário | n |
| Idioma da interface | Português do Brasil, consistente com o site | Requisito do `CLAUDE.md` | y |

**Open questions:** none - all resolved or logged above. Suposições confirmadas pelo usuário em 2026-10-04.

---

## User Stories

### P1: Cadastro com código de convite ⭐ MVP

**User Story**: As a administradora da Ilê, I want criar minha conta com nome, e-mail e senha usando um código de convite so that somente pessoas autorizadas tenham acesso ao painel.

**Why P1**: Sem cadastro não existe conta; sem o código de convite qualquer pessoa criaria conta.

**Acceptance Criteria**:

1. WHEN o formulário de cadastro é enviado com todos os campos válidos e código de convite correto THEN the system SHALL criar a conta, iniciar a sessão e redirecionar para `/admin` com status HTTP 201.
2. IF o código de convite estiver ausente ou diferente de `ADMIN_INVITE_CODE` THEN the system SHALL responder HTTP 403 com a mensagem "Código de convite inválido" e não criar conta.
3. IF já existe conta com o e-mail informado THEN the system SHALL responder HTTP 409 com a mensagem "Já existe uma conta com este e-mail" sem criar nova conta.
4. IF a senha tiver menos de 10 caracteres OU não contiver letra e número THEN the system SHALL responder HTTP 400 com a mensagem indicando a regra violada e não criar conta.
5. IF o e-mail não tiver formato válido (`^[^\s@]+@[^\s@]+\.[^\s@]{2,}$`) OU o nome tiver menos de 2 caracteres OU mais de 120 caracteres THEN the system SHALL responder HTTP 400 com erro de campo correspondente.
6. The system SHALL armazenar a senha somente como hash `scrypt` com sal aleatório de 16 bytes.
7. WHEN a conta é criada THEN the system SHALL gravar e-mail normalizado em minúsculas, sem espaços nas bordas.

**Independent Test**: Cadastrar com código correto e ver o painel; repetir com e-mail existente e ver 409.

---

### P1: Login e logout ⭐ MVP

**User Story**: As a administradora, I want entrar com e-mail e senha so that eu acesse o painel, e sair so that outra pessoa no mesmo computador não acesse.

**Why P1**: É o controle de acesso central do feature.

**Acceptance Criteria**:

1. WHEN o e-mail e a senha correspondem a uma conta THEN the system SHALL criar sessão, definir o cookie de sessão e responder HTTP 200.
2. IF o e-mail não existe OU a senha está incorreta THEN the system SHALL responder HTTP 401 com a mensagem "E-mail ou senha incorretos", sem indicar qual campo falhou.
3. IF houver 5 falhas para o mesmo e-mail dentro de 15 minutos THEN the system SHALL responder HTTP 429 com a mensagem "Muitas tentativas. Tente novamente em 15 minutos" e não validar a senha até o bloqueio expirar.
4. WHEN o logout é solicitado THEN the system SHALL remover a sessão do banco, expirar o cookie e responder HTTP 200.
5. The system SHALL definir a expiração da sessão como exatamente 7 dias após sua criação, sem renovação deslizante.
6. The system SHALL responder a erros de login em tempo constante, executando a verificação de hash mesmo quando o e-mail não existe.

**Independent Test**: Entrar, sair, tentar entrar com senha errada 5 vezes e ver o bloqueio.

---

### P1: Área `/admin` protegida ⭐ MVP

**User Story**: As a administradora, I want que `/admin` mostre o painel só depois de eu entrar so that o conteúdo administrativo não seja visível publicamente.

**Why P1**: Requisito explícito do pedido: o painel é restrito a pessoas com login.

**Acceptance Criteria**:

1. WHEN uma requisição a `/api/admin/*` (exceto autenticação) chega sem cookie válido THEN the system SHALL responder HTTP 401 e não retornar dados.
2. WHEN uma requisição a `/admin` chega sem sessão válida THEN the client SHALL redirecionar para `/admin/entrar` antes de renderizar qualquer conteúdo do painel.
3. IF a sessão expirou (mais de 7 dias desde a criação) THEN the system SHALL tratá-la como inexistente e exigir novo login.
4. The system SHALL NOT incluir o conteúdo do painel no HTML público da landing (`/`).
5. WHEN o usuário já autenticado acessa `/admin/entrar` THEN the client SHALL redirecionar para `/admin`.
6. IF o cookie de sessão não corresponde a uma sessão válida (adulterado, expirado ou de conta removida) THEN the system SHALL responder HTTP 401 e expirar o cookie na resposta.

**Independent Test**: Acessar `/admin` em aba anônima e ver redirecionamento; acessar `/api/admin/me` sem cookie e ver 401.

---

### P2: Esqueci minha senha ⭐

**User Story**: As a administradora, I want pedir um link de redefinição pelo e-mail so that eu recupere o acesso sem depender de suporte.

**Why P2**: Essencial para uso contínuo, mas o painel já funciona sem ele para quem lembra a senha.

**Acceptance Criteria**:

1. WHEN um e-mail é enviado em "Esqueci minha senha" THEN the system SHALL responder HTTP 200 com a mensagem "Se o e-mail estiver cadastrado, você receberá um link em instantes" independentemente de a conta existir.
2. IF a conta existe THEN the system SHALL gerar token de redefinição, gravar seu hash com validade de 30 minutos e enviar e-mail contendo o link `APP_URL/admin/redefinir-senha#token=<token>`.
3. IF já existe token ativo para a conta THEN the system SHALL invalidá-lo antes de criar o novo.
4. IF o envio do e-mail falhar THEN the system SHALL registrar o erro no log do servidor e ainda responder HTTP 200 com a mesma mensagem, sem vazar o erro ao cliente.
5. IF o e-mail não tiver formato válido THEN the system SHALL responder HTTP 400 com a mensagem "Informe um e-mail válido".

**Independent Test**: Solicitar redefinição, abrir o link recebido e definir nova senha.

---

### P2: Redefinir senha pelo link ⭐

**User Story**: As a administradora, I want definir uma nova senha a partir do link enviado por e-mail so that eu volte a entrar com segurança.

**Why P2**: Fecha o fluxo de recuperação iniciado em "Esqueci minha senha".

**Acceptance Criteria**:

1. WHEN o token é válido, não expirado e não usado, e a nova senha atende às regras de senha THEN the system SHALL atualizar o hash, marcar o token como usado, invalidar todas as sessões ativas da conta e responder HTTP 200.
2. IF o token não existe, já foi usado ou expirou THEN the system SHALL responder HTTP 410 com a mensagem "Este link não é mais válido. Solicite um novo" e não alterar a senha.
3. IF a nova senha não atende às regras (mínimo 10 caracteres, letra e número) THEN the system SHALL responder HTTP 400 e manter o token válido para nova tentativa.
4. WHEN a senha é redefinida THEN the system SHALL enviar e-mail informando a alteração; falha no envio não desfaz a redefinição.
5. WHEN a página `/admin/redefinir-senha` é carregada THEN the client SHALL ler o token do fragmento da URL (`#token=<token>`), remover o fragmento da barra de endereço com `history.replaceState` e enviá-lo somente no corpo do POST; the system SHALL NOT registrar a URL completa com token em logs de requisição.

**Independent Test**: Usar o link uma vez com sucesso; tentar usar de novo e ver 410.

---

### P3: Tela de conta do usuário

**User Story**: As a administradora, I want ver meu nome e e-mail no painel so that eu confirme em qual conta estou.

**Why P3**: Conveniência; não bloqueia o uso.

**Acceptance Criteria**:

1. WHILE a sessão está ativa the system SHALL exibir nome e e-mail do usuário autenticado no cabeçalho do painel.

---

## Edge Cases

- IF o banco estiver indisponível durante o login THEN the system SHALL responder HTTP 503 com a mensagem "Serviço temporariamente indisponível" sem expor o erro técnico.
- IF o cookie de sessão for adulterado THEN the system SHALL responder HTTP 401 e expirar o cookie.
- IF o usuário abrir dois links de redefinição diferentes em sequência THEN the system SHALL aceitar somente o mais recente.
- WHEN dois cadastros com o mesmo e-mail são enviados simultaneamente THEN the system SHALL criar apenas uma conta (restrição única no banco) e responder 409 à segunda.
- IF `DATABASE_URL`, `RESEND_API_KEY`, `APP_URL` ou `ADMIN_INVITE_CODE` estiverem ausentes THEN the system SHALL falhar na inicialização da função com erro claro nos logs do servidor.

---

## Requirement Traceability

| Requirement ID | Story                 | Phase | Status  |
| -------------- | --------------------- | ----- | ------- |
| AUTH-01        | P1: Cadastro          | Design | In Design |
| AUTH-02        | P1: Cadastro          | Design | In Design |
| AUTH-03        | P1: Cadastro          | Design | In Design |
| AUTH-04        | P1: Cadastro          | Design | In Design |
| AUTH-05        | P1: Cadastro          | Design | In Design |
| AUTH-06        | P1: Cadastro          | Design | In Design |
| AUTH-07        | P1: Cadastro          | Design | In Design |
| AUTH-08        | P1: Login             | Design | In Design |
| AUTH-09        | P1: Login             | Design | In Design |
| AUTH-10        | P1: Login             | Design | In Design |
| AUTH-11        | P1: Login             | Design | In Design |
| AUTH-12        | P1: Login             | Design | In Design |
| AUTH-13        | P1: Login             | Design | In Design |
| AUTH-14        | P1: Área protegida    | Design | In Design |
| AUTH-15        | P1: Área protegida    | Design | In Design |
| AUTH-16        | P1: Área protegida    | Design | In Design |
| AUTH-17        | P1: Área protegida    | Design | In Design |
| AUTH-18        | P1: Área protegida    | Design | In Design |
| AUTH-19        | P1: Área protegida    | Design | In Design |
| AUTH-20        | P2: Esqueci a senha   | Design | In Design |
| AUTH-21        | P2: Esqueci a senha   | Design | In Design |
| AUTH-22        | P2: Esqueci a senha   | Design | In Design |
| AUTH-23        | P2: Esqueci a senha   | Design | In Design |
| AUTH-24        | P2: Esqueci a senha   | Design | In Design |
| AUTH-25        | P2: Redefinir senha   | Design | In Design |
| AUTH-26        | P2: Redefinir senha   | Design | In Design |
| AUTH-27        | P2: Redefinir senha   | Design | In Design |
| AUTH-28        | P2: Redefinir senha   | Design | In Design |
| AUTH-29        | P2: Redefinir senha   | Design | In Design |
| AUTH-30        | P3: Conta do usuário  | Design | In Design |
| AUTH-31        | Edge: banco indisponível | -  | Pending |

**Coverage:** 31 total, 0 mapped to tasks, 31 unmapped ⚠️ (será resolvido na fase Tasks)

---

## Success Criteria

- [ ] Cadastro, login, logout, recuperação e redefinição funcionam de ponta a ponta em produção (Vercel)
- [ ] `/admin` não renderiza conteúdo sem sessão, verificado em aba anônima
- [ ] Os testes automatizados cobrem cada AC P1 e P2 (inclusive 401, 403, 409, 410 e bloqueio por tentativas)
