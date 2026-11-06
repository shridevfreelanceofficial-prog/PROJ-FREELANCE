import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'Google Client ID is not configured on the server.' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get('returnTo') || '/complete-profile';
  const clientOrigin = searchParams.get('origin') || '';

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || '';
  const isProdOrigin = clientOrigin.includes('shridevfreelance.online');
  const isLocalOrigin = clientOrigin.includes('localhost') || clientOrigin.includes('127.0.0.1');

  let isLocal = true;
  if (isProdOrigin) {
    isLocal = false;
  } else if (isLocalOrigin) {
    isLocal = true;
  } else {
    isLocal = host.includes('localhost') || host.includes('127.0.0.1');
  }

  // Google OAuth redirect_uri MUST strictly match one of the authorized URIs in Google Cloud Console:
  // 1) http://localhost:3000/api/auth/google/callback
  // 2) https://profilemitraa.shridevfreelance.online/api/auth/google/callback
  const redirectUri = isLocal
    ? 'http://localhost:3000/api/auth/google/callback'
    : 'https://profilemitraa.shridevfreelance.online/api/auth/google/callback';

  // Pack state to securely preserve original context & destination
  const stateData = {
    returnTo,
    origin: clientOrigin || (isLocal ? 'http://localhost:3000' : 'https://profilemitraa.shridevfreelance.online'),
  };
  const state = Buffer.from(JSON.stringify(stateData)).toString('base64url');

  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', clientId);
  googleAuthUrl.searchParams.set('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid email profile');
  googleAuthUrl.searchParams.set('state', state);
  googleAuthUrl.searchParams.set('access_type', 'offline');
  googleAuthUrl.searchParams.set('prompt', 'select_account');

  return NextResponse.redirect(googleAuthUrl.toString());
}

