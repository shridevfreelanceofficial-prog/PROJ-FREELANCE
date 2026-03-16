import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

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
      `WITH notif AS (
         SELECT n.id, n.title, n.message, n.type, n.is_read, n.created_at, n.action_url, n.action_data,
                substring(n.action_url from '/member/dashboard/projects/([0-9a-f\-]{36})')::uuid as project_id
         FROM notifications n
         WHERE n.user_type = 'member' AND n.user_id = $1
       )
       SELECT notif.id, notif.title, notif.message, notif.type, notif.is_read, notif.created_at, notif.action_url, notif.action_data
       FROM notif
       LEFT JOIN project_members pm
         ON pm.project_id = notif.project_id AND pm.member_id = $1
       WHERE notif.project_id IS NULL OR pm.participation_confirmed = true
       ORDER BY notif.created_at DESC
       LIMIT 50`,
      [result.user.id]
    );

    const unread = await queryOne<{ count: string }>(
      `WITH notif AS (
         SELECT n.id, n.is_read, n.action_url,
                substring(n.action_url from '/member/dashboard/projects/([0-9a-f\-]{36})')::uuid as project_id
         FROM notifications n
         WHERE n.user_type = 'member' AND n.user_id = $1
       )
       SELECT COUNT(*)::text as count
       FROM notif
       LEFT JOIN project_members pm
         ON pm.project_id = notif.project_id AND pm.member_id = $1
       WHERE (notif.project_id IS NULL OR pm.participation_confirmed = true)
         AND notif.is_read = false`,
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
    console.error('Get member notifications error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
