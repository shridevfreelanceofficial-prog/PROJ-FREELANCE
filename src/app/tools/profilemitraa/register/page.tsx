/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfileMitraaRegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [domain, setDomain] = useState('profilemitraa.shridevfreelance.online');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hostname.endsWith('localhost') || window.location.hostname === '127.0.0.1') {
        setDomain('profilemitraa.localhost:3000');
      } else {
        setDomain('profilemitraa.shridevfreelance.online');
      }
    }
  }, []);

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !email || !username || !password || !confirmPassword) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    if (!agree) {
      setErrorMsg('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setIsLoading(true);
    fetch('/api/profilemitraa/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fullName,
        email,
        username,
        password,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Registration failed.');
        }
        router.push('/tools/profilemitraa/dashboard');
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Something went wrong. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-white flex flex-col lg:flex-row font-sans selection:bg-[#009670] selection:text-white">
      {/* Left Column - Product Showcase (Hidden on Mobile/Tablet < lg) */}
      <div className="hidden lg:flex lg:w-[48%] bg-[#F4FAF8] border-r border-[#E6F3EE] flex-col p-10 pb-0 relative overflow-hidden shrink-0 select-none h-full">
        
        {/* Soft Background shapes & gradients */}
        <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-[#E1F2ED]/60 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] bg-[#EEF8F5]/80 rounded-full blur-[80px] pointer-events-none" />

        {/* Character image — absolutely positioned at bottom, 55% of column height */}
        <div className="absolute bottom-0 left-0 w-full h-[55%] z-0 pointer-events-none select-none">
          <img
            src="/images/tools/ProfileMitraa/registration-img/registration.png"
            alt="ProfileMitraa Character Illustration"
            className="w-full h-full object-contain object-bottom"
          />
        </div>

        {/* Top Header Logo */}
        <div className="flex items-center gap-3 relative z-10 shrink-0">
          <img
            src="/images/tools/ProfileMitraa/logo/profilemitraalogo.png"
            alt="ProfileMitraa Logo"
            className="h-12 w-auto object-contain"
          />
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            Profile<span className="text-[#009670]">Mitraa</span>
          </span>
        </div>

        {/* Top Content (Badge, Heading, Paragraph, and Points) */}
        <div className="pt-6 relative z-10 max-w-xl shrink-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F5EF] text-[#009670] text-[11px] font-bold tracking-wide mb-3">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 5a3 3 0 015-2.236A3 3 0 0114.83 6H16a2 2 0 110 4h-5v9a1 1 0 11-2 0v-9H4a2 2 0 110-4h1.17C5.06 5.687 5 5.35 5 5zm4 1V5a1 1 0 10-1 1h1zm3 0a1 1 0 10-1-1v1h1z" clipRule="evenodd" />
            </svg>
            100% Free Forever
          </div>

          {/* Heading */}
          <h1 className="text-[34px] xl:text-[40px] font-black text-slate-900 tracking-tight leading-[1.12] mb-3">
            Build Your <br />
            Professional Identity <br />
            with <span className="text-[#009670]">ProfileMitraa</span>
          </h1>

          {/* Paragraph */}
          <p className="text-sm text-slate-600 font-normal leading-relaxed max-w-lg mb-5">
            Create stunning portfolios, professional resumes and personal profiles in minutes. All features. All templates. 100% free.
          </p>

          {/* Checklists (Points) */}
          <div className="space-y-3.5">
            {/* Item 1 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E1F2ED] text-[#009670] flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">100% Free Forever</h4>
                <p className="text-[10.5px] text-slate-500 mt-0.5">No hidden charges. No limits.</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E1F2ED] text-[#009670] flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Super Fast</h4>
                <p className="text-[10.5px] text-slate-500 mt-0.5">Create your portfolio in just 5 minutes.</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white border border-[#E1F2ED] text-[#009670] flex items-center justify-center shrink-0 shadow-sm">
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Secure & Private</h4>
                <p className="text-[10.5px] text-slate-500 mt-0.5">Your data is safe with us.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-12 lg:px-20 py-8 lg:max-h-screen lg:overflow-y-auto">
        <div className="max-w-[440px] w-full space-y-5 my-auto">
          
          {/* Logo header displaying on Mobile only */}
          <div className="lg:hidden flex items-center gap-2.5 mb-2 justify-center">
            <img
              src="/images/tools/ProfileMitraa/logo/profilemitraalogo.png"
              alt="ProfileMitraa Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-xl font-black text-slate-900 tracking-tight">
              Profile<span className="text-[#009670]">Mitraa</span>
            </span>
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-[26px] sm:text-[30px] font-black text-slate-900 tracking-tight">
              Create Your Account
            </h2>
            <p className="text-[13px] text-slate-500 font-medium mt-0.5 leading-relaxed">
              Join ProfileMitraa and start building your professional identity today.
            </p>
          </div>

          {/* Google SSO Button */}
          <button
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                setFullName('Google User');
                setEmail('google.user@gmail.com');
                setUsername('googleuser');
              }, 800);
            }}
            className="w-full py-2.5 border border-slate-200 hover:border-slate-300 rounded-xl flex items-center justify-center gap-2.5 font-bold text-[13px] text-slate-700 bg-white hover:bg-slate-50/50 transition-all select-none shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.44-.63-.73-1.36-.73-2.09s.29-1.46.73-2.09l-2.85-2.22C1.43 7.06 1 8.73 1 10.5c0 1.77.43 3.44 1.18 4.94l2.85-2.22c-.44-.63-.73-1.36-.73-2.09z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Separator */}
          <div className="relative flex items-center justify-center select-none py-0.5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <span className="relative z-10 px-3 bg-white text-xs font-semibold text-slate-400">
              or
            </span>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span className="w-4 h-4 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0">!</span>
              {errorMsg}
            </div>
          )}

          {/* Registration Form fields */}
          <form onSubmit={handleSubmit} className="space-y-[14px]">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Full Name
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] bg-white transition-colors"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] bg-white transition-colors"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Username
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-[15px] font-bold text-slate-400 select-none">
                  @
                </span>
                <input
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] bg-white transition-colors"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                Unique profile link: <span className="text-[#009670]">{domain}/{username || 'username'}</span>
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Confirm Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-11 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-2.5 select-none pt-0.5">
              <input
                id="agree"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 text-[#009670] border-slate-300 focus:ring-[#009670] rounded cursor-pointer"
              />
              <label htmlFor="agree" className="text-[11px] text-slate-500 font-semibold cursor-pointer">
                I agree to the{' '}
                <a href="#" className="text-[#009670] hover:underline font-bold">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#009670] hover:underline font-bold">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* CTA Register Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#009670] hover:bg-[#047857] disabled:bg-slate-300 text-white font-extrabold text-[13.5px] rounded-xl transition-all shadow-lg shadow-emerald-700/20 hover:shadow-xl flex items-center justify-center gap-2 select-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <svg className="w-4.5 h-4.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Form Footer */}
          <p className="text-center font-bold text-xs text-slate-500 select-none pt-0.5">
            Already have an account?{' '}
            <Link href="/tools/profilemitraa/login" className="text-[#009670] hover:underline font-extrabold">
              Sign In
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}
