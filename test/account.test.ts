import { beforeEach, describe, expect, it } from 'vitest';
import { AccountService, RESET_MINUTES, checkPassword, sessionSecret } from '../worker/account';
import { createSession, verifySession } from '../worker/auth';
import { hashPassword, passwordProblem, verifyPassword } from '../worker/password';
import { FakeMailer, MemoryAccount } from './helpers';

const INICIAL = 'senha-inicial-123';
const NOVA = 'outra-senha-456';
const ORIGEM = 'https://elianalino.com.br';

let repo: MemoryAccount;
let mailer: FakeMailer;
let agora: number;
let svc: AccountService;
beforeEach(() => {
  repo = new MemoryAccount();
  mailer = new FakeMailer();
  agora = 1_800_000_000_000;
  svc = new AccountService(repo, mailer, INICIAL, () => agora);
});

const entra = async (senha: string) => checkPassword(await svc.credential(), senha);
const tokenDoEmail = () => /#redefinir=([a-f0-9]{64})/.exec(mailer.sent.at(-1)!.text)![1]!;

describe('senha guardada', () => {
  it('confere a senha certa e recusa a errada, sem guardar a senha em texto', async () => {
    const { hash, salt } = await hashPassword(NOVA);
    expect(hash).not.toContain(NOVA);
    expect(await verifyPassword(NOVA, hash, salt)).toBe(true);
    expect(await verifyPassword(NOVA + 'x', hash, salt)).toBe(false);
    expect((await hashPassword(NOVA)).hash).not.toBe(hash);
  });
  it('exige 10 caracteres, com letras e números', () => {
    expect(passwordProblem('curta1')).toBe('A senha nova precisa ter ao menos 10 caracteres.');
    expect(passwordProblem('somenteletras')).toBe('A senha nova precisa ter letras e números.');
    expect(passwordProblem('12345678901')).toBe('A senha nova precisa ter letras e números.');
    expect(passwordProblem(NOVA)).toBeNull();
    expect(passwordProblem(undefined)).not.toBeNull();
  });
});

describe('senha inicial e troca de senha', () => {
  it('antes de qualquer troca vale a senha do secret', async () => {
    expect(await entra(INICIAL)).toBe(true);
    expect(await entra('errada')).toBe(false);
    expect((await svc.view()).senhaPropria).toBe(false);
  });
  it('sem secret e sem senha guardada ninguém entra', async () => {
    const vazio = new AccountService(repo, mailer, '');
    expect(await checkPassword(await vazio.credential(), '')).toBe(false);
  });
  it('trocar exige a senha atual e uma senha nova válida', async () => {
    expect(await svc.changePassword({ senhaAtual: 'errada', senhaNova: NOVA })).toEqual({
      ok: false,
      kind: 'senha',
      error: 'A senha atual não confere.',
    });
    const fraca = await svc.changePassword({ senhaAtual: INICIAL, senhaNova: 'fraca' });
    expect(fraca.ok).toBe(false);
    expect(await entra(INICIAL)).toBe(true);
  });
  it('depois da troca só a senha nova entra e as sessões antigas caem', async () => {
    const antes = sessionSecret(await svc.credential());
    const sessao = await createSession(antes, 1000);
    expect(await svc.changePassword({ senhaAtual: INICIAL, senhaNova: NOVA })).toEqual({
      ok: true,
    });
    expect(await entra(NOVA)).toBe(true);
    expect(await entra(INICIAL)).toBe(false);
    const depois = sessionSecret(await svc.credential());
    expect(await verifySession(sessao, antes, 1001)).toBe(true);
    expect(await verifySession(sessao, depois, 1001)).toBe(false);
    expect((await svc.view()).senhaPropria).toBe(true);
  });
});

