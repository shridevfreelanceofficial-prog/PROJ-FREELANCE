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
    }>(
      `SELECT p.id, p.member_id, m.full_name as member_name, p.amount, p.status, p.confirmed_by_member
       FROM payments p
       JOIN members m ON p.member_id = m.id
       WHERE p.project_id = $1
       ORDER BY m.full_name`,
      [id]
    );

    return NextResponse.json({ payments });
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
    const { payments } = await request.json();

    // Create or update payments for each member
    for (const payment of payments) {
      if (payment.amount && parseFloat(payment.amount) > 0) {
        await query(
          `INSERT INTO payments (project_id, member_id, amount, status)
           VALUES ($1, $2, $3, 'unpaid')
           ON CONFLICT (project_id, member_id) 
           DO UPDATE SET amount = $3`,
          [id, payment.member_id, payment.amount]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Create project payments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
