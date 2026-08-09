import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { uploadPublicFile } from '@/lib/blob';

export async function GET() {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const templates = await query(`
      SELECT * FROM profilemitraa_templates
      ORDER BY created_at ASC
    `);

    return NextResponse.json({ success: true, templates });
  } catch (error: any) {
    console.error('Error fetching admin templates:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let id = '';
    let name = '';
    let bannerUrl = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      id = (formData.get('id') as string) || '';
      name = (formData.get('name') as string) || '';
      const bannerFile = formData.get('banner') as File | null;
      const bannerUrlInput = (formData.get('banner_url') as string) || '';

      if (bannerFile && bannerFile.size > 0) {
        const uploadResult = await uploadPublicFile(bannerFile, 'profilemitraa-templates');
        bannerUrl = uploadResult.url;
      } else if (bannerUrlInput) {
        bannerUrl = bannerUrlInput;
      }
    } else {
      const body = await request.json();
      id = body.id || '';
      name = body.name || '';
      bannerUrl = body.banner_url || '';
    }

    if (!id) {
      return NextResponse.json({ error: 'Template ID is required' }, { status: 400 });
    }

    // Get current template info
    const existing = await queryOne<{ name: string; banner_url: string | null }>(
      'SELECT name, banner_url FROM profilemitraa_templates WHERE id = $1',
      [id]
    );

    if (!existing) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    // Fallbacks if not provided
    const finalName = name.trim() || existing.name;
    const finalBannerUrl = bannerUrl !== undefined ? bannerUrl.trim() : existing.banner_url;

    const result = await query(`
      UPDATE profilemitraa_templates
      SET name = $1, banner_url = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [finalName, finalBannerUrl || null, id]);

    return NextResponse.json({ success: true, template: result[0] });
  } catch (error: any) {
    console.error('Error updating admin template:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
