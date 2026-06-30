import React from 'react';

export interface SectionHeadingProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Small uppercase eyebrow above the title, e.g. "Sobre mim". */
  eyebrow?: React.ReactNode;
  /** The serif headline. Wrap a word in a terracotta italic <em> for emphasis. */
  children?: React.ReactNode;
  /** Optional lead line below the title. */
  lead?: React.ReactNode;
  /** @default "left" */
  align?: 'left' | 'center';
  /** "dark" recolors eyebrow/title for dark sections. @default "light" */
  tone?: 'light' | 'dark';
  style?: React.CSSProperties;
}

/**
 * The consistent header used atop every section: terracotta eyebrow, thin serif
 * headline with optional italic-terracotta emphasis, and an optional lead line.
 */
export function SectionHeading(props: SectionHeadingProps): React.JSX.Element;
