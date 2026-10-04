import { useEffect, type ReactNode } from 'react';
import { useAuth } from './auth';
import { navigate } from './router';

// Renderiza os filhos só com sessão ativa. Sem sessão, leva para o login.
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { status } = useAuth();

  useEffect(() => {
    if (status === 'out') navigate('/admin/entrar', { replace: true });
  }, [status]);

  if (status !== 'in') return null;
  return <>{children}</>;
}
