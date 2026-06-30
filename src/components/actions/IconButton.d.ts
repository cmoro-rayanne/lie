import React from 'react';

export interface IconButtonProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  /** Icon node — a lucide icon at ~18px (sm/md) or 24px (lg). */
  children?: React.ReactNode;
  /** @default "md" — sm=38px (social), md=44px (carousel nav), lg=56px (FAB). */
  size?: 'sm' | 'md' | 'lg';
  /** `outline` = round ring that fills on hover; `soft` = rounded-square tinted chip. @default "outline" */
  variant?: 'outline' | 'soft';
  /** Surface tone — `dark` for footer/hero, `light` for sand sections. @default "light" */
  tone?: 'dark' | 'light';
  /** Required for accessibility — icon-only buttons need a label. */
  'aria-label': string;
  href?: string;
  onClick?: React.MouseEventHandler;
  style?: React.CSSProperties;
}

/**
 * Round (or soft-square) icon-only control for carousel arrows, social links
 * and floating actions. Fills with terracotta on hover.
 */
export function IconButton(props: IconButtonProps): React.JSX.Element;
