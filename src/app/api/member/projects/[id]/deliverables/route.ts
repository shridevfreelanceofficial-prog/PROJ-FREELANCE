import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { uploadDeliverable } from '@/lib/blob';
import { notifyAdmins } from '@/lib/notifications';

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
      uploaded_at: string;
    }>(
      `SELECT id, title, description, file_url, created_at as uploaded_at
       FROM deliverables
       WHERE project_id = $1 AND uploaded_by = $2
       ORDER BY created_at DESC`,
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
    const file = formData.get('file') as File | null;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!file || file.size === 0) {
      return NextResponse.json(
        { error: 'Please upload a PDF file' },
        { status: 400 }
      );
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    let file_url = null;

    if (file && file.size > 0) {
      const uploadResult = await uploadDeliverable(file, id);
      file_url = uploadResult.url;
    }

    const deliverable = await query(
      `INSERT INTO deliverables (project_id, uploaded_by, title, description, file_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, description, file_url, created_at as uploaded_at`,
      [id, result.user.id, title, description, file_url]
    );

    const project = await query<{ title: string }>('SELECT title FROM projects WHERE id = $1', [id]);
    const projectName = project[0]?.title || 'Project';

    await notifyAdmins({
      title: 'New Deliverable Uploaded',
      message: `${(result.user as any).full_name} uploaded a deliverable for "${projectName}"`,
      type: 'deliverable',
      action_url: `/admin/dashboard/projects/${id}`,
    });

    return NextResponse.json({ success: true, deliverable: deliverable[0] });
  } catch (error) {
    console.error('Create deliverable error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
