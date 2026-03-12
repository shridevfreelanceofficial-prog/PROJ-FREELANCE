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
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get current member status
    const member = await queryOne<{ is_active: boolean }>(
      'SELECT is_active FROM members WHERE id = $1',
      [id]
    );

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    // Toggle status
    await query(
      'UPDATE members SET is_active = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [!member.is_active, id]
    );

    return NextResponse.json({
      success: true,
      is_active: !member.is_active,
    });
  } catch (error) {
    console.error('Toggle member status error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
