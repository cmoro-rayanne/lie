import React from 'react';

export interface StatCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  /** The metric, e.g. "500+", "98%", "8+". Rendered in serif. */
  value: React.ReactNode;
  /** Bold one-line label, e.g. "Clientes atendidos". */
  label: React.ReactNode;
  /** Optional muted second line, e.g. "ao longo da carreira". */
  sub?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * A quiet proof-point row: vertical terracotta→olive accent bar, a large serif
 * number, and a two-line label. Stack a few in a results / credibility block.
 */
export function StatCard(props: StatCardProps): React.JSX.Element;
