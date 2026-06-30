import React from 'react';

export interface TagProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'style'> {
  children?: React.ReactNode;
  /** Color family. @default "olive" */
  tone?: 'olive' | 'terra' | 'sand';
  style?: React.CSSProperties;
}

/**
 * A small uppercase pill for topics / therapy modalities. Olive is the default
 * grounding accent; terra and sand are quiet alternatives. Group with flex + gap.
 */
export function Tag(props: TagProps): React.JSX.Element;
