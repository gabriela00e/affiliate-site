/**
 * Run: npx tsx scripts/generate-password-hash.ts "yourPassword"
 * Copy the printed value into ADMIN_PASSWORD_HASH in your .env.local
 */
import { randomBytes, scryptSync } from "crypto";

const password = process.argv[2];
if (!password) {
  console.error('Usage: npx tsx scripts/generate-password-hash.ts "yourPassword"');
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(password, salt, 64).toString("hex");
console.log(`${salt}:${hash}`);
