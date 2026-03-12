import { NextRequest, NextResponse } from 'next/server';
import { head } from '@vercel/blob';
import { getCurrentUser } from '@/lib/auth';

// This endpoint serves private blob files with authentication
export async function GET(request: NextRequest) {
  try {
    const result = await getCurrentUser();
    
    if (!result) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const blobUrl = searchParams.get('url');
    const path = searchParams.get('path');

    if (!blobUrl && !path) {
      return NextResponse.json(
        { error: 'url or path is required' },
        { status: 400 }
      );
    }

    // Preferred: when full blob URL is provided, fetch it directly with the RW token.
    if (blobUrl) {
      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return NextResponse.json(
          { error: 'BLOB_READ_WRITE_TOKEN is not configured' },
          { status: 500 }
        );
      }

      const blobAuthHeaders = {
        authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        'x-vercel-blob-token': process.env.BLOB_READ_WRITE_TOKEN,
      };

      const upstream = await fetch(blobUrl, {
        headers: {
          ...blobAuthHeaders,
        },
        cache: 'no-store',
      });

      if (!upstream.ok) {
        const body = await upstream.text().catch(() => '');
        return NextResponse.json(
          {
            error: 'Failed to fetch file',
            upstreamStatus: upstream.status,
            upstreamBody: body.slice(0, 500),
          },
          { status: 502 }
        );
      }

      const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
      const filename = blobUrl.split('/').pop() || 'file';

      return new NextResponse(upstream.body, {
        status: 200,
        headers: {
          'Content-Type': contentType,
          'Content-Disposition': `inline; filename="${filename}"`,
          'Cache-Control': 'no-store',
        },
      });
    }

    // Backward compatibility: if only pathname is given, attempt to resolve via head()
    const headInput = path ? path.replace(/^\/+/, '') : '';
    const blob = await head(headInput);

    if (!blob) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    const signedDownloadUrl = (blob as any).downloadUrl as string | undefined;
    if (!signedDownloadUrl) {
      return NextResponse.json({ error: 'File not available' }, { status: 404 });
    }

    const upstream = await fetch(signedDownloadUrl, {
      headers: process.env.BLOB_READ_WRITE_TOKEN
        ? {
            authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
            'x-vercel-blob-token': process.env.BLOB_READ_WRITE_TOKEN,
          }
        : undefined,
      cache: 'no-store',
    });
    if (!upstream.ok) {
      const body = await upstream.text().catch(() => '');
      return NextResponse.json(
        {
          error: 'Failed to fetch file',
          upstreamStatus: upstream.status,
          upstreamBody: body.slice(0, 500),
        },
        { status: 502 }
      );
    }

    const contentType = upstream.headers.get('content-type') || (blob as any).contentType || 'application/octet-stream';
    const filename = path?.split('/').pop() || 'file';

    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Blob download error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
