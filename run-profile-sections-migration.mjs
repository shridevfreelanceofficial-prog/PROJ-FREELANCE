import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const logFile = path.resolve(process.cwd(), 'db-profile-sections-init.log');
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
    log('Adding education and projects columns to profilemitraa_profiles...');
    await sql`
      ALTER TABLE profilemitraa_profiles
      ADD COLUMN IF NOT EXISTS education JSONB DEFAULT '[]',
      ADD COLUMN IF NOT EXISTS projects JSONB DEFAULT '[]';
    `;
    log('✓ Columns added successfully.');
    log('✅ DB Migration complete!');
  } catch (error) {
    log('❌ Error: ' + error.message);
  }
}

init();
