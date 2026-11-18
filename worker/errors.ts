import type { ZodIssue } from 'zod';

const SECTIONS: Record<string, string> = {
  seo: 'Google',
  hero: 'Início',
  quote: 'Frase em destaque',
  about: 'Sobre',
  approach: 'Abordagem',
  groups: 'Grupos',
  areas: 'Atuação',
  projects: 'Projetos',
  cta: 'Chamada para o WhatsApp',
  contact: 'Contato',
  footer: 'Rodapé',
  images: 'Fotos',
};

const FIELDS: Record<string, string> = {
  title: 'Título',
  titleItalic: 'Segunda linha do título',
  description: 'Descrição',
  eyebrow: 'Chamada acima do título',
  subtitle: 'Subtítulo',
  text: 'Texto',
  paragraphs: 'Parágrafos',
  author: 'Assinatura',
  cards: 'Cartões',
  items: 'Áreas',
  lead: 'Resumo',
  body: 'Texto completo',
  intro: 'Introdução',
  whatsapp: 'WhatsApp',
  phoneDisplay: 'Telefone exibido',
  email: 'E-mail',
  address: 'Endereço',
  instagram: 'Instagram',
  waGreeting: 'Saudação do WhatsApp',
  subjects: 'Assuntos do formulário',
  quote: 'Frase',
  tagline: 'Texto abaixo da logo',
  copyright: 'Linha final',
  about: 'Sobre',
  groups: 'Grupos',
  projects: 'Projetos',
  cta: 'Chamada para o WhatsApp',
  src: 'Foto',
  alt: 'Descrição da foto',
};

function label(key: string): string {
  return FIELDS[key] ?? key;
}

function itemName(content: unknown, path: (string | number)[], upTo: number): string | undefined {
  let node: unknown = content;
  for (let i = 0; i <= upTo; i += 1) {
    if (node && typeof node === 'object')
      node = (node as Record<string | number, unknown>)[path[i]!];
    else return undefined;
  }
  if (node && typeof node === 'object') {
    const title = (node as Record<string, unknown>).title;
    if (typeof title === 'string' && title.trim()) return title.trim();
  }
  return undefined;
}

/** Caminho legível: “Atuação › Áreas › Pathwork › Resumo”. */
export function describePath(path: (string | number)[], content?: unknown): string {
  const parts: string[] = [];
  path.forEach((seg, i) => {
    if (typeof seg === 'number') {
      parts.push(itemName(content, path, i) ?? `item ${seg + 1}`);
    } else if (i === 0) {
      parts.push(SECTIONS[seg] ?? seg);
    } else {
      parts.push(label(seg));
    }
  });
  return parts.join(' › ');
}

function describeIssue(issue: ZodIssue): string {
  const i = issue as ZodIssue & { origin?: string; minimum?: number; maximum?: number };
  switch (issue.code) {
    case 'too_small':
      if (i.origin === 'array') return `precisa ter ao menos ${i.minimum} item(ns)`;
      return Number(i.minimum) <= 1 ? 'não pode ficar vazio' : `mínimo de ${i.minimum} caracteres`;
    case 'too_big':
      return i.origin === 'array'
        ? `máximo de ${i.maximum} itens`
        : `máximo de ${i.maximum} caracteres`;
    case 'invalid_type':
      return 'preenchimento obrigatório';
    case 'invalid_value':
      return 'valor inválido';
    default:
      return /^invalid/i.test(issue.message) ? 'formato inválido' : issue.message;
  }
}

export function formatIssues(issues: ZodIssue[], content?: unknown): string[] {
  return issues.map(
    (issue) =>
      `${describePath(issue.path as (string | number)[], content)}: ${describeIssue(issue)}`,
  );
}
