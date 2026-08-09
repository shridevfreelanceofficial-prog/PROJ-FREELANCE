import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const logFile = path.resolve(process.cwd(), 'db-users-init.log');
function log(msg) {
  console.log(msg);
  fs.appendFileSync(logFile, msg + '\n');
}

fs.writeFileSync(logFile, ''); // clear log

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
  if (match) {
    let key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    }
    env[key] = val;
  }
});

const databaseUrl = env.NEON_DATABASE_URL;
const sql = neon(databaseUrl);

async function init() {
  try {
    // Step 1: Create profilemitraa_users table
    log("Creating profilemitraa_users table...");
    await sql`
      CREATE TABLE IF NOT EXISTS profilemitraa_users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    log("✓ profilemitraa_users table created (or already exists).");

    // Step 2: Drop and recreate profiles table
    log("Dropping profilemitraa_profiles if exists...");
    await sql`DROP TABLE IF EXISTS profilemitraa_profiles;`;
    log("✓ Dropped.");

    log("Creating profilemitraa_profiles base table...");
    await sql`
      CREATE TABLE profilemitraa_profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID UNIQUE NOT NULL REFERENCES profilemitraa_users(id) ON DELETE CASCADE
      );
    `;
    log("✓ Base table created.");

    // Step 3: Add all columns
    const fields = [
      "ALTER TABLE profilemitraa_profiles ADD COLUMN phone VARCHAR(50)",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN dob VARCHAR(50)",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN location TEXT",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN headline VARCHAR(255)",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN profile_photo_url TEXT",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN professional_title VARCHAR(255)",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN experience_level VARCHAR(100)",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN current_job_role VARCHAR(255)",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN experience_years VARCHAR(50)",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN employment_type VARCHAR(100)",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN company VARCHAR(255)",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN about_me TEXT",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN tech_skills JSONB DEFAULT '[]'",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN tools JSONB DEFAULT '[]'",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN soft_skills JSONB DEFAULT '[]'",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN languages JSONB DEFAULT '[]'",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN certifications JSONB DEFAULT '[]'",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP"
    ];

    for (let queryStr of fields) {
      log(`Executing: ${queryStr.substring(0, 60)}...`);
      await sql.query(queryStr);
    }

    log("✓ All profile columns added successfully.");
    log("✅ Database initialization complete!");
  } catch (error) {
    log("❌ Error: " + error.message);
    log("Stack: " + error.stack);
  }
}

init();
