import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const tool = await queryOne(
      'SELECT id, name, slug, logo_url, description, status, created_at FROM tools WHERE slug = $1',
      [slug]
    );

    if (!tool) {
      return NextResponse.json({ error: 'Tool not found' }, { status: 404 });
    }

    return NextResponse.json({ tool });
  } catch (error) {
    console.error('Error fetching public tool:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
