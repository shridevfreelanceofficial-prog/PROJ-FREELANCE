import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.NEON_DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS content_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(255) NOT NULL,
    created_by UUID REFERENCES administrators(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )
`;

await sql`
  CREATE TABLE IF NOT EXISTS content_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID REFERENCES content_collections(id) ON DELETE CASCADE,
    business_logo_url TEXT,
    about_business TEXT,
    business_images JSONB DEFAULT '[]',
    website_requirements TEXT,
    target_audience TEXT,
    preferred_style VARCHAR(255),
    reference_websites TEXT,
    color_preferences VARCHAR(255),
    contact_name VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    social_media JSONB DEFAULT '{}',
    additional_notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )
`;

console.log('Content collections migration done!');
