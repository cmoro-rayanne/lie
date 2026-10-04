import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { navigate, usePathname } from './router';

beforeEach(() => {
  window.history.replaceState(null, '', '/');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('roteador mínimo do painel', () => {
  it('navigate atualiza window.location.pathname e o valor de usePathname', () => {
    const { result } = renderHook(() => usePathname());

    act(() => navigate('/admin/entrar'));

    expect(window.location.pathname).toBe('/admin/entrar');
    expect(result.current).toBe('/admin/entrar');
  });

  it('navigate sem replace empilha entrada com pushState', () => {
    const push = vi.spyOn(window.history, 'pushState');
    const replace = vi.spyOn(window.history, 'replaceState');

    act(() => navigate('/admin'));

    expect(push).toHaveBeenCalledWith(null, '', '/admin');
    expect(replace).not.toHaveBeenCalled();
  });

  it('navigate com replace: true usa replaceState e não empilha entrada', () => {
    const push = vi.spyOn(window.history, 'pushState');
    const replace = vi.spyOn(window.history, 'replaceState');

    act(() => navigate('/admin/entrar', { replace: true }));

    expect(replace).toHaveBeenCalledWith(null, '', '/admin/entrar');
    expect(push).not.toHaveBeenCalled();
    expect(window.location.pathname).toBe('/admin/entrar');
  });

  it('evento popstate atualiza o valor retornado por usePathname', () => {
    const { result } = renderHook(() => usePathname());

    act(() => {
      window.history.pushState(null, '', '/admin/cadastro');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(result.current).toBe('/admin/cadastro');
  });
});
