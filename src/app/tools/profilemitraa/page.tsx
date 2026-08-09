/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProfileMitraaPage() {
  const [isStartedModalOpen, setIsStartedModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'portfolio' | 'resume'>('all');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-800 font-sans selection:bg-[#059669] selection:text-white flex flex-col">
      {/* Sticky Top Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-[68px] w-[68px] relative flex items-center justify-center">
              <img
                src="/images/tools/ProfileMitraa/logo/profilemitraalogo.png"
                alt="ProfileMitraa Logo"
                className="h-[68px] w-auto object-contain"
              />
            </div>
            <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Profile<span className="text-[#059669]">Mitraa</span>
            </span>
          </div>

          {/* Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#templates" onClick={() => setIsTemplateModalOpen(true)} className="hover:text-[#059669] transition-colors">
              Templates
            </a>
            <a href="#features" className="hover:text-[#059669] transition-colors">
              Features
            </a>
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#059669] transition-colors py-2">
              <span>Explore</span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-[#059669]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </nav>

          {/* Auth CTA Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/tools/profilemitraa/login"
              className="px-4 py-2 text-sm font-semibold text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all"
            >
              Login
            </Link>
            <Link
              href="/tools/profilemitraa/register"
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              Get Started Free
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-16 pb-16 sm:pb-24 overflow-hidden">
        {/* Soft Background Gradient Blobs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-cyan-100/40 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Hero Text Column */}
            <div className="lg:col-span-6 flex flex-col items-start text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold tracking-wide mb-6 shadow-sm">
                <svg className="w-3.5 h-3.5 text-[#059669]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                100% Free Forever
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-gray-900 tracking-tight leading-[1.15] mb-6">
                Build Your Professional Identity with <span className="text-[#059669]">ProfileMitraa</span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-gray-600 font-normal leading-relaxed max-w-xl mb-8">
                Create stunning portfolio websites, professional resumes and personal profiles in minutes. 100% free, forever. No hidden charges. No limits.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10">
                <Link
                  href="/tools/profilemitraa/register"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-base transition-all shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 hover:-translate-y-0.5"
                >
                  Get Started for Free
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
                <button
                  onClick={() => setIsTemplateModalOpen(true)}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-bold text-base transition-all shadow-sm flex items-center justify-center gap-2.5 hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Try a Template
                </button>
              </div>

              {/* Perks Bar */}
              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center text-[10px]">✓</span>
                  No Credit Card
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center text-[10px]">🛡</span>
                  No Hidden Charges
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-[#059669] flex items-center justify-center text-[10px]">∞</span>
                  No Limits
                </div>
              </div>
            </div>

            {/* Right Hero Graphics (Desktop + Mobile Overlapping) */}
            <div className="lg:col-span-6 relative mt-6 lg:mt-0">
              <div className="relative mx-auto max-w-2xl lg:max-w-none">
                {/* Desktop Mockup */}
                <div className="relative rounded-2xl shadow-2xl overflow-hidden border border-gray-200/80 bg-white">
                  <img
                    src="/images/tools/ProfileMitraa/hero-img/heroimg1.png"
                    alt="ProfileMitraa Desktop View"
                    className="w-full h-auto object-cover rounded-2xl"
                  />
                </div>

                {/* Mobile Mockup (Overlapping right bottom) */}
                <div className="absolute -right-3 sm:-right-6 -bottom-6 sm:-bottom-8 w-[38%] max-w-[210px] sm:max-w-[240px] rounded-3xl shadow-2xl border-4 border-white bg-white overflow-hidden z-20 hover:scale-105 transition-transform duration-300">
                  <img
                    src="/images/tools/ProfileMitraa/hero-img/heroimg2.png"
                    alt="ProfileMitraa Mobile View"
                    className="w-full h-auto object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Everything is 100% Free Banner Bar */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-gray-200/80 p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Gift Box Title */}
            <div className="md:col-span-5 flex items-center gap-4 border-b md:border-b-0 md:border-r border-gray-100 pb-5 md:pb-0 md:pr-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#059669] shrink-0 shadow-inner">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 13C10.832 21 2 20 2 12V8a2 2 0 012-2h16a2 2 0 012 2v4c0 8-8.832 9-10 9z" />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-base sm:text-lg">Everything is 100% Free</h4>
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5 leading-snug">
                  All features. All templates. Unlimited everything. Build your professional identity without any limits.
                </p>
              </div>
            </div>

            {/* 4 Feature Items */}
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
                  <span className="text-lg">∞</span>
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 text-xs sm:text-sm">100% Free Forever</h5>
                  <p className="text-[11px] text-gray-400">No time limit</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 text-xs sm:text-sm">All Features Included</h5>
                  <p className="text-[11px] text-gray-400">No restrictions</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 text-xs sm:text-sm">Unlimited Usage</h5>
                  <p className="text-[11px] text-gray-400">For everyone</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#059669] flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 text-xs sm:text-sm">Secure & Private</h5>
                  <p className="text-[11px] text-gray-400">Your data is safe</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ALL FREE FEATURES Section */}
      <section id="features" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-[#059669] text-xs font-bold tracking-wider uppercase inline-block mb-3 border border-emerald-200/60">
              ALL FREE FEATURES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-4">
              Everything You Need, 100% Free
            </h2>
            <p className="text-base sm:text-lg text-gray-600 font-normal">
              Powerful features to build, customize and grow your professional identity.
            </p>
          </div>

          {/* 6 Grid Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1: Portfolio Builder */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-[#059669] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Portfolio Builder</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Create beautiful portfolio websites with our easy builder and modern templates.
                </p>
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-md bg-emerald-50 text-[#059669] text-xs font-bold">
                  100% FREE
                </span>
              </div>
            </div>

            {/* Card 2: Resume Builder */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Resume Builder</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Build ATS-friendly resumes and download them in PDF format instantly.
                </p>
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-md bg-emerald-50 text-[#059669] text-xs font-bold">
                  100% FREE
                </span>
              </div>
            </div>

            {/* Card 3: Unique Link */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Unique Link</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Get your unique profile link and share your work anywhere in the world.
                </p>
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-md bg-emerald-50 text-[#059669] text-xs font-bold">
                  100% FREE
                </span>
              </div>
            </div>

            {/* Card 4: Certificates */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Certificates</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Showcase your certificates and achievements in a professional way.
                </p>
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-md bg-emerald-50 text-[#059669] text-xs font-bold">
                  100% FREE
                </span>
              </div>
            </div>

            {/* Card 5: Analytics */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Analytics</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Track your profile views and understand your audience better.
                </p>
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-md bg-emerald-50 text-[#059669] text-xs font-bold">
                  100% FREE
                </span>
              </div>
            </div>

            {/* Card 6: Easy Customization */}
            <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between hover:-translate-y-1">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Easy Customization</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Customize everything easily with our simple and powerful editor.
                </p>
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-md bg-emerald-50 text-[#059669] text-xs font-bold">
                  100% FREE
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/images/tools/ProfileMitraa/logo/profilemitraalogo.png" alt="ProfileMitraa Logo" className="h-16 w-auto object-contain" />
            <span className="font-bold text-gray-900 text-sm">
              Profile<span className="text-[#059669]">Mitraa</span>
            </span>
          </div>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} ProfileMitraa. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-[#059669] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#059669] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#059669] transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>

      {/* GET STARTED MODAL */}
      {isStartedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setIsStartedModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-[#059669]">
                <img src="/images/tools/ProfileMitraa/logo/profilemitraalogo.png" alt="ProfileMitraa" className="h-8 w-auto" />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Create Your Profile</h3>
              <p className="text-xs text-gray-500 mt-1">Start building your 100% free professional identity</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert('Profile Builder initializing...'); setIsStartedModalOpen(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Shrikesh Shetty"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#059669] focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#059669] focus:outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Desired Profile URL</label>
                <div className="flex items-center rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#059669]">
                  <span className="bg-gray-50 px-3 py-3 text-xs text-gray-400 border-r border-gray-200 font-mono">profilemitraa.online/</span>
                  <input
                    type="text"
                    placeholder="shrikeshshetty"
                    required
                    className="w-full px-3 py-3 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all mt-2"
              >
                Launch Profile Builder
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TEMPLATES MODAL */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-3xl bg-white rounded-3xl p-8 shadow-2xl relative border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsTemplateModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <span className="text-xs font-bold text-[#059669] uppercase tracking-wider">Free Templates</span>
              <h3 className="text-2xl font-black text-gray-900 mt-0.5">Select a Starting Template</h3>
            </div>

            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3">
              {(['all', 'portfolio', 'resume'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${
                    activeTab === tab ? 'bg-[#059669] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <img src="/images/tools/ProfileMitraa/hero-img/heroimg1.png" alt="Developer Portfolio" className="w-full h-44 object-cover" />
                <div className="p-4 bg-white">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#059669]">PORTFOLIO</span>
                  <h4 className="font-bold text-gray-900 text-base mt-1">Full Stack Developer Profile</h4>
                  <p className="text-xs text-gray-500 mt-1">Clean dark sidebar with featured projects and skills section.</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <img src="/images/tools/ProfileMitraa/hero-img/heroimg2.png" alt="Mobile Minimal" className="w-full h-44 object-cover" />
                <div className="p-4 bg-white">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600">MINIMAL</span>
                  <h4 className="font-bold text-gray-900 text-base mt-1">Mobile Personal Bio</h4>
                  <p className="text-xs text-gray-500 mt-1">Sleek single-page profile optimized for mobile screens & social link-in-bio.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
