import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { queryOne } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get project details
    const project = await queryOne<{
      id: string;
      name: string;
      description: string | null;
      requirements: string | null;
      start_date: string | null;
      end_date: string | null;
      status: string;
      client_name: string | null;
    }>(
      `SELECT p.id, p.title as name, p.description, p.requirements, p.start_date, p.end_date, p.status,
              NULL::text as client_name
       FROM projects p
       WHERE p.id = $1`,
      [id]
    );

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Check if member is assigned to this project
    const projectMember = await queryOne<{
      id: string;
      participation_confirmed: boolean;
      daily_working_hours: number;
    }>(
      `SELECT id, participation_confirmed, daily_working_hours
       FROM project_members
       WHERE project_id = $1 AND member_id = $2`,
      [id, result.user.id]
    );

    if (!projectMember) {
      return NextResponse.json(
        { error: 'You are not assigned to this project' },
        { status: 403 }
      );
    }

    return NextResponse.json({ project, projectMember });
  } catch (error) {
    console.error('Get member project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
