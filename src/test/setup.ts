import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds = [];
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

// Valores de placeholder para os módulos de servidor (server/deps.ts valida o ambiente ao carregar).
// `??=` preserva variáveis reais já definidas; nenhum teste usa estes valores para conectar em banco.
const SERVER_ENV_PLACEHOLDERS: Record<string, string> = {
  DATABASE_URL: 'postgres://placeholder:placeholder@localhost:5432/placeholder',
  RESEND_API_KEY: 're_placeholder',
  APP_URL: 'https://placeholder.example',
  ADMIN_INVITE_CODE: 'placeholder-convite',
  MAIL_FROM: 'placeholder <placeholder@example.com>',
};
for (const [name, value] of Object.entries(SERVER_ENV_PLACEHOLDERS)) {
  process.env[name] ??= value;
}

// Testes de servidor usam ambiente `node`, onde `window` não existe.
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: MockIntersectionObserver,
  });
}

Object.defineProperty(globalThis, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});
