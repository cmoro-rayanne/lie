import React from 'react';

/**
 * Tag — a small olive pill for topics / modalities (TCC, Mindfulness, …).
 * Uppercase, letter-spaced, rounded full. The grounding olive accent.
 */
export function Tag({ children, tone = 'olive', style = {}, ...rest }) {
  const tones = {
    olive: { bg: 'var(--color-olive-100)', color: 'var(--color-olive-600)', border: 'var(--color-olive-200)' },
    terra: { bg: 'var(--color-terra-100)', color: 'var(--color-terra-600)', border: 'var(--color-terra-200)' },
    sand:  { bg: 'var(--color-sand-100)',  color: 'var(--color-warm-700)',  border: 'var(--color-sand-300)' },
  };
  const t = tones[tone] || tones.olive;
  return (
    <span
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.65rem',
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        padding: '4px 10px',
        background: t.bg,
        color: t.color,
        border: `1px solid ${t.border}`,
        borderRadius: 'var(--radius-pill)',
        display: 'inline-block',
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}
