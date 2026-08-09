import { NextRequest, NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db';

// POST /api/profilemitraa/profile/[username]/view
// Increments profile_views for the target user. No auth required (public profiles).
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    // Get user id
    const user = await queryOne<{ id: string }>(
      'SELECT id FROM profilemitraa_users WHERE LOWER(username) = LOWER($1)',
      [username]
    );
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Increment profile_views; upsert profile row if not yet created
    await query(
      `INSERT INTO profilemitraa_profiles (user_id, profile_views)
       VALUES ($1, 1)
       ON CONFLICT (user_id)
       DO UPDATE SET profile_views = COALESCE(profilemitraa_profiles.profile_views, 0) + 1`,
      [user.id]
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
