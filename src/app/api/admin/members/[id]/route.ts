import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { queryOne, query } from '@/lib/db';
import { uploadProfileImage, uploadSignature } from '@/lib/blob';

export async function GET(
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

    const member = await queryOne<{
      id: string;
      full_name: string;
      email: string;
      phone: string | null;
      github_username: string | null;
      residential_location: string | null;
      role: string | null;
      signature_url: string | null;
      profile_image_url: string | null;
      is_active: boolean;
      created_at: string;
    }>(
      'SELECT id, full_name, email, phone, github_username, residential_location, role, signature_url, profile_image_url, is_active, created_at FROM members WHERE id = $1',
      [id]
    );

    if (!member) {
      return NextResponse.json(
        { error: 'Member not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ member });
  } catch (error) {
    console.error('Get member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const formData = await request.formData();
    
    const fullName = formData.get('full_name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const githubUsername = formData.get('github_username') as string;
    const location = formData.get('residential_location') as string;
    const role = formData.get('role') as string;
    const signatureFile = formData.get('signature') as File | null;
    const profileImageFile = formData.get('profile_image') as File | null;

    // Check if email already exists for another member
    const existingMember = await queryOne<{ id: string }>(
      'SELECT id FROM members WHERE email = $1 AND id != $2',
      [email, id]
    );

    if (existingMember) {
      return NextResponse.json(
        { error: 'Email already exists for another member' },
        { status: 400 }
      );
    }

    let signatureUrl: string | null = null;
    let profileImageUrl: string | null = null;
    
    // Upload new signature if provided
    if (signatureFile && signatureFile.size > 0) {
      const uploadResult = await uploadSignature(signatureFile, id);
      signatureUrl = uploadResult.url;
    }

    if (profileImageFile && profileImageFile.size > 0) {
      const uploadResult = await uploadProfileImage(profileImageFile, 'member', id);
      profileImageUrl = uploadResult.url;
    }

    // Update member
    await query(
      `UPDATE members 
       SET full_name = $1, email = $2, phone = $3, github_username = $4, residential_location = $5, 
           role = $6,
           signature_url = COALESCE($7, signature_url),
           profile_image_url = COALESCE($8, profile_image_url),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9`,
      [
        fullName,
        email,
        phone || null,
        githubUsername || null,
        location || null,
        role || null,
        signatureUrl,
        profileImageUrl,
        id,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update member error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
