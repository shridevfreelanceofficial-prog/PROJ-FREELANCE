import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

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
    const { final_website_url } = await request.json();

    await query(
      `UPDATE projects 
       SET status = 'completed', final_website_url = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2`,
      [final_website_url, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Complete project error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
