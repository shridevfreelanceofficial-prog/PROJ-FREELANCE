import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { notifyAdmins } from '@/lib/notifications';

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

    // Get project info for notification
    const projectInfo = await query<{ project_id: string; project_name: string }>(
      `SELECT ws.project_id, p.title as project_name 
       FROM work_sessions ws 
       JOIN projects p ON ws.project_id = p.id 
       WHERE ws.id = $1`,
      [session_id]
    );
    const projectName = projectInfo[0]?.project_name || 'Unknown Project';
    const stopTime = new Date().toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',
    });
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    await notifyAdmins({
      title: 'Work Session Completed',
      message: `${(result.user as any).full_name} completed working on "${projectName}" at ${stopTime} (${hours}h ${minutes}m total)`,
      type: 'work_session',
      action_url: projectInfo[0]?.project_id ? `/admin/dashboard/projects/${projectInfo[0]?.project_id}` : undefined,
    });

    return NextResponse.json({
      success: true,
      total_seconds: totalSeconds,
      session: null,
    });
  } catch (error) {
    console.error('Stop work session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
