import React from 'react';

export interface AvatarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** Initials shown when no image is provided, e.g. "MS". */
  initials?: string;
  /** Optional photo URL — fills the circle, cover-cropped. */
  src?: string;
  alt?: string;
  /** Diameter in px. @default 48 */
  size?: number;
  style?: React.CSSProperties;
}

/**
 * A terracotta gradient circle holding initials, or a cover-cropped photo.
 * Pairs with a name + role beside testimonials and contact identities.
 */
export function Avatar(props: AvatarProps): React.JSX.Element;
