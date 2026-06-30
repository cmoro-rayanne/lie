import React from 'react';

/**
 * @startingPoint section="Content" subtitle="Hoverable content card" viewport="700x340"
 */
export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  children?: React.ReactNode;
  /** Show the terracotta→olive accent bar that fades in on hover. @default true */
  accentBar?: boolean;
  /** Enable hover lift + border warm-up. Set false for static content panels. @default true */
  interactive?: boolean;
  /** CSS padding. @default "40px 32px" */
  padding?: string;
  style?: React.CSSProperties;
}

/**
 * The brand's signature surface — sand ground, hairline border that warms to
 * terracotta and lifts on hover, with a thin gradient accent bar up top.
 * Compose service/area content, icon + title + description + tags inside.
 *
 * @startingPoint section="Content" subtitle="Hoverable content card" viewport="700x260"
 */
export function Card(props: CardProps): React.JSX.Element;
