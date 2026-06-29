import React, { useState } from 'react';

export interface InputOption {
  value: string;
  label: string;
}

export interface InputProps extends Omit<React.AllHTMLAttributes<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, 'size'> {
  as?: 'input' | 'textarea' | 'select';
  label?: string;
  error?: string;
  options?: InputOption[];
}

export function Input({
  as = 'input',
  label,
  error,
  id,
  options = [],
  style = {},
  children,
  ...rest
}: InputProps) {
  const [focus, setFocus] = useState(false);

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 18px',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9rem',
    fontWeight: 300,
    color: 'var(--text-strong)',
    background: 'var(--color-sand-50)',
    border: `1px solid ${error ? 'var(--error)' : (focus ? 'var(--color-terra-400)' : 'var(--border-soft)')}`,
    borderRadius: 'var(--radius-sm)',
    outline: 'none',
    boxShadow: focus ? '0 0 0 3px rgba(192,140,80,0.1)' : 'none',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
    ...(as === 'textarea' ? { resize: 'vertical', lineHeight: 1.6 } : {}),
    ...(as === 'select' ? { color: 'var(--text-body)', appearance: 'none', cursor: 'pointer' } : {}),
    ...style,
  };

  const focusProps = {
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
  };

  let field;
  if (as === 'textarea') {
    field = <textarea id={id} style={fieldStyle} {...focusProps} {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} />;
  } else if (as === 'select') {
    field = (
      <select id={id} style={fieldStyle} {...focusProps} {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}>
        {children || options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    );
  } else {
    field = <input id={id} style={fieldStyle} {...focusProps} {...(rest as React.InputHTMLAttributes<HTMLInputElement>)} />;
  }

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label htmlFor={id} style={{
          display: 'block',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.72rem',
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          marginBottom: '8px',
        }}>
          {label}
        </label>
      )}
      {field}
      {error && (
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.72rem', color: 'var(--error)', marginTop: '6px' }}>
          {error}
        </p>
      )}
    </div>
  );
}
