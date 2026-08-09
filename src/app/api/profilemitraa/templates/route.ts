import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const templates = await query(`
      SELECT key, name, banner_url
      FROM profilemitraa_templates
      ORDER BY created_at ASC
    `);

    return NextResponse.json({ success: true, templates });
  } catch (error: any) {
    console.error('Error fetching public profilemitraa templates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
