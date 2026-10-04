// Placeholders de ambiente para os testes de servidor: server/deps.ts valida o ambiente ao carregar.
// `??=` preserva variáveis reais já definidas. Nenhum teste usa estes valores para conectar em banco.
const SERVER_ENV_PLACEHOLDERS: Record<string, string> = {
  DATABASE_URL: 'postgres://placeholder:placeholder@localhost:5432/placeholder',
  RESEND_API_KEY: 're_placeholder',
  APP_URL: 'https://placeholder.example',
  ADMIN_INVITE_CODE: 'placeholder-convite',
  MAIL_FROM: 'placeholder <placeholder@example.com>',
};

for (const [name, value] of Object.entries(SERVER_ENV_PLACEHOLDERS)) {
  process.env[name] ??= value;
}
