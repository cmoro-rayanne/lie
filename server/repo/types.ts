export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export interface UserWithPassword extends SessionUser {
  passwordHash: string;
}

export type CreateUserResult = { ok: true; user: SessionUser } | { ok: false; reason: 'duplicate_email' };

export interface SessionRecord {
  userId: string;
  expiresAt: Date;
}

export interface ResetTokenRecord {
  userId: string;
  expiresAt: Date;
  usedAt: Date | null;
}

export interface AdminRepo {
  createUser(input: { name: string; email: string; passwordHash: string }): Promise<CreateUserResult>;
  findUserByEmail(email: string): Promise<UserWithPassword | null>;
  findUserById(id: string): Promise<SessionUser | null>;

  createSession(input: { tokenHash: string; userId: string; createdAt: Date; expiresAt: Date }): Promise<void>;
  findSession(tokenHash: string): Promise<SessionRecord | null>;
  deleteSession(tokenHash: string): Promise<void>;
  deleteSessionsForUser(userId: string): Promise<void>;

  /** Invalida tokens não usados da conta e grava o novo (AUTH-22). */
  replaceResetToken(input: { userId: string; tokenHash: string; createdAt: Date; expiresAt: Date }): Promise<void>;
  findResetToken(tokenHash: string): Promise<ResetTokenRecord | null>;
  /**
   * Em uma única transação: se o token existe, não foi usado e não expirou em `now`,
   * marca-o como usado, troca o hash da senha e apaga as sessões da conta. Caso contrário, 'invalid'.
   */
  resetPasswordTx(input: { tokenHash: string; passwordHash: string; now: Date }): Promise<'ok' | 'invalid'>;

  recordFailure(key: string, at: Date): Promise<void>;
  /** Conta falhas com `attempted_at >= since`. */
  countFailures(key: string, since: Date): Promise<number>;
  clearFailures(key: string): Promise<void>;
}
