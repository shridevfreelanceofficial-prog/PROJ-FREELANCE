import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.NEON_DATABASE_URL);

async function run() {
  const hash = await bcrypt.hash('rtshetty', 10);
  await sql`UPDATE administrators SET password = ${hash} WHERE username = 'Shrikesh Shetty'`;
  console.log('Password updated to: rtshetty');
}

run().catch(console.error);
