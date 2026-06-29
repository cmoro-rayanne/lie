import React from 'react';

interface RingMarkProps {
  size?: number;
  mono?: string | null;
  style?: React.CSSProperties;
}

function RingMark({ size = 88, mono = null, style = {} }: RingMarkProps) {
  const terra = mono || 'var(--color-terra-400)';
  const olive = mono || 'var(--color-olive-500)';
  const gold = mono || 'var(--color-terra-300)';
  const w = size;
  const h = size * (230 / 300);
  return (
    <svg width={w} height={h} viewBox="0 0 300 230" fill="none" style={style} aria-hidden="true">
      <circle cx="150" cy="112" r="100" stroke={terra} strokeWidth="2.6" />
      <circle cx="150" cy="146" r="67" stroke={olive} strokeWidth="2.6" />
      <ellipse cx="150" cy="162" rx="46" ry="52" stroke={gold} strokeWidth="2.6" />
    </svg>
  );
}

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'full' | 'inline' | 'mark' | 'wordmark' | 'stacked';
  size?: number;
  tone?: 'light' | 'dark';
  mono?: string | null;
  showTagline?: boolean;
}

export function Logo({
  variant = 'full',
  size = 120,
  tone = 'light',
  mono = null,
  showTagline = true,
  style = {},
  ...rest
}: LogoProps) {
  const onDark = tone === 'dark';
  const ringColor = mono || (onDark ? 'rgba(192,169,130,0.9)' : null);
  const wordColor = onDark ? 'rgba(240,225,205,0.95)' : 'var(--color-terra-500)';
  const tagColor = onDark ? 'var(--color-gold-soft)' : 'var(--color-olive-500)';
  const lineColor = onDark ? 'rgba(192,169,130,0.45)' : 'var(--color-olive-300)';
  const dotColor = onDark ? 'var(--color-gold)' : 'var(--color-terra-400)';

  const Word = ({ fs }: { fs: string }) => (
    <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 500, fontSize: fs, lineHeight: 0.9, color: wordColor, letterSpacing: '0.01em' }}>Ilê</span>
  );
  const Tagline = ({ fs }: { fs: string }) => (
    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: fs, letterSpacing: '0.26em', textTransform: 'uppercase', color: tagColor, whiteSpace: 'nowrap' }}>
      Psicologia e Consciência
    </span>
  );
  const Divider = ({ w }: { w: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: w }}>
      <span style={{ flex: 1, height: '1px', background: lineColor }} />
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: dotColor }} />
      <span style={{ flex: 1, height: '1px', background: lineColor }} />
    </div>
  );

  // Inline — compact horizontal lockup for nav bars
  if (variant === 'inline') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.18, ...style }} {...rest}>
        <RingMark size={size} mono={ringColor} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <Word fs={`${size * 0.5}px`} />
          {showTagline && (
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: `${size * 0.1}px`, letterSpacing: '0.24em', textTransform: 'uppercase', color: tagColor, marginTop: '4px' }}>
              Psicologia e Consciência
            </span>
          )}
        </div>
      </div>
    );
  }

  // Mark only
  if (variant === 'mark') {
    return <div style={style} {...rest}><RingMark size={size} mono={ringColor} /></div>;
  }

  // Wordmark only (no rings)
  if (variant === 'wordmark') {
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.14, ...style }} {...rest}>
        <Word fs={`${size * 0.62}px`} />
        {showTagline && <Tagline fs={`${size * 0.12}px`} />}
        {showTagline && <Divider w={`${size * 1.7}px`} />}
      </div>
    );
  }

  // Stacked (rings + wordmark) and Full (+ tagline + divider) — the canonical vertical lockup
  const full = variant !== 'stacked';
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', ...style }} {...rest}>
      <RingMark size={size} mono={ringColor} style={{ marginBottom: -size * 0.06 }} />
      <Word fs={`${size * 0.62}px`} />
      {full && showTagline && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.1, marginTop: size * 0.12 }}>
          <Tagline fs={`${size * 0.12}px`} />
          <Divider w={`${size * 1.9}px`} />
        </div>
      )}
    </div>
  );
}
