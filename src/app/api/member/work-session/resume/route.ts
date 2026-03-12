import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { session_id } = await request.json();

    // Get current session
    const session = await queryOne<{ id: string; status: string }>(
      'SELECT id, status FROM work_sessions WHERE id = $1 AND member_id = $2',
      [session_id, result.user.id]
    );

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    if (session.status !== 'paused') {
      return NextResponse.json(
        { error: 'Session is not paused' },
        { status: 400 }
      );
    }

    // Update session
    await query(
      `UPDATE work_sessions 
       SET status = 'running', resume_time = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [session_id]
    );

    // Create notification for admin
    await query(
      `INSERT INTO notifications (user_type, user_id, title, message, type)
       SELECT 'admin', a.id, $1, $2, $3
       FROM administrators a`,
      [
        'Work Session Resumed',
        `${(result.user as any).full_name} resumed their work session`,
        'work_session',
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Resume work session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
