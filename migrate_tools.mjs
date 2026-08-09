import { neon } from '@neondatabase/serverless';

async function migrate() {
  const connectionString = process.env.NEON_DATABASE_URL;
  if (!connectionString) {
    console.error('NEON_DATABASE_URL is not set in environment.');
    process.exit(1);
  }

  const sql = neon(connectionString);

  console.log('Running tools table migration...');
  await sql`
    CREATE TABLE IF NOT EXISTS tools (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE NOT NULL,
      logo_url TEXT,
      description TEXT,
      status VARCHAR(50) DEFAULT 'active',
      created_by UUID REFERENCES administrators(id) ON DELETE SET NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_tools_slug ON tools(slug)
  `;

  console.log('Tools table migration completed successfully!');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
