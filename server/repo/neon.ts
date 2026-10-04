import { neon } from '@neondatabase/serverless';
import type { AdminRepo, CreateUserResult, ResetTokenRecord, SessionRecord, SessionUser, UserWithPassword } from './types';

export interface NeonRepoOptions {
  /** Opções extras do `fetch` do driver HTTP (usado pelos testes para simular falha de conexão). */
  fetchOptions?: Record<string, unknown>;
}

const UNIQUE_VIOLATION = '23505';

type Row = Record<string, unknown>;

const asDate = (value: unknown): Date => new Date(value as string | Date);

/** Repositório do painel sobre o Neon (driver HTTP). */
export function createNeonRepo(databaseUrl: string, options: NeonRepoOptions = {}): AdminRepo {
  const sql = neon(databaseUrl, options.fetchOptions ? { fetchOptions: options.fetchOptions } : {});

  const toSessionUser = (row: Row): SessionUser => ({
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
  });

  return {
    async createUser({ name, email, passwordHash }): Promise<CreateUserResult> {
      try {
        const rows = (await sql`
          insert into users (name, email, password_hash)
          values (${name}, ${email}, ${passwordHash})
          returning id, name, email
        `) as Row[];
        return { ok: true, user: toSessionUser(rows[0]) };
      } catch (error) {
        if ((error as { code?: string }).code === UNIQUE_VIOLATION) {
          return { ok: false, reason: 'duplicate_email' };
        }
        throw error;
      }
    },

    async findUserByEmail(email): Promise<UserWithPassword | null> {
      const rows = (await sql`
        select id, name, email, password_hash from users where email = ${email}
      `) as Row[];
      if (rows.length === 0) return null;
      return { ...toSessionUser(rows[0]), passwordHash: rows[0].password_hash as string };
    },

    async findUserById(id): Promise<SessionUser | null> {
      const rows = (await sql`select id, name, email from users where id = ${id}`) as Row[];
      return rows.length === 0 ? null : toSessionUser(rows[0]);
    },

    async createSession({ tokenHash, userId, createdAt, expiresAt }) {
      await sql`
        insert into sessions (token_hash, user_id, created_at, expires_at)
        values (${tokenHash}, ${userId}, ${createdAt}, ${expiresAt})
      `;
    },

    async findSession(tokenHash): Promise<SessionRecord | null> {
      const rows = (await sql`select user_id, expires_at from sessions where token_hash = ${tokenHash}`) as Row[];
      if (rows.length === 0) return null;
      return { userId: rows[0].user_id as string, expiresAt: asDate(rows[0].expires_at) };
    },

    async deleteSession(tokenHash) {
      await sql`delete from sessions where token_hash = ${tokenHash}`;
    },

    async deleteSessionsForUser(userId) {
      await sql`delete from sessions where user_id = ${userId}`;
    },

    async replaceResetToken({ userId, tokenHash, createdAt, expiresAt }) {
      await sql.transaction([
        sql`delete from password_reset_tokens where user_id = ${userId} and used_at is null`,
        sql`
          insert into password_reset_tokens (token_hash, user_id, created_at, expires_at)
          values (${tokenHash}, ${userId}, ${createdAt}, ${expiresAt})
        `,
      ]);
    },

    async findResetToken(tokenHash): Promise<ResetTokenRecord | null> {
      const rows = (await sql`
        select user_id, expires_at, used_at from password_reset_tokens where token_hash = ${tokenHash}
      `) as Row[];
      if (rows.length === 0) return null;
      const row = rows[0];
      return {
        userId: row.user_id as string,
        expiresAt: asDate(row.expires_at),
        usedAt: row.used_at === null ? null : asDate(row.used_at),
      };
    },

    async resetPasswordTx({ tokenHash, passwordHash, now }): Promise<'ok' | 'invalid'> {
      // As três instruções rodam na mesma transação. A primeira só marca o token se ele
      // é válido (não usado e não expirado); as seguintes só atuam sobre o token marcado agora.
      const [marked] = await sql.transaction([
        sql`
          update password_reset_tokens
          set used_at = ${now}
          where token_hash = ${tokenHash} and used_at is null and expires_at > ${now}
          returning user_id
        `,
        sql`
          update users
          set password_hash = ${passwordHash}
          where id in (
            select user_id from password_reset_tokens where token_hash = ${tokenHash} and used_at = ${now}
          )
        `,
        sql`
          delete from sessions
          where user_id in (
            select user_id from password_reset_tokens where token_hash = ${tokenHash} and used_at = ${now}
          )
        `,
      ]);
      return (marked as Row[]).length === 1 ? 'ok' : 'invalid';
    },

    async recordFailure(key, at) {
      await sql`insert into failed_logins (key, attempted_at) values (${key}, ${at})`;
    },

    async countFailures(key, since) {
      const rows = (await sql`
        select count(*)::int as total from failed_logins where key = ${key} and attempted_at >= ${since}
      `) as Row[];
      return rows[0].total as number;
    },

    async clearFailures(key) {
      await sql`delete from failed_logins where key = ${key}`;
    },
  };
}
