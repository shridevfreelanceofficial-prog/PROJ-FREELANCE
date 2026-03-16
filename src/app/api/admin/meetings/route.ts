import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { sendMeetingNotificationEmail } from '@/lib/email';

export async function GET() {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'admin') {
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
      status: string | null;
      cancelled_at: string | null;
      reminder_sent: boolean;
    }>(
      `SELECT m.id,
              m.title,
              m.project_id,
              p.title as project_name,
              to_char(m.meeting_date, 'YYYY-MM-DD') as meeting_date,
              to_char(m.meeting_time, 'HH24:MI') as meeting_time,
              m.meeting_link,
              m.status,
              m.cancelled_at,
              m.reminder_sent
       FROM meetings m
       JOIN projects p ON p.id = m.project_id
       ORDER BY m.meeting_date DESC, m.meeting_time DESC
       LIMIT 200`
    );

    return NextResponse.json({ meetings });
  } catch (error) {
    console.error('Get meetings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { project_id, title, meeting_link, meeting_date, meeting_time } = await request.json();

    const normalizedMeetingLink = typeof meeting_link === 'string' && meeting_link.trim()
      ? /^https?:\/\//i.test(meeting_link.trim())
        ? meeting_link.trim()
        : `https://${meeting_link.trim()}`
      : null;

    if (!project_id || !title || !meeting_date || !meeting_time) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create meeting
    const meeting = await query<{
      id: string;
      title: string;
      meeting_link: string | null;
      meeting_date: string;
      meeting_time: string;
    }>(
      `INSERT INTO meetings (project_id, title, meeting_link, meeting_date, meeting_time)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, meeting_link, meeting_date, meeting_time`,
      [project_id, title, normalizedMeetingLink, meeting_date, meeting_time]
    );

    const meetingId = meeting[0]?.id || '';

    // Get project details
    const project = await query<{ title: string }>(
      'SELECT title FROM projects WHERE id = $1',
      [project_id]
    );

    // Get assigned members
    const members = await query<{ id: string; email: string; full_name: string }>(
      `SELECT m.id, m.email, m.full_name
       FROM members m
       JOIN project_members pm ON m.id = pm.member_id
       WHERE pm.project_id = $1 AND pm.participation_confirmed = true`,
      [project_id]
    );

    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
      console.error('Brevo SMTP is not configured (BREVO_SMTP_USER / BREVO_SMTP_PASS) - meeting emails will not be sent');
    }

    // Send notifications to all members
    for (const member of members) {
      if (!member.email) {
        console.error(`Member ${member.id} has no email. Skipping meeting email.`);
      }

      // Create in-app notification
      await query(
        `INSERT INTO notifications (user_type, user_id, title, message, type, action_url)
         VALUES ('member', $1, $2, $3, $4, $5)`,
        [
          member.id,
          'Meeting Scheduled',
          `Meeting "${title}" has been scheduled for ${meeting_date} at ${meeting_time}`,
          'meeting',
          `/member/dashboard/projects/${project_id}`,
        ]
      );

      // Send email notification
      if (member.email) {
        const ok = await sendMeetingNotificationEmail(
          member.email,
          member.full_name,
          title,
          normalizedMeetingLink || '',
          meeting_date,
          meeting_time,
          project[0]?.title || 'Project'
        );

        if (!ok) {
          console.error(`Failed to send meeting email to ${member.email} for meeting ${meetingId}`);
        }
      }
    }

    return NextResponse.json({ success: true, meeting: meeting[0] });
  } catch (error) {
    console.error('Create meeting error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
