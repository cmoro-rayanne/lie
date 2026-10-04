import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from './auth';
import { ProtectedRoute } from './ProtectedRoute';

const SECRET = 'Conteúdo exclusivo do painel';

function stubMe(handler: () => Response | Promise<Response>) {
  vi.stubGlobal('fetch', vi.fn(async () => handler()));
}

function renderProtected() {
  return render(
    <AuthProvider>
      <ProtectedRoute>
        <p>{SECRET}</p>
      </ProtectedRoute>
    </AuthProvider>,
  );
}

beforeEach(() => {
  window.history.replaceState(null, '', '/admin');
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ProtectedRoute', () => {
  it('com status loading, nenhum texto dos filhos aparece no DOM', () => {
    // /api/admin/me nunca responde: o status fica em loading.
    stubMe(() => new Promise<Response>(() => undefined));

    renderProtected();

    expect(screen.queryByText(SECRET)).toBeNull();
  });

  it('com status out, navega para /admin/entrar e não renderiza os filhos', async () => {
    stubMe(
      () =>
        new Response(JSON.stringify({ message: 'Sessão inexistente ou expirada' }), {
          status: 401,
        }),
    );

    renderProtected();

    await waitFor(() => expect(window.location.pathname).toBe('/admin/entrar'));
    expect(screen.queryByText(SECRET)).toBeNull();
  });

  it('com status in, renderiza os filhos', async () => {
    stubMe(
      () =>
        new Response(JSON.stringify({ name: 'Eliana Lino', email: 'eliana@exemplo.com' }), {
          status: 200,
        }),
    );

    renderProtected();

    expect(await screen.findByText(SECRET)).toBeInTheDocument();
    expect(window.location.pathname).toBe('/admin');
  });
});
