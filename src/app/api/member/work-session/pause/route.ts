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
    const session = await queryOne<{ id: string; start_time: string; total_duration_seconds: number; status: string }>(
      'SELECT id, start_time, total_duration_seconds, status FROM work_sessions WHERE id = $1 AND member_id = $2',
      [session_id, result.user.id]
    );

    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    if (session.status !== 'running') {
      return NextResponse.json(
        { error: 'Session is not running' },
        { status: 400 }
      );
    }

    // Calculate elapsed time
    const startTime = new Date(session.start_time).getTime();
    const now = Date.now();
    const additionalSeconds = Math.floor((now - startTime) / 1000);
    const totalSeconds = session.total_duration_seconds + additionalSeconds;

    // Update session
    await query(
      `UPDATE work_sessions 
       SET status = 'paused', pause_time = CURRENT_TIMESTAMP, total_duration_seconds = $1
       WHERE id = $2`,
      [totalSeconds, session_id]
    );

    // Create notification for admin
    await query(
      `INSERT INTO notifications (user_type, user_id, title, message, type)
       SELECT 'admin', a.id, $1, $2, $3
       FROM administrators a`,
      [
        'Work Session Paused',
        `${(result.user as any).full_name} paused their work session`,
        'work_session',
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pause work session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
