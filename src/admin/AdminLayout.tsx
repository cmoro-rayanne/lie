import type { CSSProperties, ReactNode } from 'react';
import { useAuth } from './auth';
import { navigate } from './router';

const header: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  padding: '20px var(--gutter)',
  background: 'var(--color-sand-50)',
  borderBottom: '1px solid var(--border-soft)',
};

// Moldura das telas autenticadas: cabeçalho com a conta e o botão de sair.
export function AdminLayout({ children }: { children: ReactNode }) {
  const { Button } = window.ElianaLinoDesignSystem_6994f2;
  const { user, logout } = useAuth();

  const sair = async () => {
    await logout();
    navigate('/admin/entrar', { replace: true });
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <header style={header}>
        <div>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 500,
              fontSize: '0.95rem',
              color: 'var(--text-strong)',
              margin: 0,
            }}
          >
            {user?.name}
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 300,
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
              margin: 0,
            }}
          >
            {user?.email}
          </p>
        </div>
        <Button variant="secondary" size="sm" tone="light" onClick={sair}>
          Sair
        </Button>
      </header>
      <main style={{ maxWidth: 'var(--container)', margin: '0 auto', padding: 'var(--section-y) var(--gutter)' }}>
        {children}
      </main>
    </div>
  );
}
