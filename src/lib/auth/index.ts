import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { queryOne } from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  username: string;
  signature_url: string | null;
  profile_image_url?: string | null;
  is_profile_complete: boolean;
}

export interface MemberUser {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  residential_location: string | null;
  role: string | null;
  signature_url: string | null;
  profile_image_url?: string | null;
  is_active: boolean;
}

export interface AuthPayload {
  userId: string;
  userType: 'admin' | 'member';
  username?: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Generate JWT token
export function generateToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

// Set auth cookie
export async function setAuthCookie(token: string, userType: 'admin' | 'member') {
  const cookieStore = await cookies();
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
  cookieStore.set('user_type', userType, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

// Clear auth cookies
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  cookieStore.delete('user_type');
}

// Get current user from cookies
export async function getCurrentUser(): Promise<{ user: AdminUser | MemberUser; userType: 'admin' | 'member' } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const userType = cookieStore.get('user_type')?.value as 'admin' | 'member' | undefined;

  if (!token || !userType) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  if (userType === 'admin') {
    const admin = await queryOne<AdminUser>(
      'SELECT id, name, email, username, signature_url, profile_image_url, is_profile_complete FROM administrators WHERE id = $1',
      [payload.userId]
    );
    if (admin) return { user: admin, userType: 'admin' };
  } else {
    const member = await queryOne<MemberUser>(
      'SELECT id, full_name, email, phone, residential_location, role, signature_url, profile_image_url, is_active FROM members WHERE id = $1',
      [payload.userId]
    );
    if (member) return { user: member, userType: 'member' };
  }

  return null;
}

// Authenticate admin
export async function authenticateAdmin(username: string, password: string): Promise<AdminUser | null> {
  const admin = await queryOne<{ id: string; username: string; password: string; name: string | null; email: string | null; signature_url: string | null; is_profile_complete: boolean }>(
    'SELECT * FROM administrators WHERE username = $1',
    [username]
  );

  if (!admin) return null;

  const isValid = await verifyPassword(password, admin.password);
  if (!isValid) return null;

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    username: admin.username,
    signature_url: admin.signature_url,
    is_profile_complete: admin.is_profile_complete,
  };
}

// Authenticate member
export async function authenticateMember(email: string, password: string): Promise<MemberUser | null> {
  const member = await queryOne<{ id: string; full_name: string; email: string; password: string; phone: string | null; residential_location: string | null; role: string | null; signature_url: string | null; is_active: boolean }>(
    'SELECT * FROM members WHERE email = $1',
    [email]
  );

  if (!member) return null;

  const isValid = await verifyPassword(password, member.password);
  if (!isValid) return null;

  return {
    id: member.id,
    full_name: member.full_name,
    email: member.email,
    phone: member.phone,
    residential_location: member.residential_location,
    role: member.role,
    signature_url: member.signature_url,
    is_active: member.is_active,
  };
}
