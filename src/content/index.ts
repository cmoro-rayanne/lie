/**
 * Conteúdo do site, resolvido na hora do build por `vite-plugin-site-content.ts`:
 * o que foi publicado no painel (`/admin/`) ou, sem resposta válida, o conteúdo embutido.
 */
import data from 'virtual:site-content';
import type { SiteContent } from './schema';

export const content: SiteContent = data;
export const whatsappUrl = `https://wa.me/${content.contact.whatsapp}`;
