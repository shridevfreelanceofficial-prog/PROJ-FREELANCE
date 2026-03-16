import { NextRequest, NextResponse } from 'next/server';

// Public proxy for showcase cover images.
// This is needed when the Blob store is configured as private-only.
// Security: only allow fetching images that are inside the `showcase-covers/` folder.
export async function GET(request: NextRequest) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ error: 'BLOB_READ_WRITE_TOKEN is not configured' }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'url is required' }, { status: 400 });
    }

    // Basic validation: only allow files under showcase-covers.
    // This prevents turning this endpoint into a general-purpose blob proxy.
    if (!url.includes('/showcase-covers/')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const upstream = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'x-vercel-blob-token': token,
      },
      cache: 'no-store',
    });

    if (!upstream.ok) {
      const body = await upstream.text().catch(() => '');
      return NextResponse.json(
        {
          error: 'Failed to fetch cover image',
          upstreamStatus: upstream.status,
          upstreamBody: body.slice(0, 500),
        },
        { status: 502 }
      );
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    const filename = url.split('/').pop() || 'cover';

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    console.error('Public showcase cover proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
