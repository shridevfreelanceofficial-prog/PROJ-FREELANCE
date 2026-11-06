import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'shrikeshshettyshridevfreelance';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const returnTo = searchParams.get('returnTo') || '/dashboard';

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify token validity
    jwt.verify(token, JWT_SECRET);

    const host = request.headers.get('host') || '';
    const isProd = process.env.NODE_ENV === 'production' || host.includes('shridevfreelance.online');

    const cookieStore = await cookies();
    cookieStore.set('profilemitraa_authToken', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
      ...(host.includes('shridevfreelance.online') ? { domain: '.shridevfreelance.online' } : {}),
    });

    return NextResponse.redirect(new URL(returnTo, request.url));
  } catch (err) {
    console.error('Session transfer error:', err);
    return NextResponse.redirect(new URL('/login?error=Invalid+session', request.url));
  }
}

