import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { queryOne, query } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'shrikeshshettyshridevfreelance';

export async function POST(request: NextRequest) {
  try {
    const { fullName, email, username, password } = await request.json();

    if (!fullName || !email || !username || !password) {
      return NextResponse.json(
        { error: 'All fields are required.' },
        { status: 400 }
      );
    }

    // Check if user already exists (email)
    const existingEmail = await queryOne(
      'SELECT id FROM profilemitraa_users WHERE email = $1',
      [email.toLowerCase()]
    );
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email is already registered.' },
        { status: 400 }
      );
    }

    // Check if user already exists (username)
    const existingUsername = await queryOne(
      'SELECT id FROM profilemitraa_users WHERE LOWER(username) = LOWER($1)',
      [username.toLowerCase()]
    );
    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username is already taken.' },
        { status: 400 }
      );
    }

    // Check if the username matches an existing portfolio slug
    const existingPortfolioSlug = await queryOne(
      'SELECT id FROM profilemitraa_portfolios WHERE LOWER(slug) = LOWER($1)',
      [username.toLowerCase()]
    );
    if (existingPortfolioSlug) {
      return NextResponse.json(
        { error: 'Username is already reserved by an existing portfolio.' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const newUser = await queryOne<{ id: string; username: string; email: string }>(
      `INSERT INTO profilemitraa_users (full_name, email, username, password)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, email`,
      [fullName, email.toLowerCase(), username.toLowerCase(), hashedPassword]
    );

    if (!newUser) {
      return NextResponse.json(
        { error: 'Failed to register user.' },
        { status: 500 }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: newUser.id, username: newUser.username, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set Cookie
    const cookieStore = await cookies();
    cookieStore.set('profilemitraa_authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName
      }
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
