export interface TextPart {
  text: string;
  em: boolean;
}

/** Separa o trecho entre asteriscos: `Espaços de *Partilha*` vira texto comum + destaque. */
export function splitEmphasis(text: string): TextPart[] {
  return text
    .split(/\*([^*]+)\*/)
    .map((part, i) => ({ text: part, em: i % 2 === 1 }))
    .filter((p) => p.text !== '');
}
