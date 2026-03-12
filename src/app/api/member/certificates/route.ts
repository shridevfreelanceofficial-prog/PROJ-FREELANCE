import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const certificates = await query<{
      id: string;
      certificate_code: string;
      project_name: string;
      client_name: string;
      issue_date: string;
      certificate_url: string;
    }>(
      `SELECT c.id, c.certificate_code, p.name as project_name, p.client_name, 
              c.issue_date, c.certificate_url
       FROM certificates c
       JOIN projects p ON c.project_id = p.id
       WHERE c.member_id = $1
       ORDER BY c.issue_date DESC`,
      [result.user.id]
    );

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error('Get member certificates error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
