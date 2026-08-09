import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
  if (match) {
    let key = match[1].trim(), val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    env[key] = val;
  }
});

const sql = neon(env.NEON_DATABASE_URL);

async function run() {
  try {
    const templates = await sql`SELECT key, name FROM profilemitraa_templates`;
    console.log('TEMPLATES IN DB:', templates);

    const portfolios = await sql`SELECT id, user_id, title, slug, design_theme FROM profilemitraa_portfolios LIMIT 5`;
    console.log('PORTFOLIOS IN DB:', portfolios);
  } catch (error) {
    console.error('ERROR:', error);
  }
}

run();
