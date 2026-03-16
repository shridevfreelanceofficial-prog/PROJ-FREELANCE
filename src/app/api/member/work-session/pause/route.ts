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

    // Get project info for notification
    const projectInfo = await query<{ project_id: string; project_name: string }>(
      `SELECT ws.project_id, p.title as project_name 
       FROM work_sessions ws 
       JOIN projects p ON ws.project_id = p.id 
       WHERE ws.id = $1`,
      [session_id]
    );
    const projectName = projectInfo[0]?.project_name || 'Unknown Project';
    const pauseTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const durationMinutes = Math.floor(totalSeconds / 60);
    
    await notifyAdmins({
      title: 'Work Session Paused',
      message: `${(result.user as any).full_name} paused working on "${projectName}" at ${pauseTime} (${durationMinutes}m total)`,
      type: 'work_session',
      action_url: projectInfo[0]?.project_id ? `/admin/dashboard/projects/${projectInfo[0]?.project_id}` : undefined,
    });

    return NextResponse.json({
      success: true,
      session: {
        id: session_id,
        project_id: projectInfo[0]?.project_id,
        project_title: projectName,
        status: 'paused',
        start_time: session.start_time,
        pause_time: new Date().toISOString(),
        total_duration_seconds: totalSeconds,
      },
    });
  } catch (error) {
    console.error('Pause work session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
