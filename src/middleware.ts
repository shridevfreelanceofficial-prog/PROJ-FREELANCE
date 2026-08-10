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

  // Check if pathname starts with /tools/[slug]
  const pathParts = url.pathname.split('/');
  if (pathParts.length > 2 && pathParts[1] === 'tools') {
    const toolSlug = pathParts[2];
    if (toolSlug && !reservedSubdomains.includes(toolSlug.toLowerCase())) {
      // We want to redirect all "/tools/[toolSlug]" paths to the "[toolSlug]" subdomain
      const remainingPath = '/' + pathParts.slice(3).join('/');
      const searchParams = url.search;

      let targetHost = `${toolSlug}.shridevfreelance.online`;
      if (currentHost.endsWith('localhost') || currentHost.endsWith('127.0.0.1')) {
        const port = hostname.split(':')[1] || '3000';
        targetHost = `${toolSlug}.localhost:${port}`;
      }

      const protocol = request.headers.get('x-forwarded-proto') || (request.url.startsWith('https') ? 'https' : 'http');
      const redirectUrl = new URL(`${protocol}://${targetHost}${remainingPath}${searchParams}`);

      console.log(`[MIDDLEWARE REDIRECT] Redirecting ${request.url} -> ${redirectUrl.href}`);
      return NextResponse.redirect(redirectUrl, 307);
    }
  }

  if (subdomain && !reservedSubdomains.includes(subdomain.toLowerCase())) {
    // If the path does not already begin with /tools/[subdomain]
    if (!url.pathname.startsWith(`/tools/${subdomain}`)) {
      const targetPath = `/tools/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;

      // Keep the SAME origin — do not change the hostname.
      // Changing the hostname makes Next.js treat this as a cross-origin proxy request
      // which breaks on Vercel and custom servers. Internal path rewrites must share the same origin.
      const rewriteUrl = new URL(targetPath, request.url);

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
