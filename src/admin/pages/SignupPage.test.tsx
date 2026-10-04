import '../../init';
import '../../_ds_bundle.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../auth';
import { SignupPage } from './SignupPage';

const NAME = 'Eliana Lino';
const EMAIL = 'eliana@exemplo.com';
const PASSWORD = 'senha12345';
const INVITE = 'codigo-de-convite-secreto';

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

// API falsa: o cadastro bem-sucedido liga a sessão, e o /me passa a responder 200.
function stubApi(signupResponse: () => Response) {
  let loggedIn = false;
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    if (url === '/api/admin/me' && init?.method !== 'POST') {
      return loggedIn
        ? json({ name: NAME, email: EMAIL }, 200)
        : json({ message: 'Sessão inexistente ou expirada' }, 401);
    }
    if (url === '/api/admin/signup' && init?.method === 'POST') {
      const response = signupResponse();
      if (response.status === 201) loggedIn = true;
      return response;
    }
    throw new Error(`rota não mockada: ${init?.method ?? 'GET'} ${url}`);
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function renderSignup() {
  return render(
    <AuthProvider>
      <SignupPage />
    </AuthProvider>,
  );
}

function fillForm(overrides: Partial<Record<'name' | 'email' | 'password' | 'invite', string>> = {}) {
  const values = {
    name: NAME,
    email: EMAIL,
    password: PASSWORD,
    invite: INVITE,
    ...overrides,
  };
  fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: values.name } });
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: values.email } });
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: values.password } });
  fireEvent.change(screen.getByLabelText('Código de convite'), { target: { value: values.invite } });
  fireEvent.click(screen.getByRole('button', { name: 'Criar conta' }));
}

// O erro aparece dentro do wrapper do próprio campo (o Input do DS renderiza label, campo e erro juntos).
function fieldWrapper(label: string) {
  return screen.getByLabelText(label).parentElement as HTMLElement;
}

beforeEach(() => {
  window.history.replaceState(null, '', '/admin/cadastro');
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('SignupPage (/admin/cadastro)', () => {
  it('erro com field password aparece no campo de senha', async () => {
    stubApi(() =>
      json({ message: 'A senha deve conter letra e número', field: 'password' }, 400),
    );
    renderSignup();

    fillForm();

    await waitFor(() =>
      expect(fieldWrapper('Senha')).toHaveTextContent('A senha deve conter letra e número'),
    );
  });

  it('erro 403 aparece no campo de código de convite', async () => {
    stubApi(() => json({ message: 'Código de convite inválido', field: 'inviteCode' }, 403));
    renderSignup();

    fillForm({ invite: 'errado' });

    await waitFor(() =>
      expect(fieldWrapper('Código de convite')).toHaveTextContent('Código de convite inválido'),
    );
  });

  it('erro 409 mostra "Já existe uma conta com este e-mail"', async () => {
    stubApi(() => json({ message: 'Já existe uma conta com este e-mail' }, 409));
    renderSignup();

    fillForm();

    expect(await screen.findByText('Já existe uma conta com este e-mail')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/admin/cadastro');
  });

  it('sucesso (201) navega para /admin', async () => {
    const fetchMock = stubApi(() => json({ name: NAME, email: EMAIL }, 201));
    renderSignup();

    fillForm();

    await waitFor(() => expect(window.location.pathname).toBe('/admin'));
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/signup',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
