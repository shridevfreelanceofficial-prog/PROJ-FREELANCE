import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    const meetings = await query(
      `SELECT id,
              title,
              meeting_link,
              to_char(meeting_date, 'YYYY-MM-DD') as meeting_date,
              to_char(meeting_time, 'HH24:MI') as meeting_time,
              reminder_sent,
              created_at
       FROM meetings
       WHERE project_id = $1
       ORDER BY meeting_date DESC, meeting_time DESC`,
      [id]
    );

    return NextResponse.json({ meetings });
  } catch (error) {
    console.error('Get project meetings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
