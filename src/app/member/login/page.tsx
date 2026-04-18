'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Input, Card, CardHeader, CardBody, CardFooter } from '@/components/ui';

export default function MemberLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const deactivatedError = searchParams.get('error');
    if (deactivatedError === 'deactivated') {
      setError('Your account has been deactivated by the administrator. Please contact support.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/member/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Redirect to dashboard
      router.push(data.redirect);
      router.refresh();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image
              src="/images/logo/ShriDev_Freelance_logo.png"
              alt="ShriDev Freelance"
              width={48}
              height={48}
              className="w-12 h-12 rounded-lg"
            />
            <span className="text-2xl font-bold text-[#111827]">ShriDev Freelance</span>
          </Link>
        </div>

        {/* Login Card */}
        <Card variant="elevated">
          <CardHeader>
            <h1 className="text-2xl font-bold text-[#111827]">Member Login</h1>
            <p className="text-[#6B7280] mt-1">Access your project dashboard</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>
          </CardBody>
          <CardFooter className="text-center">
            <p className="text-sm text-[#6B7280]">
              Administrator?{' '}
              <Link href="/admin/login" className="text-[#10B981] hover:text-[#0F766E] font-medium">
                Admin Login
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Back to home */}
        <p className="text-center mt-6">
          <Link href="/" className="text-[#6B7280] hover:text-[#10B981] text-sm">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
