import type { CSSProperties } from 'react';
import { splitEmphasis } from './emphasis';

const DEFAULT_STYLE: CSSProperties = { color: 'var(--accent)', fontStyle: 'italic' };

/** Título com o trecho entre asteriscos em itálico na cor de destaque. */
export function Emphasis({
  text,
  emStyle = DEFAULT_STYLE,
}: {
  text: string;
  emStyle?: CSSProperties;
}) {
  return (
    <>
      {splitEmphasis(text).map((p, i) =>
        p.em ? (
          <em key={i} style={emStyle}>
            {p.text}
          </em>
        ) : (
          p.text
        ),
      )}
    </>
  );
}
