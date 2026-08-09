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
    return jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
  } catch { return null; }
}

// GET /api/profilemitraa/follow/[username]
// Returns: follower list, following list, isFollowing status, counts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const authUser = await getAuthUser();

    // Get target user
    const target = await queryOne<{ id: string }>(
      'SELECT id FROM profilemitraa_users WHERE LOWER(username) = LOWER($1)',
      [username]
    );
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Followers list (people who follow the target)
    const followersRaw = await query<{ id: string; full_name: string; username: string; profile_photo_url: string | null }>(
      `SELECT u.id, u.full_name, u.username, p.profile_photo_url
       FROM profilemitraa_follows f
       JOIN profilemitraa_users u ON f.follower_id = u.id
       LEFT JOIN profilemitraa_profiles p ON u.id = p.user_id
       WHERE f.following_id = $1
       ORDER BY f.created_at DESC`,
      [target.id]
    );

    // Following list (people the target follows)
    const followingRaw = await query<{ id: string; full_name: string; username: string; profile_photo_url: string | null }>(
      `SELECT u.id, u.full_name, u.username, p.profile_photo_url
       FROM profilemitraa_follows f
       JOIN profilemitraa_users u ON f.following_id = u.id
       LEFT JOIN profilemitraa_profiles p ON u.id = p.user_id
       WHERE f.follower_id = $1
       ORDER BY f.created_at DESC`,
      [target.id]
    );

    // Proxy all profile photo URLs through signed URL helper
    const proxyUrl = (url: string | null) => url ? getSignedUrl(url) : null;

    const followers = followersRaw.map(u => ({ ...u, profile_photo_url: proxyUrl(u.profile_photo_url) }));
    const following = followingRaw.map(u => ({ ...u, profile_photo_url: proxyUrl(u.profile_photo_url) }));

    // Is the current user following this profile?
    let isFollowing = false;
    if (authUser) {
      const followRow = await queryOne<{ id: string }>(
        'SELECT id FROM profilemitraa_follows WHERE follower_id = $1 AND following_id = $2',
        [authUser.userId, target.id]
      );
      isFollowing = !!followRow;
    }

    return NextResponse.json({
      success: true,
      targetUserId: target.id,
      isFollowing,
      followersCount: followers.length,
      followingCount: following.length,
      followers,
      following,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/profilemitraa/follow/[username] — follow the user
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const target = await queryOne<{ id: string }>(
      'SELECT id FROM profilemitraa_users WHERE LOWER(username) = LOWER($1)',
      [username]
    );
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (target.id === authUser.userId) return NextResponse.json({ error: 'Cannot follow yourself' }, { status: 400 });

    await query(
      'INSERT INTO profilemitraa_follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [authUser.userId, target.id]
    );

    const followerCount = await queryOne<{ count: string }>(
      'SELECT COUNT(*)::int as count FROM profilemitraa_follows WHERE following_id = $1',
      [target.id]
    );

    return NextResponse.json({ success: true, isFollowing: true, followersCount: Number((followerCount as any)?.count ?? 0) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/profilemitraa/follow/[username] — unfollow the user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const target = await queryOne<{ id: string }>(
      'SELECT id FROM profilemitraa_users WHERE LOWER(username) = LOWER($1)',
      [username]
    );
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    await query(
      'DELETE FROM profilemitraa_follows WHERE follower_id = $1 AND following_id = $2',
      [authUser.userId, target.id]
    );

    const followerCount = await queryOne<{ count: string }>(
      'SELECT COUNT(*)::int as count FROM profilemitraa_follows WHERE following_id = $1',
      [target.id]
    );

    return NextResponse.json({ success: true, isFollowing: false, followersCount: Number((followerCount as any)?.count ?? 0) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
