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

    const reports = await query(
      `SELECT dr.id, dr.report_date, dr.report_url, dr.work_hours, dr.summary,
              m.full_name as member_name
       FROM daily_reports dr
       JOIN members m ON dr.member_id = m.id
       WHERE dr.project_id = $1
       ORDER BY dr.report_date DESC`,
      [id]
    );

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Get project reports error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
