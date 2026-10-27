import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET() {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const packages = await query(`
      SELECT *
      FROM service_packages
      ORDER BY service_type ASC, sort_order ASC, created_at ASC
    `);

    return NextResponse.json({ packages }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error fetching admin service packages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      service_type,
      name,
      price,
      price_period = '/ project',
      description,
      features = [],
      popular = false,
      popular_badge_text = null,
      icon_type = 'sparkles',
      sort_order = 0,
      is_active = true,
    } = body;

    if (!service_type || (service_type !== 'website' && service_type !== 'app')) {
      return NextResponse.json({ error: 'Invalid service type. Must be "website" or "app".' }, { status: 400 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Package name is required.' }, { status: 400 });
    }

    if (!price || !price.trim()) {
      return NextResponse.json({ error: 'Package price is required.' }, { status: 400 });
    }

    if (!description || !description.trim()) {
      return NextResponse.json({ error: 'Package description is required.' }, { status: 400 });
    }

    const slug = slugify(name);
    const featuresJson = JSON.stringify(Array.isArray(features) ? features : []);

    const result = await query(`
      INSERT INTO service_packages (
        service_type, name, slug, price, price_period, description,
        features, popular, popular_badge_text, icon_type, sort_order, is_active
      ) VALUES (
        $1, $2, $3, $4, $5, $6,
        $7::jsonb, $8, $9, $10, $11, $12
      )
      RETURNING *
    `, [
      service_type,
      name.trim(),
      slug,
      price.trim(),
      price_period || '/ project',
      description.trim(),
      featuresJson,
      Boolean(popular),
      popular_badge_text?.trim() || null,
      icon_type || 'sparkles',
      Number(sort_order) || 0,
      Boolean(is_active),
    ]);

    return NextResponse.json({ package: result[0] }, { status: 201 });
  } catch (error) {
    console.error('Error creating service package:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
