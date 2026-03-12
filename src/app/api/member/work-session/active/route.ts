import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET() {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const session = await queryOne<{
      id: string;
      project_id: string;
      project_title: string;
      status: string;
      start_time: string | null;
      total_duration_seconds: number;
    }>(
      `SELECT ws.id, ws.project_id, p.title as project_title, ws.status, ws.start_time, ws.total_duration_seconds
       FROM work_sessions ws
       JOIN projects p ON ws.project_id = p.id
       WHERE ws.member_id = $1 AND ws.status IN ('running', 'paused')
       ORDER BY ws.start_time DESC
       LIMIT 1`,
      [result.user.id]
    );

    return NextResponse.json({ session });
  } catch (error) {
    console.error('Get active work session error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
