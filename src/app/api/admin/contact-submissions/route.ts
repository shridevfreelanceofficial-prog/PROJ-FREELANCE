import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submissions = await query<{
      id: string;
      name: string;
      email: string;
      phone: string | null;
      subject: string | null;
      message: string;
      is_read: boolean;
      created_at: string;
    }>(
      `SELECT id, name, email, phone, subject, message, is_read, created_at
       FROM contact_submissions
       ORDER BY created_at DESC
       LIMIT 500`
    );

    return NextResponse.json(
      { submissions },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Get contact submissions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
