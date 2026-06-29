import React, { useState } from 'react';
import type { ReactNode } from 'react';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'soft';
  tone?: 'light' | 'dark';
  href?: string;
  'aria-label'?: string;
}

export function IconButton({
  children,
  size = 'md',
  variant = 'outline',
  tone = 'light',
  'aria-label': ariaLabel,
  href,
  onClick,
  style = {},
  ...rest
}: IconButtonProps) {
  const [hover, setHover] = useState(false);

  const dims = { sm: 38, md: 44, lg: 56 }[size];
  const onDark = tone === 'dark';

  const palettes = {
    outline: {
      idleBg: onDark ? 'rgba(192,169,130,0.06)' : 'transparent',
      idleBorder: onDark ? 'rgba(192,169,130,0.2)' : 'var(--color-terra-300)',
      idleColor: onDark ? 'rgba(192,169,130,0.6)' : 'var(--color-terra-500)',
      hoverBg: onDark ? 'rgba(192,169,130,0.15)' : 'var(--color-terra-400)',
      hoverColor: onDark ? 'rgba(192,169,130,0.9)' : '#fff',
      hoverBorder: onDark ? 'rgba(192,169,130,0.4)' : 'var(--color-terra-400)',
    },
    soft: {
      idleBg: 'var(--color-terra-100)',
      idleBorder: 'var(--color-terra-200)',
      idleColor: 'var(--color-terra-500)',
      hoverBg: 'var(--color-terra-400)',
      hoverColor: '#fff',
      hoverBorder: 'var(--color-terra-400)',
    },
  };
  const p = palettes[variant];

  const composed: React.CSSProperties = {
    width: dims,
    height: dims,
    borderRadius: variant === 'soft' ? 'var(--radius-sm)' : '50%',
    border: `1px solid ${hover ? p.hoverBorder : p.idleBorder}`,
    background: hover ? p.hoverBg : p.idleBg,
    color: hover ? p.hoverColor : p.idleColor,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    flexShrink: 0,
    transition: 'all 0.3s ease',
    ...style,
  };

  const handlers = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  };

  if (href) {
    const { type: _, ...anchorRest } = rest as any;
    return (
      <a href={href} aria-label={ariaLabel} style={composed} {...handlers} {...anchorRest}>
        {children}
      </a>
    );
  }
  return (
    <button aria-label={ariaLabel} onClick={onClick} style={composed} {...handlers} {...rest}>
      {children}
    </button>
  );
}
