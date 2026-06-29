import React, { useState } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  accentBar?: boolean;
  interactive?: boolean;
  padding?: string;
}

export function Card({
  children,
  accentBar = true,
  interactive = true,
  padding = '40px 32px',
  style = {},
  ...rest
}: CardProps) {
  const [hover, setHover] = useState(false);
  const active = interactive && hover;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: active ? 'var(--surface-raised)' : 'var(--surface-card)',
        border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border-soft)'}`,
        borderRadius: 'var(--radius-lg)',
        padding,
        boxShadow: active ? 'var(--shadow-card)' : 'none',
        transform: active ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.4s var(--ease-out-expo)',
        ...style,
      }}
      {...rest}
    >
      {accentBar && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'linear-gradient(90deg, var(--color-terra-300), var(--color-olive-300))',
            opacity: active ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      )}
      {children}
    </div>
  );
}
