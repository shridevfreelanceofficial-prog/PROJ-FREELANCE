import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = new URL('/api/auth/google', request.url);
  url.search = request.nextUrl.search;
  return NextResponse.redirect(url);
}

