import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendMeetingReminderEmail } from '@/lib/email';

// This endpoint should be called by a cron job every minute
// It checks for meetings starting in 5 minutes and sends reminders

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Find meetings starting in approximately 5 minutes
    // Using a 2-minute window to account for cron timing
    const meetings = await query<{
      id: string;
      title: string;
      meeting_time: string;
      meeting_link: string | null;
      project_id: string;
      project_name: string;
    }>(
      `SELECT m.id, m.title, m.meeting_time, m.meeting_link, m.project_id, p.name as project_name
       FROM meetings m
       JOIN projects p ON m.project_id = p.id
       WHERE m.status = 'scheduled'
         AND m.reminder_sent = false
         AND m.meeting_time BETWEEN NOW() + INTERVAL '3 minutes' AND NOW() + INTERVAL '7 minutes'`
    );

    for (const meeting of meetings) {
      // Get all confirmed project members for this meeting
      const members = await query<{
        member_id: string;
        email: string;
        full_name: string;
      }>(
        `SELECT pm.member_id, m.email, m.full_name
         FROM project_members pm
         JOIN members m ON pm.member_id = m.id
         WHERE pm.project_id = $1 AND pm.participation_confirmed = true AND m.is_active = true`,
        [meeting.project_id]
      );

      // Send notification to each member
      for (const member of members) {
        // Create in-app notification
        await query(
          `INSERT INTO notifications (user_type, user_id, title, message, type, action_url)
           VALUES ('member', $1, $2, $3, $4, $5)`,
          [
            member.member_id,
            'Meeting Reminder',
            `Your meeting "${meeting.title}" for project ${meeting.project_name} starts in 5 minutes.`,
            'meeting_reminder',
            meeting.meeting_link || `/member/dashboard/projects/${meeting.project_id}`,
          ]
        );

        // Send email notification
        try {
          await sendMeetingReminderEmail(
            member.email,
            member.full_name,
            meeting.title,
            meeting.meeting_link || '',
            meeting.project_name
          );
        } catch (emailError) {
          console.error('Failed to send meeting reminder email:', emailError);
        }
      }

      // Mark reminder as sent
      await query(
        'UPDATE meetings SET reminder_sent = true WHERE id = $1',
        [meeting.id]
      );
    }

    return NextResponse.json({
      success: true,
      remindersSent: meetings.length,
    });
  } catch (error) {
    console.error('Meeting reminder cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
