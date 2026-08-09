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
    console.log('--- PORTFOLIOS ---');
    const portfolios = await sql`SELECT id, user_id, title, slug, design_theme, status FROM profilemitraa_portfolios`;
    console.log(portfolios);

    console.log('--- USERS ---');
    const users = await sql`SELECT id, username, full_name, email FROM profilemitraa_users`;
    console.log(users);

    console.log('--- PROFILES ---');
    const profiles = await sql`SELECT id, user_id, headline, about_me FROM profilemitraa_profiles`;
    console.log(profiles);

  } catch (error) {
    console.error('ERROR:', error);
  }
}

run();
