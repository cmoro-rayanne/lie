// Aplica server/schema.sql no banco apontado por DATABASE_URL (idempotente).
// Uso: npm run db:migrate

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('db:migrate: a variável DATABASE_URL não está definida.');
  process.exit(1);
}

const schemaPath = fileURLToPath(new URL('../server/schema.sql', import.meta.url));
const statements = readFileSync(schemaPath, 'utf8')
  .split(';')
  .map((s) => s.trim())
  .filter(Boolean);

const sql = neon(databaseUrl);

for (const statement of statements) {
  await sql.query(statement);
}

console.log(`db:migrate: ${statements.length} instruções aplicadas.`);
