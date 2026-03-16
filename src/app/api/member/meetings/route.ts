import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'member') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const meetings = await query<{
      id: string;
      title: string;
      project_id: string;
      project_name: string;
      meeting_date: string;
      meeting_time: string;
      meeting_link: string | null;
      reminder_sent: boolean;
    }>(
      `SELECT m.id,
              m.title,
              m.project_id,
              p.title as project_name,
              to_char(m.meeting_date, 'YYYY-MM-DD') as meeting_date,
              to_char(m.meeting_time, 'HH24:MI') as meeting_time,
              m.meeting_link,
              m.reminder_sent
       FROM meetings m
       JOIN projects p ON p.id = m.project_id
       JOIN project_members pm ON pm.project_id = m.project_id
       WHERE pm.member_id = $1
         AND pm.participation_confirmed = true
         AND (m.status IS NULL OR m.status = 'scheduled')
       ORDER BY m.meeting_date ASC, m.meeting_time ASC
       LIMIT 100`,
      [result.user.id]
    );

    return NextResponse.json({ meetings });
  } catch (error) {
    console.error('Get member meetings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
