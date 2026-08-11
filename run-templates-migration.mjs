import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const logFile = path.resolve(process.cwd(), 'db-templates-init.log');
function log(msg) { console.log(msg); fs.appendFileSync(logFile, msg + '\n'); }
fs.writeFileSync(logFile, '');

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split(/\r?\n/).forEach(line => {
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
    log('1. Creating profilemitraa_templates table...');
    await sql`
      CREATE TABLE IF NOT EXISTS profilemitraa_templates (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        key VARCHAR(100) UNIQUE NOT NULL,
        banner_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    log('✓ profilemitraa_templates table created.');

    log('2. Adding customized_data to profilemitraa_portfolios table...');
    await sql`
      ALTER TABLE profilemitraa_portfolios 
      ADD COLUMN IF NOT EXISTS customized_data JSONB DEFAULT '{}';
    `;
    log('✓ customized_data column check complete.');

    log('3. Seeding profilemitraa_templates table...');
    
    // Check and seed Template 1
    const t1 = await sql`SELECT id FROM profilemitraa_templates WHERE key = 'minimal_dark'`;
    if (t1.length === 0) {
      await sql`
        INSERT INTO profilemitraa_templates (name, key, banner_url)
        VALUES ('Tech Minimalist (Dark Mode)', 'minimal_dark', '/images/tools/ProfileMitraa/templates/tech-minimalist-banner.png')
      `;
      log('✓ Seeded: Tech Minimalist (Dark Mode)');
    }

    // Check and seed Template 2
    const t2 = await sql`SELECT id FROM profilemitraa_templates WHERE key = 'creative_glass'`;
    if (t2.length === 0) {
      await sql`
        INSERT INTO profilemitraa_templates (name, key, banner_url)
        VALUES ('Creative Portfolio (Glassmorphism)', 'creative_glass', '/images/tools/ProfileMitraa/templates/creative-glass-banner.png')
      `;
      log('✓ Seeded: Creative Portfolio (Glassmorphism)');
    }

    // Check and seed Template 3
    const t3 = await sql`SELECT id FROM profilemitraa_templates WHERE key = 'corporate_blue'`;
    if (t3.length === 0) {
      await sql`
        INSERT INTO profilemitraa_templates (name, key, banner_url)
        VALUES ('Corporate Grid (Professional Blue)', 'corporate_blue', '/images/tools/ProfileMitraa/templates/corporate-blue-banner.png')
      `;
      log('✓ Seeded: Corporate Grid (Professional Blue)');
    }

    // Check and seed Template 4: Aesthetic Violet
    const t4 = await sql`SELECT id FROM profilemitraa_templates WHERE key = 'aesthetic_violet'`;
    if (t4.length === 0) {
      await sql`
        INSERT INTO profilemitraa_templates (name, key, banner_url)
        VALUES ('Aesthetic Violet (Design Portfolio)', 'aesthetic_violet', '/images/tools/ProfileMitraa/templates/aesthetic-violet-banner.png')
      `;
      log('✓ Seeded: Aesthetic Violet (Design Portfolio)');
    }

    log('✅ Database updates complete!');
  } catch (error) {
    log('❌ Error: ' + error.message);
  }
}

init();
