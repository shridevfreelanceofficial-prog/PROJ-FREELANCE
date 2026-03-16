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

    const projectInfo = await queryOne<{ project_id: string; project_title: string; start_time: string; total_duration_seconds: number }>(
      `SELECT ws.project_id, p.title as project_title, ws.start_time, ws.total_duration_seconds
       FROM work_sessions ws
       JOIN projects p ON p.id = ws.project_id
       WHERE ws.id = $1`,
      [session_id]
    );

    const projectTitle = projectInfo?.project_title || 'Unknown Project';
    await notifyAdmins({
      title: 'Work Session Resumed',
      message: `${(result.user as any).full_name} resumed working on "${projectTitle}"`,
      type: 'work_session',
      action_url: projectInfo?.project_id ? `/admin/dashboard/projects/${projectInfo.project_id}` : undefined,
    });

    return NextResponse.json({
      success: true,
      session: projectInfo
        ? {
            id: session_id,
            project_id: projectInfo.project_id,
            project_title: projectInfo.project_title,
            status: 'running',
            start_time: projectInfo.start_time,
            pause_time: null,
            total_duration_seconds: projectInfo.total_duration_seconds,
          }
        : null,
    });
  } catch (error) {
    console.error('Resume work session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
