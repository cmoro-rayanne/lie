import '../../init';
import '../../_ds_bundle.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ResetPasswordPage } from './ResetPasswordPage';

const TOKEN = 'token-de-teste-com-32-bytes-base64url';
const NEW_PASSWORD = 'senha12345';
const INVALID_MESSAGE = 'Este link não é mais válido. Solicite um novo';

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function stubFetch(response: () => Response) {
  const fetchMock = vi.fn(async () => response());
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function submitPassword(password: string) {
  fireEvent.change(screen.getByLabelText('Nova senha'), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: 'Redefinir senha' }));
}

beforeEach(() => {
  window.history.replaceState(null, '', `/admin/redefinir-senha?token=${TOKEN}`);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ResetPasswordPage (/admin/redefinir-senha)', () => {
  it('após carregar, a URL não contém mais o token', () => {
    stubFetch(() => json({ ok: true }, 200));

    render(<ResetPasswordPage />);

    expect(window.location.search).not.toContain('token');
    expect(window.location.href).not.toContain(TOKEN);
    expect(window.location.pathname).toBe('/admin/redefinir-senha');
  });

  it('o POST envia o token no corpo, não na URL da requisição', async () => {
    const fetchMock = stubFetch(() => json({ ok: true }, 200));
    render(<ResetPasswordPage />);

    submitPassword(NEW_PASSWORD);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('/api/admin/reset-password');
    expect(url).not.toContain(TOKEN);
    expect(JSON.parse(init.body as string)).toEqual({ token: TOKEN, password: NEW_PASSWORD });
  });

  it('sucesso mostra confirmação e link para /admin/entrar', async () => {
    stubFetch(() => json({ ok: true }, 200));
    render(<ResetPasswordPage />);

    submitPassword(NEW_PASSWORD);

    expect(await screen.findByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/admin/entrar');
  });

  it('erro 410 mostra "Este link não é mais válido. Solicite um novo" com link para /admin/esqueci-senha', async () => {
    stubFetch(() => json({ message: INVALID_MESSAGE }, 410));
    render(<ResetPasswordPage />);

    submitPassword(NEW_PASSWORD);

    expect(await screen.findByText(INVALID_MESSAGE)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Solicitar novo link' })).toHaveAttribute(
      'href',
      '/admin/esqueci-senha',
    );
  });

  it('senha fraca mostra erro no campo, não chama a API e mantém o formulário', async () => {
    const fetchMock = stubFetch(() => json({ ok: true }, 200));
    render(<ResetPasswordPage />);

    submitPassword('curta1');

    expect(
      await screen.findByText('A senha deve ter pelo menos 10 caracteres'),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText('Nova senha')).toBeInTheDocument();
  });
});
