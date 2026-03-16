import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const is_visible = body?.is_visible as boolean | undefined;

    if (typeof is_visible !== 'boolean') {
      return NextResponse.json({ error: 'is_visible is required' }, { status: 400 });
    }

    const existing = await queryOne<{ id: string }>(
      'SELECT id FROM project_showcase WHERE id = $1',
      [id]
    );

    if (!existing) {
      return NextResponse.json({ error: 'Showcase entry not found' }, { status: 404 });
    }

    await query('UPDATE project_showcase SET is_visible = $1 WHERE id = $2', [is_visible, id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Toggle showcase visibility error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
