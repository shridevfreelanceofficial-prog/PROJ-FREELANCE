import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const projects = await query(
      `SELECT p.id, p.title, p.description, p.status, p.start_date, p.end_date,
              pm.participation_confirmed
       FROM projects p
       JOIN project_members pm ON p.id = pm.project_id
       WHERE pm.member_id = $1
       ORDER BY p.created_at DESC`,
      [result.user.id]
    );

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Get member projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
