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

    const notifications = await query(
      `SELECT id, title, message, type, is_read, created_at
       FROM notifications
       WHERE user_type = 'member' AND user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [result.user.id]
    );

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Get member notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
