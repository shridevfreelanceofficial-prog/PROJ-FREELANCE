import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { queryOne, query } from '@/lib/db';
import { getSignedUrl } from '@/lib/blob';

const JWT_SECRET = process.env.JWT_SECRET || 'shrikeshshettyshridevfreelance';

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('profilemitraa_authToken')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; username: string; email: string };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rows = await query<{
      id: string;
      activity_type: string;
      actor_id: string | null;
      actor_name: string | null;
      actor_username: string | null;
      actor_avatar_url: string | null;
      details: string | null;
      created_at: string;
    }>(
      `SELECT id, activity_type, actor_id, actor_name, actor_username, actor_avatar_url, details, created_at
       FROM profilemitraa_activities
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 20`,
      [authUser.userId]
    );

    const activities = rows.map((a) => ({
      ...a,
      actor_avatar_url: a.actor_avatar_url ? getSignedUrl(a.actor_avatar_url) : null,
    }));

    return NextResponse.json({
      success: true,
      activities,
    });
  } catch (err: any) {
    console.error('Fetch activities error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

