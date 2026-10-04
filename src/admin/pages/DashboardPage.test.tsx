import '../../init';
import '../../_ds_bundle.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from '../auth';
import { DashboardPage } from './DashboardPage';

const NAME = 'Eliana Lino';
const EMAIL = 'eliana@exemplo.com';
const PANEL_TITLE = 'Painel administrativo';

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function stubApi(meStatus: 200 | 401) {
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    if (url === '/api/admin/me') {
      return meStatus === 200
        ? json({ name: NAME, email: EMAIL }, 200)
        : json({ message: 'Sessão inexistente ou expirada' }, 401);
    }
    if (url === '/api/admin/logout' && init?.method === 'POST') {
      return json({ ok: true }, 200);
    }
    throw new Error(`rota não mockada: ${init?.method ?? 'GET'} ${url}`);
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function renderDashboard() {
  return render(
    <AuthProvider>
      <DashboardPage />
    </AuthProvider>,
  );
}

beforeEach(() => {
  window.history.replaceState(null, '', '/admin');
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('DashboardPage (/admin)', () => {
  it('cabeçalho mostra nome e e-mail do usuário', async () => {
    stubApi(200);
    renderDashboard();

    expect(await screen.findByText(NAME)).toBeInTheDocument();
    expect(screen.getByText(EMAIL)).toBeInTheDocument();
    expect(screen.getByText(PANEL_TITLE)).toBeInTheDocument();
  });

  it('botão Sair chama logout e navega para /admin/entrar', async () => {
    const fetchMock = stubApi(200);
    renderDashboard();

    fireEvent.click(await screen.findByRole('button', { name: 'Sair' }));

    await waitFor(() => expect(window.location.pathname).toBe('/admin/entrar'));
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/logout',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('sem sessão, não renderiza o conteúdo do painel', async () => {
    stubApi(401);
    renderDashboard();

    await waitFor(() => expect(window.location.pathname).toBe('/admin/entrar'));
    expect(screen.queryByText(PANEL_TITLE)).toBeNull();
    expect(screen.queryByText(NAME)).toBeNull();
    expect(screen.queryByRole('button', { name: 'Sair' })).toBeNull();
  });
});
