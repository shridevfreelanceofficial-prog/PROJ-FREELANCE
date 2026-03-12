import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { uploadDailyReport } from '@/lib/blob';

export async function GET() {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const reports = await query<{
      id: string;
      project_id: string;
      project_title: string;
      report_date: string;
      report_url: string;
      work_hours: string;
      summary: string | null;
    }>(
      `SELECT dr.id, dr.project_id, p.title as project_title, dr.report_date, dr.report_url, dr.work_hours, dr.summary
       FROM daily_reports dr
       JOIN projects p ON dr.project_id = p.id
       WHERE dr.member_id = $1
       ORDER BY dr.report_date DESC`,
      [result.user.id]
    );

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Get member reports error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const project_id = formData.get('project_id') as string;
    const report_date = formData.get('report_date') as string;
    const work_hours = formData.get('work_hours') as string;
    const summary = formData.get('summary') as string;
    const report_file = formData.get('report_file') as File;

    if (!project_id || !report_date || !work_hours || !report_file) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if member is confirmed for this project
    const projectMember = await query<{ participation_confirmed: boolean }>(
      'SELECT participation_confirmed FROM project_members WHERE project_id = $1 AND member_id = $2',
      [project_id, result.user.id]
    );

    if (!projectMember.length || !projectMember[0].participation_confirmed) {
      return NextResponse.json(
        { error: 'You must confirm your participation before submitting reports' },
        { status: 403 }
      );
    }

    // Upload file to Vercel Blob
    const uploadResult = await uploadDailyReport(report_file, project_id, result.user.id);

    // Save report to database
    const report = await query(
      `INSERT INTO daily_reports (project_id, member_id, report_date, report_url, work_hours, summary)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, report_date, report_url, work_hours`,
      [project_id, result.user.id, report_date, uploadResult.url, work_hours, summary]
    );

    // Get project name for notification
    const projectInfo = await query<{ name: string }>(
      'SELECT name FROM projects WHERE id = $1',
      [project_id]
    );
    const projectName = projectInfo[0]?.name || 'Unknown Project';

    // Create notification for admin with project details
    await query(
      `INSERT INTO notifications (user_type, user_id, title, message, type, action_url)
       SELECT 'admin', id, $1, $2, $3, $4
       FROM administrators`,
      [
        'Daily Report Submitted',
        `${(result.user as any).full_name} submitted a daily report for "${projectName}"`,
        'daily_report',
        `/admin/dashboard/projects/${project_id}`,
      ]
    );

    return NextResponse.json({ success: true, report: report[0] });
  } catch (error) {
    console.error('Create daily report error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
