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

    // Calculate final elapsed time
    let totalSeconds = session.total_duration_seconds;
    if (session.status === 'running') {
      const startTime = new Date(session.start_time).getTime();
      const now = Date.now();
      const additionalSeconds = Math.floor((now - startTime) / 1000);
      totalSeconds += additionalSeconds;
    }

    // Update session
    await query(
      `UPDATE work_sessions 
       SET status = 'stopped', end_time = CURRENT_TIMESTAMP, total_duration_seconds = $1
       WHERE id = $2`,
      [totalSeconds, session_id]
    );

    // Create notification for admin
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    await query(
      `INSERT INTO notifications (user_type, user_id, title, message, type)
       SELECT 'admin', a.id, $1, $2, $3
       FROM administrators a`,
      [
        'Work Session Completed',
        `${(result.user as any).full_name} completed their work session (${hours}h ${minutes}m)`,
        'work_session',
      ]
    );

    return NextResponse.json({ success: true, total_seconds: totalSeconds });
  } catch (error) {
    console.error('Stop work session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
