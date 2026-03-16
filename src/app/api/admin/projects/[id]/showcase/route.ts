import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await request.json().catch(() => ({}));
    const showcase_enabled = body?.showcase_enabled as boolean | undefined;

    if (typeof showcase_enabled !== 'boolean') {
      return NextResponse.json(
        { error: 'showcase_enabled is required' },
        { status: 400 }
      );
    }

    const project = await queryOne<{
      id: string;
      title: string;
      description: string | null;
      requirements: string | null;
      media_drive_link: string | null;
      start_date: string | null;
      end_date: string | null;
    }>(
      `SELECT id, title, description, requirements, media_drive_link, start_date, end_date
       FROM projects
       WHERE id = $1`,
      [id]
    );

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    await query(
      `INSERT INTO project_showcase (project_id, title, description, requirements, media_drive_link, start_date, end_date, is_visible)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (project_id)
       DO UPDATE SET is_visible = EXCLUDED.is_visible`,
      [
        project.id,
        project.title,
        project.description,
        project.requirements,
        project.media_drive_link,
        project.start_date,
        project.end_date,
        showcase_enabled,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Toggle showcase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
