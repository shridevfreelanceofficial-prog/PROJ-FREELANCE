import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'member') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payments = await query<{
      id: string;
      project_id: string;
      project_title: string;
      amount: string;
      status: string;
      payment_date: string | null;
      confirmed_by_member: boolean;
      created_at: string;
    }>(
      `SELECT p.id, p.project_id, pr.title as project_title, p.amount, p.status, p.payment_date, p.confirmed_by_member, p.created_at
       FROM payments p
       JOIN projects pr ON p.project_id = pr.id
       WHERE p.member_id = $1
       ORDER BY p.created_at DESC`,
      [result.user.id]
    );

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Get member payments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
