import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { sendPaymentNotificationEmail } from '@/lib/email';

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

    // Get payment details
    const payment = await queryOne<{
      id: string;
      member_id: string;
      amount: string;
      status: string;
    }>(
      'SELECT id, member_id, amount, status FROM payments WHERE id = $1',
      [id]
    );

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      );
    }

    if (payment.status === 'paid') {
      return NextResponse.json(
        { error: 'Payment is already marked as paid' },
        { status: 400 }
      );
    }

    // Update payment status
    await query(
      `UPDATE payments SET status = 'paid', payment_date = CURRENT_TIMESTAMP WHERE id = $1`,
      [id]
    );

    // Get member details for notification
    const member = await queryOne<{ email: string; full_name: string }>(
      'SELECT email, full_name FROM members WHERE id = $1',
      [payment.member_id]
    );

    const project = await queryOne<{ title: string }>(
      'SELECT title FROM projects WHERE id = (SELECT project_id FROM payments WHERE id = $1)',
      [id]
    );

    if (member && project) {
      // Create notification for member
      await query(
        `INSERT INTO notifications (user_type, user_id, title, message, type, action_url, action_data)
         VALUES ('member', $1, $2, $3, $4, $5, $6)`,
        [
          payment.member_id,
          'Payment Received',
          `Your payment of ₹${payment.amount} for ${project.title} has been processed. Please confirm receipt.`,
          'payment',
          '/member/dashboard/payments',
          JSON.stringify({ payment_id: id, amount: payment.amount }),
        ]
      );

      // Send email notification
      await sendPaymentNotificationEmail(
        member.email,
        member.full_name,
        project.title,
        payment.amount
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Mark payment as paid error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
