import '../init';
import '../_ds_bundle.js';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './auth';

type Handler = () => Response;

function stubApi(routes: Record<string, Handler>) {
  const fetchMock = vi.fn(async (url: string, init?: RequestInit) => {
    const key = `${init?.method ?? 'GET'} ${url}`;
    const handler = routes[key];
    if (!handler) throw new Error(`rota não mockada: ${key}`);
    return handler();
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function json(body: unknown, status: number) {
  return () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
}

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('AuthProvider e useAuth', () => {
  it('com /api/admin/me 200, status vira in e expõe user com nome e e-mail', async () => {
    stubApi({
      'GET /api/admin/me': json({ name: 'Eliana Lino', email: 'eliana@exemplo.com' }, 200),
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('in'));
    expect(result.current.user).toEqual({ name: 'Eliana Lino', email: 'eliana@exemplo.com' });
  });

  it('com /api/admin/me 401, status vira out e user fica nulo', async () => {
    stubApi({
      'GET /api/admin/me': json({ message: 'Sessão inexistente ou expirada' }, 401),
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('out'));
    expect(result.current.user).toBeNull();
  });

  it('logout() chama POST /api/admin/logout e muda status para out', async () => {
    const fetchMock = stubApi({
      'GET /api/admin/me': json({ name: 'Eliana Lino', email: 'eliana@exemplo.com' }, 200),
      'POST /api/admin/logout': json({ ok: true }, 200),
    });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('in'));

    await act(() => result.current.logout());

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/logout',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(result.current.status).toBe('out');
    expect(result.current.user).toBeNull();
  });
});
