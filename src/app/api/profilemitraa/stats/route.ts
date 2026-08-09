import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { queryOne, query } from '@/lib/db';

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

// GET /api/profilemitraa/stats — real stats for the logged-in user
export async function GET() {
  try {
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Profile views & resume downloads from profiles table
    const profileStats = await queryOne<{ profile_views: number; resume_downloads: number; certifications: any }>(
      `SELECT profile_views, resume_downloads, certifications
       FROM profilemitraa_profiles WHERE user_id = $1`,
      [authUser.userId]
    );

    // Follower count
    const followerRow = await queryOne<{ count: string }>(
      `SELECT COUNT(*)::int as count FROM profilemitraa_follows WHERE following_id = $1`,
      [authUser.userId]
    );

    // Following count
    const followingRow = await queryOne<{ count: string }>(
      `SELECT COUNT(*)::int as count FROM profilemitraa_follows WHERE follower_id = $1`,
      [authUser.userId]
    );

    let certCount = 0;
    if (profileStats?.certifications) {
      try {
        const certs = typeof profileStats.certifications === 'string'
          ? JSON.parse(profileStats.certifications)
          : profileStats.certifications;
        certCount = Array.isArray(certs) ? certs.length : 0;
      } catch { certCount = 0; }
    }

    return NextResponse.json({
      success: true,
      stats: {
        profileViews: profileStats?.profile_views ?? 0,
        resumeDownloads: profileStats?.resume_downloads ?? 0,
        certificates: certCount,
        followers: Number((followerRow as any)?.count ?? 0),
        following: Number((followingRow as any)?.count ?? 0),
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
