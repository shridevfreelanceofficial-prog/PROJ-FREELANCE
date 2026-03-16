import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const deliverables = await query<{
      id: string;
      title: string | null;
      description: string | null;
      file_url: string | null;
      uploaded_at: string;
      member_name: string;
    }>(
      `SELECT d.id,
              d.title,
              d.description,
              d.file_url,
              d.created_at as uploaded_at,
              m.full_name as member_name
       FROM deliverables d
       JOIN members m ON d.uploaded_by = m.id
       WHERE d.project_id = $1
       ORDER BY d.created_at DESC`,
      [id]
    );

    return NextResponse.json({ deliverables });
  } catch (error) {
    console.error('Get project deliverables error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
