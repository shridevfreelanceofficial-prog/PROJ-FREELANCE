import { NextRequest, NextResponse } from 'next/server';
import { authenticateMember, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const member = await authenticateMember(email, password);

    if (!member) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!member.is_active) {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact the administrator.' },
        { status: 403 }
      );
    }

    const token = generateToken({
      userId: member.id,
      userType: 'member',
    });

    await setAuthCookie(token, 'member');

    return NextResponse.json({
      success: true,
      user: member,
      redirect: '/member/dashboard',
    });
  } catch (error) {
    console.error('Member login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
