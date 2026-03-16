import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { notifyAdmins, notifyMember } from '@/lib/notifications';

// This endpoint should be called by a cron job daily at end of day
// It checks for members who didn't submit daily reports and notifies admin

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

    // Get today's date
    const today = new Date().toISOString().split('T')[0];

    // Find all active project members who should have submitted a report today
    // but didn't (for active projects)
    const missingReports = await query<{
      member_id: string;
      member_name: string;
      member_email: string;
      project_id: string;
      project_name: string;
      daily_working_hours: number;
    }>(
      `SELECT 
        pm.member_id, 
        m.full_name as member_name, 
        m.email as member_email,
        pm.project_id, 
        p.title as project_name,
        pm.daily_working_hours
       FROM project_members pm
       JOIN members m ON pm.member_id = m.id
       JOIN projects p ON pm.project_id = p.id
       WHERE p.status = 'active'
         AND pm.participation_confirmed = true
         AND m.is_active = true
         AND NOT EXISTS (
           SELECT 1 FROM daily_reports dr
           WHERE dr.member_id = pm.member_id 
             AND dr.project_id = pm.project_id
             AND dr.report_date = $1
         )`,
      [today]
    );

    // Group by project for team notifications
    const projectGroups: Record<string, typeof missingReports> = {};
    
    for (const report of missingReports) {
      if (!projectGroups[report.project_id]) {
        projectGroups[report.project_id] = [];
      }
      projectGroups[report.project_id].push(report);
    }

    // Send notifications
    for (const projectId in projectGroups) {
      const members = projectGroups[projectId];
      const projectName = members[0].project_name;

      // Notify admin about all missing reports for this project
      await notifyAdmins({
        title: 'Missing Daily Reports',
        message: `${members.length} member(s) failed to submit daily reports for "${projectName}" today`,
        type: 'daily_report_missing',
        action_url: `/admin/dashboard/projects/${projectId}`,
      });

      // Notify each team member who failed to submit
      for (const member of members) {
        await notifyMember(member.member_id, {
          title: 'Daily Report Reminder',
          message: `You haven't submitted your daily report for "${projectName}" today. Please submit it as soon as possible.`,
          type: 'daily_report_reminder',
        });
      }
    }

    return NextResponse.json({
      success: true,
      checkedDate: today,
      missingReports: missingReports.length,
      projectsAffected: Object.keys(projectGroups).length,
    });
  } catch (error) {
    console.error('Daily report check cron error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
