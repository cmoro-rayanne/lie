import '../init';
import '../_ds_bundle.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AdminApp from './AdminApp';

function stubSemSessao() {
  vi.stubGlobal(
    'fetch',
    vi.fn(
      async () =>
        new Response(JSON.stringify({ message: 'Sessão inexistente ou expirada' }), {
          status: 401,
          headers: { 'content-type': 'application/json; charset=utf-8' },
        }),
    ),
  );
}

beforeEach(() => {
  stubSemSessao();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AdminApp', () => {
  it('em /admin/entrar renderiza a tela de login', async () => {
    window.history.replaceState(null, '', '/admin/entrar');

    render(<AdminApp />);

    expect(await screen.findByRole('heading', { name: 'Entrar no painel' })).toBeInTheDocument();
  });

  it('em /admin sem sessão redireciona para /admin/entrar', async () => {
    window.history.replaceState(null, '', '/admin');

    render(<AdminApp />);

    await waitFor(() => expect(window.location.pathname).toBe('/admin/entrar'));
    expect(await screen.findByRole('heading', { name: 'Entrar no painel' })).toBeInTheDocument();
  });
});
