import { WorkerMailer } from 'worker-mailer';
import type { MailMessage, Mailer } from './ports';

export interface SmtpConfig {
  host?: string;
  port?: string;
  user?: string;
  pass?: string;
  from?: string;
}

/**
 * Envia pelo servidor de e-mail da hospedagem (SMTP com usuário e senha).
 * Porta 465 usa TLS direto; as demais (587) começam sem e sobem para TLS.
 */
export class SmtpMailer implements Mailer {
  readonly configured: boolean;

  constructor(private readonly cfg: SmtpConfig) {
    this.configured = Boolean(cfg.host && cfg.user && cfg.pass);
  }

  async send(message: MailMessage): Promise<boolean> {
    if (!this.configured) return false;
    const port = Number(this.cfg.port) || 465;
    try {
      await WorkerMailer.send(
        {
          host: this.cfg.host!,
          port,
          secure: port === 465,
          startTls: port !== 465,
          credentials: { username: this.cfg.user!, password: this.cfg.pass! },
          authType: ['plain', 'login'],
        },
        {
          from: { name: 'Painel Ilê', email: this.cfg.from || this.cfg.user! },
          to: message.to,
          subject: message.subject,
          text: message.text,
        },
      );
      return true;
    } catch (e) {
      // Sem dados do destinatário nem da mensagem no log.
      console.error('[painel] envio de e-mail falhou', e instanceof Error ? e.message : e);
      return false;
    }
  }
}
