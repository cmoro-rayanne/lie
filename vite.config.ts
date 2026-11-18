import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { siteContent } from './vite-plugin-site-content';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteContent()],
});
