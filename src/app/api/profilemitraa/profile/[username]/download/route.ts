import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { queryOne, query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'shrikeshshettyshridevfreelance';

async function getAuthDownloader() {
  const cookieStore = await cookies();
  const token = cookieStore.get('profilemitraa_authToken')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; username: string; email: string };
  } catch {
    return null;
  }
}

// POST /api/profilemitraa/profile/[username]/download
// Increments resume_downloads for the target user and records activity.
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    const user = await queryOne<{ id: string }>(
      'SELECT id FROM profilemitraa_users WHERE LOWER(username) = LOWER($1)',
      [username]
    );
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const downloader = await getAuthDownloader();

    // Increment resume_downloads in profilemitraa_profiles
    await query(
      `INSERT INTO profilemitraa_profiles (user_id, resume_downloads)
       VALUES ($1, 1)
       ON CONFLICT (user_id)
       DO UPDATE SET resume_downloads = COALESCE(profilemitraa_profiles.resume_downloads, 0) + 1`,
      [user.id]
    );

    // Record download activity
    try {
      let actorName = 'A recruiter / visitor';
      let actorUsername = null;
      let actorAvatar = null;

      if (downloader) {
        const dInfo = await queryOne<{ full_name: string; username: string; avatar_url: string | null }>(
          'SELECT full_name, username, avatar_url FROM profilemitraa_users WHERE id = $1',
          [downloader.userId]
        );
        if (dInfo) {
          actorName = dInfo.full_name || dInfo.username;
          actorUsername = dInfo.username;
          actorAvatar = dInfo.avatar_url;
        }
      }

      await query(
        `INSERT INTO profilemitraa_activities (user_id, actor_id, activity_type, actor_name, actor_username, actor_avatar_url, details)
         VALUES ($1, $2, 'download', $3, $4, $5, 'downloaded your resume')`,
        [user.id, downloader?.userId || null, actorName, actorUsername, actorAvatar]
      );
    } catch (actErr) {
      console.warn('Could not record download activity:', actErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

