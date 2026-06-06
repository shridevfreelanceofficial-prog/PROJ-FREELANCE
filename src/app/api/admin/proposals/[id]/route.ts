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

    const proposal = await queryOne(`
      SELECT p.*, a.name as created_by_name, a.email as created_by_email, a.profile_image_url
      FROM proposals p
      LEFT JOIN administrators a ON p.created_by = a.id
      WHERE p.id = $1
    `, [id]);

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    return NextResponse.json({ proposal });
  } catch (error) {
    console.error('Error fetching proposal for edit:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const { business_name, title, body, theme_color } = await request.json();

    if (!business_name || !title || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await query(`
      UPDATE proposals 
      SET business_name = $1, title = $2, body = $3, theme_color = $4, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $5
      RETURNING *
    `, [business_name, title, body, theme_color || '#10B981', id]);

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    return NextResponse.json({ proposal: result[0] });
  } catch (error) {
    console.error('Error updating proposal:', error);
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

    const result = await query(`
      DELETE FROM proposals 
      WHERE id = $1
      RETURNING id
    `, [id]);

    if (!result || result.length === 0) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting proposal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
