import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';

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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const pkg = await queryOne('SELECT * FROM service_packages WHERE id = $1', [id]);

    if (!pkg) {
      return NextResponse.json({ error: 'Service package not found' }, { status: 404 });
    }

    return NextResponse.json({ package: pkg });
  } catch (error) {
    console.error('Error fetching service package:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await queryOne('SELECT id FROM service_packages WHERE id = $1', [id]);
    if (!existing) {
      return NextResponse.json({ error: 'Service package not found' }, { status: 404 });
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
      UPDATE service_packages
      SET service_type = $1,
          name = $2,
          slug = $3,
          price = $4,
          price_period = $5,
          description = $6,
          features = $7::jsonb,
          popular = $8,
          popular_badge_text = $9,
          icon_type = $10,
          sort_order = $11,
          is_active = $12,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $13
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
      id,
    ]);

    return NextResponse.json({ package: result[0] });
  } catch (error) {
    console.error('Error updating service package:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getCurrentUser();
    if (!auth || auth.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const existing = await queryOne('SELECT id FROM service_packages WHERE id = $1', [id]);
    if (!existing) {
      return NextResponse.json({ error: 'Service package not found' }, { status: 404 });
    }

    await query('DELETE FROM service_packages WHERE id = $1', [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting service package:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
