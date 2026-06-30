import React from 'react';

export interface DividerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** `line` = left-anchored fade under a heading; `center` = short centered fade; `ornament` = full-width rule. @default "line" */
  variant?: 'line' | 'center' | 'ornament';
  /** Width in px (or any CSS length). @default 48 */
  width?: number | string;
  /** "dark" uses the gold rule for dark sections. @default "light" */
  tone?: 'light' | 'dark';
  style?: React.CSSProperties;
}

/**
 * The brand's thin terracotta gradient rule — the small flourish that separates
 * a heading from its body copy. Add the `animate-line-grow` class to grow it in.
 */
export function Divider(props: DividerProps): React.JSX.Element;
