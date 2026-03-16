import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim();
    const phone = body?.phone ? String(body.phone).trim() : null;
    const subject = body?.subject ? String(body.subject).trim() : null;
    const message = String(body?.message || '').trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    if (!email.includes('@') || email.length > 255) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const inserted = await query<{ id: string }>(
      `INSERT INTO contact_submissions (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [name, email, phone, subject, message]
    );

    return NextResponse.json(
      { success: true, id: inserted[0]?.id },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Create contact submission error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
