# React + TypeScript + Vite

[![Harness Score: L4](./badge.svg)](https://paladini.github.io/harness-score/)

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## Painel de conteúdo (`/admin/`)

Textos, contatos e fotos do site são editados em `elianalino.com.br/admin/`. Salvar guarda um rascunho; **Publicar** atualiza o site em 1 a 2 minutos. Spec: `docs/specs/0001-painel-conteudo.md`.

- **Hospedagem:** Cloudflare Workers, ligado a este repositório: build `npm run build`, deploy `npx wrangler deploy` (configuração em `wrangler.jsonc`). O Worker (`worker/`) usa D1 (`elianalino-conteudo`) e R2 (`elianalino-imagens`).
- **Secrets** (Worker `elianalino-site` → Settings → Variables and secrets): `ADMIN_PASSWORD` (senha do painel) e `DEPLOY_HOOK_URL` (Deploy Hook do Workers Builds).
- **Conteúdo no build:** o build busca o que foi publicado em `{SITE_API_URL}/api/public/site` (padrão `https://elianalino.com.br`). O log mostra de onde veio: `[conteúdo] painel, versão N` ou `[conteúdo] embutido (...)`. O conteúdo de reserva fica em `src/content/embedded.ts`.
- **Migrations:** a `0001_init.sql` já foi aplicada no banco de produção; as próximas, com `npx wrangler d1 execute elianalino-conteudo --remote --file migrations/<arquivo>.sql`.
- **Local:** `.dev.vars` com `ADMIN_PASSWORD`, `npx wrangler d1 migrations apply elianalino-conteudo --local`, `npm run build` e `npx wrangler dev`. Tipos do Worker: `npm run typecheck:worker`.
