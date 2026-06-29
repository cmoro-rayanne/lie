import React, { useState } from 'react';
import type { ReactNode } from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  tone?: 'dark' | 'light';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  href?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  tone = 'dark',
  icon = null,
  iconPosition = 'left',
  href,
  onClick,
  type = 'button',
  disabled = false,
  style = {},
  ...rest
}: ButtonProps) {
  const [hover, setHover] = useState(false);

  const sizes = {
    sm: { padding: '10px 22px', fontSize: '0.72rem' },
    md: { padding: '13px 30px', fontSize: '0.78rem' },
    lg: { padding: '15px 38px', fontSize: '0.8rem' },
  };

  const cream = 'rgba(235,220,200,0.85)';
  const onDark = tone === 'dark';

  const base: React.CSSProperties = {
    fontFamily: 'var(--font-sans)',
    fontWeight: variant === 'primary' ? 500 : 400,
    letterSpacing: 'var(--tracking-label)',
    textTransform: 'uppercase',
    textDecoration: 'none',
    borderRadius: 'var(--radius-sm)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.35s var(--ease-out-expo)',
    whiteSpace: 'nowrap',
    ...sizes[size],
  };

  const variants = {
    primary: {
      background: disabled
        ? 'var(--color-sand-300)'
        : (hover
            ? 'linear-gradient(135deg, #cd9655, #a57341)'
            : 'var(--grad-cta)'),
      color: disabled ? 'var(--color-warm-600)' : '#f5efe8',
      border: '1px solid rgba(192,160,110,0.3)',
      transform: hover && !disabled ? 'translateY(-2px)' : 'translateY(0)',
      boxShadow: hover && !disabled ? 'var(--shadow-cta)' : 'none',
    },
    secondary: {
      background: hover ? (onDark ? 'rgba(255,255,255,0.06)' : 'var(--color-terra-400)') : 'transparent',
      color: onDark ? (hover ? '#fff' : cream) : (hover ? '#fff' : 'var(--color-terra-600)'),
      border: `1px solid ${onDark
        ? (hover ? 'rgba(235,220,200,0.55)' : 'rgba(235,220,200,0.28)')
        : 'var(--color-terra-400)'}`,
      transform: 'translateY(0)',
    },
    ghost: {
      background: hover ? 'rgba(154,115,80,0.08)' : 'transparent',
      color: 'var(--color-terra-600)',
      border: '1px solid transparent',
      transform: 'translateY(0)',
    },
  };

  const composed: React.CSSProperties = { ...base, ...variants[variant], ...style };
  const inner = (
    <>
      {icon && iconPosition === 'left' ? <span style={{ display: 'inline-flex' }}>{icon}</span> : null}
      {children}
      {icon && iconPosition === 'right' ? <span style={{ display: 'inline-flex' }}>{icon}</span> : null}
    </>
  );

  const handlers = {
    onMouseEnter: () => !disabled && setHover(true),
    onMouseLeave: () => setHover(false),
  };

  if (href && !disabled) {
    // If it's a link, we cast standard anchor attrs.
    const { type: _, ...anchorRest } = rest as any;
    return (
      <a href={href} style={composed} {...handlers} {...anchorRest}>{inner}</a>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={composed} {...handlers} {...rest}>
      {inner}
    </button>
  );
}
