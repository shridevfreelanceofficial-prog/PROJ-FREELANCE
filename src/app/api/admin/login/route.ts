import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, generateToken, setAuthCookie } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const admin = await authenticateAdmin(username, password);

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const token = generateToken({
      userId: admin.id,
      userType: 'admin',
      username: admin.username,
    });

    await setAuthCookie(token, 'admin');

    return NextResponse.json({
      success: true,
      user: admin,
      redirect: '/admin/dashboard',
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
