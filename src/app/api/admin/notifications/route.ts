import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export async function GET() {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const notifications = await query<{
      id: string;
      title: string;
      message: string;
      type: string;
      is_read: boolean;
      created_at: string;
      action_url: string | null;
      action_data: any | null;
    }>(
      `SELECT id, title, message, type, is_read, created_at, action_url, action_data
       FROM notifications
       WHERE user_type = 'admin' AND user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [result.user.id]
    );

    const unread = await queryOne<{ count: string }>(
      `SELECT COUNT(*)::text as count
       FROM notifications
       WHERE user_type = 'admin' AND user_id = $1 AND is_read = false`,
      [result.user.id]
    );

    return NextResponse.json(
      { notifications, unread_count: Number(unread?.count || 0) },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Get admin notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
