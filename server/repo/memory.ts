import { randomUUID } from 'node:crypto';
import type { AdminRepo, CreateUserResult, ResetTokenRecord, SessionRecord, SessionUser, UserWithPassword } from './types';

interface SessionRow {
  tokenHash: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
}

interface ResetRow {
  tokenHash: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  usedAt: Date | null;
}

interface FailureRow {
  key: string;
  attemptedAt: Date;
}

/** Repositório em memória para os testes das rotas. Cada chamada cria um estado novo. */
export function createMemoryRepo(): AdminRepo {
  const users = new Map<string, UserWithPassword>();
  const sessions = new Map<string, SessionRow>();
  const resetTokens = new Map<string, ResetRow>();
  let failures: FailureRow[] = [];

  const toSessionUser = (user: UserWithPassword): SessionUser => ({ id: user.id, name: user.name, email: user.email });

  return {
    async createUser({ name, email, passwordHash }): Promise<CreateUserResult> {
      for (const user of users.values()) {
        if (user.email === email) return { ok: false, reason: 'duplicate_email' };
      }
      const user: UserWithPassword = { id: randomUUID(), name, email, passwordHash };
      users.set(user.id, user);
      return { ok: true, user: toSessionUser(user) };
    },

    async findUserByEmail(email) {
      for (const user of users.values()) {
        if (user.email === email) return { ...user };
      }
      return null;
    },

    async findUserById(id) {
      const user = users.get(id);
      return user ? toSessionUser(user) : null;
    },

    async createSession({ tokenHash, userId, createdAt, expiresAt }) {
      sessions.set(tokenHash, { tokenHash, userId, createdAt, expiresAt });
    },

    async findSession(tokenHash): Promise<SessionRecord | null> {
      const row = sessions.get(tokenHash);
      return row ? { userId: row.userId, expiresAt: row.expiresAt } : null;
    },

    async deleteSession(tokenHash) {
      sessions.delete(tokenHash);
    },

    async deleteSessionsForUser(userId) {
      for (const [hash, row] of sessions) {
        if (row.userId === userId) sessions.delete(hash);
      }
    },

    async replaceResetToken({ userId, tokenHash, createdAt, expiresAt }) {
      for (const [hash, row] of resetTokens) {
        if (row.userId === userId && row.usedAt === null) resetTokens.delete(hash);
      }
      resetTokens.set(tokenHash, { tokenHash, userId, createdAt, expiresAt, usedAt: null });
    },

    async findResetToken(tokenHash): Promise<ResetTokenRecord | null> {
      const row = resetTokens.get(tokenHash);
      return row ? { userId: row.userId, expiresAt: row.expiresAt, usedAt: row.usedAt } : null;
    },

    async resetPasswordTx({ tokenHash, passwordHash, now }) {
      const row = resetTokens.get(tokenHash);
      if (!row || row.usedAt !== null || row.expiresAt <= now) return 'invalid';

      row.usedAt = now;
      const user = users.get(row.userId);
      if (user) user.passwordHash = passwordHash;
      for (const [hash, session] of sessions) {
        if (session.userId === row.userId) sessions.delete(hash);
      }
      return 'ok';
    },

    async recordFailure(key, at) {
      failures.push({ key, attemptedAt: at });
    },

    async countFailures(key, since) {
      return failures.filter((f) => f.key === key && f.attemptedAt >= since).length;
    },

    async clearFailures(key) {
      failures = failures.filter((f) => f.key !== key);
    },
  };
}
