import { NextRequest, NextResponse } from 'next/server';
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

    return NextResponse.json({ admin: result.user });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const signatureFile = formData.get('signature') as File | null;
    const profileImageFile = formData.get('profile_image') as File | null;

    // Validate required fields (username is not required since it cannot be changed)
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if email is already taken
    const existingEmail = await query(
      'SELECT id FROM administrators WHERE email = $1 AND id != $2',
      [email, result.user.id]
    );

    if (existingEmail.length > 0) {
      return NextResponse.json(
        { error: 'Email is already in use' },
        { status: 400 }
      );
    }

    let signatureUrl = (result.user as any).signature_url;
    let profileImageUrl = (result.user as any).profile_image_url;

    // Upload new signature if provided
    if (signatureFile && signatureFile.size > 0) {
      signatureUrl = (await uploadSignature(signatureFile, result.user.id)).url;
    }

    // Upload new profile image if provided
    if (profileImageFile && profileImageFile.size > 0) {
      profileImageUrl = (await uploadProfileImage(profileImageFile, 'admin', result.user.id)).url;
    }

    // Update admin profile
    await query(
      `UPDATE administrators 
       SET name = $1, email = $2, signature_url = $3, profile_image_url = $4, is_profile_complete = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5`,
      [name, email, signatureUrl, profileImageUrl, result.user.id]
    );

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
