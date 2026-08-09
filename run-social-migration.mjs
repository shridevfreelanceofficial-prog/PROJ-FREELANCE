import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const logFile = path.resolve(process.cwd(), 'db-social-init.log');
function log(msg) {
  console.log(msg);
  fs.appendFileSync(logFile, msg + '\n');
}
fs.writeFileSync(logFile, '');

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
  if (match) {
    let key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.substring(1, val.length - 1);
    env[key] = val;
  }
});

const sql = neon(env.NEON_DATABASE_URL);

async function init() {
  try {
    // 1. Add profile_views to profilemitraa_profiles
    log('Adding profile_views column...');
    await sql.query(`ALTER TABLE profilemitraa_profiles ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0`);
    log('✓ profile_views column added.');

    // 2. Add resume_downloads column
    log('Adding resume_downloads column...');
    await sql.query(`ALTER TABLE profilemitraa_profiles ADD COLUMN IF NOT EXISTS resume_downloads INTEGER DEFAULT 0`);
    log('✓ resume_downloads column added.');

    // 3. Create follows table
    log('Creating profilemitraa_follows table...');
    await sql`
      CREATE TABLE IF NOT EXISTS profilemitraa_follows (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        follower_id UUID NOT NULL REFERENCES profilemitraa_users(id) ON DELETE CASCADE,
        following_id UUID NOT NULL REFERENCES profilemitraa_users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(follower_id, following_id)
      );
    `;
    log('✓ profilemitraa_follows table created.');

    log('✅ Social features DB migration complete!');
  } catch (error) {
    log('❌ Error: ' + error.message);
    log('Stack: ' + error.stack);
  }
}

init();
