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
    const body = await request.json();
    const memberId = body?.member_id as string | undefined;
    const dailyWorkingHours = body?.daily_working_hours as number | undefined;

    if (!memberId || typeof dailyWorkingHours !== 'number' || Number.isNaN(dailyWorkingHours)) {
      return NextResponse.json(
        { error: 'member_id and daily_working_hours are required' },
        { status: 400 }
      );
    }

    const inserted = await query(
      `INSERT INTO project_members (project_id, member_id, daily_working_hours)
       VALUES ($1, $2, $3)
       ON CONFLICT (project_id, member_id) DO NOTHING
       RETURNING id, project_id, member_id, daily_working_hours, participation_confirmed`,
      [id, memberId, dailyWorkingHours]
    );

    if (!inserted || inserted.length === 0) {
      return NextResponse.json(
        { error: 'Member is already assigned to this project' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: true, member: inserted[0] },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Add project member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('member_id');

    if (!memberId) {
      return NextResponse.json({ error: 'member_id is required' }, { status: 400 });
    }

    await query(
      'DELETE FROM project_members WHERE project_id = $1 AND member_id = $2',
      [id, memberId]
    );

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Remove project member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
