import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await context.params;

    const collection = await queryOne(`
      SELECT cc.*, a.name as created_by_name
      FROM content_collections cc
      LEFT JOIN administrators a ON cc.created_by = a.id
      WHERE cc.id = $1
    `, [id]);

    if (!collection) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const submissions = await query(`
      SELECT * FROM content_submissions WHERE collection_id = $1 ORDER BY submitted_at DESC
    `, [id]);

    return NextResponse.json({ collection, submissions });
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await context.params;

    await query(`DELETE FROM content_collections WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting collection:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
