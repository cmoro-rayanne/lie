import '../../init';
import '../../_ds_bundle.js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ForgotPasswordPage } from './ForgotPasswordPage';

const SUCCESS_MESSAGE = 'Se o e-mail estiver cadastrado, você receberá um link em instantes';

function stubFetch() {
  const fetchMock = vi.fn(
    async () =>
      new Response(JSON.stringify({ message: SUCCESS_MESSAGE }), {
        status: 200,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      }),
  );
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

function submitEmail(email: string) {
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: email } });
  fireEvent.click(screen.getByRole('button', { name: 'Enviar link' }));
}

beforeEach(() => {
  window.history.replaceState(null, '', '/admin/esqueci-senha');
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('ForgotPasswordPage (/admin/esqueci-senha)', () => {
  it('após envio válido, mostra a mensagem neutra de sucesso', async () => {
    const fetchMock = stubFetch();
    render(<ForgotPasswordPage />);

    submitEmail('eliana@exemplo.com');

    expect(await screen.findByText(SUCCESS_MESSAGE)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/admin/forgot-password',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('e-mail inválido mostra "Informe um e-mail válido" sem chamar a API', async () => {
    const fetchMock = stubFetch();
    render(<ForgotPasswordPage />);

    submitEmail('ana@exemplo');

    expect(await screen.findByText('Informe um e-mail válido')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByText(SUCCESS_MESSAGE)).toBeNull();
  });
});
