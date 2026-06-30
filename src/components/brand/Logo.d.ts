import React from 'react';

export type LogoVariant = 'full' | 'stacked' | 'mark' | 'wordmark' | 'inline';

/**
 * @startingPoint section="Brand" subtitle="Ilê logo — all lockups" viewport="700x420"
 */
export interface LogoProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /**
   * `full` = rings + Ilê + tagline + divider (vertical lockup);
   * `stacked` = rings + Ilê; `mark` = rings only; `wordmark` = Ilê + tagline;
   * `inline` = compact horizontal lockup for nav bars. @default "full"
   */
  variant?: LogoVariant;
  /** Mark width in px; wordmark + tagline scale from it. @default 120 */
  size?: number;
  /** `dark` recolors wordmark/tagline (and tints rings gold) for dark sections. @default "light" */
  tone?: 'light' | 'dark';
  /** Force a single color for the rings (e.g. "#fff" for a one-color reversed mark). */
  mono?: string | null;
  /** Show the "Psicologia e Consciência" tagline. @default true */
  showTagline?: boolean;
  style?: React.CSSProperties;
}

/**
 * The Ilê brand logo — three nested rings (terracotta / olive / sand-gold) over
 * the "Ilê" serif wordmark and "Psicologia e Consciência" tagline. Recreated as
 * crisp vector so it scales and recolors. Use `full` for splashes/footers,
 * `inline` for nav bars, `mark` as a favicon/avatar.
 *
 * @startingPoint section="Brand" subtitle="Ilê logo — all lockups" viewport="700x420"
 */
export function Logo(props: LogoProps): React.JSX.Element;
