import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { queryOne } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'shrikeshshettyshridevfreelance';

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('profilemitraa_authToken')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
  } catch {
    return null;
  }
}

// GET: Check slug availability
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug')?.trim().toLowerCase() || '';
    const portfolioId = searchParams.get('portfolioId')?.trim() || '';

    if (!slug) {
      return NextResponse.json({ success: false, available: false, error: 'Slug is required.' });
    }

    // Check pattern (only letters, numbers, hyphens)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ success: false, available: false, error: 'URL can only contain lowercase letters, numbers, and hyphens.' });
    }

    // Reserved words
    const reserved = ['dashboard', 'login', 'register', 'api', 'tools', 'profile', 'admin', 'complete-profile', 'create-portfolio'];
    if (reserved.includes(slug)) {
      return NextResponse.json({ success: false, available: false, error: 'This URL is reserved.' });
    }

    // 1. Check if slug is already used as a portfolio slug by ANYONE (excluding the exact portfolio we are editing)
    const existingPortfolio = await queryOne<{ id: string; user_id: string }>(
      'SELECT id, user_id FROM profilemitraa_portfolios WHERE LOWER(slug) = LOWER($1) AND id != $2',
      [slug, portfolioId || '00000000-0000-0000-0000-000000000000']
    );

    if (existingPortfolio) {
      if (existingPortfolio.user_id === authUser.userId) {
        return NextResponse.json({ success: true, available: false, error: 'You already have another portfolio using this URL.' });
      }
      return NextResponse.json({ success: true, available: false, error: 'This domain is registered by other user' });
    }

    // 2. Check if slug is reserved by another user's username
    const existingUser = await queryOne<{ id: string }>(
      'SELECT id FROM profilemitraa_users WHERE LOWER(username) = LOWER($1) AND id != $2',
      [slug, authUser.userId]
    );

    if (existingUser) {
      return NextResponse.json({ success: true, available: false, error: 'This URL is reserved for another user.' });
    }

    return NextResponse.json({ success: true, available: true });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
