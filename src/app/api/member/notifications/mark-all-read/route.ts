import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function PATCH() {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'member') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await query(
      `UPDATE notifications
       SET is_read = true
       WHERE user_type = 'member' AND user_id = $1 AND is_read = false`,
      [result.user.id]
    );

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Mark all member notifications read error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
