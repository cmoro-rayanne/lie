// @vitest-environment node
import { randomUUID } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import { afterAll, describe, expect, it } from 'vitest';
import { withErrors } from '../http';
import { createNeonRepo } from './neon';

const TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;
if (!TEST_DATABASE_URL) {
  throw new Error(
    'TEST_DATABASE_URL não definida: aponte para um banco Neon de teste antes de rodar server/repo/neon.test.ts.',
  );
}

const MINUTE = 60 * 1000;
const runId = `${Date.now()}-${randomUUID().slice(0, 8)}`;
const createdUserIds: string[] = [];
const createdFailureKeys: string[] = [];

const repo = createNeonRepo(TEST_DATABASE_URL);
const rawSql = neon(TEST_DATABASE_URL);

/** E-mail de teste com prefixo único, no formato exigido para dados de teste. */
function testEmail(): string {
  return `teste-${Date.now()}-${randomUUID().slice(0, 8)}@exemplo.invalid`;
}

async function newUser(): Promise<{ id: string; email: string }> {
  const email = testEmail();
  const result = await repo.createUser({ name: 'Usuário de Teste', email, passwordHash: 'hash-inicial' });
  if (!result.ok) throw new Error('falha ao criar usuário de teste');
  createdUserIds.push(result.user.id);
  return { id: result.user.id, email };
}

function newFailureKey(): string {
  const key = `teste:${runId}:${randomUUID()}`;
  createdFailureKeys.push(key);
  return key;
}

afterAll(async () => {
  // Só remove as linhas criadas por estes testes; sessões e tokens saem em cascata.
  if (createdUserIds.length > 0) {
    await rawSql`delete from users where id = any(${createdUserIds}::uuid[])`;
  }
  if (createdFailureKeys.length > 0) {
    await rawSql`delete from failed_logins where key = any(${createdFailureKeys}::text[])`;
  }
});

describe('repositório Neon (banco de teste)', () => {
  describe('unicidade de e-mail (AUTH-01)', () => {
    it('segundo cadastro com o mesmo e-mail retorna duplicate_email', async () => {
      const email = testEmail();
      const first = await repo.createUser({ name: 'Primeira', email, passwordHash: 'h1' });
      if (first.ok) createdUserIds.push(first.user.id);
      const second = await repo.createUser({ name: 'Segunda', email, passwordHash: 'h2' });

      expect(first.ok).toBe(true);
      expect(second).toEqual({ ok: false, reason: 'duplicate_email' });
    });

    it('insert direto de e-mail repetido lança erro com código 23505', async () => {
      const email = testEmail();
      const first = await repo.createUser({ name: 'Primeira', email, passwordHash: 'h1' });
      if (first.ok) createdUserIds.push(first.user.id);

      const attempt = rawSql`
        insert into users (name, email, password_hash) values ('Repetida', ${email}, 'h2')
      `;
      await expect(attempt).rejects.toMatchObject({ code: '23505' });
    });
  });

  describe('limite de tentativas (AUTH-10)', () => {
    it('countFailures conta só falhas dentro dos últimos 15 minutos', async () => {
      const key = newFailureKey();
      const now = Date.now();
      await repo.recordFailure(key, new Date(now - 16 * MINUTE));
      await repo.recordFailure(key, new Date(now - 14 * MINUTE));
      await repo.recordFailure(key, new Date(now - 1 * MINUTE));

      const total = await repo.countFailures(key, new Date(now - 15 * MINUTE));

      expect(total).toBe(2);
    });
  });

  describe('redefinição de senha (AUTH-25, AUTH-26)', () => {
    async function setupResetScenario(expiresInMs: number) {
      const user = await newUser();
      const now = new Date();
      const sessionA = `teste-sessao-${randomUUID()}`;
      const sessionB = `teste-sessao-${randomUUID()}`;
      for (const tokenHash of [sessionA, sessionB]) {
        await repo.createSession({
          tokenHash,
          userId: user.id,
          createdAt: now,
          expiresAt: new Date(now.getTime() + 7 * 24 * 60 * MINUTE),
        });
      }
      const resetHash = `teste-reset-${randomUUID()}`;
      await repo.replaceResetToken({
        userId: user.id,
        tokenHash: resetHash,
        createdAt: now,
        expiresAt: new Date(now.getTime() + expiresInMs),
      });
      return { user, now, sessionA, sessionB, resetHash };
    }

    it('token válido troca o hash, marca used_at e apaga as sessões na mesma transação', async () => {
      const { user, now, sessionA, sessionB, resetHash } = await setupResetScenario(60 * MINUTE);

      const outcome = await repo.resetPasswordTx({ tokenHash: resetHash, passwordHash: 'hash-novo', now });

      expect(outcome).toBe('ok');
      const updated = await repo.findUserByEmail(user.email);
      expect(updated?.passwordHash).toBe('hash-novo');
      const reset = await repo.findResetToken(resetHash);
      expect(reset?.usedAt?.getTime()).toBe(now.getTime());
      expect(await repo.findSession(sessionA)).toBeNull();
      expect(await repo.findSession(sessionB)).toBeNull();
    });

    it('token já usado retorna invalid e não altera a senha', async () => {
      const { user, now, resetHash } = await setupResetScenario(60 * MINUTE);
      await repo.resetPasswordTx({ tokenHash: resetHash, passwordHash: 'hash-novo', now });

      const outcome = await repo.resetPasswordTx({
        tokenHash: resetHash,
        passwordHash: 'hash-outro',
        now: new Date(now.getTime() + 1000),
      });

      expect(outcome).toBe('invalid');
      const current = await repo.findUserByEmail(user.email);
      expect(current?.passwordHash).toBe('hash-novo');
    });

    it('token expirado retorna invalid e não altera a senha', async () => {
      const { user, now, resetHash } = await setupResetScenario(-MINUTE);

      const outcome = await repo.resetPasswordTx({ tokenHash: resetHash, passwordHash: 'hash-novo', now });

      expect(outcome).toBe('invalid');
      const current = await repo.findUserByEmail(user.email);
      expect(current?.passwordHash).toBe('hash-inicial');
    });
  });

  describe('falha de conexão (AUTH-31)', () => {
    it('erro de conexão propaga do repositório', async () => {
      const broken = createNeonRepo(TEST_DATABASE_URL, { fetchOptions: { signal: AbortSignal.abort() } });

      await expect(broken.findUserByEmail('qualquer@exemplo.invalid')).rejects.toThrow();
    });

    it('withErrors responde 503 com mensagem genérica quando o banco falha', async () => {
      const broken = createNeonRepo(TEST_DATABASE_URL, { fetchOptions: { signal: AbortSignal.abort() } });
      const handler = withErrors(() => broken.findUserByEmail('qualquer@exemplo.invalid').then(() => new Response()));

      const response = await handler();

      expect(response.status).toBe(503);
      expect(await response.json()).toEqual({ message: 'Serviço temporariamente indisponível' });
    });
  });
});
