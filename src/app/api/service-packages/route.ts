import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceType = searchParams.get('type');

    let sqlQuery = `
      SELECT *
      FROM service_packages
      WHERE is_active = true
    `;
    const params: string[] = [];

    if (serviceType && (serviceType === 'website' || serviceType === 'app')) {
      sqlQuery += ` AND service_type = $1`;
      params.push(serviceType);
    }

    sqlQuery += ` ORDER BY sort_order ASC, created_at ASC`;

    const packages = await query(sqlQuery, params);

    return NextResponse.json({ packages }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching service packages:', error);
    return NextResponse.json({ error: 'Failed to fetch packages' }, { status: 500 });
  }
}
