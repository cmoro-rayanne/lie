# Painel administrativo (`/admin`)

Acesso do painel: cadastro com código de convite, login, sair, esqueci minha senha e redefinição por e-mail.

## Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha. Os valores nunca vão para o repositório.

- `DATABASE_URL`: connection string do Neon Postgres (injetada pela integração do Vercel Marketplace).
- `RESEND_API_KEY`: chave da API do Resend, usada no envio dos e-mails (integração do Vercel Marketplace).
- `APP_URL`: URL pública do site, com protocolo (ex.: `https://ilelino.vercel.app`). Base do link de redefinição.
- `ADMIN_INVITE_CODE`: código exigido no cadastro. Use 24 ou mais caracteres aleatórios.
- `MAIL_FROM`: remetente dos e-mails, em domínio verificado no Resend.

Sem alguma dessas variáveis, a função falha na inicialização e registra qual está faltando.

## Banco de dados

```bash
npm run db:migrate
```

Executa `server/schema.sql` (idempotente). Requer `DATABASE_URL`.

## Desenvolvimento local

`npm run dev` serve só o front-end. As rotas `/api/admin/*` são Vercel Functions e não rodam nele.
Para testar o painel com as rotas de API, use `vercel dev`, que serve o front-end e as functions juntos.

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
