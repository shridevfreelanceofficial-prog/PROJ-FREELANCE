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

    const members = await query(
      `SELECT pm.id, pm.member_id, pm.daily_working_hours, pm.participation_confirmed,
              m.full_name, m.email, m.role
       FROM project_members pm
       JOIN members m ON pm.member_id = m.id
       WHERE pm.project_id = $1
       ORDER BY m.full_name`,
      [id]
    );

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Get project members error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
