import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { notifyAdmins } from '@/lib/notifications';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify payment belongs to this member
    const payment = await queryOne<{ id: string; status: string; confirmed_by_member: boolean }>(
      'SELECT id, status, confirmed_by_member FROM payments WHERE id = $1 AND member_id = $2',
      [id, result.user.id]
    );

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment is not marked as paid' },
        { status: 400 }
      );
    }

    if (payment.confirmed_by_member) {
      return NextResponse.json(
        { error: 'Payment already confirmed' },
        { status: 400 }
      );
    }

    // Update payment confirmation
    await query(
      `UPDATE payments SET confirmed_by_member = true, confirmed_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );

    await notifyAdmins({
      title: 'Payment Confirmed',
      message: `${(result.user as any).full_name} confirmed receipt of payment`,
      type: 'payment',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Confirm payment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
