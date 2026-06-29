import React from 'react';

export interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  lead?: string;
  align?: 'left' | 'center' | 'right';
  tone?: 'light' | 'dark';
}

export function SectionHeading({
  eyebrow,
  children,
  lead,
  align = 'left',
  tone = 'light',
  style = {},
  ...rest
}: SectionHeadingProps) {
  const onDark = tone === 'dark';
  return (
    <div style={{ textAlign: align, ...style }} {...rest}>
      {eyebrow && (
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--eyebrow-size)',
          fontWeight: 500,
          letterSpacing: 'var(--eyebrow-track)',
          textTransform: 'uppercase',
          color: onDark ? 'var(--color-gold-soft)' : 'var(--accent)',
          marginBottom: '16px',
        }}>
          {eyebrow}
        </p>
      )}
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'var(--text-h2)',
        fontWeight: 400,
        lineHeight: 'var(--leading-tight)',
        letterSpacing: 'var(--tracking-tight)',
        color: onDark ? 'var(--text-on-ink)' : 'var(--text-strong)',
      }}>
        {children}
      </h2>
      {lead && (
        <p style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 'var(--text-base)',
          fontWeight: 300,
          lineHeight: 'var(--leading-relaxed)',
          color: onDark ? 'rgba(235,220,200,0.8)' : 'var(--text-muted)',
          maxWidth: '600px',
          margin: align === 'center' ? '20px auto 0' : '16px 0 0',
        }}>
          {lead}
        </p>
      )}
    </div>
  );
}
