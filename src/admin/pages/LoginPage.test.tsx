import '../../init';
import '../../_ds_bundle.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../auth';
import { LoginPage } from './LoginPage';

const EMAIL = 'eliana@exemplo.com';
const PASSWORD = 'senha12345';

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

// API falsa com sessão real: o login liga a sessão, o /me passa a responder 200.
function stubApi(loginResponse: () => Response = () => json({ name: 'Eliana Lino', email: EMAIL }, 200)) {
  let loggedIn = false;
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    if (url === '/api/admin/me' && init?.method !== 'POST') {
      return loggedIn
        ? json({ name: 'Eliana Lino', email: EMAIL }, 200)
        : json({ message: 'Sessão inexistente ou expirada' }, 401);
    }
    if (url === '/api/admin/login' && init?.method === 'POST') {
      const response = loginResponse();
      if (response.status === 200) loggedIn = true;
      return response;
    }
    throw new Error(`rota não mockada: ${init?.method ?? 'GET'} ${url}`);
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function renderLogin() {
  return render(
    <AuthProvider>
      <LoginPage />
    </AuthProvider>,
  );
}

function fillAndSubmit() {
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: EMAIL } });
  fireEvent.change(screen.getByLabelText('Senha'), { target: { value: PASSWORD } });
  fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));
}

beforeEach(() => {
  window.history.replaceState(null, '', '/admin/entrar');
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('LoginPage (/admin/entrar)', () => {
  it('login com sucesso navega para /admin', async () => {
    const fetchMock = stubApi();
    renderLogin();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/admin/me', expect.anything()));

    fillAndSubmit();

    await waitFor(() => expect(window.location.pathname).toBe('/admin'));
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/login',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('erro 401 mostra "E-mail ou senha incorretos"', async () => {
    stubApi(() => json({ message: 'E-mail ou senha incorretos' }, 401));
    renderLogin();

    fillAndSubmit();

    expect(await screen.findByText('E-mail ou senha incorretos')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/admin/entrar');
  });

  it('erro 429 mostra "Muitas tentativas. Tente novamente em 15 minutos"', async () => {
    stubApi(() =>
      json({ message: 'Muitas tentativas. Tente novamente em 15 minutos' }, 429),
    );
    renderLogin();

    fillAndSubmit();

    expect(
      await screen.findByText('Muitas tentativas. Tente novamente em 15 minutos'),
    ).toBeInTheDocument();
  });

  it('usuário já logado é redirecionado para /admin', async () => {
    window.history.replaceState(null, '', '/admin/entrar');
    const fetchMock = vi.fn(
      async () => json({ name: 'Eliana Lino', email: EMAIL }, 200),
    );
    vi.stubGlobal('fetch', fetchMock);

    renderLogin();

    await waitFor(() => expect(window.location.pathname).toBe('/admin'));
  });
});
