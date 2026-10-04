import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { api } from './api';

export interface SessionUser {
  name: string;
  email: string;
}

export type AuthStatus = 'loading' | 'in' | 'out';

interface AuthState {
  user: SessionUser | null;
  status: AuthStatus;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

// Sem sessão válida (401 ou qualquer falha) devolve null.
async function loadSession(): Promise<SessionUser | null> {
  try {
    const me = await api.get<SessionUser>('/api/admin/me');
    return { name: me.name, email: me.email };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>('loading');

  const refresh = useCallback(async () => {
    const session = await loadSession();
    setUser(session);
    setStatus(session ? 'in' : 'out');
  }, []);

  const logout = useCallback(async () => {
    await api.post('/api/admin/logout', {}).catch(() => undefined);
    setUser(null);
    setStatus('out');
  }, []);

  useEffect(() => {
    let active = true;
    void loadSession().then((session) => {
      if (!active) return;
      setUser(session);
      setStatus(session ? 'in' : 'out');
    });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(() => ({ user, status, refresh, logout }), [user, status, refresh, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// O hook fica junto do provedor, como manda o design (src/admin/auth.tsx).
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthState {
  const value = useContext(AuthContext);
  if (value === null) throw new Error('useAuth precisa estar dentro de AuthProvider');
  return value;
}
