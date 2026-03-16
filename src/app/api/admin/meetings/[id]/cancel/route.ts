import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { sendMeetingCancellationEmail } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const meeting = await query<{
      id: string;
      title: string;
      project_id: string;
      meeting_link: string | null;
      meeting_date: string;
      meeting_time: string;
      status: string | null;
    }>(
      `SELECT id,
              title,
              project_id,
              meeting_link,
              to_char(meeting_date, 'YYYY-MM-DD') as meeting_date,
              to_char(meeting_time, 'HH24:MI') as meeting_time,
              status
       FROM meetings
       WHERE id = $1
       LIMIT 1`,
      [id]
    );

    if (meeting.length === 0) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    if (meeting[0].status === 'cancelled') {
      return NextResponse.json({ success: true });
    }

    await query(
      `UPDATE meetings
       SET status = 'cancelled', cancelled_at = NOW()
       WHERE id = $1`,
      [id]
    );

    const project = await query<{ title: string }>(
      `SELECT title FROM projects WHERE id = $1 LIMIT 1`,
      [meeting[0].project_id]
    );

    const members = await query<{ id: string; email: string; full_name: string }>(
      `SELECT m.id, m.email, m.full_name
       FROM members m
       JOIN project_members pm ON m.id = pm.member_id
       WHERE pm.project_id = $1 AND pm.participation_confirmed = true`,
      [meeting[0].project_id]
    );

    for (const member of members) {
      await query(
        `INSERT INTO notifications (user_type, user_id, title, message, type, action_url)
         VALUES ('member', $1, $2, $3, $4, $5)`,
        [
          member.id,
          'Meeting Cancelled',
          `Meeting "${meeting[0].title}" for project ${project[0]?.title || 'Project'} has been cancelled.`,
          'meeting_cancelled',
          `/member/dashboard/projects/${meeting[0].project_id}`,
        ]
      );

      if (member.email) {
        await sendMeetingCancellationEmail(
          member.email,
          member.full_name,
          meeting[0].title,
          meeting[0].meeting_date,
          meeting[0].meeting_time,
          project[0]?.title || 'Project'
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Cancel meeting error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
