import { z } from 'zod';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

const email = z
  .string()
  .transform(normalizeEmail)
  .pipe(z.string().regex(EMAIL_RE, 'Informe um e-mail válido'));

export const passwordRule = z
  .string()
  .min(10, 'A senha deve ter pelo menos 10 caracteres')
  .regex(/[A-Za-z]/, 'A senha deve conter letra e número')
  .regex(/\d/, 'A senha deve conter letra e número');

export const signupSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'O nome deve ter pelo menos 2 caracteres')
    .max(120, 'O nome deve ter no máximo 120 caracteres'),
  email,
  password: passwordRule,
  inviteCode: z.string().optional(),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Informe a senha'),
});

export const forgotSchema = z.object({ email });

export const resetSchema = z.object({
  token: z.string().min(1, 'Token ausente'),
  password: passwordRule,
});
