import { neon } from '@neondatabase/serverless';

async function check() {
  const sql = neon(process.env.NEON_DATABASE_URL);
  const admins = await sql`SELECT id, username, password, name, email FROM administrators`;
  console.log('Admins in DB:', admins);
  
  const collections = await sql`SELECT id, business_name FROM content_collections`;
  console.log('Collections in DB:', collections);
  
  const submissions = await sql`SELECT id, contact_name, about_business, collection_id FROM content_submissions`;
  console.log('Submissions in DB:', submissions);
}
check();
