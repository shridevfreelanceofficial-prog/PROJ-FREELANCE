/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CompleteProfilePage() {
  const router = useRouter();

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

  // Form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState('');
  const [location, setLocation] = useState('');
  const [headline, setHeadline] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetch('/api/profilemitraa/profile')
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            router.push('/tools/profilemitraa/login');
          }
          return;
        }
        const data = await res.json();
        if (data.success) {
          if (data.user) {
            setFullName(data.user.fullName || '');
            setUsername(data.user.username || '');
            setEmail(data.user.email || '');
          }
          if (data.profile) {
            setPhoneNumber(data.profile.phone || '');
            setDob(data.profile.dob || '');
            setLocation(data.profile.location || '');
            setHeadline(data.profile.headline || '');
            if (data.profile.profile_photo_url) {
              setPhotoPreview(data.profile.profile_photo_url);
            }
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching step 1 profile details:', err);
      });
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName || !username || !email || !dob || !location || !headline) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('phone', phoneNumber);
    formData.append('dob', dob);
    formData.append('location', location);
    formData.append('headline', headline);
    if (photo) {
      formData.append('profile_photo', photo);
    }

    fetch('/api/profilemitraa/profile', {
      method: 'POST',
      body: formData,
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to save base profile details.');
        }
        const isToolsPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/tools/profilemitraa');
        const targetRoute = isToolsPath ? '/tools/profilemitraa/complete-profile/step-2' : '/complete-profile/step-2';
        router.push(targetRoute);
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Error occurred while saving profile.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-white flex flex-col lg:flex-row font-sans selection:bg-[#009670] selection:text-white">
      
      {/* Left Column - Product Showcase (Visible on lg support) */}
      <div className="hidden lg:flex lg:w-[38%] bg-[#F4FAF8] border-r border-[#E6F3EE] flex-col p-8 relative overflow-hidden shrink-0 select-none h-full justify-between">
        
        {/* Soft Background shapes & gradients */}
        <div className="absolute top-[10%] right-[-10%] w-[400px] h-[400px] bg-[#E1F2ED]/60 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Top Info Group: Header block and feature listings */}
        <div className="relative z-10 flex flex-col gap-6">
          {/* Header Block / Logo */}
          <div>
            <div className="flex items-center gap-2.5 mb-6 justify-start">
              <img
                src="/images/tools/ProfileMitraa/logo/profilemitraalogo.png"
                alt="ProfileMitraa Logo"
                className="h-9 w-auto object-contain"
              />
              <span className="text-lg font-black text-slate-800 tracking-tight">
                Profile<span className="text-[#009670]">Mitraa</span>
              </span>
            </div>
            
            <h1 className="text-[28px] xl:text-[34px] font-black text-slate-900 tracking-tight leading-[1.12] mb-3">
              Complete Your <span className="text-[#009670]">Profile</span>
            </h1>
            <p className="text-[12.5px] text-slate-500 font-medium leading-relaxed max-w-xs">
              Let&apos;s build your professional identity. Fill in a few details to get started.
            </p>
          </div>

          {/* List of Features */}
          <div className="space-y-4 pl-1 max-w-xs">
            
            {/* Point 1 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5F5EF] text-[#009670] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-[12px] text-slate-900 leading-tight">Personalized Experience</h4>
                <p className="text-[10.5px] text-slate-400 mt-1 leading-snug">Get profile suggestions tailored just for you.</p>
              </div>
            </div>

            {/* Point 2 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5F5EF] text-[#009670] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-[12px] text-slate-900 leading-tight">Showcase Your Best</h4>
                <p className="text-[10.5px] text-slate-400 mt-1 leading-snug">Highlight your skills, experience and achievements.</p>
              </div>
            </div>

            {/* Point 3 */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5F5EF] text-[#009670] flex items-center justify-center shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h4 className="font-extrabold text-[12px] text-slate-900 leading-tight">Stand Out</h4>
                <p className="text-[10.5px] text-slate-400 mt-1 leading-snug">A complete profile helps you get noticed by the right people.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Decorative elements - Dots */}
        <div className="absolute right-4 top-[40%] grid grid-cols-4 gap-1.5 opacity-20 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-1 h-1 rounded-full bg-slate-500" />
          ))}
        </div>

        {/* Background Mint Circle Decoration - Placed directly behind the desktop showcase */}
        <div className="absolute bottom-[-100px] right-[-100px] w-[320px] h-[320px] rounded-full bg-[#E3F4EF]/75 pointer-events-none z-0" />

        {/* Bottom illustration container - centering the computer dashboard illustration */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[85%] max-h-[30%] z-10 pointer-events-none select-none flex items-end justify-center">
          <img
            src="/images/tools/ProfileMitraa/registration-img/registration1.png"
            alt="Profile Mockup Dashboard"
            className="w-full h-auto object-contain object-bottom"
          />
        </div>

      </div>

      {/* Right Column - Complete Profile Form */}
      <div className="flex-1 flex flex-col items-center px-4 sm:px-8 lg:px-12 py-12 lg:py-16 lg:h-screen lg:overflow-y-auto justify-start select-text">
        <div className="max-w-[680px] w-full space-y-6 flex flex-col justify-start">
          
          {/* Mobile visible logo header */}
          <div className="lg:hidden flex items-center gap-2 mb-4 justify-center">
            <img
              src="/images/tools/ProfileMitraa/logo/profilemitraalogo.png"
              alt="ProfileMitraa Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="text-base font-black text-slate-900 tracking-tight">
              Profile<span className="text-[#009670]">Mitraa</span>
            </span>
          </div>

          {/* Page Headers & Stepper */}
          <div className="text-center lg:text-left flex flex-col lg:flex-row lg:items-center lg:justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">
                Let&apos;s Complete Your Profile
              </h2>
              <p className="text-[12.5px] text-[#009670] font-bold mt-1">
                Step 1 of 4
              </p>
            </div>

            {/* Stepper Progress Indicator */}
            <div className="flex items-center gap-6 mt-4 lg:mt-0 justify-center select-none">
              
              {/* Step 1 */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#009670] text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-emerald-700/20">
                  1
                </div>
                <span className="text-xs font-bold text-[#009670]">Basic Info</span>
              </div>

              {/* Connector line */}
              <div className="w-8 h-[1px] bg-slate-200 hidden sm:block" />

              {/* Step 2 */}
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-7 h-7 rounded-full border border-slate-300 text-slate-500 bg-slate-50 flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Professional Info</span>
              </div>

              {/* Connector line */}
              <div className="w-8 h-[1px] bg-slate-200 hidden sm:block" />

              {/* Step 3 */}
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-7 h-7 rounded-full border border-slate-300 text-slate-500 bg-slate-50 flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Skills</span>
              </div>

              {/* Connector line */}
              <div className="w-8 h-[1px] bg-slate-200 hidden sm:block" />

              {/* Step 4 */}
              <div className="flex items-center gap-2 opacity-50">
                <div className="w-7 h-7 rounded-full border border-slate-300 text-slate-500 bg-slate-50 flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Review</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span className="w-4 h-4 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0">!</span>
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Grid 2 Column */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] transition-colors"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Username *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 font-bold select-none text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] transition-colors"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 select-none font-medium">
                  This will be your unique profile link.{' '}
                  <span className="text-[#009670] font-semibold">
                    {domain}/{username || 'username'}
                  </span>
                </p>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] transition-colors"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <div className="absolute left-10 flex items-center gap-1 pl-1 pr-2 border-r border-slate-100 select-none">
                    <span className="text-base leading-none">🇮🇳</span>
                    <svg className="w-2.5 h-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-[78px] pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] transition-colors"
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Date of Birth *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] text-slate-700 transition-colors"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400">
                    <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="Enter your city, state or country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] transition-colors"
                  />
                </div>
              </div>

            </div>

            {/* Headline */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Headline *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </span>
                <input
                  type="text"
                  required
                  placeholder="Write a short professional headline"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] transition-colors"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 select-none font-medium">
                Example: Full Stack Developer | MERN Stack Enthusiast
              </p>
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Profile Photo
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 p-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                {/* Upload Action Card */}
                <label className="flex flex-col items-center justify-center w-28 h-20 border border-dashed border-slate-300 rounded-xl bg-white hover:bg-slate-50 cursor-pointer transition-all self-center shrink-0 overflow-hidden">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {photo ? (
                    <img src={URL.createObjectURL(photo)} alt="Selected Avatar Preview" className="w-full h-full object-cover" />
                  ) : photoPreview ? (
                    <img src={photoPreview} alt="Existing Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-[10px] font-bold text-slate-500 mt-1">Upload Photo</span>
                    </>
                  )}
                </label>

                {/* Upload Guide Details */}
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-[12.5px] text-slate-500 font-medium">
                    {photo ? (
                      <span className="text-[#009670] font-bold">Selected: {photo.name}</span>
                    ) : photoPreview ? (
                      <span className="text-[#009670] font-bold">Existing avatar loaded</span>
                    ) : (
                      <>
                        <span className="text-slate-800 font-bold">Click to upload</span> or drag and drop
                      </>
                    )}
                  </p>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    JPG, PNG or WEBP (Max. 2MB)
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPhoto(null);
                      setPhotoPreview(null);
                    }}
                    className="text-[#009670] hover:underline font-bold text-[11px] self-start mt-2"
                  >
                    {photo || photoPreview ? 'Clear photo' : 'Add later'}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-6 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-700 bg-white font-bold text-[12.5px] rounded-xl transition-all"
              >
                Skip for now
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-[#009670] hover:bg-[#047857] disabled:bg-slate-300 text-white font-bold text-[12.5px] rounded-xl transition-all shadow-md shadow-emerald-700/10 flex items-center gap-1.5"
              >
                {isLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Next Step
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Security Disclaimer */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-semibold select-none pt-4 bg-white">
            <svg className="w-3.5 h-3.5 text-[#009670]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Your information is safe with us. We never share your data.</span>
          </div>

        </div>
      </div>

    </div>
  );
}
