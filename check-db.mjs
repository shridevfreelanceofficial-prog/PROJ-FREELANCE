import { neon } from '@neondatabase/serverless';

async function check() {
  const sql = neon(process.env.NEON_DATABASE_URL);
  const admins = await sql`SELECT id, name, email FROM administrators`;
  console.log('Admins in DB:', admins);
}
check();
