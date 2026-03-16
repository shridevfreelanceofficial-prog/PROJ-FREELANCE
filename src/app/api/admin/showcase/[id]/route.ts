import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { deleteFile, uploadPublicFile } from '@/lib/blob';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await queryOne<{ id: string; cover_image_url: string | null }>(
      'SELECT id, cover_image_url FROM project_showcase WHERE id = $1',
      [id]
    );

    if (!existing) {
      return NextResponse.json({ error: 'Showcase entry not found' }, { status: 404 });
    }

    const formData = await request.formData();

    const title = String(formData.get('title') || '').trim();
    const client_name = (formData.get('client_name') as string | null) || null;
    const description = (formData.get('description') as string | null) || null;
    const requirements = (formData.get('requirements') as string | null) || null;
    const media_drive_link = (formData.get('media_drive_link') as string | null) || null;
    const live_website_url = (formData.get('live_website_url') as string | null) || null;
    const start_date = (formData.get('start_date') as string | null) || null;
    const end_date = (formData.get('end_date') as string | null) || null;
    const daily_working_hoursRaw = (formData.get('daily_working_hours') as string | null) || null;

    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    let newCoverUrl: string | null = null;
    const coverImage = formData.get('cover_image') as File | null;
    if (coverImage && coverImage.size > 0) {
      const uploaded = await uploadPublicFile(coverImage, 'showcase-covers');
      newCoverUrl = uploaded.url;

      if (existing.cover_image_url) {
        try {
          await deleteFile(existing.cover_image_url);
        } catch (e) {
          console.error('Failed to delete old cover image (non-critical):', e);
        }
      }
    }

    await query(
      `UPDATE project_showcase
       SET title = $1,
           client_name = $2,
           description = $3,
           requirements = $4,
           media_drive_link = $5,
           live_website_url = $6,
           daily_working_hours = $7,
           start_date = $8,
           end_date = $9,
           cover_image_url = COALESCE($10, cover_image_url)
       WHERE id = $11`,
      [
        title,
        client_name,
        description,
        requirements,
        media_drive_link,
        live_website_url,
        daily_working_hoursRaw,
        start_date,
        end_date,
        newCoverUrl,
        id,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update showcase error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const existing = await queryOne<{ id: string; cover_image_url: string | null }>(
      'SELECT id, cover_image_url FROM project_showcase WHERE id = $1',
      [id]
    );

    if (!existing) {
      return NextResponse.json({ error: 'Showcase entry not found' }, { status: 404 });
    }

    await query('DELETE FROM project_showcase WHERE id = $1', [id]);

    if (existing.cover_image_url) {
      try {
        await deleteFile(existing.cover_image_url);
      } catch (e) {
        console.error('Failed to delete cover image (non-critical):', e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete showcase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
