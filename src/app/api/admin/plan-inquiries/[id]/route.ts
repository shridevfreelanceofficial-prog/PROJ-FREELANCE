import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    await query('DELETE FROM plan_inquiries WHERE id = $1', [id]);

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Delete plan inquiry error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
