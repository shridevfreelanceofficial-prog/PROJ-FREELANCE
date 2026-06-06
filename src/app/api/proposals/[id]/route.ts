import { NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db';
import { sendNotificationEmail } from '@/lib/email';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: RouteContext) {
  try {
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

    // Auto update status to 'viewed' if it's currently 'pending'
    if ((proposal as any).status === 'pending') {
      await query(`UPDATE proposals SET status = 'viewed', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [id]);
      (proposal as any).status = 'viewed';
    }

    return NextResponse.json({ proposal });
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const { status } = await request.json();

    if (!['accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const proposal = await queryOne(`
      UPDATE proposals 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `, [status, id]);

    if (!proposal) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Send email and DB notification to admin
    try {
      if ((proposal as any).created_by) {
        const admin = await queryOne(`SELECT id, email, name FROM administrators WHERE id = $1`, [(proposal as any).created_by]);
        
        if (admin) {
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';
          const actionUrl = `/admin/dashboard/proposals`;
          const actionStr = status === 'accepted' ? 'Accepted' : 'Declined';
          const title = `Proposal ${actionStr}`;
          const message = `The client has ${status} your proposal for "${(proposal as any).business_name}" (${(proposal as any).title}).`;
          
          // Add notification to database
          await query(`
            INSERT INTO notifications (user_type, user_id, title, message, type, action_url)
            VALUES ($1, $2, $3, $4, $5, $6)
          `, ['admin', (admin as any).id, title, message, 'proposal', actionUrl]);

          // Send email
          if ((admin as any).email) {
            const fullActionUrl = `${baseUrl}${actionUrl}`;
            await sendNotificationEmail((admin as any).email, (admin as any).name || 'Admin', title, message, fullActionUrl);
          }
        }
      }
    } catch (e) {
      console.error('Failed to send proposal notification:', e);
    }

    return NextResponse.json({ proposal });
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
