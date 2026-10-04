// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { createMailer } from './mail';

const LINK = 'https://ilelino.example/admin/redefinir-senha?token=TOKEN-DE-TESTE';
const CONFIG = { apiKey: 're_chave_teste', from: 'Ilê <nao-responda@ilelino.example>' };

function setup(status = 200) {
  const fetchMock = vi.fn(async () => new Response('{}', { status }));
  const mailer = createMailer({ ...CONFIG, fetch: fetchMock as unknown as typeof fetch });
  return { fetchMock, mailer };
}

function sentBody(fetchMock: ReturnType<typeof vi.fn>): { to: string[]; from: string; text: string } {
  const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
  return JSON.parse(String(init.body));
}

describe('envio de e-mails transacionais', () => {
  it('sendPasswordReset envia o link de redefinição no corpo (AUTH-21)', async () => {
    const { fetchMock, mailer } = setup();

    await mailer.sendPasswordReset('ana@exemplo.com', 'Ana Souza', LINK);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const body = sentBody(fetchMock);
    expect(body.to).toEqual(['ana@exemplo.com']);
    expect(body.from).toBe(CONFIG.from);
    expect(body.text).toContain(LINK);
  });

  it('usa POST na API do Resend com Bearer RESEND_API_KEY', async () => {
    const { fetchMock, mailer } = setup();

    await mailer.sendPasswordReset('ana@exemplo.com', 'Ana Souza', LINK);

    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer re_chave_teste');
  });

  it('resposta não-2xx faz o envio lançar erro com o status', async () => {
    const { mailer } = setup(422);

    await expect(mailer.sendPasswordReset('ana@exemplo.com', 'Ana Souza', LINK)).rejects.toThrow('422');
  });

  it('sendPasswordChanged não inclui token nem link (AUTH-28)', async () => {
    const { fetchMock, mailer } = setup();

    await mailer.sendPasswordChanged('ana@exemplo.com', 'Ana Souza');

    const body = sentBody(fetchMock);
    expect(body.to).toEqual(['ana@exemplo.com']);
    expect(body.text).not.toContain('token');
    expect(body.text).not.toContain('redefinir-senha');
    expect(body.text).not.toContain('http');
  });

  it('sendPasswordChanged propaga erro de envio para quem chama decidir (AUTH-28)', async () => {
    const { mailer } = setup(500);

    await expect(mailer.sendPasswordChanged('ana@exemplo.com', 'Ana Souza')).rejects.toThrow('500');
  });
});
