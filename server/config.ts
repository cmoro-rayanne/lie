const REQUIRED = ['DATABASE_URL', 'RESEND_API_KEY', 'APP_URL', 'ADMIN_INVITE_CODE', 'MAIL_FROM'] as const;

export interface AppConfig {
  databaseUrl: string;
  resendApiKey: string;
  appUrl: string;
  inviteCode: string;
  mailFrom: string;
}

export function getConfig(): AppConfig {
  const env = process.env;
  const missing = REQUIRED.filter((name) => !env[name]);
  if (missing.length > 0) {
    throw new Error(`Variáveis de ambiente ausentes: ${missing.join(', ')}`);
  }

  const appUrl = env.APP_URL as string;
  if (!isHttpUrl(appUrl)) {
    throw new Error('APP_URL inválida: informe a URL com protocolo, ex.: https://ilelino.example');
  }

  return {
    databaseUrl: env.DATABASE_URL as string,
    resendApiKey: env.RESEND_API_KEY as string,
    appUrl,
    inviteCode: env.ADMIN_INVITE_CODE as string,
    mailFrom: env.MAIL_FROM as string,
  };
}

function isHttpUrl(value: string): boolean {
  try {
    const { protocol } = new URL(value);
    return protocol === 'https:' || protocol === 'http:';
  } catch {
    return false;
  }
}
