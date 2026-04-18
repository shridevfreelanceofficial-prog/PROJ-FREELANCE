import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const inquiries = await query<{
      id: string;
      name: string;
      email: string;
      phone: string | null;
      plan_type: string;
      plan_name: string;
      subject: string | null;
      message: string;
      is_read: boolean;
      created_at: string;
    }>(
      `SELECT id, name, email, phone, plan_type, plan_name, subject, message, is_read, created_at
       FROM plan_inquiries
       ORDER BY created_at DESC
       LIMIT 500`
    );

    return NextResponse.json(
      { inquiries },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Get plan inquiries error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
