import { useEffect, type ReactNode } from 'react';
import { AuthProvider } from './auth';
import { navigate, usePathname } from './router';
import { DashboardPage } from './pages/DashboardPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { LoginPage } from './pages/LoginPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { SignupPage } from './pages/SignupPage';

const SCREENS: Record<string, () => ReactNode> = {
  '/admin': () => <DashboardPage />,
  '/admin/entrar': () => <LoginPage />,
  '/admin/cadastro': () => <SignupPage />,
  '/admin/esqueci-senha': () => <ForgotPasswordPage />,
  '/admin/redefinir-senha': () => <ResetPasswordPage />,
};

function Screen() {
  const pathname = usePathname();
  const known = Object.prototype.hasOwnProperty.call(SCREENS, pathname);

  useEffect(() => {
    if (!known) navigate('/admin', { replace: true });
  }, [known]);

  if (!known) return null;
  return SCREENS[pathname]();
}

// Raiz do painel, carregada sob demanda pelo main.tsx somente em /admin.
export default function AdminApp() {
  return (
    <AuthProvider>
      <Screen />
    </AuthProvider>
  );
}
