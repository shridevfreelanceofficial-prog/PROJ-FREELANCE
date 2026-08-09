import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

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
    console.log("Dropping tables if exist to resolve schema issues...");
    await sql`DROP TABLE IF EXISTS profilemitraa_profiles;`;
    console.log("Creating table profilemitraa_profiles step-by-step...");
    
    // Create base table first
    await sql`
      CREATE TABLE profilemitraa_profiles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID UNIQUE NOT NULL REFERENCES profilemitraa_users(id) ON DELETE CASCADE
      );
    `;
    console.log("✓ Base table created.");

    // Alter table to add fields
    const fields = [
      "ALTER TABLE profilemitraa_profiles ADD COLUMN phone VARCHAR(50)",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN dob VARCHAR(50)",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN location TEXT",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN headline VARCHAR(255)",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN profile_photo_url TEXT",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN professional_title VARCHAR(255)",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN experience_level VARCHAR(100)",
      "ALTER TABLE profilemitraa_profiles ADD COLUMN current_role VARCHAR(255)",
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
      console.log(`Executing: ${queryStr}`);
      await sql(queryStr);
    }

    console.log("✓ All fields added successfully.");
  } catch (error) {
    console.error("Step-by-step error status:", error);
  }
}

init();
