/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfileMitraaLoginPage() {
  const router = useRouter();
  const isToolsPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/tools/profilemitraa');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!emailOrUsername || !password) {
      setErrorMsg('Please enter both your email/username and password.');
      return;
    }

    setIsLoading(true);
    fetch('/api/profilemitraa/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailOrUsername,
        password,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Login failed.');
        }
        router.push(isToolsPath ? '/tools/profilemitraa/dashboard' : '/dashboard');
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Invalid credentials or something went wrong.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-white flex flex-col lg:flex-row font-sans selection:bg-[#009670] selection:text-white">
      
      {/* Left Column - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-12 lg:px-20 py-8 lg:max-h-screen lg:overflow-y-auto">
        <div className="max-w-[440px] w-full space-y-5 my-auto flex flex-col justify-center">
          
          {/* Logo Header */}
          <div className="flex items-center gap-2.5 mb-2 justify-center lg:justify-start">
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
              Welcome Back!
            </h2>
            <p className="text-[13px] text-slate-500 font-medium mt-0.5 leading-relaxed">
              Login to continue building your professional identity.
            </p>
          </div>

          {/* Google SSO Button */}
          <button
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                setIsLoading(false);
                setEmailOrUsername('google.user@gmail.com');
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-[14px]">
            {/* Email or Username */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email or Username
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Enter your email or username"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] bg-white transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
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

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between text-[13px] font-semibold select-none pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-500">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#009670] border-slate-300 focus:ring-[#009670] rounded cursor-pointer"
                />
                Remember me
              </label>
              <a href="#" className="text-[#009670] hover:underline font-bold">
                Forgot Password?
              </a>
            </div>

            {/* CTA Log In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#009670] hover:bg-[#047857] disabled:bg-slate-300 text-white font-extrabold text-[13.5px] rounded-xl transition-all shadow-lg shadow-emerald-700/20 hover:shadow-xl flex items-center justify-center gap-2 select-none"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging In...
                </>
              ) : (
                <>
                  Log In
                  <svg className="w-4.5 h-4.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Form Footer */}
          <p className="text-center font-bold text-xs text-slate-500 select-none pt-0.5">
            Don&apos;t have an account?{' '}
            <Link href={isToolsPath ? "/tools/profilemitraa/register" : "/register"} className="text-[#009670] hover:underline font-extrabold">
              Sign Up
            </Link>
          </p>

          {/* Perks Bar at bottom */}
          <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-6 text-left max-w-[440px] w-full text-slate-500 gap-2 select-none">
            {/* Item 1 */}
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded bg-emerald-50 text-[#009670] flex items-center justify-center shrink-0 border border-emerald-100">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h5 className="font-bold text-[10.5px] text-slate-900 leading-tight">100% Free Forever</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">All features. All free.</p>
              </div>
            </div>

            {/* Item 2 */}
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded bg-emerald-50 text-[#009670] flex items-center justify-center shrink-0 border border-emerald-100">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h5 className="font-bold text-[10.5px] text-slate-900 leading-tight">Secure & Private</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">Your data is safe.</p>
              </div>
            </div>

            {/* Item 3 */}
            <div className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded bg-emerald-50 text-[#009670] flex items-center justify-center shrink-0 border border-emerald-100">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h5 className="font-bold text-[10.5px] text-slate-900 leading-tight">Super Fast</h5>
                <p className="text-[10px] text-slate-400 mt-0.5">Built for speed.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Right Column - Product Showcase (Now bg-white to perfectly blend with the illustration image) */}
      <div className="hidden lg:flex lg:w-[50%] bg-[#F4FAF8] border-l border-[#E6F3EE] flex-col p-10 pb-0 relative overflow-hidden shrink-0 select-none h-full justify-between">
        
        {/* Soft Background shapes & gradients */}
        <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-[#E1F2ED]/60 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-[#EEF8F5]/80 rounded-full blur-[80px] pointer-events-none" />

        {/* Decorative elements - Top Right Dot Grid & Green Ring */}
        <div className="absolute top-10 right-10 grid grid-cols-5 gap-2 opacity-30 z-10">
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          ))}
        </div>
        <div className="absolute top-[12%] right-[-140px] w-[340px] h-[340px] rounded-full border-[32px] border-[#009670]/10 pointer-events-none z-10" />

        {/* Top Content & Floating Badges aligned vertically on the left */}
        <div className="pt-10 pl-6 relative z-10 max-w-xl shrink-0 flex flex-col items-start">
          {/* Header block */}
          <h1 className="text-[38px] xl:text-[44px] font-black text-slate-900 tracking-tight leading-[1.12] mb-3">
            Build. <br />
            Create. <br />
            <span className="text-[#009670]">Stand Out.</span>
          </h1>
          <p className="text-[14px] text-slate-600 font-normal leading-relaxed max-w-lg mb-8">
            Your professional identity starts here.
          </p>

          {/* Widget 1 - Profile Badge */}
          <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl p-3 shadow-lg flex items-center gap-3 w-[220px] mb-4 hover:scale-[1.02] transition-transform duration-300 relative z-20">
            <div className="w-[34px] h-[34px] rounded-full bg-[#009670] text-white flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="h-2 bg-slate-200 rounded-full w-4/5"></div>
              <div className="h-1.5 bg-slate-100 rounded-full w-3/5"></div>
            </div>
          </div>
          
          {/* Widget 2 - Growth Chart Badge */}
          <div className="bg-white/95 backdrop-blur-sm border border-slate-100 rounded-2xl p-3 shadow-lg flex flex-col gap-1 w-[220px] hover:scale-[1.02] transition-transform duration-300 relative z-20">
            <div className="w-full flex items-end justify-between h-9">
              {/* Green chart curve with shade/gradient area */}
              <div className="relative w-[75%] h-8 mt-1">
                <svg className="w-full h-full text-[#009670]" viewBox="0 0 100 30" fill="none">
                  {/* Shaded Area under the path */}
                  <path d="M0,25 C15,22 30,5 50,15 C70,25 85,2 100,5 L100,30 L0,30 Z" fill="rgba(0, 150, 112, 0.08)" />
                  {/* Border path */}
                  <path d="M0,25 C15,22 30,5 50,15 C70,25 85,2 100,5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="w-[26px] h-[26px] rounded-full bg-[#0d2a23] flex items-center justify-center text-white shrink-0 self-end mb-0.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Character Illustration - Perfectly scaled and aligned bottom-right to blend with white/grey background */}
        <div className="absolute bottom-0 right-0 w-full h-[70%] z-0 pointer-events-none select-none flex items-end justify-end">
          <img
            src="/images/tools/ProfileMitraa/login-img/login.png"
            alt="ProfileMitraa Character Illustration"
            className="w-full h-full object-contain object-bottom object-right"
          />
        </div>

      </div>

    </div>
  );
}
