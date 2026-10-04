# Estado do projeto

## Decisions

| ID      | Decisão | Status | Feature |
| ------- | ------- | ------ | ------- |
| AD-001  | Backend em Vercel Functions: handlers Web-standard em `api/`, lógica compartilhada em `server/`. Banco Neon via `@neondatabase/serverless`; e-mail Resend via API REST com `fetch`. | active | admin-auth |
| AD-002  | Rotas `/admin*` são carregadas com `React.lazy` a partir de `src/main.tsx`; a landing não baixa código do painel. | active | admin-auth |
| AD-003  | Autenticação própria: senha com `scrypt`; sessão em cookie `admin_session` (HttpOnly, Secure, SameSite=Lax) com token opaco, hash SHA-256 no banco e validade fixa de 7 dias; sem JWT. | active | admin-auth |

## Handoff

- Feature: admin-auth
- Fase: Tasks (rascunho para aprovação)
- Concluído: spec confirmada; design aprovado
- Próximo passo: aprovar tasks e modo de execução (inline ou sub-agentes)
- Bloqueios: Neon (banco de testes com `TEST_DATABASE_URL`) e Resend (domínio verificado) ainda não provisionados
- Arquivos não rastreados: `.specs/`, e alterações pré-existentes em `.agents/`, `.claude/`, `.cursor/`, `.windsurf/` (não pertencem a este feature)
- Branch: `feat/admin-auth`, criada a partir de `main` (13946ce)
- Modo de execução: sub-agentes por fase (4 lotes, sequenciais)
- Pendente: T9 aguarda banco Neon de teste (`TEST_DATABASE_URL`)
