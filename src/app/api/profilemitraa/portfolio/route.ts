import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { queryOne, query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'shrikeshshettyshridevfreelance';

async function getAuthUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('profilemitraa_authToken')?.value;
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
  } catch {
    return null;
  }
}

// GET: Retrieve authenticated user's portfolios (all or single by ID)
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id')?.trim() || '';

    if (id) {
      const portfolio = await queryOne(
        `SELECT id, title, slug, tagline, description, location, language, profile_image_url, status, sections, design_theme, customized_data
         FROM profilemitraa_portfolios
         WHERE id = $1 AND user_id = $2`,
        [id, authUser.userId]
      );
      return NextResponse.json({ success: true, portfolio });
    } else {
      const portfolios = await query(
        `SELECT id, title, slug, tagline, description, location, language, profile_image_url, status, sections, design_theme, customized_data, created_at
         FROM profilemitraa_portfolios
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [authUser.userId]
      );
      return NextResponse.json({ success: true, portfolios });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Save or Update portfolio data
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, slug, tagline, description, location, language, profile_image_url, sections, design_theme, status, customized_data } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Title and URL slug are required.' }, { status: 400 });
    }

    // Double-check slug pattern & availability
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: 'Invalid URL slug format.' }, { status: 400 });
    }

    // Check if slug is taken by another portfolio (excluding this portfolio ID if we are editing it)
    const existingSlug = await queryOne(
      'SELECT id FROM profilemitraa_portfolios WHERE LOWER(slug) = LOWER($1) AND id != $2',
      [slug, id || '00000000-0000-0000-0000-000000000000']
    );
    if (existingSlug) {
      return NextResponse.json({ error: 'URL is already taken by another portfolio.' }, { status: 400 });
    }

    // Check if slug is reserved by another user's username
    const existingUsername = await queryOne(
      'SELECT id FROM profilemitraa_users WHERE LOWER(username) = LOWER($1) AND id != $2',
      [slug, authUser.userId]
    );
    if (existingUsername) {
      return NextResponse.json({ error: 'URL is reserved for another user.' }, { status: 400 });
    }

    if (id) {
      // Update existing portfolio
      const updated = await queryOne(
        `UPDATE profilemitraa_portfolios
         SET title = $1, slug = $2, tagline = $3, description = $4, location = $5, language = $6,
             profile_image_url = $7, sections = $8, design_theme = $9, status = $10, 
             customized_data = $11, updated_at = CURRENT_TIMESTAMP
         WHERE id = $12 AND user_id = $13
         RETURNING id, slug`,
        [
          title,
          slug,
          tagline || '',
          description || '',
          location || '',
          language || 'English',
          profile_image_url || '',
          JSON.stringify(sections || []),
          design_theme || 'minimal',
          status || 'draft',
          JSON.stringify(customized_data || {}),
          id,
          authUser.userId
        ]
      );
      if (!updated) {
        return NextResponse.json({ error: 'Portfolio not found or unauthorized.' }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: 'Portfolio updated successfully.', portfolio: updated });
    } else {
      // Create new portfolio
      const created = await queryOne(
        `INSERT INTO profilemitraa_portfolios
         (user_id, title, slug, tagline, description, location, language, profile_image_url, sections, design_theme, status, customized_data)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING id, slug`,
        [
          authUser.userId,
          title,
          slug,
          tagline || '',
          description || '',
          location || '',
          language || 'English',
          profile_image_url || '',
          JSON.stringify(sections || []),
          design_theme || 'minimal',
          status || 'draft',
          JSON.stringify(customized_data || {})
        ]
      );
      return NextResponse.json({ success: true, message: 'Portfolio created successfully.', portfolio: created });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove the authenticated user's portfolio by ID
export async function DELETE(request: NextRequest) {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id')?.trim() || '';

    if (!id) {
      return NextResponse.json({ error: 'Portfolio ID is required.' }, { status: 400 });
    }

    const deleted = await queryOne<{ id: string; slug: string }>(
      'DELETE FROM profilemitraa_portfolios WHERE id = $1 AND user_id = $2 RETURNING id, slug',
      [id, authUser.userId]
    );

    if (!deleted) {
      return NextResponse.json({ error: 'No portfolio found to delete.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Portfolio deleted. URL "${deleted.slug}" is now free.` });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

