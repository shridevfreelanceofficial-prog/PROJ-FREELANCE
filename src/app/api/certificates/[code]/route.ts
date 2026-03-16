import { NextRequest, NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

// Public endpoint to view certificates by certificate code
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Get certificate from database
    const certificate = await queryOne<{
      id: string;
      certificate_code: string;
      certificate_url: string;
    }>(
      'SELECT id, certificate_code, certificate_url FROM certificates WHERE certificate_code = $1',
      [code]
    );

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Fetch the PDF from blob storage
    const blobResponse = await fetch(certificate.certificate_url, {
      headers: {
        'Authorization': `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    });

    if (!blobResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch certificate' },
        { status: 500 }
      );
    }

    const pdfBuffer = await blobResponse.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': `inline; filename="certificate-${code}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Certificate fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
