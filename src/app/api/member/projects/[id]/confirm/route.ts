import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

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

    // Check if member is assigned to this project
    const projectMember = await queryOne<{ id: string; participation_confirmed: boolean }>(
      'SELECT id, participation_confirmed FROM project_members WHERE project_id = $1 AND member_id = $2',
      [id, result.user.id]
    );

    if (!projectMember) {
      return NextResponse.json(
        { error: 'You are not assigned to this project' },
        { status: 403 }
      );
    }

    if (projectMember.participation_confirmed) {
      return NextResponse.json(
        { error: 'Participation already confirmed' },
        { status: 400 }
      );
    }

    // Update participation status
    await query(
      'UPDATE project_members SET participation_confirmed = true WHERE id = $1',
      [projectMember.id]
    );

    // Notify admin about confirmation
    const projectInfo = await queryOne<{ title: string }>(
      'SELECT title FROM projects WHERE id = $1',
      [id]
    );

    await query(
      `INSERT INTO notifications (user_type, user_id, title, message, type, action_url)
       SELECT 'admin', a.id, $1, $2, $3, $4
       FROM administrators a`,
      [
        'Project Participation Confirmed',
        `${(result.user as any).full_name} confirmed participation for "${projectInfo?.title || 'Unknown Project'}"`,
        'project',
        `/admin/dashboard/projects/${id}`,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Confirm participation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
