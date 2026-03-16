import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const projects = await query(
      `SELECT id, title, client_name, description, start_date, end_date, status, created_at 
       FROM projects 
       ORDER BY created_at DESC`
    );

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      client_name,
      description,
      requirements,
      media_drive_link,
      start_date,
      end_date,
      assigned_members,
      assign_to_self,
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Project title is required' },
        { status: 400 }
      );
    }

    // Create project
    interface ProjectResult {
      id: string;
      title: string;
      description: string | null;
      start_date: string | null;
      end_date: string | null;
      status: string;
    }

    const projectResult = await query<ProjectResult>(
      `INSERT INTO projects (title, client_name, description, requirements, media_drive_link, start_date, end_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, title, description, start_date, end_date, status`,
      [title, client_name || null, description, requirements, media_drive_link, start_date, end_date, result.user.id]
    );

    const project = projectResult[0] as ProjectResult;

    // Assign members to project
    if (assigned_members && assigned_members.length > 0) {
      for (const member of assigned_members) {
        await query(
          `INSERT INTO project_members (project_id, member_id, daily_working_hours)
           VALUES ($1, $2, $3)`,
          [project.id, member.member_id, member.daily_working_hours]
        );

        // Create notification for member
        await query(
          `INSERT INTO notifications (user_type, user_id, title, message, type, action_url)
           VALUES ('member', $1, $2, $3, $4, $5)`,
          [
            member.member_id,
            'New Project Assigned',
            `You have been assigned to the project "${title}". Please confirm your participation.`,
            'project_assignment',
            `/member/dashboard/projects/${project.id}`,
          ]
        );

        // Send email notification
        const { sendProjectAssignmentEmail } = await import('@/lib/email');
        const memberData = await query<{ email: string; full_name: string }>(
          'SELECT email, full_name FROM members WHERE id = $1',
          [member.member_id]
        );
        
        if (memberData.length > 0) {
          await sendProjectAssignmentEmail(
            memberData[0].email,
            memberData[0].full_name,
            title,
            description || '',
            start_date || '',
            end_date || ''
          );
        }
      }
    }

    // Assign admin to project if requested
    if (assign_to_self) {
      await query(
        `INSERT INTO project_admins (project_id, admin_id, daily_working_hours)
         VALUES ($1, $2, $3)`,
        [project.id, result.user.id, body.admin_working_hours || 8]
      );
    }

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
