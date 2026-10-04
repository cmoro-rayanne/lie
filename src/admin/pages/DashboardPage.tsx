import type { CSSProperties } from 'react';
import { AdminLayout } from '../AdminLayout';
import { ProtectedRoute } from '../ProtectedRoute';

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-serif)',
  fontWeight: 400,
  fontSize: 'clamp(2rem,4vw,2.6rem)',
  color: 'var(--text-strong)',
  margin: '0 0 16px',
};

const textStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: '0.95rem',
  fontWeight: 300,
  lineHeight: 1.7,
  color: 'var(--text-body)',
  margin: 0,
};

export function DashboardPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <h1 style={titleStyle}>Painel administrativo</h1>
        <p style={textStyle}>A edição do conteúdo do site chega em uma próxima etapa.</p>
      </AdminLayout>
    </ProtectedRoute>
  );
}
