import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { queryOne, query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'shrikeshshettyshridevfreelance';

async function getAuthViewer() {
  const cookieStore = await cookies();
  const token = cookieStore.get('profilemitraa_authToken')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; username: string; email: string };
  } catch {
    return null;
  }
}

// POST /api/profilemitraa/profile/[username]/view
// Increments profile_views for the target user and records activity.
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

    const viewer = await getAuthViewer();

    // Skip counting if the user is viewing their own profile
    if (viewer && viewer.userId === user.id) {
      return NextResponse.json({ success: true, selfView: true });
    }

    // Increment profile_views; upsert profile row if not yet created
    await query(
      `INSERT INTO profilemitraa_profiles (user_id, profile_views)
       VALUES ($1, 1)
       ON CONFLICT (user_id)
       DO UPDATE SET profile_views = COALESCE(profilemitraa_profiles.profile_views, 0) + 1`,
      [user.id]
    );

    // Record activity with viewer details
    try {
      let actorName = 'Visitor';
      let actorUsername = null;
      let actorAvatar = null;

      if (viewer) {
        const viewerDetails = await queryOne<{ full_name: string; username: string; avatar_url: string | null }>(
          'SELECT full_name, username, avatar_url FROM profilemitraa_users WHERE id = $1',
          [viewer.userId]
        );
        if (viewerDetails) {
          actorName = viewerDetails.full_name || viewerDetails.username;
          actorUsername = viewerDetails.username;
          actorAvatar = viewerDetails.avatar_url;
        }
      }

      await query(
        `INSERT INTO profilemitraa_activities (user_id, actor_id, activity_type, actor_name, actor_username, actor_avatar_url, details)
         VALUES ($1, $2, 'view', $3, $4, $5, 'viewed your profile')`,
        [user.id, viewer?.userId || null, actorName, actorUsername, actorAvatar]
      );
    } catch (actErr) {
      console.warn('Could not record profile view activity:', actErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
