import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { queryOne, query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'shrikeshshettyshridevfreelance';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const requestHost = request.headers.get('host') || '';
  const isLocal =
    requestHost.includes('localhost') ||
    requestHost.includes('127.0.0.1');

  // Default values
  let returnTo = '/dashboard';
  let targetOrigin = isLocal ? 'http://localhost:3000' : 'https://profilemitraa.shridevfreelance.online';

  if (state) {
    try {
      const decoded = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
      if (decoded.returnTo && typeof decoded.returnTo === 'string') {
        returnTo = decoded.returnTo;
      }
      if (decoded.origin && typeof decoded.origin === 'string') {
        const parsedOrigin = new URL(decoded.origin);
        // Validate origin to avoid open-redirect vulnerabilities
        if (
          parsedOrigin.hostname === 'localhost' ||
          parsedOrigin.hostname.endsWith('.localhost') ||
          parsedOrigin.hostname === '127.0.0.1' ||
          parsedOrigin.hostname.endsWith('shridevfreelance.online')
        ) {
          targetOrigin = decoded.origin;
        }
      }
    } catch (e) {
      console.warn('Failed to parse OAuth state:', e);
    }
  }

  const isToolsPath = returnTo.startsWith('/tools/profilemitraa');
  const loginPath = isToolsPath ? '/tools/profilemitraa/login' : '/login';

  if (error) {
    console.error('Google OAuth returned error:', error);
    const redirectUrl = new URL(loginPath, targetOrigin);
    redirectUrl.searchParams.set('error', 'Google authentication was cancelled or denied: ' + error);
    return NextResponse.redirect(redirectUrl.toString());
  }

  if (!code) {
    const redirectUrl = new URL(loginPath, targetOrigin);
    redirectUrl.searchParams.set('error', 'No authorization code received from Google.');
    return NextResponse.redirect(redirectUrl.toString());
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials not configured on server.');
    }

    // Google redirect_uri MUST strictly match one of the authorized URIs in Google Cloud Console
    const isProdOrigin = targetOrigin.includes('shridevfreelance.online') || requestHost.includes('shridevfreelance.online');
    const isLocalRequest = !isProdOrigin && (requestHost.includes('localhost') || requestHost.includes('127.0.0.1') || targetOrigin.includes('localhost'));

    const redirectUri = isLocalRequest
      ? 'http://localhost:3000/api/auth/google/callback'
      : 'https://profilemitraa.shridevfreelance.online/api/auth/google/callback';

    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Google token exchange failed:', tokenData);
      throw new Error(tokenData.error_description || tokenData.error || 'Failed to exchange authorization code.');
    }

    // 2. Fetch user profile from Google UserInfo endpoint
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userInfo = await userInfoResponse.json();

    if (!userInfoResponse.ok || !userInfo.email) {
      console.error('Failed to get Google user info:', userInfo);
      throw new Error('Failed to retrieve user profile from Google.');
    }

    const email = userInfo.email.toLowerCase();
    const fullName = userInfo.name || email.split('@')[0];
    const googleId = userInfo.sub;
    const avatarUrl = userInfo.picture || null;

    // 3. Find or create user in profilemitraa_users
    let user = await queryOne<{ id: string; full_name: string; email: string; username: string }>(
      'SELECT id, full_name, email, username FROM profilemitraa_users WHERE email = $1 OR google_id = $2',
      [email, googleId]
    );

    if (user) {
      // Update existing user with google_id and avatar if missing
      await query(
        `UPDATE profilemitraa_users 
         SET google_id = COALESCE(google_id, $1), 
             avatar_url = COALESCE(avatar_url, $2),
             updated_at = CURRENT_TIMESTAMP 
         WHERE id = $3`,
        [googleId, avatarUrl, user.id]
      );
    } else {
      // Generate clean unique username
      let baseUsername = (email.split('@')[0] || fullName.replace(/\s+/g, '') || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '')
        .slice(0, 25);

      if (baseUsername.length < 3) {
        baseUsername = `user_${baseUsername}`;
      }

      const reserved = [
        'dashboard', 'login', 'register', 'api', 'tools', 'profile', 'admin',
        'complete-profile', 'create-portfolio', 'users', 'preview', 'demo', 'www', 'auth'
      ];

      let username = baseUsername;
      let counter = 1;

      while (true) {
        if (reserved.includes(username)) {
          username = `${baseUsername}${counter++}`;
          continue;
        }

        const existingUser = await queryOne(
          'SELECT id FROM profilemitraa_users WHERE LOWER(username) = LOWER($1)',
          [username]
        );
        const existingPortfolioSlug = await queryOne(
          'SELECT id FROM profilemitraa_portfolios WHERE LOWER(slug) = LOWER($1)',
          [username]
        );

        if (!existingUser && !existingPortfolioSlug) {
          break;
        }

        username = `${baseUsername}${counter++}`;
      }

      // Insert new user
      const newUser = await queryOne<{ id: string; full_name: string; email: string; username: string }>(
        `INSERT INTO profilemitraa_users (full_name, email, username, google_id, avatar_url)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, full_name, email, username`,
        [fullName, email, username, googleId, avatarUrl]
      );

      if (!newUser) {
        throw new Error('Failed to create account in database.');
      }
      user = newUser;

      // Seed initial profile in profilemitraa_profiles if photo is available
      if (avatarUrl) {
        try {
          await query(
            `INSERT INTO profilemitraa_profiles (user_id, profile_photo_url)
             VALUES ($1, $2)
             ON CONFLICT (user_id) DO UPDATE SET profile_photo_url = COALESCE(profilemitraa_profiles.profile_photo_url, EXCLUDED.profile_photo_url)`,
            [user.id, avatarUrl]
          );
        } catch (profileErr) {
          console.warn('Could not seed initial profile:', profileErr);
        }
      }
    }

    // 4. Generate JWT auth token
    const token = jwt.sign(
      { userId: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 5. Check if we need cross-origin session transfer (e.g. localhost:3000 -> profilemitraa.localhost:3000)
    const targetUrlObj = new URL(returnTo, targetOrigin);
    const targetHost = targetUrlObj.host;
    const currentHost = request.headers.get('host') || '';

    // If hostnames differ (different subdomain/port), use session-transfer endpoint to plant the cookie on the target host
    if (targetHost && currentHost && targetHost !== currentHost) {
      const transferUrl = new URL('/api/auth/session-transfer', targetOrigin);
      transferUrl.searchParams.set('token', token);
      transferUrl.searchParams.set('returnTo', returnTo);
      return NextResponse.redirect(transferUrl.toString());
    }

    // Otherwise, set cookie on current domain directly
    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === 'production' || requestHost.includes('shridevfreelance.online');

    cookieStore.set('profilemitraa_authToken', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
      ...(requestHost.includes('shridevfreelance.online') ? { domain: '.shridevfreelance.online' } : {}),
    });

    return NextResponse.redirect(targetUrlObj.toString());

  } catch (err: any) {
    console.error('Google OAuth callback error:', err);
    const redirectUrl = new URL(loginPath, targetOrigin);
    redirectUrl.searchParams.set('error', err.message || 'Google authentication failed.');
    return NextResponse.redirect(redirectUrl.toString());
  }
}

