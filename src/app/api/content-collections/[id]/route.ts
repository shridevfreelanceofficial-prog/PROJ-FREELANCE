import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/db';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const collection = await queryOne(`
      SELECT id, business_name, created_at FROM content_collections WHERE id = $1
    `, [id]);

    if (!collection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
    }

    return NextResponse.json({ collection });
  } catch (error) {
    console.error('Error fetching public collection:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
