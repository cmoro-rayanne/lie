import React from 'react';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'line' | 'center' | 'ornament';
  width?: number | string;
  tone?: 'light' | 'dark';
}

export function Divider({ variant = 'line', width = 48, tone = 'light', style = {}, ...rest }: DividerProps) {
  const onDark = tone === 'dark';

  if (variant === 'ornament') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', ...style }} {...rest}>
        <span style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, var(--color-terra-300), transparent)' }} />
      </div>
    );
  }

  const grad = onDark
    ? (variant === 'center'
        ? 'linear-gradient(90deg, transparent, rgba(192,169,130,0.6), transparent)'
        : 'linear-gradient(90deg, rgba(192,169,130,0.8), transparent)')
    : (variant === 'center'
        ? 'linear-gradient(90deg, transparent, var(--color-terra-300), transparent)'
        : 'var(--grad-line)');

  return (
    <div
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: '1px',
        background: grad,
        transformOrigin: 'left',
        margin: variant === 'center' ? '0 auto' : undefined,
        ...style,
      }}
      {...rest}
    />
  );
}
