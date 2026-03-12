import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { certificate_code } = await request.json();

    if (!certificate_code) {
      return NextResponse.json(
        { error: 'Certificate code is required' },
        { status: 400 }
      );
    }

    const certificate = await queryOne<{
      member_name: string;
      project_name: string;
      start_date: string;
      end_date: string;
      is_valid: boolean;
      issued_at: string;
    }>(
      `SELECT m.full_name as member_name, p.title as project_name, p.start_date, p.end_date, 
              c.is_valid, c.issued_at
       FROM certificates c
       JOIN members m ON c.member_id = m.id
       JOIN projects p ON c.project_id = p.id
       WHERE c.certificate_code = $1 AND c.is_valid = true`,
      [certificate_code.toUpperCase()]
    );

    if (!certificate) {
      return NextResponse.json(
        { error: 'Invalid certificate code' },
        { status: 404 }
      );
    }

    return NextResponse.json({ certificate });
  } catch (error) {
    console.error('Verify certificate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
