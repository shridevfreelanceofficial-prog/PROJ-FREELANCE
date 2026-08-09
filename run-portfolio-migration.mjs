import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const logFile = path.resolve(process.cwd(), 'db-portfolio-init.log');
function log(msg) { console.log(msg); fs.appendFileSync(logFile, msg + '\n'); }
fs.writeFileSync(logFile, '');

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

async function init() {
  try {
    log('Creating profilemitraa_portfolios table...');
    await sql`
      CREATE TABLE IF NOT EXISTS profilemitraa_portfolios (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES profilemitraa_users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        tagline VARCHAR(100),
        description TEXT,
        location VARCHAR(255),
        language VARCHAR(100) DEFAULT 'English',
        profile_image_url TEXT,
        status VARCHAR(50) DEFAULT 'draft',
        sections JSONB DEFAULT '[]',
        design_theme VARCHAR(100) DEFAULT 'minimal',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    log('✓ profilemitraa_portfolios table created.');
    log('✅ Portfolio DB migration complete!');
  } catch (error) {
    log('❌ Error: ' + error.message);
  }
}

init();
