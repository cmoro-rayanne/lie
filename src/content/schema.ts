import { z } from 'zod';

/**
 * Contrato do conteúdo do site. Usado no build (`vite-plugin-site-content.ts`) e pelo Worker do
 * painel (`worker/`). Os limites de tamanho também aparecem em `public/admin/admin.js`
 * (contadores dos campos).
 *
 * Títulos aceitam um trecho entre asteriscos, que o site mostra em itálico na cor de destaque:
 * `Uma escuta para a *sua totalidade*`.
 */
const line = (max: number) => z.string().trim().min(1).max(max);
const httpsUrl = z
  .string()
  .url()
  .max(300)
  .refine((u) => u.startsWith('https://'), 'precisa começar com https://');

/** Foto enviada pelo painel (`/img/<arquivo>`, guardada no R2). */
const Img = z.string().regex(/^\/img\/[a-f0-9]{16,64}\.(webp|jpg|png)$/, 'imagem inválida');
/** Sem `src`, o site usa a foto original do repositório. `alt` descreve a foto para leitores de tela. */
const Photo = z.object({ src: Img.optional(), alt: line(160) });

const Heading = { eyebrow: line(40), title: line(100) };

export const SiteContent = z.object({
  /** Título e descrição que aparecem no Google e ao compartilhar o link. */
  seo: z.object({ title: line(80), description: line(200) }),
  hero: z.object({
    eyebrow: line(80),
    /** A frase do topo aparece em duas linhas; a segunda fica em itálico. */
    title: line(80),
    titleItalic: line(80),
    text: line(300),
  }),
  about: z.object({
    ...Heading,
    subtitle: line(160),
    paragraphs: z.array(line(700)).min(1).max(5),
  }),
  quote: z.object({ text: line(240), author: line(80) }),
  approach: z.object({
    ...Heading,
    subtitle: line(160),
    cards: z
      .array(z.object({ title: line(60), text: line(400) }))
      .min(1)
      .max(6),
  }),
  groups: z.object({ ...Heading, subtitle: line(160), text: line(700) }),
  areas: z.object({
    ...Heading,
    items: z
      .array(z.object({ title: line(60), subtitle: line(80), lead: line(300), body: line(500) }))
      .min(1)
      .max(6),
  }),
  projects: z.object({
    ...Heading,
    subtitle: line(160),
    paragraphs: z.array(line(700)).min(1).max(5),
  }),
  /** Faixa de chamada para o WhatsApp, antes do formulário. */
  cta: z.object({ ...Heading, text: line(240) }),
  contact: z.object({
    ...Heading,
    intro: line(300),
    whatsapp: z
      .string()
      .regex(/^\d{12,13}$/, 'WhatsApp com DDI e DDD, só números (ex.: 5548999212332)'),
    phoneDisplay: line(30),
    email: z.string().email().max(120),
    address: line(200),
    instagram: httpsUrl,
    /** Primeira linha da mensagem que o formulário monta no WhatsApp. */
    waGreeting: line(120),
    /** Opções do campo “Assunto” do formulário. */
    subjects: z.array(line(60)).min(1).max(10),
  }),
  footer: z.object({ quote: line(300), tagline: line(240), copyright: line(120) }),
  images: z.object({ about: Photo, groups: Photo, projects: Photo, cta: Photo }),
});

export type SiteContent = z.infer<typeof SiteContent>;
