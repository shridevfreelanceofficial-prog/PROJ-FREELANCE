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

    const members = await query(
      'SELECT id, full_name, email, phone, role, is_active, created_at FROM members ORDER BY created_at DESC'
    );

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Get members error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const full_name = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const password = formData.get('password') as string;
    const residential_location = formData.get('residential_location') as string;
    const role = formData.get('role') as string;

    // Validate required fields
    if (!full_name || !email || !password) {
      return NextResponse.json(
        { error: 'Full name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingMember = await query(
      'SELECT id FROM members WHERE email = $1',
      [email]
    );

    if (existingMember.length > 0) {
      return NextResponse.json(
        { error: 'A member with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const { hashPassword } = await import('@/lib/auth');
    const hashedPassword = await hashPassword(password);

    // Insert member
    const newMember = await query(
      `INSERT INTO members (full_name, email, phone, password, residential_location, role)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, full_name, email, phone, role, is_active, created_at`,
      [full_name, email, phone, hashedPassword, residential_location, role]
    );

    return NextResponse.json({
      success: true,
      member: newMember[0],
    });
  } catch (error) {
    console.error('Create member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
