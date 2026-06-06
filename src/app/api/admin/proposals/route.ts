import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const proposals = await query(`
      SELECT p.*, a.name as created_by_name 
      FROM proposals p
      LEFT JOIN administrators a ON p.created_by = a.id
      ORDER BY p.created_at DESC
    `);

    return NextResponse.json({ proposals });
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { business_name, title, body, theme_color } = await request.json();

    if (!business_name || !title || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const color = theme_color || '#10B981';

    const result = await query(`
      INSERT INTO proposals (business_name, title, body, created_by, theme_color)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [business_name, title, body, auth.user.id, color]);

    return NextResponse.json({ proposal: result[0] });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
