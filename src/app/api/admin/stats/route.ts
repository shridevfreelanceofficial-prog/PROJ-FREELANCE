import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET() {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get total projects
    const totalProjects = await queryOne<{ count: string }>(
      'SELECT COUNT(*) as count FROM projects'
    );

    // Get active projects
    const activeProjects = await queryOne<{ count: string }>(
      "SELECT COUNT(*) as count FROM projects WHERE status = 'active'"
    );

    // Get total members
    const totalMembers = await queryOne<{ count: string }>(
      'SELECT COUNT(*) as count FROM members WHERE is_active = true'
    );

    // Get pending payments
    const pendingPayments = await queryOne<{ count: string }>(
      "SELECT COUNT(*) as count FROM payments WHERE status = 'unpaid'"
    );

    // Get upcoming meetings
    const upcomingMeetings = await queryOne<{ count: string }>(
      "SELECT COUNT(*) as count FROM meetings WHERE meeting_date >= CURRENT_DATE"
    );

    return NextResponse.json({
      totalProjects: parseInt(totalProjects?.count || '0'),
      activeProjects: parseInt(activeProjects?.count || '0'),
      totalMembers: parseInt(totalMembers?.count || '0'),
      pendingPayments: parseInt(pendingPayments?.count || '0'),
      upcomingMeetings: parseInt(upcomingMeetings?.count || '0'),
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
