import { neon } from '@neondatabase/serverless';
async function test() {
  const sql = neon(process.env.NEON_DATABASE_URL);
  try {
    const res = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'content_submissions';
    `;
    console.log(res);
  } catch (e) {
    console.error(e);
  }
}
test();
