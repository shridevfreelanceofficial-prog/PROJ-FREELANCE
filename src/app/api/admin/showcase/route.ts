import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { uploadPublicFile } from '@/lib/blob';

type ShowcaseTeamMember = { name: string; role: string | null };

export async function GET() {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const showcase = await query<{
      id: string;
      project_id: string | null;
      title: string;
      client_name: string | null;
      description: string | null;
      requirements: string | null;
      media_drive_link: string | null;
      live_website_url: string | null;
      daily_working_hours: string | null;
      cover_image_url: string | null;
      start_date: string | null;
      end_date: string | null;
      team_members: ShowcaseTeamMember[] | null;
      is_visible: boolean;
      created_at: string;
    }>(
      `SELECT id, project_id, title, client_name, description, requirements, media_drive_link, daily_working_hours,
              live_website_url, cover_image_url, start_date, end_date, team_members, is_visible, created_at
       FROM project_showcase
       ORDER BY created_at DESC`
    );

    return NextResponse.json({ showcase });
  } catch (error) {
    console.error('Get showcase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const mode = String(formData.get('mode') || 'manual');

    const coverImage = formData.get('cover_image') as File | null;
    if (!coverImage || coverImage.size === 0) {
      return NextResponse.json({ error: 'cover_image is required' }, { status: 400 });
    }

    const coverUpload = await uploadPublicFile(coverImage, 'showcase-covers');

    if (mode === 'import') {
      const projectId = String(formData.get('project_id') || '').trim();
      if (!projectId) {
        return NextResponse.json({ error: 'project_id is required for import' }, { status: 400 });
      }

      const project = await queryOne<{
        title: string;
        client_name: string | null;
        description: string | null;
        requirements: string | null;
        media_drive_link: string | null;
        final_website_url: string | null;
        start_date: string | null;
        end_date: string | null;
        status: string;
      }>(
        `SELECT title, client_name, description, requirements, media_drive_link, final_website_url, start_date, end_date, status
         FROM projects
         WHERE id = $1`,
        [projectId]
      );

      if (!project) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

      if (project.status !== 'completed') {
        return NextResponse.json({ error: 'Only completed projects can be imported' }, { status: 400 });
      }

      const team = await query<ShowcaseTeamMember & { daily_working_hours: string | null }>(
        `SELECT m.full_name as name, m.role, pm.daily_working_hours
         FROM project_members pm
         JOIN members m ON m.id = pm.member_id
         WHERE pm.project_id = $1
         ORDER BY m.full_name`,
        [projectId]
      );

      const avgHours = await queryOne<{ hours: string | null }>(
        `SELECT AVG(daily_working_hours)::text as hours
         FROM project_members
         WHERE project_id = $1`,
        [projectId]
      );

      await query(
        `INSERT INTO project_showcase (
           project_id, title, client_name, description, requirements, media_drive_link, live_website_url, daily_working_hours,
           cover_image_url, start_date, end_date, team_members, is_visible
         )
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, false)
         ON CONFLICT (project_id)
         DO UPDATE SET
           title = EXCLUDED.title,
           client_name = EXCLUDED.client_name,
           description = EXCLUDED.description,
           requirements = EXCLUDED.requirements,
           media_drive_link = EXCLUDED.media_drive_link,
           live_website_url = EXCLUDED.live_website_url,
           daily_working_hours = EXCLUDED.daily_working_hours,
           cover_image_url = EXCLUDED.cover_image_url,
           start_date = EXCLUDED.start_date,
           end_date = EXCLUDED.end_date,
           team_members = EXCLUDED.team_members`,
        [
          projectId,
          project.title,
          project.client_name,
          project.description,
          project.requirements,
          project.media_drive_link,
          project.final_website_url,
          avgHours?.hours ?? null,
          coverUpload.url,
          project.start_date,
          project.end_date,
          JSON.stringify(team.map(({ name, role }) => ({ name, role }))),
        ]
      );

      return NextResponse.json({ success: true });
    }

    // Manual entry
    const title = String(formData.get('title') || '').trim();
    const client_name = (formData.get('client_name') as string | null) || null;
    const description = (formData.get('description') as string | null) || null;
    const requirements = (formData.get('requirements') as string | null) || null;
    const media_drive_link = (formData.get('media_drive_link') as string | null) || null;
    const live_website_url = (formData.get('live_website_url') as string | null) || null;
    const start_date = (formData.get('start_date') as string | null) || null;
    const end_date = (formData.get('end_date') as string | null) || null;
    const daily_working_hoursRaw = (formData.get('daily_working_hours') as string | null) || null;

    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    const projectId = (formData.get('project_id') as string | null) || null;

    let teamMembers: ShowcaseTeamMember[] | null = null;
    const teamMembersJson = (formData.get('team_members_json') as string | null) || null;

    if (teamMembersJson) {
      try {
        const parsed = JSON.parse(teamMembersJson) as unknown;
        if (Array.isArray(parsed)) {
          teamMembers = parsed
            .map((m) => {
              const name = typeof m?.name === 'string' ? m.name.trim() : '';
              const role = typeof m?.role === 'string' ? m.role.trim() : null;
              return name ? { name, role: role || null } : null;
            })
            .filter(Boolean) as ShowcaseTeamMember[];
        }
      } catch (e) {
        return NextResponse.json({ error: 'Invalid team_members_json' }, { status: 400 });
      }
    }

    const assignedMembersRaw = (formData.get('assigned_members') as string | null) || null;
    if (!teamMembersJson && assignedMembersRaw) {
      const ids = assignedMembersRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      if (ids.length > 0) {
        const rows = await query<{ name: string; role: string | null }>(
          `SELECT full_name as name, role
           FROM members
           WHERE id = ANY($1::uuid[])
           ORDER BY full_name`,
          [ids]
        );
        teamMembers = rows;
      }
    }

    await query(
      `INSERT INTO project_showcase (
         project_id, title, client_name, description, requirements, media_drive_link, live_website_url, daily_working_hours,
         cover_image_url, start_date, end_date, team_members, is_visible
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, false)`,
      [
        projectId,
        title,
        client_name,
        description,
        requirements,
        media_drive_link,
        live_website_url,
        daily_working_hoursRaw,
        coverUpload.url,
        start_date,
        end_date,
        teamMembers ? JSON.stringify(teamMembers) : null,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create showcase error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
