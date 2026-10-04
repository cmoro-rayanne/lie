import { useEffect, useState, type ChangeEvent, type CSSProperties, type FormEvent } from 'react';
import { api, ApiError } from '../api';
import { useAuth } from '../auth';
import { navigate } from '../router';

const shell: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--bg-page)',
  padding: '0 var(--gutter)',
};

const card: CSSProperties = {
  width: '100%',
  maxWidth: 400,
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  padding: 'clamp(28px,5vw,40px)',
  background: 'var(--color-sand-50)',
  border: '1px solid var(--border-soft)',
  borderRadius: 'var(--radius-lg)',
};

const linkStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: '0.8rem',
  color: 'var(--color-terra-600)',
  textDecoration: 'none',
};

function loginErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'E-mail ou senha incorretos';
    if (error.status === 429) return 'Muitas tentativas. Tente novamente em 15 minutos';
    if (error.status === 503) return 'Serviço temporariamente indisponível';
    return error.message;
  }
  return 'Não foi possível entrar. Verifique sua conexão e tente de novo.';
}

export function LoginPage() {
  const { Input, Button } = window.ElianaLinoDesignSystem_6994f2;
  const { status, refresh } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === 'in') navigate('/admin', { replace: true });
  }, [status]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post('/api/admin/login', { email, password });
      await refresh();
      navigate('/admin');
    } catch (err) {
      setError(loginErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <main style={shell}>
      <form onSubmit={submit} noValidate style={card} aria-labelledby="login-title">
        <h1
          id="login-title"
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontSize: '2rem',
            color: 'var(--text-strong)',
            margin: 0,
          }}
        >
          Entrar no painel
        </h1>
        <Input
          id="login-email"
          type="email"
          label="E-mail"
          autoComplete="email"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
        <Input
          id="login-password"
          type="password"
          label="Senha"
          autoComplete="current-password"
          value={password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
        {error && (
          <p role="alert" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--error)', margin: 0 }}>
            {error}
          </p>
        )}
        <Button type="submit" variant="primary" size="lg" tone="light" fullWidth disabled={submitting}>
          Entrar
        </Button>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <a href="/admin/esqueci-senha" style={linkStyle}>
            Esqueci minha senha
          </a>
          <a href="/admin/cadastro" style={linkStyle}>
            Criar conta com código de convite
          </a>
        </div>
      </form>
    </main>
  );
}
