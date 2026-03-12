import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payments = await query<{
      id: string;
      project_id: string;
      project_title: string;
      member_id: string;
      member_name: string;
      amount: string;
      status: string;
      confirmed_by_member: boolean;
      payment_date: string | null;
    }>(
      `SELECT p.id, p.project_id, pr.title as project_title, p.member_id, m.full_name as member_name, 
              p.amount, p.status, p.confirmed_by_member, p.payment_date
       FROM payments p
       JOIN projects pr ON p.project_id = pr.id
       JOIN members m ON p.member_id = m.id
       ORDER BY p.created_at DESC`
    );

    return NextResponse.json({ payments });
  } catch (error) {
    console.error('Get admin payments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