describe('dados da conta', () => {
  it('salva o nome sem pedir senha', async () => {
    expect(await svc.updateProfile({ nome: '  Eliana Lino ', email: '' })).toEqual({ ok: true });
    expect(await svc.view()).toMatchObject({ nome: 'Eliana Lino', email: '' });
  });
  it('mudar o e-mail de recuperação exige a senha atual', async () => {
    const sem = await svc.updateProfile({ nome: 'Eliana', email: 'eliana@exemplo.com.br' });
    expect(sem).toMatchObject({ ok: false, kind: 'invalido' });
    const errada = await svc.updateProfile({
      nome: 'Eliana',
      email: 'eliana@exemplo.com.br',
      senhaAtual: 'errada',
    });
    expect(errada).toEqual({ ok: false, kind: 'senha', error: 'A senha atual não confere.' });
    expect((await svc.view()).email).toBe('');
    const com = await svc.updateProfile({
      nome: 'Eliana',
      email: ' Eliana@Exemplo.com.br ',
      senhaAtual: INICIAL,
    });
    expect(com).toEqual({ ok: true });
    expect((await svc.view()).email).toBe('eliana@exemplo.com.br');
    // mesmo e-mail, só o nome muda: não pede senha
    expect(await svc.updateProfile({ nome: 'Eliana L.', email: 'eliana@exemplo.com.br' })).toEqual({
      ok: true,
    });
  });
  it('recusa e-mail fora do formato e nome longo demais', async () => {
    expect(
      await svc.updateProfile({ nome: 'E', email: 'sem-arroba', senhaAtual: INICIAL }),
    ).toMatchObject({
      ok: false,
      kind: 'invalido',
    });
    expect(await svc.updateProfile({ nome: 'x'.repeat(81), email: '' })).toMatchObject({
      ok: false,
      kind: 'invalido',
    });
  });
  it('avisa quando o envio de e-mail não está configurado', async () => {
    mailer.configured = false;
    expect((await svc.view()).envioDeEmail).toBe(false);
  });
});

describe('esqueci minha senha', () => {
  beforeEach(async () => {
    await svc.updateProfile({
      nome: 'Eliana',
      email: 'eliana@exemplo.com.br',
      senhaAtual: INICIAL,
    });
  });

  it('envia o link só para o e-mail cadastrado, com o token no fragmento', async () => {
    await svc.requestReset('outra@exemplo.com.br', ORIGEM);
    await svc.requestReset('', ORIGEM);
    expect(mailer.sent).toHaveLength(0);
    await svc.requestReset(' ELIANA@exemplo.com.br ', ORIGEM);
    expect(mailer.sent).toHaveLength(1);
    expect(mailer.sent[0]!.to).toBe('eliana@exemplo.com.br');
    expect(mailer.sent[0]!.text).toContain(`${ORIGEM}/admin/#redefinir=`);
  });
  it('não guarda o token em texto', async () => {
    await svc.requestReset('eliana@exemplo.com.br', ORIGEM);
    expect(repo.resets[0]!.tokenHash).not.toBe(tokenDoEmail());
  });
  it('sem e-mail cadastrado ou sem envio configurado, não envia nada', async () => {
    mailer.configured = false;
    await svc.requestReset('eliana@exemplo.com.br', ORIGEM);
    expect(mailer.sent).toHaveLength(0);
    expect(repo.resets).toHaveLength(0);
  });
  it('o link define a senha nova e só vale uma vez', async () => {
    await svc.requestReset('eliana@exemplo.com.br', ORIGEM);
    const token = tokenDoEmail();
    expect(await svc.resetPassword(token, 'fraca')).toMatchObject({ ok: false, kind: 'invalido' });
    expect(await svc.resetPassword(token, NOVA)).toEqual({ ok: true });
    expect(await entra(NOVA)).toBe(true);
    expect(await entra(INICIAL)).toBe(false);
    expect(await svc.resetPassword(token, 'mais-uma-senha-789')).toMatchObject({
      ok: false,
      kind: 'senha',
    });
    expect(await entra(NOVA)).toBe(true);
  });
  it('link vencido, inventado ou trocado por um pedido mais novo não vale', async () => {
    await svc.requestReset('eliana@exemplo.com.br', ORIGEM);
    const primeiro = tokenDoEmail();
    await svc.requestReset('eliana@exemplo.com.br', ORIGEM);
    const segundo = tokenDoEmail();
    expect(await svc.resetPassword(primeiro, NOVA)).toMatchObject({ ok: false, kind: 'senha' });
    expect(await svc.resetPassword('a'.repeat(64), NOVA)).toMatchObject({
      ok: false,
      kind: 'senha',
    });
    expect(await svc.resetPassword(undefined, NOVA)).toMatchObject({ ok: false, kind: 'senha' });
    agora += RESET_MINUTES * 60_000 + 1;
    expect(await svc.resetPassword(segundo, NOVA)).toMatchObject({ ok: false, kind: 'senha' });
    expect(await entra(INICIAL)).toBe(true);
  });
});
