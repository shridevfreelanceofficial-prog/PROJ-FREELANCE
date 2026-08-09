import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { uploadPublicFile } from '@/lib/blob';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET() {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tools = await query(`
      SELECT t.*, a.name as created_by_name
      FROM tools t
      LEFT JOIN administrators a ON t.created_by = a.id
      ORDER BY t.created_at DESC
    `);

    return NextResponse.json({ tools });
  } catch (error) {
    console.error('Error fetching tools:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let name = '';
    let customSlug = '';
    let description = '';
    let logoUrl = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      name = (formData.get('name') as string) || '';
      customSlug = (formData.get('slug') as string) || '';
      description = (formData.get('description') as string) || '';
      const logoFile = formData.get('logo') as File | null;
      const logoUrlInput = (formData.get('logo_url') as string) || '';

      if (logoFile && logoFile.size > 0) {
        const uploadResult = await uploadPublicFile(logoFile, 'tool-logos');
        logoUrl = uploadResult.url;
      } else if (logoUrlInput) {
        logoUrl = logoUrlInput;
      }
    } else {
      const body = await request.json();
      name = body.name || '';
      customSlug = body.slug || '';
      description = body.description || '';
      logoUrl = body.logo_url || '';
    }

    if (!name.trim()) {
      return NextResponse.json({ error: 'Tool name is required' }, { status: 400 });
    }

    let slug = slugify(customSlug.trim() || name.trim());
    if (!slug) {
      slug = `tool-${Date.now()}`;
    }

    // Check if slug exists
    const existing = await queryOne<{ id: string }>('SELECT id FROM tools WHERE slug = $1', [slug]);
    if (existing) {
      slug = `${slug}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const result = await query(`
      INSERT INTO tools (name, slug, logo_url, description, status, created_by)
      VALUES ($1, $2, $3, $4, 'active', $5)
      RETURNING *
    `, [name.trim(), slug, logoUrl || null, description.trim() || null, auth.user.id]);

    return NextResponse.json({ tool: result[0] });
  } catch (error) {
    console.error('Error creating tool:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
