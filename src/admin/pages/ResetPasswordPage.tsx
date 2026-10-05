import {
  useEffect,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from 'react';
import { api, ApiError } from '../api';
import { passwordRule } from '../../../server/validation';

const FALLBACK_MESSAGE = 'Não foi possível redefinir a senha agora. Tente novamente.';
const INVALID_MESSAGE = 'Este link não é mais válido. Solicite um novo';

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

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-serif)',
  fontWeight: 400,
  fontSize: '2rem',
  color: 'var(--text-strong)',
  margin: 0,
};

const textStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: '0.9rem',
  fontWeight: 300,
  lineHeight: 1.7,
  color: 'var(--text-body)',
  margin: 0,
};

const linkStyle: CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: '0.8rem',
  color: 'var(--color-terra-600)',
  textDecoration: 'none',
};

export function ResetPasswordPage() {
  const { Input, Button } = window.ElianaLinoDesignSystem_6994f2;
  // O token vem no fragmento (#token=...), que não é enviado ao servidor nem costuma entrar em logs.
  // É lido uma vez, na montagem, e a URL é limpa logo depois.
  const [token] = useState<string | null>(() => new URLSearchParams(window.location.hash.slice(1)).get('token'));
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [linkInvalid, setLinkInvalid] = useState(token === null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.history.replaceState(null, '', window.location.pathname);
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGeneralError(null);
    if (token === null) {
      setLinkInvalid(true);
      return;
    }

    const check = passwordRule.safeParse(password);
    if (!check.success) {
      setPasswordError(check.error.issues[0].message);
      return;
    }

    setPasswordError(undefined);
    setSubmitting(true);
    try {
      await api.post('/api/admin/reset-password', { token, password });
      setDone(true);
    } catch (error) {
      if (error instanceof ApiError && error.status === 410) {
        setLinkInvalid(true);
      } else if (error instanceof ApiError && error.field === 'password') {
        setPasswordError(error.message);
      } else {
        setGeneralError(error instanceof ApiError ? error.message : FALLBACK_MESSAGE);
      }
    } finally {
      setSubmitting(false);
    }
  };

  let content: ReactNode;
  if (done) {
    content = (
      <>
        <p role="status" style={textStyle}>
          Sua senha foi redefinida. Agora você já pode entrar com a nova senha.
        </p>
        <a href="/admin/entrar" style={linkStyle}>
          Entrar
        </a>
      </>
    );
  } else if (linkInvalid) {
    content = (
      <>
        <p role="alert" style={{ ...textStyle, color: 'var(--error)' }}>
          {INVALID_MESSAGE}
        </p>
        <a href="/admin/esqueci-senha" style={linkStyle}>
          Solicitar novo link
        </a>
      </>
    );
  } else {
    content = (
      <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <p style={textStyle}>Escolha uma nova senha com pelo menos 10 caracteres, com letra e número.</p>
        <Input
          id="reset-password"
          type="password"
          label="Nova senha"
          autoComplete="new-password"
          value={password}
          error={passwordError}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
        {generalError && (
          <p role="alert" style={{ ...textStyle, color: 'var(--error)' }}>
            {generalError}
          </p>
        )}
        <Button type="submit" variant="primary" size="lg" tone="light" fullWidth disabled={submitting}>
          Redefinir senha
        </Button>
      </form>
    );
  }

  return (
    <main style={shell}>
      <div style={card}>
        <h1 style={titleStyle}>Redefinir senha</h1>
        {content}
      </div>
    </main>
  );
}
