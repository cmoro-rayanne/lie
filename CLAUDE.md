# Ilê · Psicologia e Consciência — Landing page

Site institucional de página única da psicóloga clínica **Eliana Lino** (Ilê). React 19 + Vite + TypeScript, publicado na Vercel (com `@vercel/analytics` e `@vercel/speed-insights`). Todo o conteúdo é em **português do Brasil**.

## Comandos

- `npm run dev` — servidor de desenvolvimento (Vite)
- `npm run build` — checagem de tipos (`tsc -b`) + build de produção em `dist/`
- `npm run lint` — ESLint (ignora `src/ui_kits/**`). Há um erro conhecido em `src/init.ts` (`any` intencional para expor `React` em `window`)
- `npm run format` / `npm run format:check` — Prettier
- `npm run preview` — serve o build localmente

Node >= 24 (ver `.nvmrc`). Não há suíte de testes: valide mudanças com `npm run build` e `npm run lint`, e confira visualmente no `npm run dev` (desktop e mobile).

## Arquitetura

- `src/main.tsx` — entrada. A ordem dos imports importa:
  1. `init.ts` expõe `React` em `window` (necessário para o bundle legado);
  2. `_ds_bundle.js` registra os componentes do design system em `window.ElianaLinoDesignSystem_6994f2`;
  3. `ui_kits/landing/icons` e `helpers` registram `window.Icons` e `window.useInView`.
- `src/ui_kits/landing/` — **as seções reais do site** (Navbar, Hero, About, Abordagem, Atuacao, Grupos, Projetos, Quote, Contact, Footer). `index.tsx` compõe a página e contém os media queries responsivos.
- `src/components/` — primitivas do design system (Button, Card, Input, SectionHeading…). O código em execução vem de `_ds_bundle.js`; os `.jsx` / `.d.ts` / `.prompt.md` são fonte e documentação.
- `src/tokens/*.css` + `src/styles.css` — tokens de design (cores, tipografia, espaçamento, animação). `src/index.css` importa Tailwind v4 e repete tokens em `@theme`; ao mudar uma cor, atualize os dois lugares.
- `src/assets/fotos/web/` — fotos otimizadas usadas no build. Os originais de câmera em `src/assets/fotos/` são ignorados pelo git.

## Convenções

- **Design:** siga `src/README.md` (guia de marca) e `src/SKILL.md`. Paleta quente (sand, terra, olive, warm), Cormorant Garamond nos títulos e Inter no texto, muito espaço em branco, animações suaves com `cubic-bezier(0.16,1,0.3,1)`. Sem emoji na interface; use ícones lucide ou os glifos ◎ ◈ ◇.
- **Estilo nas seções:** estilos inline com variáveis CSS (`var(--accent)`, `var(--section-y)`…) em vez de valores fixos. Componentes do DS são obtidos via `window.ElianaLinoDesignSystem_6994f2`, e revelações ao rolar usam `window.useInView()`.
- **Texto:** primeira pessoa da psicóloga, tratando o leitor por "você"; tom acolhedor, nunca clínico-frio.
- **Contato:** o formulário em `Contact.tsx` não tem backend. Ele monta uma mensagem e abre `wa.me/<WHATSAPP_NUMBER>`. Se o número mudar, atualize todas as ocorrências (`Contact.tsx`, `Footer.tsx`).
- **Commits:** Conventional Commits (`feat:`, `fix:`, `style:`, `chore:`), mensagens em português.
- Não edite `_ds_bundle.js` à mão nem commite `.env`.
