import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonTone = 'dark' | 'light';

/**
 * @startingPoint section="Actions" subtitle="Primary & secondary buttons" viewport="700x300"
 */
export interface ButtonProps extends Omit<React.HTMLAttributes<HTMLElement>, 'style'> {
  /** Button label / content. */
  children?: React.ReactNode;
  /** Visual weight. `primary` = terracotta gradient; `secondary` = outline; `ghost` = text-only. @default "primary" */
  variant?: ButtonVariant;
  /** @default "md" */
  size?: ButtonSize;
  /** Surface the button sits on. `dark` tunes outline/ghost for dark hero sections; `light` for sand backgrounds. @default "dark" */
  tone?: ButtonTone;
  /** Optional icon node (e.g. a lucide icon). */
  icon?: React.ReactNode;
  /** @default "left" */
  iconPosition?: 'left' | 'right';
  /** Render as an anchor instead of a button. */
  href?: string;
  onClick?: React.MouseEventHandler;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

/**
 * The brand's call to action: uppercase, letter-spaced sans label on a soft
 * terracotta gradient, lifting gently on hover. Use outline/ghost for secondary actions.
 *
 * @startingPoint section="Actions" subtitle="Primary & secondary buttons" viewport="700x200"
 */
export function Button(props: ButtonProps): React.JSX.Element;
