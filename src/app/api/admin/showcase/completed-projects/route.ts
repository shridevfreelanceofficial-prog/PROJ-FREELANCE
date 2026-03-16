import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await query<{
      id: string;
      title: string;
      client_name: string | null;
      description: string | null;
      requirements: string | null;
      media_drive_link: string | null;
      start_date: string | null;
      end_date: string | null;
      status: string;
      has_showcase: boolean;
    }>(
      `SELECT p.id,
              p.title,
              p.client_name,
              p.description,
              p.requirements,
              p.media_drive_link,
              p.start_date,
              p.end_date,
              p.status,
              (ps.id IS NOT NULL) as has_showcase
       FROM projects p
       LEFT JOIN project_showcase ps ON ps.project_id = p.id
       WHERE p.status = 'completed'
       ORDER BY p.end_date DESC NULLS LAST, p.created_at DESC`
    );

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Get completed projects for showcase error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
