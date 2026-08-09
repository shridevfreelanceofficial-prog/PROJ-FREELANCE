import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { uploadPublicFile, deleteFile } from '@/lib/blob';

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

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const tool = await queryOne('SELECT * FROM tools WHERE id = $1', [id]);
    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    return NextResponse.json({ tool });
  } catch (error) {
    console.error('Error fetching tool:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existingTool = await queryOne<{ id: string; logo_url: string | null; slug: string }>(
      'SELECT id, logo_url, slug FROM tools WHERE id = $1',
      [id]
    );

    if (!existingTool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    const contentType = request.headers.get('content-type') || '';
    let name: string | undefined;
    let customSlug: string | undefined;
    let description: string | undefined;
    let status: string | undefined;
    let logoUrl: string | undefined;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.has('name')) name = formData.get('name') as string;
      if (formData.has('slug')) customSlug = formData.get('slug') as string;
      if (formData.has('description')) description = formData.get('description') as string;
      if (formData.has('status')) status = formData.get('status') as string;
      
      const logoFile = formData.get('logo') as File | null;
      if (logoFile && logoFile.size > 0) {
        const uploadResult = await uploadPublicFile(logoFile, 'tool-logos');
        logoUrl = uploadResult.url;
      } else if (formData.has('logo_url')) {
        logoUrl = formData.get('logo_url') as string;
      }
    } else {
      const body = await request.json();
      name = body.name;
      customSlug = body.slug;
      description = body.description;
      status = body.status;
      logoUrl = body.logo_url;
    }

    let updatedSlug = existingTool.slug;
    if (customSlug !== undefined && customSlug.trim() !== '') {
      const candidateSlug = slugify(customSlug);
      if (candidateSlug !== existingTool.slug) {
        const checkSlug = await queryOne<{ id: string }>(
          'SELECT id FROM tools WHERE slug = $1 AND id != $2',
          [candidateSlug, id]
        );
        if (checkSlug) {
          return NextResponse.json({ error: 'Slug already in use by another tool' }, { status: 400 });
        }
        updatedSlug = candidateSlug;
      }
    } else if (name !== undefined && name.trim() !== '') {
      const candidateSlug = slugify(name);
      if (candidateSlug !== existingTool.slug) {
        const checkSlug = await queryOne<{ id: string }>(
          'SELECT id FROM tools WHERE slug = $1 AND id != $2',
          [candidateSlug, id]
        );
        if (!checkSlug) {
          updatedSlug = candidateSlug;
        }
      }
    }

    const updatedLogoUrl = logoUrl !== undefined ? logoUrl : existingTool.logo_url;

    const result = await query(
      `
      UPDATE tools
      SET 
        name = COALESCE($1, name),
        slug = $2,
        description = COALESCE($3, description),
        status = COALESCE($4, status),
        logo_url = $5,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
      `,
      [
        name ? name.trim() : null,
        updatedSlug,
        description !== undefined ? description.trim() : null,
        status ? status.trim() : null,
        updatedLogoUrl,
        id,
      ]
    );

    return NextResponse.json({ tool: result[0] });
  } catch (error) {
    console.error('Error updating tool:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existingTool = await queryOne<{ id: string; logo_url: string | null }>(
      'SELECT id, logo_url FROM tools WHERE id = $1',
      [id]
    );

    if (!existingTool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    if (existingTool.logo_url && existingTool.logo_url.includes('vercel-storage.com')) {
      try {
        await deleteFile(existingTool.logo_url);
      } catch (err) {
        console.error('Error deleting tool logo file:', err);
      }
    }

    await query('DELETE FROM tools WHERE id = $1', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tool:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
