import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { query } from '@/lib/db';
import { getSignedUrl } from '@/lib/blob';

const JWT_SECRET = process.env.JWT_SECRET || 'shrikeshshettyshridevfreelance';

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('profilemitraa_authToken')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
  } catch { return null; }
}

// GET /api/profilemitraa/users — list all registered users (public), excluding self
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    // Get logged-in user to exclude self from list
    const authUser = await getAuthUser();
    const selfId = authUser?.userId ?? null;

    const users = await query<{
      id: string;
      full_name: string;
      username: string;
      headline: string | null;
      profile_photo_url: string | null;
      location: string | null;
      professional_title: string | null;
      experience_level: string | null;
      followers: string;
    }>(
      `SELECT u.id, u.full_name, u.username,
              p.headline, p.profile_photo_url, p.location,
              p.professional_title, p.experience_level,
              (SELECT COUNT(*) FROM profilemitraa_follows f WHERE f.following_id = u.id)::int as followers
       FROM profilemitraa_users u
       LEFT JOIN profilemitraa_profiles p ON u.id = p.user_id
       WHERE ($1 = '' OR LOWER(u.full_name) LIKE LOWER($2) OR LOWER(u.username) LIKE LOWER($2))
         AND ($3::text IS NULL OR u.id::text != $3)
       ORDER BY u.created_at DESC`,
      [search, `%${search}%`, selfId]
    );

    const result = users.map(u => ({
      ...u,
      profile_photo_url: u.profile_photo_url ? getSignedUrl(u.profile_photo_url) : null,
      followers: Number(u.followers),
    }));

    return NextResponse.json({ success: true, users: result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
