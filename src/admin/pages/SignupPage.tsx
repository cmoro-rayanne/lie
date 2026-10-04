import { useState, type ChangeEvent, type CSSProperties, type FormEvent } from 'react';
import { api, ApiError } from '../api';
import { useAuth } from '../auth';
import { navigate } from '../router';
import { signupSchema } from '../../../server/validation';

type Field = 'name' | 'email' | 'password' | 'inviteCode';
type FieldErrors = Partial<Record<Field, string>>;

const FIELDS: readonly string[] = ['name', 'email', 'password', 'inviteCode'];
const FALLBACK_MESSAGE = 'Não foi possível criar a conta. Tente novamente.';

const shell: CSSProperties = {
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'var(--bg-page)',
  padding: '32px var(--gutter)',
};

const card: CSSProperties = {
  width: '100%',
  maxWidth: 440,
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

function isField(value: unknown): value is Field {
  return typeof value === 'string' && FIELDS.includes(value);
}

function firstErrorPerField(issues: { path: PropertyKey[]; message: string }[]): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (isField(key) && errors[key] === undefined) errors[key] = issue.message;
  }
  return errors;
}

// Mensagem de erro do servidor: 409 vai para o e-mail, campos vindos de `field` vão para o próprio campo.
function signupFailure(error: unknown): { field?: Field; message: string } {
  if (!(error instanceof ApiError)) return { message: FALLBACK_MESSAGE };
  if (error.status === 409) return { field: 'email', message: error.message };
  if (isField(error.field)) return { field: error.field, message: error.message };
  return { message: error.message };
}

export function SignupPage() {
  const { Input, Button } = window.ElianaLinoDesignSystem_6994f2;
  const { refresh } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGeneralError(null);

    const check = signupSchema.safeParse({ name, email, password, inviteCode });
    if (!check.success) {
      setFieldErrors(firstErrorPerField(check.error.issues));
      return;
    }

    setFieldErrors({});
    setSubmitting(true);
    try {
      await api.post('/api/admin/signup', { name, email, password, inviteCode });
      await refresh();
      navigate('/admin');
    } catch (error) {
      const failure = signupFailure(error);
      if (failure.field) {
        setFieldErrors({ [failure.field]: failure.message });
      } else {
        setGeneralError(failure.message);
      }
      setSubmitting(false);
    }
  };

  return (
    <main style={shell}>
      <form onSubmit={submit} noValidate style={card} aria-labelledby="signup-title">
        <h1
          id="signup-title"
          style={{
            fontFamily: 'var(--font-serif)',
            fontWeight: 400,
            fontSize: '2rem',
            color: 'var(--text-strong)',
            margin: 0,
          }}
        >
          Criar conta
        </h1>
        <Input
          id="signup-name"
          label="Nome completo"
          autoComplete="name"
          value={name}
          error={fieldErrors.name}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
        />
        <Input
          id="signup-email"
          type="email"
          label="E-mail"
          autoComplete="email"
          value={email}
          error={fieldErrors.email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
        />
        <Input
          id="signup-password"
          type="password"
          label="Senha"
          autoComplete="new-password"
          value={password}
          error={fieldErrors.password}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
        />
        <Input
          id="signup-invite"
          label="Código de convite"
          autoComplete="off"
          value={inviteCode}
          error={fieldErrors.inviteCode}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInviteCode(e.target.value)}
        />
        {generalError && (
          <p role="alert" style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--error)', margin: 0 }}>
            {generalError}
          </p>
        )}
        <Button type="submit" variant="primary" size="lg" tone="light" fullWidth disabled={submitting}>
          Criar conta
        </Button>
        <a href="/admin/entrar" style={linkStyle}>
          Já tenho conta: entrar
        </a>
      </form>
    </main>
  );
}
