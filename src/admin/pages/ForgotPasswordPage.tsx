import { useState, type ChangeEvent, type CSSProperties, type FormEvent } from 'react';
import { api, ApiError } from '../api';
import { forgotSchema } from '../../../server/validation';

const SUCCESS_MESSAGE = 'Se o e-mail estiver cadastrado, você receberá um link em instantes';
const FALLBACK_MESSAGE = 'Não foi possível enviar agora. Tente novamente.';

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

export function ForgotPasswordPage() {
  const { Input, Button } = window.ElianaLinoDesignSystem_6994f2;
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGeneralError(null);

    const check = forgotSchema.safeParse({ email });
    if (!check.success) {
      setEmailError(check.error.issues[0].message);
      return;
    }

    setEmailError(undefined);
    setSubmitting(true);
    try {
      await api.post('/api/admin/forgot-password', { email });
      setSent(true);
    } catch (error) {
      setGeneralError(error instanceof ApiError ? error.message : FALLBACK_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main style={shell}>
      <div style={card}>
        <h1 style={titleStyle}>Esqueci minha senha</h1>
        {sent ? (
          <>
            <p role="status" style={textStyle}>
              {SUCCESS_MESSAGE}
            </p>
            <a href="/admin/entrar" style={linkStyle}>
              Voltar para o login
            </a>
          </>
        ) : (
          <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <p style={textStyle}>Informe o e-mail da conta. Enviaremos um link para criar uma nova senha.</p>
            <Input
              id="forgot-email"
              type="email"
              label="E-mail"
              autoComplete="email"
              value={email}
              error={emailError}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            />
            {generalError && (
              <p role="alert" style={{ ...textStyle, color: 'var(--error)' }}>
                {generalError}
              </p>
            )}
            <Button type="submit" variant="primary" size="lg" tone="light" fullWidth disabled={submitting}>
              Enviar link
            </Button>
            <a href="/admin/entrar" style={linkStyle}>
              Voltar para o login
            </a>
          </form>
        )}
      </div>
    </main>
  );
}
