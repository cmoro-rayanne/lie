import React from 'react';

export interface InputOption { value: string; label: string; }

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'style'> {
  /** Render an `input`, `textarea`, or `select`. @default "input" */
  as?: 'input' | 'textarea' | 'select';
  /** Optional uppercase field label above the control. */
  label?: React.ReactNode;
  /** Validation message shown below; also reddens the border. */
  error?: React.ReactNode;
  /** For `as="select"` — options to render (or pass <option> children). */
  options?: InputOption[];
  rows?: number;
  style?: React.CSSProperties;
}

/**
 * The brand's form field — text input, textarea or select sharing one calm
 * treatment: sand ground, hairline border that warms to terracotta with a soft
 * focus ring. Pass `error` to surface validation.
 */
export function Input(props: InputProps): React.JSX.Element;
