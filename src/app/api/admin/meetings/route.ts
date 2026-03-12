import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { sendMeetingNotificationEmail } from '@/lib/email';

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

    if (!project_id || !title || !meeting_date || !meeting_time) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Create meeting
    const meeting = await query(
      `INSERT INTO meetings (project_id, title, meeting_link, meeting_date, meeting_time)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, meeting_link, meeting_date, meeting_time`,
      [project_id, title, meeting_link, meeting_date, meeting_time]
    );

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
       WHERE pm.project_id = $1`,
      [project_id]
    );

    // Send notifications to all members
    for (const member of members) {
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
      await sendMeetingNotificationEmail(
        member.email,
        member.full_name,
        title,
        meeting_link || '',
        meeting_date,
        meeting_time,
        project[0]?.title || 'Project'
      );
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
