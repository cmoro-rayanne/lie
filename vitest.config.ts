import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { siteContent } from './vite-plugin-site-content';

export default defineConfig({
  plugins: [react(), siteContent()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
