/**
 * Gate hook script to check shell commands before execution.
 */
const dangerousPatterns = [/rm\s+-rf\s+[\/\\]/, /format\s+[a-z]:/i, /drop\s+database/i];

const cmd = process.argv.slice(2).join(' ');
for (const pattern of dangerousPatterns) {
  if (pattern.test(cmd)) {
    console.error(`Blocked dangerous command pattern: ${pattern}`);
    process.exit(1);
  }
}

process.exit(0);
