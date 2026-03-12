import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { project_id } = await request.json();

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
    const session = await query(
      `INSERT INTO work_sessions (project_id, member_id, start_time, status)
       VALUES ($1, $2, CURRENT_TIMESTAMP, 'running')
       RETURNING id, project_id, start_time, status`,
      [project_id, result.user.id]
    );

    // Create notification for admin
    await query(
      `INSERT INTO notifications (user_type, user_id, title, message, type)
       SELECT 'admin', a.id, $1, $2, $3
       FROM administrators a
       CROSS JOIN members m
       WHERE m.id = $4`,
      [
        'Work Session Started',
        `${(result.user as any).full_name} started working on a project`,
        'work_session',
        result.user.id,
      ]
    );

    return NextResponse.json({ success: true, session: session[0] });
  } catch (error) {
    console.error('Start work session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
