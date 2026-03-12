import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { uploadDeliverable } from '@/lib/blob';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const deliverables = await query<{
      id: string;
      title: string;
      description: string | null;
      file_url: string | null;
      drive_link: string | null;
      uploaded_at: string;
    }>(
      `SELECT id, title, description, file_url, drive_link, uploaded_at
       FROM deliverables
       WHERE project_id = $1 AND member_id = $2
       ORDER BY uploaded_at DESC`,
      [id, result.user.id]
    );

    return NextResponse.json({ deliverables });
  } catch (error) {
    console.error('Get deliverables error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const drive_link = formData.get('drive_link') as string;
    const file = formData.get('file') as File | null;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    let file_url = null;

    if (file && file.size > 0) {
      const uploadResult = await uploadDeliverable(file, id);
      file_url = uploadResult.url;
    }

    const deliverable = await query(
      `INSERT INTO deliverables (project_id, member_id, title, description, file_url, drive_link)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, title, description, file_url, drive_link, uploaded_at`,
      [id, result.user.id, title, description, file_url, drive_link]
    );

    // Create notification for admin
    await query(
      `INSERT INTO notifications (user_type, user_id, title, message, type)
       SELECT 'admin', id, $1, $2, $3
       FROM administrators`,
      [
        'New Deliverable Uploaded',
        `${(result.user as any).full_name} uploaded a deliverable`,
        'deliverable',
      ]
    );

    return NextResponse.json({ success: true, deliverable: deliverable[0] });
  } catch (error) {
    console.error('Create deliverable error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
