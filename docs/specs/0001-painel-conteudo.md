# Spec 0001 — Painel de conteúdo no Cloudflare

## Objetivo

A Eliana (ou a RMoro) edita os textos, os contatos e as fotos do elianalino.com.br por um painel simples em
`elianalino.com.br/admin/`, sem mexer em código. O que for publicado entra no site.

Segue o mesmo modelo do painel da RMoro (rmoro.com.br), adaptado às seções desta landing.

## Decisões

- **Hospedagem no Cloudflare** (Worker `elianalino-site`), no lugar da Vercel. Arquivos estáticos continuam servidos
  direto; só `/api/*` e `/img/*` passam pelo código (`assets.run_worker_first`). O painel é uma página estática em
  `/admin/`. Os scripts de Analytics e Speed Insights da Vercel saíram do site.
- **D1** (`elianalino-conteudo`) guarda o conteúdo (rascunho, versão publicada e histórico); **R2** (`elianalino-imagens`) guarda
  as fotos.
- **Rascunho e publicação separados**: salvar não muda o site; **Publicar** copia o rascunho para a versão pública
  e chama o _deploy hook_ do Cloudflare, que gera o site de novo.
- **Site lê o conteúdo na hora do build** (`vite-plugin-site-content.ts`) em `GET /api/public/site`. Sem resposta
  válida, usa o conteúdo embutido (`src/content/embedded.ts`), então o build nunca quebra. O primeiro acesso ao
  painel carrega o conteúdo embutido como rascunho e como versão publicada.
- **Um acesso só**: senha em `ADMIN_PASSWORD` (secret). Cookie de sessão assinado, `HttpOnly`, `Secure`,
  `SameSite=Strict`, 12 h. A chave de assinatura deriva da senha: trocar a senha encerra todas as sessões.
  A branch `feat/admin-auth` (cadastro, e-mail e Neon na Vercel) não foi usada.
- **Falha no deploy hook não desfaz a publicação**: a versão fica salva e o painel avisa para tentar de novo.
- **Duas abas ou pessoas salvando**: lock otimista por `version`; a segunda recebe 409 e nada é sobrescrito.
- **Fotos reduzidas no navegador** (máx. 1600 px, WebP) antes do envio; o servidor ainda confere tipo, assinatura
  do arquivo e 2 MB. Sem foto enviada, a seção usa a foto original do repositório.
- **Destaque em títulos**: o trecho entre asteriscos aparece em itálico na cor de destaque
  (`Uma escuta para a *sua totalidade*`).

## Design

- `src/content/schema.ts`: contrato `SiteContent` (Zod), usado no build e pelo Worker.
- `src/content/index.ts`: conteúdo que as seções (`src/ui_kits/landing/`) leem; vem do módulo
  `virtual:site-content`.
- `vite-plugin-site-content.ts`: busca o conteúdo publicado, preenche título e descrição do `index.html` e gera
  `admin/fotos-originais.json` (miniaturas das fotos originais no painel).
- `worker/`: `content-service.ts` (rascunho, publicar, versões), `auth.ts` (senha, sessão, 8 erros em 15 min por
  IP → 429), `errors.ts` (erros em português com o caminho: “Atuação › Áreas › Pathwork › Resumo”), `images.ts`,
  `d1-repo.ts` e `index.ts` (rotas).
- Rotas: `POST /api/login`, `POST /api/logout`, `GET /api/me`, `GET|PUT /api/content`, `POST /api/publish`,
  `GET /api/history`, `POST /api/restore/:id`, `GET|POST /api/images`, `DELETE /api/images/:arquivo`,
  `GET /img/:arquivo` e a pública `GET /api/public/site`.
- `migrations/0001_init.sql`: `site_content`, `content_history`, `login_attempts`.
- Painel (`public/admin/`): abas Início, Sobre, Abordagem, Grupos, Atuação, Projetos, Contato, Fotos e Versões;
  mostra se há alterações não publicadas.

## Fora desta entrega

- Menu, rótulos de botões, textos fixos do formulário (rótulos, mensagens de erro), logo e favicon seguem no código.
- Prévia do site antes de publicar, vários usuários, recuperação de senha por e-mail.
- Seção de depoimentos (`Testimonials.tsx`), que está desligada no site.

## Critérios de aceite

- [x] Rotas de edição sem sessão válida respondem 401; `GET /api/public/site` e `GET /img/*` são públicas.
- [x] Senha errada nunca cria sessão; após 8 erros em 15 min responde 429.
- [x] Salvar valida o conteúdo e aponta seção, item e campo com erro, em português.
- [x] Salvar com versão antiga responde 409 e não altera o rascunho.
- [x] Publicar copia o rascunho, grava histórico e chama o hook; falha do hook mantém a publicação.
- [x] Voltar uma versão cria novo rascunho (não apaga histórico).
- [x] Upload recusa tipo diferente de JPEG/PNG/WebP, arquivo cuja assinatura não confere e mais de 2 MB.
- [x] Com o conteúdo embutido, o site mostra os mesmos textos, links e fotos de antes.
- [x] Painel fora do ar ou com conteúdo inválido não quebra o build.
