import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';
import { uploadProfileImage, uploadSignature } from '@/lib/blob';

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
      'SELECT id, full_name, email, phone, github_username, role, profile_image_url, is_active, created_at FROM members ORDER BY created_at DESC'
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
    const github_username = formData.get('github_username') as string;
    const password = formData.get('password') as string;
    const residential_location = formData.get('residential_location') as string;
    const role = formData.get('role') as string;
    const signatureFile = formData.get('signature') as File | null;
    const profileImageFile = formData.get('profile_image') as File | null;

    // Validate required fields
    if (!full_name || !email || !password || !github_username) {
      return NextResponse.json(
        { error: 'Full name, email, GitHub username, and password are required' },
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

    // Insert member first (so we have an id for blob foldering)
    const inserted = await query<{ id: string }>(
      `INSERT INTO members (full_name, email, phone, github_username, password, residential_location, role)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [full_name, email, phone, github_username || null, hashedPassword, residential_location, role]
    );

    const memberId = inserted[0]?.id;
    let signatureUrl: string | null = null;
    let profileImageUrl: string | null = null;

    if (memberId) {
      if (signatureFile && signatureFile.size > 0) {
        signatureUrl = (await uploadSignature(signatureFile, memberId)).url;
      }
      if (profileImageFile && profileImageFile.size > 0) {
        profileImageUrl = (await uploadProfileImage(profileImageFile, 'member', memberId)).url;
      }
    }

    if (memberId && (signatureUrl || profileImageUrl)) {
      await query(
        `UPDATE members
         SET signature_url = COALESCE($1, signature_url),
             profile_image_url = COALESCE($2, profile_image_url),
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $3`,
        [signatureUrl, profileImageUrl, memberId]
      );
    }

    const newMember = await query(
      `SELECT id, full_name, email, phone, github_username, role, is_active, created_at
       FROM members
       WHERE id = $1`,
      [memberId]
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
