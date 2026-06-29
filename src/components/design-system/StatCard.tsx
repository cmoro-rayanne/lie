import React, { useState } from 'react';

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  label: string;
  sub?: string;
}

export function StatCard({ value, label, sub, style = {}, ...rest }: StatCardProps) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: 'var(--surface-raised)',
        border: `1px solid ${hover ? 'var(--border-accent)' : 'var(--border-soft)'}`,
        borderRadius: 'var(--radius-md)',
        padding: '28px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        boxShadow: hover ? 'var(--shadow-soft)' : 'none',
        transition: 'all 0.3s ease',
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          width: '4px',
          alignSelf: 'stretch',
          borderRadius: '2px',
          background: 'linear-gradient(180deg, var(--color-terra-300), var(--color-olive-300))',
          flexShrink: 0,
        }}
      />
      <div>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', fontWeight: 500, color: 'var(--accent)', lineHeight: 1, marginBottom: '6px' }}>
          {value}
        </p>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-strong)', marginBottom: '2px' }}>
          {label}
        </p>
        {sub && (
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.75rem', fontWeight: 300, color: 'var(--text-muted)' }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
