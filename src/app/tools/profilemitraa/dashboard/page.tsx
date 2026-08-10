/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfileMitraaDashboardPage() {
  const router = useRouter();
  const isToolsPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/tools/profilemitraa');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [portfolioLoading, setPortfolioLoading] = useState(true);
  const [deletingPortfolio, setDeletingPortfolio] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [greeting, setGreeting] = useState('Good Morning');
  const [domainPrefix, setDomainPrefix] = useState('profilemitraa.shridevfreelance.online/');
  const [stats, setStats] = useState({ profileViews: 0, resumeDownloads: 0, certificates: 0, followers: 0, following: 0 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.location.hostname.endsWith('localhost') || window.location.hostname === '127.0.0.1') {
        setDomainPrefix('profilemitraa.localhost:3000/');
      } else {
        setDomainPrefix('profilemitraa.shridevfreelance.online/');
      }
    }
  }, []);

  // Load profile state
  useEffect(() => {
    // Dynamic greeting based on current local hour
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    fetch('/api/profilemitraa/profile')
      .then(async (res) => {
        if (!res.ok) {
          if (res.status === 401) {
            router.push(isToolsPath ? '/tools/profilemitraa/login' : '/login');
          }
          return;
        }
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setProfile(data.profile);
        }
      })
      .catch((err) => console.error('Error fetching dashboard details:', err))
      .finally(() => setLoading(false));

    // Fetch portfolio state
    fetch('/api/profilemitraa/portfolio')
      .then(r => r.json())
      .then(d => { if (d.success) setPortfolios(d.portfolios || []); })
      .catch(() => {})
      .finally(() => setPortfolioLoading(false));

    // Fetch real stats
    fetch('/api/profilemitraa/stats')
      .then(r => r.json())
      .then(d => { if (d.success) setStats(d.stats); })
      .catch(() => {});
  }, [router]);

  // Calculate dynamic profile completion percentage
  const getCompletionPercentage = () => {
    if (!profile) return 0;
    let filledFields = 0;
    
    // Step 1: Basic Info (max 40%)
    if (user?.fullName) filledFields += 5;
    if (user?.email) filledFields += 5;
    if (user?.username) filledFields += 5;
    if (profile.phone) filledFields += 5;
    if (profile.dob) filledFields += 5;
    if (profile.location) filledFields += 5;
    if (profile.headline) filledFields += 5;
    if (profile.profile_photo_url) filledFields += 5;

    // Step 2: Professional Info (max 35%)
    if (profile.professional_title) filledFields += 5;
    if (profile.experience_level) filledFields += 5;
    if (profile.experience_level === 'Fresher') {
      // Fresher gets full points for the hidden fields
      filledFields += 15;
    } else {
      if (profile.current_job_role) filledFields += 5;
      if (profile.experience_years) filledFields += 5;
      if (profile.company) filledFields += 5;
    }
    if (profile.employment_type) filledFields += 5;
    if (profile.about_me) filledFields += 5;

    // Step 3: Skills & Certs (max 25%)
    const techLen = Array.isArray(profile.tech_skills) ? profile.tech_skills.length : 0;
    const toolsLen = Array.isArray(profile.tools) ? profile.tools.length : 0;
    const softLen = Array.isArray(profile.soft_skills) ? profile.soft_skills.length : 0;
    const langLen = Array.isArray(profile.languages) ? profile.languages.length : 0;
    const certsLen = Array.isArray(profile.certifications) ? profile.certifications.length : 0;

    if (techLen > 0) filledFields += 5;
    if (toolsLen > 0) filledFields += 5;
    if (softLen > 0) filledFields += 5;
    if (langLen > 0) filledFields += 5;
    if (certsLen > 0) filledFields += 5;

    return Math.min(filledFields, 100);
  };

  const completionPercent = getCompletionPercentage();

  // Get portfolio public URL
  const getPortfolioUrl = (slug: string) => {
    if (typeof window !== 'undefined' && (window.location.hostname.endsWith('localhost') || window.location.hostname === '127.0.0.1')) {
      return `http://profilemitraa.localhost:3000/${slug}`;
    }
    return `http://profilemitraa.shridevfreelance.online/${slug}`;
  };

  // Delete portfolio with confirmation
  const handleDeletePortfolio = async (id: string) => {
    setDeletingPortfolio(true);
    try {
      const res = await fetch(`/api/profilemitraa/portfolio?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPortfolios(prev => prev.filter(p => p.id !== id));
        setDeleteConfirmId(null);
      } else {
        alert(data.error || 'Failed to delete portfolio.');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setDeletingPortfolio(false);
    }
  };

  // Public Profile URL
  const getProfileUrl = () => {
    const username = user?.username || 'username';
    if (typeof window !== 'undefined' && (window.location.hostname.endsWith('localhost') || window.location.hostname === '127.0.0.1')) {
      return `http://profilemitraa.localhost:3000/${username}/profile`;
    }
    return `http://profilemitraa.shridevfreelance.online/${username}/profile`;
  };

  const profileUrl = getProfileUrl();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(profileUrl)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${user?.username || 'user'}-profilemitraa-qr.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading QR code:', err);
    }
  };

  const handleLogout = async () => {
    // Basic logout logic by resetting cookie and redirecting to login page
    document.cookie = 'profilemitraa_authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push(isToolsPath ? '/tools/profilemitraa/login' : '/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-[#009670]/40 border-t-[#009670] rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-500">Loading Dashboard...</p>
      </div>
    );
  }

  // Get user avatar initials
  const initials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'PM';

  // Get first certificate name for dynamic listing
  const lastCertName = profile?.certifications && Array.isArray(profile.certifications) && profile.certifications.length > 0
    ? profile.certifications[profile.certifications.length - 1].name
    : 'Web Development Certificate';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-[#009670]/20 flex flex-col">
      
      {/* ─── Header topbar ─── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={isToolsPath ? "/tools/profilemitraa" : "/"} className="flex items-center gap-2.5">
            <img
              src="/images/tools/ProfileMitraa/logo/profilemitraalogo.png"
              alt="ProfileMitraa Logo"
              className="h-8 sm:h-9 w-auto object-contain"
            />
            <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Profile<span className="text-[#009670]">Mitraa</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navbar menu */}
        <nav className="hidden md:flex items-center gap-7 text-[13.5px] font-bold text-slate-600">
          <Link href={isToolsPath ? "/tools/profilemitraa" : "/"} className="text-[#009670] border-b-2 border-[#009670] pb-5 pt-5 hover:text-[#009670]">Home</Link>
          <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#009670] py-5">
            <span>Create</span>
            <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#009670]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          <Link href={isToolsPath ? "/tools/profilemitraa/users" : "/users"} className="hover:text-[#009670]">Users</Link>
          <Link href={isToolsPath ? "/tools/profilemitraa" : "/"} className="hover:text-[#009670]">Explore</Link>
        </nav>

        {/* User profile session */}
        <div className="flex items-center gap-3.5">
          {/* Notification bell */}
          <button className="relative w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors">
            <svg className="w-4.5 h-4.5 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500" />
          </button>

          {/* User profile menu dropdown */}
          <div className="flex items-center gap-2">
            {profile?.profile_photo_url ? (
              <img
                src={profile.profile_photo_url}
                alt="Profile Avatar"
                className="w-9.5 h-9.5 rounded-full object-cover border border-slate-100"
              />
            ) : (
              <div className="w-9.5 h-9.5 rounded-full bg-emerald-50 text-[#009670] flex items-center justify-center text-xs font-bold font-sans">
                {initials}
              </div>
            )}
            {/* Logout button */}
            <button onClick={handleLogout} className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors hidden sm:block">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main body container with sidebar ─── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        
        {/* ─── Left sidebar navigation ─── */}
        <aside className="w-full md:w-[220px] shrink-0 flex flex-col justify-between self-start gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-1 shadow-sm">
            <Link href={isToolsPath ? "/tools/profilemitraa/dashboard" : "/dashboard"} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-emerald-50 text-[#009670] font-bold text-[13px] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Dashboard
            </Link>

            <Link href={isToolsPath ? "/tools/profilemitraa/create-portfolio" : "/create-portfolio"} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold text-[13px] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Portfolio
            </Link>

            <Link href="#resume" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold text-[13px] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Resume
            </Link>

            <Link href="#projects" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold text-[13px] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18" />
              </svg>
              Projects
            </Link>

            <Link href={isToolsPath ? "/tools/profilemitraa/complete-profile/step-3" : "/complete-profile/step-3"} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold text-[13px] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Certificates
            </Link>

            <Link href={isToolsPath ? "/tools/profilemitraa/users" : "/users"} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold text-[13px] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              Users
            </Link>

            <Link href="#analytics" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold text-[13px] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v5.25c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 18.375v-5.25zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125v-9.75zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v14.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              Analytics
            </Link>

            <Link href={isToolsPath ? "/tools/profilemitraa/complete-profile" : "/complete-profile"} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-bold text-[13px] transition-all">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.59 4.59A2 2 0 1111 8H9m10.59 11.41A2 2 0 1119 18h-2M9 18H5a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2v3m-6 10h6m-3-3v6" />
              </svg>
              Settings
            </Link>
          </div>

          {/* Premium banner box */}
          <div className="bg-gradient-to-br from-slate-900 to-emerald-950 rounded-2xl p-4.5 text-white space-y-3 relative overflow-hidden shadow-md hidden md:block">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-700/25 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 text-amber-400">
              <span className="text-sm">👑</span>
              <span className="text-[12px] font-black tracking-wider uppercase">Go Premium</span>
            </div>
            <p className="text-[11px] text-emerald-100/90 leading-relaxed font-semibold">
              Unlock premium styled templates, custom domains, resume designs, and advanced analytics.
            </p>
            <button className="w-full py-2 bg-[#009670] hover:bg-[#047857] text-white font-bold text-xs rounded-xl transition-all shadow-sm">
              Upgrade Now
            </button>
          </div>
        </aside>

        {/* ─── Center / Right main content ─── */}
        <main className="flex-1 space-y-6">
          
          {/* Main header row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                {greeting}, {user?.fullName?.split(' ')[0] || 'User'} 👋
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                Manage your professional identity and grow your presence.
              </p>
            </div>

            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-[13px] rounded-xl transition-all shadow-xs"
            >
              View My Profile
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
            </a>
          </div>

          {/* Stats grid row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* View Stats Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4.5 shadow-sm space-y-3 hover:translate-y-[-2px] transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#009670] flex items-center justify-center shrink-0">
                  <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profile Views</p>
                  <p className="text-xl font-black text-slate-900 mt-0.5">{stats.profileViews.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-600">
                <span>{stats.followers} followers</span>
                {/* SVG Mini line graph */}
                <svg className="w-14 h-5 text-[#009670]" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M0,15 Q5,5 10,12 T20,8 T30,16 T40,4 T50,11" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Downloads Stats Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4.5 shadow-sm space-y-3 hover:translate-y-[-2px] transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resume Downloads</p>
                  <p className="text-xl font-black text-slate-900 mt-0.5">{stats.resumeDownloads.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-600">
                <span>↑ 12.4% this week</span>
                <svg className="w-14 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M0,15 Q5,10 10,5 T20,12 T30,8 T40,16 T50,5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Certifications Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4.5 shadow-sm space-y-3 hover:translate-y-[-2px] transition-transform">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Certificates</p>
                  <p className="text-xl font-black text-slate-900 mt-0.5">{stats.certificates}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-purple-600">
                <span>↑ 2 new this month</span>
                <svg className="w-14 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M0,15 T10,10 T20,14 T30,5 T40,10 T50,3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Profile Completion Circle Stats Card */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4.5 shadow-sm space-y-3 hover:translate-y-[-2px] transition-transform">
              <div className="flex items-center justify-between">
                <div className="relative w-12 h-12">
                  {/* Round Progress Bar */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="24" cy="24" r="20" stroke="#F1F5F9" strokeWidth="4" fill="transparent" />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke="#009670"
                      strokeWidth="4"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 20}`}
                      strokeDashoffset={`${2 * Math.PI * 20 * (1 - completionPercent / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10.5px] font-black text-slate-800">
                    {completionPercent}%
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Profile Completion</p>
                  <p className="text-xs font-bold text-[#009670] mt-0.5">Keep it up!</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold">
                <Link href={isToolsPath ? "/tools/profilemitraa/complete-profile" : "/complete-profile"} className="text-[#009670] hover:underline flex items-center gap-1 mt-1">
                  Improve Profile
                  <span>➔</span>
                </Link>
              </div>
            </div>

          </div>

          {/* Bottom layout sections */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left section: Create New & Recent Activity */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Create new components */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <div>
                  <h3 className="text-[14.5px] font-black text-slate-900">Create New</h3>
                  <p className="text-[11.5px] font-semibold text-slate-400 mt-0.5">
                    Build and manage your professional identity.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Portfolio Card — static entry point for creating new portfolios */}
                  <div className="border border-slate-100 rounded-xl p-4.5 bg-slate-50/50 flex flex-col justify-between gap-4 relative overflow-hidden">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#009670] flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-.554-8-1.548m16 0A12.02 12.02 0 0121 12c0 2.29-.643 4.43-1.782 6.25m-16.436 0A12.02 12.02 0 013 12c0-2.29.643-4.43 1.782-6.25" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-[13.5px]">Portfolio Website</h4>
                        <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                          Create a stunning new portfolio website to showcase your work.
                        </p>
                      </div>
                    </div>
                    <Link
                      href={isToolsPath ? "/tools/profilemitraa/create-portfolio" : "/create-portfolio"}
                      className="w-full py-2 bg-[#009670] hover:bg-[#047857] text-white font-bold text-xs rounded-lg text-center transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-700/10"
                    >
                      Create Portfolio
                      <span>➔</span>
                    </Link>
                  </div>

                  {/* Resume Card */}
                  <div className="border border-slate-100 rounded-xl p-4.5 bg-slate-50/50 flex flex-col justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zM9 16.5h.008v.008H9V16.5zm0-3h.008v.008H9v-.008zm0-3h.008v.008H9V10.5z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-[13.5px]">Resume</h4>
                        <p className="text-[11px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                          Build a professional, ATS-friendly resume to share instantly.
                        </p>
                      </div>
                    </div>
                    <Link
                      href={isToolsPath ? "/tools/profilemitraa/complete-profile" : "/complete-profile"}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg text-center transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-blue-700/10"
                    >
                      Build Resume
                      <span>➔</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Your Portfolios List Section */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[14.5px] font-black text-slate-900">Your Portfolio Websites</h3>
                    <p className="text-[11.5px] font-semibold text-slate-400 mt-0.5">
                      List of digital portfolio sites generated under your account.
                    </p>
                  </div>
                  <span className="bg-emerald-50 text-[#009670] text-[10px] font-black px-2.5 py-1 rounded-full uppercase">
                    Total: {portfolios.length}
                  </span>
                </div>

                {portfolioLoading ? (
                  <div className="flex flex-col items-center justify-center py-10 gap-2">
                    <div className="w-8 h-8 border-3 border-[#009670]/40 border-t-[#009670] rounded-full animate-spin" />
                    <p className="text-xs font-semibold text-slate-400">Loading portfolios...</p>
                  </div>
                ) : portfolios.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center flex flex-col items-center justify-center gap-2.5">
                    <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-700">No Portfolio Websites Created Yet</p>
                      <p className="text-[10.5px] font-semibold text-slate-400 mt-0.5 leading-relaxed">
                        Start showcase your skills and resume in a stunning responsive layout.
                      </p>
                    </div>
                    <Link
                      href={isToolsPath ? "/tools/profilemitraa/create-portfolio" : "/create-portfolio"}
                      className="px-4 py-1.5 bg-[#009670] hover:bg-[#047857] text-white font-bold text-xs rounded-lg transition-all shadow-sm"
                    >
                      + Create My First Portfolio
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {portfolios.map((p) => (
                      <div key={p.id} className="border border-slate-100 hover:border-slate-200 rounded-xl p-4 bg-slate-50/30 flex flex-col justify-between gap-4 transition-all shadow-sm">
                        <div className="flex gap-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#009670] flex items-center justify-center shrink-0">
                            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-bold text-slate-800 text-[13px] truncate">{p.title}</h4>
                              <span className={`text-[8.5px] font-black uppercase px-2 py-0.5 rounded-full ${
                                p.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {p.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate break-all">
                              {domainPrefix}{p.slug}
                            </p>
                          </div>
                        </div>

                        {/* Inline Delete confirmation */}
                        {deleteConfirmId === p.id && (
                          <div className="bg-rose-50 border border-rose-200 rounded-lg px-3 py-2.5 text-[11px] text-rose-700 font-semibold space-y-2">
                            <p>⚠️ This will permanently delete this portfolio and free the URL <span className="font-black">/{p.slug}</span>. Continue?</p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDeletePortfolio(p.id)}
                                disabled={deletingPortfolio}
                                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-md font-bold text-[10px] transition-colors disabled:opacity-60"
                              >
                                {deletingPortfolio ? 'Deleting...' : 'Yes, Delete'}
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-md font-bold text-[10px] transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex gap-1.5 mt-1">
                          {p.status === 'published' && (
                            <a
                              href={getPortfolioUrl(p.slug)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 bg-[#009670] hover:bg-[#047857] text-white font-bold text-xs rounded-lg text-center transition-all flex items-center justify-center gap-1 shadow-sm shadow-emerald-700/10"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                              </svg>
                              View
                            </a>
                          )}
                          <Link
                            href={isToolsPath ? `/tools/profilemitraa/create-portfolio?id=${p.id}` : `/create-portfolio?id=${p.id}`}
                            className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-lg text-center transition-all flex items-center justify-center gap-1"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                            </svg>
                            Edit
                          </Link>
                          {deleteConfirmId !== p.id && (
                            <button
                              onClick={() => setDeleteConfirmId(p.id)}
                              disabled={deletingPortfolio}
                              className="py-1.5 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1 disabled:opacity-60"
                              title="Delete portfolio"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent activity log list */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14.5px] font-black text-slate-900">Recent Activity</h3>
                  <button className="text-[11.5px] font-bold text-[#009670] hover:underline">View All</button>
                </div>

                <div className="divide-y divide-slate-100">
                  {/* Activity Item 1 */}
                  <div className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8.5 h-8.5 rounded-lg bg-emerald-50 text-[#009670] flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-snug">
                          Your portfolio <span className="text-[#009670] font-black">&quot;{user?.fullName || 'My'} Portfolio&quot;</span> was viewed by Sarah Johnson
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 ml-4 shrink-0">2h ago</span>
                  </div>

                  {/* Activity Item 2 */}
                  <div className="flex items-center justify-between py-3.5 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8.5 h-8.5 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-snug">
                          Your resume was downloaded by TechNova Solutions
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 ml-4 shrink-0">5h ago</span>
                  </div>

                  {/* Activity Item 3 */}
                  <div className="flex items-center justify-between py-3.5 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8.5 h-8.5 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-snug">
                          Certificate <span className="font-bold text-purple-600">&quot;{lastCertName}&quot;</span> was added
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 ml-4 shrink-0">1d ago</span>
                  </div>

                  {/* Activity Item 4 */}
                  <div className="flex items-center justify-between py-3.5 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8.5 h-8.5 rounded-lg bg-emerald-50 text-[#009670] flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 leading-snug">
                          Profile information was updated successfully
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 ml-4 shrink-0">2d ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right section: Profile Completion bar, QR code share link, and premium standouts */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Profile Completion details */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <h3 className="text-[13.5px] font-black text-slate-900">Profile Completion</h3>
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="24" cy="24" r="20" stroke="#F1F5F9" strokeWidth="4.5" fill="transparent" />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="#009670"
                        strokeWidth="4.5"
                        fill="transparent"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - completionPercent / 100)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10.5px] font-black text-slate-800">
                      {completionPercent}%
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[11.5px] font-bold text-slate-800 leading-snug">You&apos;re almost there!</h4>
                    <p className="text-[10.5px] text-slate-400 font-semibold leading-relaxed mt-0.5">
                      Complete your profile detail requirements to get better job opportunities.
                    </p>
                  </div>
                </div>
                
                {alignmentProgressList(profile, completionPercent)}

                <Link
                  href={isToolsPath ? "/tools/profilemitraa/complete-profile" : "/complete-profile"}
                  className="w-full py-2 border border-slate-100 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-all"
                >
                  Improve Profile
                  <span>➔</span>
                </Link>
              </div>

              {/* Your Profile QR */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13.5px] font-black text-slate-900">Your Profile QR</h3>
                  <div className="group relative">
                    <span className="text-[11px] font-bold text-[#009670] cursor-help underline decoration-dotted">Info</span>
                    <span className="absolute right-0 top-6 hidden group-hover:block bg-slate-800 text-white text-[10px] p-2 rounded-lg w-48 shadow-lg z-50">
                      Recruiters can scan this code to view your digital portfolio portfolio site instantly!
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-4 bg-slate-50/50 rounded-xl p-4.5 border border-slate-100/50">
                  <img
                    src={qrUrl}
                    alt="Profile URL QR Code"
                    className="w-36 h-36 object-contain rounded-lg border border-slate-100"
                  />
                  <div className="text-center space-y-2">
                    <p className="text-[10.5px] font-semibold text-slate-400 max-w-[200px] leading-relaxed mx-auto">
                      Share your profile offline and online with recruiters.
                    </p>
                    <button
                      onClick={handleDownloadQR}
                      className="px-4 py-1.5 border border-slate-200 hover:border-slate-300 text-slate-700 bg-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Download QR
                    </button>
                  </div>
                </div>
              </div>

              {/* Your Public URL Share Link */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-[13.5px] font-black text-slate-900">Your Portfolio Link</h3>
                  <a href={profileUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-600">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center rounded-xl border border-slate-200 overflow-hidden bg-slate-50/50 focus-within:border-[#009670] focus-within:ring-1 focus-within:ring-[#009670] transition-all">
                    <input
                      type="text"
                      readOnly
                      value={profileUrl}
                      className="w-full bg-transparent px-3.5 py-2.5 text-xs font-mono font-semibold text-slate-600 focus:outline-none overflow-x-auto select-all"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-3.5 py-2.5 text-[#009670] hover:bg-slate-100 flex items-center justify-center shrink-0 border-l border-slate-200 cursor-pointer"
                      title="Copy URL link"
                    >
                      {copied ? (
                        <span className="text-[11px] font-bold">Copied!</span>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <Link href={isToolsPath ? "/tools/profilemitraa/complete-profile" : "/complete-profile"} className="text-[10px] font-bold text-[#009670] hover:underline block">
                    Customize URL
                  </Link>
                </div>
              </div>

              {/* Standout upgrade advertisement */}
              <div className="bg-[#FAF5FF] border border-purple-100 rounded-2xl p-4.5 space-y-3 relative overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-bold text-purple-700">Premium Rocket 🚀</span>
                </div>
                <p className="text-[10.5px] text-purple-600/90 leading-relaxed font-semibold">
                  Upgrade to Premium, unlock custom templates, premium document outputs, and stand out from the crowd!
                </p>
                <button className="text-xs font-bold text-purple-700 hover:text-purple-900 underline block cursor-pointer">
                  Upgrade Now &rarr;
                </button>
              </div>

            </div>

          </div>

        </main>
      </div>

    </div>
  );
}

// Sub-component helper for detailed progress steps bar
function alignmentProgressList(profile: any, pct: number) {
  const steps = [
    { name: 'Basic Info', met: Boolean(profile?.phone && profile?.dob && profile?.location) },
    { name: 'Professional Details', met: Boolean(profile?.professional_title && profile?.about_me) },
    { name: 'Skills & Tools', met: Boolean(profile?.tech_skills && JSON.parse(typeof profile.tech_skills === 'string' ? profile.tech_skills : '[]').length > 0) },
  ];

  return (
    <div className="space-y-2 py-1.5 border-t border-b border-slate-100 select-none">
      {steps.map((st, i) => (
        <div key={st.name} className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] ${st.met ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              ✓
            </div>
            <span>{st.name}</span>
          </div>
          <span className={st.met ? 'text-emerald-600' : 'text-slate-400'}>{st.met ? 'Completed' : 'Pending'}</span>
        </div>
      ))}
    </div>
  );
}
