import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const collections = await query(`
      SELECT cc.*, a.name as created_by_name,
        (SELECT COUNT(*) FROM content_submissions cs WHERE cs.collection_id = cc.id) as submission_count
      FROM content_collections cc
      LEFT JOIN administrators a ON cc.created_by = a.id
      ORDER BY cc.created_at DESC
    `);

    return NextResponse.json({ collections });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { business_name } = await request.json();
    if (!business_name) {
      return NextResponse.json({ error: 'Business name is required' }, { status: 400 });
    }

    const result = await query(`
      INSERT INTO content_collections (business_name, created_by)
      VALUES ($1, $2)
      RETURNING *
    `, [business_name, auth.user.id]);

    return NextResponse.json({ collection: result[0] });
  } catch (error) {
    console.error('Error creating collection:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
