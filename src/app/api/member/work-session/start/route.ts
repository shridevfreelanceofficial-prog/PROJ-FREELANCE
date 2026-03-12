import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, type MemberUser } from '@/lib/auth';
import { query } from '@/lib/db';

type WorkSessionInsertRow = {
  id: string;
  project_id: string;
  start_time: string;
  status: string;
};

export async function POST(request: NextRequest) {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = (await request.json().catch(() => ({}))) as { project_id?: string };
    const project_id = body.project_id;

    if (!project_id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Check if there's already an active session
    const existingSession = await query(
      `SELECT id FROM work_sessions 
       WHERE member_id = $1 AND status IN ('running', 'paused')`,
      [result.user.id]
    );

    if (existingSession.length > 0) {
      return NextResponse.json(
        { error: 'You already have an active work session' },
        { status: 400 }
      );
    }

    // Create new work session
    const session = await query<WorkSessionInsertRow>(
      `INSERT INTO work_sessions (project_id, member_id, start_time, status)
       VALUES ($1, $2, CURRENT_TIMESTAMP, 'running')
       RETURNING id, project_id, start_time, status`,
      [project_id, result.user.id]
    );

    if (!session[0]) {
      return NextResponse.json(
        { error: 'Failed to start work session' },
        { status: 500 }
      );
    }

    const project = await query<{ title: string }>(
      'SELECT title FROM projects WHERE id = $1',
      [project_id]
    );

    // Create notification for admin with project details
    const projectName = project[0]?.title || 'Unknown Project';
    const startTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const member = result.user as MemberUser;
    
    await query(
      `INSERT INTO notifications (user_type, user_id, title, message, type, action_url)
       SELECT 'admin', a.id, $1, $2, $3, $4
       FROM administrators a`,
      [
        'Work Session Started',
        `${member.full_name} started working on "${projectName}" at ${startTime}`,
        'work_session',
        `/admin/dashboard/projects/${project_id}`,
      ]
    );

    return NextResponse.json({
      success: true,
      session: {
        ...session[0],
        project_title: projectName,
        total_duration_seconds: 0,
      },
    });
  } catch (error) {
    console.error('Start work session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
