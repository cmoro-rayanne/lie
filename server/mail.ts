// SPEC_DEVIATION: design.md lista funções avulsas; aqui `createMailer` recebe chave, remetente e fetch.
// Reason: a chave e o fetch injetável permitem testar o envio sem variáveis de ambiente nem rede.

export interface MailerOptions {
  apiKey: string;
  from: string;
  fetch?: typeof fetch;
}

export interface Mailer {
  /** Lança erro se o Resend não responder 2xx; quem chama decide o que fazer. */
  sendPasswordReset(to: string, name: string, link: string): Promise<void>;
  /** Não inclui token nem link. */
  sendPasswordChanged(to: string, name: string): Promise<void>;
}

const RESEND_URL = 'https://api.resend.com/emails';

export function createMailer({ apiKey, from, fetch: fetchFn = fetch }: MailerOptions): Mailer {
  async function send(to: string, subject: string, text: string): Promise<void> {
    const response = await fetchFn(RESEND_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });
    if (!response.ok) {
      throw new Error(`Falha ao enviar e-mail: Resend respondeu ${response.status}`);
    }
  }

  return {
    sendPasswordReset(to, name, link) {
      const text = [
        `Olá, ${name}.`,
        '',
        'Recebemos um pedido para redefinir a senha do painel da Ilê.',
        `Use o link abaixo para criar uma nova senha. Ele vale por 30 minutos e só pode ser usado uma vez:`,
        '',
        link,
        '',
        'Se você não fez este pedido, pode ignorar este e-mail.',
      ].join('\n');
      return send(to, 'Redefinição de senha · Ilê', text);
    },

    sendPasswordChanged(to, name) {
      const text = [
        `Olá, ${name}.`,
        '',
        'A senha do painel da Ilê foi alterada. Se não foi você, entre em contato com a Ilê imediatamente.',
      ].join('\n');
      return send(to, 'Sua senha foi alterada · Ilê', text);
    },
  };
}
