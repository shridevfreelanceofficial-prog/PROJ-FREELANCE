import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get('host') || '';

  // Extract hostname without port
  const currentHost = hostname.split(':')[0];
  const hostParts = currentHost.split('.');

  let subdomain: string | null = null;

  if (currentHost.endsWith('localhost') || currentHost.endsWith('127.0.0.1')) {
    if (hostParts.length > 1 && hostParts[0] !== 'localhost') {
      subdomain = hostParts[0];
    }
  } else if (currentHost.includes('shridevfreelance.online')) {
    if (hostParts.length > 2) {
      subdomain = hostParts[0];
    }
  }

  const reservedSubdomains = ['www', 'admin', 'api', 'shridevfreelance', 'shrikeshdevfreelance', 'app'];

  if (subdomain && !reservedSubdomains.includes(subdomain.toLowerCase())) {
    // If the path does not already begin with /tools/[subdomain]
    if (!url.pathname.startsWith(`/tools/${subdomain}`)) {
      const targetPath = `/tools/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
      
      const rewriteUrl = new URL(targetPath, request.url);
      if (currentHost.endsWith('localhost') || currentHost.endsWith('127.0.0.1')) {
        rewriteUrl.hostname = 'localhost';
      } else {
        rewriteUrl.hostname = 'shridevfreelance.online';
      }

      console.log(`[MIDDLEWARE REWRITE] Rewriting ${request.url} -> ${rewriteUrl.href}`);

      return NextResponse.rewrite(rewriteUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|logo|api).*)',
  ],
};
