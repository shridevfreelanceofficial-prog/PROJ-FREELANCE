import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(
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

    const payments = await query<{
      id: string;
      member_id: string;
      member_name: string;
      amount: string;
      status: string;
      confirmed_by_member: boolean;
      due_date: string;
      paid_date: string | null;
    }>(
      `SELECT p.id,
              p.member_id,
              m.full_name as member_name,
              p.amount,
              p.status,
              p.confirmed_by_member,
              p.created_at as due_date,
              p.payment_date as paid_date
       FROM payments p
       JOIN members m ON p.member_id = m.id
       WHERE p.project_id = $1
       ORDER BY m.full_name`,
      [id]
    );

    return NextResponse.json(
      { payments },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Get project payments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
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
    const body = await request.json().catch(() => ({}));

    // Support both shapes:
    // 1) UI sends: { member_id, amount, due_date }
    // 2) Bulk sends: { payments: [{ member_id, amount }] }
    const incomingPayments: Array<{ member_id?: string; amount?: string | number }> = Array.isArray(body?.payments)
      ? body.payments
      : [body];

    let insertedCount = 0;

    for (const payment of incomingPayments) {
      const memberId = payment?.member_id;
      const amountRaw = payment?.amount;
      const amount = typeof amountRaw === 'string' ? parseFloat(amountRaw) : amountRaw;

      if (!memberId) continue;
      // DB uses UUIDs for member_id; prevent 500s when user inputs numeric IDs.
      if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(memberId)) {
        return NextResponse.json(
          { error: 'Invalid member_id. Please select a valid member (UUID).' },
          { status: 400 }
        );
      }
      if (typeof amount !== 'number' || Number.isNaN(amount) || amount <= 0) continue;

      await query(
        `INSERT INTO payments (project_id, member_id, amount, status)
         VALUES ($1, $2, $3, 'unpaid')
         ON CONFLICT (project_id, member_id)
         DO UPDATE SET amount = $3, updated_at = CURRENT_TIMESTAMP`,
        [id, memberId, amount]
      );
      insertedCount += 1;
    }

    if (insertedCount === 0) {
      return NextResponse.json(
        { error: 'No valid payment data provided' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Create project payments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
