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

async function getPortfolioData(slug) {
  console.log('Fetching portfolio for slug:', slug);
  const portfolios = await sql`SELECT * FROM profilemitraa_portfolios WHERE slug = ${slug} LIMIT 1`;
  console.log('portfolios found:', portfolios.length);
  if (!portfolios.length) return null;
  const portfolio = portfolios[0];
  console.log('portfolio status:', portfolio.status);
  if (portfolio.status !== 'published') return null;

  const userId = portfolio.user_id;
  console.log('userId:', userId);

  const users = await sql`SELECT id, username, full_name FROM profilemitraa_users WHERE id = ${userId} LIMIT 1`;
  console.log('users found:', users.length);
  if (!users.length) return null;

  const profiles = await sql`SELECT * FROM profilemitraa_profiles WHERE user_id = ${userId} LIMIT 1`;
  console.log('profiles found:', profiles.length);

  return {
    user: users[0],
    profile: profiles[0] || {},
    portfolio,
  };
}

async function run() {
  const result = await getPortfolioData('shrikesh');
  console.log('RESULT:', result ? 'SUCCESS' : 'NULL');
}

run();
