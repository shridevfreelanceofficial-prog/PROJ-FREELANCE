'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Input, Card, CardHeader, CardBody, CardFooter } from '@/components/ui';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
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
            <h1 className="text-2xl font-bold text-[#111827]">Administrator Login</h1>
            <p className="text-[#6B7280] mt-1">Access the admin dashboard</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <Input
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
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
              Not an administrator?{' '}
              <Link href="/member/login" className="text-[#10B981] hover:text-[#0F766E] font-medium">
                Member Login
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
