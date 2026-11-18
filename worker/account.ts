import { safeCompare } from './auth';
import { hashPassword, passwordProblem, randomToken, sha256Hex, verifyPassword } from './password';
import type { AccountRepo, Mailer } from './ports';

export const RESET_MINUTES = 30;

/**
 * Como a senha é conferida: pelo secret `ADMIN_PASSWORD` até alguém definir uma senha no painel
 * (ou redefinir por e-mail); daí em diante, pela senha guardada no banco.
 */
export type Credential =
  { kind: 'secret'; password: string } | { kind: 'stored'; hash: string; salt: string };

/** Segredo que assina a sessão: muda quando a senha muda, encerrando as sessões abertas. */
export const sessionSecret = (c: Credential) => (c.kind === 'stored' ? c.hash : c.password);

export async function checkPassword(c: Credential, given: string): Promise<boolean> {
  if (c.kind === 'stored') return verifyPassword(given, c.hash, c.salt);
  return c.password !== '' && safeCompare(given, c.password);
}

export interface AccountView {
  nome: string;
  email: string;
  /** false = ainda vale a senha inicial (secret). */
  senhaPropria: boolean;
  /** false = envio de e-mail não configurado; "esqueci minha senha" não funciona. */
  envioDeEmail: boolean;
}

export type AccountResult = { ok: true } | { ok: false; kind: 'invalido' | 'senha'; error: string };

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WRONG_PASSWORD = 'A senha atual não confere.';

export class AccountService {
  constructor(
    private readonly repo: AccountRepo,
    private readonly mailer: Mailer,
    private readonly secretPassword: string,
    private readonly now: () => number = () => Date.now(),
  ) {}

  async credential(): Promise<Credential> {
    const row = await this.repo.get();
    return row?.passwordHash && row.passwordSalt
      ? { kind: 'stored', hash: row.passwordHash, salt: row.passwordSalt }
      : { kind: 'secret', password: this.secretPassword };
  }

  async view(): Promise<AccountView> {
    const row = await this.repo.get();
    return {
      nome: row?.name ?? '',
      email: row?.email ?? '',
      senhaPropria: Boolean(row?.passwordHash),
      envioDeEmail: this.mailer.configured,
    };
  }

  /** Trocar o e-mail de recuperação exige a senha atual: é ele que permite redefinir a senha. */
  async updateProfile(input: {
    nome?: unknown;
    email?: unknown;
    senhaAtual?: unknown;
  }): Promise<AccountResult> {
    const name = typeof input.nome === 'string' ? input.nome.trim() : '';
    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
    if (name.length > 80) return invalid('O nome pode ter no máximo 80 caracteres.');
    if (email && (email.length > 120 || !EMAIL.test(email)))
      return invalid('Confira o e-mail: o formato não parece válido.');
    const row = await this.repo.get();
    if (email !== (row?.email ?? '')) {
      const given = typeof input.senhaAtual === 'string' ? input.senhaAtual : '';
      if (!given) {
        return invalid('Para mudar o e-mail de recuperação, informe a senha atual.');
      }
      if (!(await checkPassword(await this.credential(), given))) {
        return { ok: false, kind: 'senha', error: WRONG_PASSWORD };
      }
    }
    await this.repo.saveProfile(name, email || null, this.now());
    return { ok: true };
  }

  async changePassword(input: {
    senhaAtual?: unknown;
    senhaNova?: unknown;
  }): Promise<AccountResult> {
    const given = typeof input.senhaAtual === 'string' ? input.senhaAtual : '';
    if (!(await checkPassword(await this.credential(), given)))
      return { ok: false, kind: 'senha', error: WRONG_PASSWORD };
    const problem = passwordProblem(input.senhaNova);
    if (problem) return invalid(problem);
    const { hash, salt } = await hashPassword(input.senhaNova as string);
    await this.repo.savePassword(hash, salt, this.now());
    return { ok: true };
  }

  /**
   * Envia o link de redefinição se o e-mail for o cadastrado. Não diz se era ou não:
   * quem chama responde sempre a mesma mensagem.
   */
  async requestReset(email: unknown, origin: string): Promise<void> {
    const given = typeof email === 'string' ? email.trim().toLowerCase() : '';
    const row = await this.repo.get();
    if (!given || !row?.email || !this.mailer.configured) return;
    if (!(await safeCompare(given, row.email))) return;
    const token = randomToken();
    const now = this.now();
    await this.repo.createReset(await sha256Hex(token), now + RESET_MINUTES * 60_000);
    const link = `${origin}/admin/#redefinir=${token}`;
    await this.mailer.send({
      to: row.email,
      subject: 'Redefinição de senha do painel · Ilê',
      text: [
        row.name ? `Olá, ${row.name}.` : 'Olá.',
        '',
        'Recebemos um pedido para redefinir a senha do painel do site.',
        `Abra o link abaixo para escolher uma senha nova. Ele vale por ${RESET_MINUTES} minutos e só pode ser usado uma vez.`,
        '',
        link,
        '',
        'Se não foi você quem pediu, ignore este e-mail: a senha continua a mesma.',
      ].join('\n'),
    });
  }

  async resetPassword(token: unknown, password: unknown): Promise<AccountResult> {
    const problem = passwordProblem(password);
    if (problem) return invalid(problem);
    const valid = typeof token === 'string' && /^[a-f0-9]{64}$/.test(token);
    if (!valid || !(await this.repo.consumeReset(await sha256Hex(token), this.now()))) {
      return {
        ok: false,
        kind: 'senha',
        error: 'Este link não vale mais. Peça um novo em “Esqueci minha senha”.',
      };
    }
    const { hash, salt } = await hashPassword(password as string);
    await this.repo.savePassword(hash, salt, this.now());
    return { ok: true };
  }
}

function invalid(error: string): AccountResult {
  return { ok: false, kind: 'invalido', error };
}
