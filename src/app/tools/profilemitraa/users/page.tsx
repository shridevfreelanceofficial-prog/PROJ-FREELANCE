/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface UserCard {
  id: string;
  full_name: string;
  username: string;
  headline: string | null;
  profile_photo_url: string | null;
  location: string | null;
  professional_title: string | null;
  experience_level: string | null;
  followers: number;
}

export default function ProfileMitraaUsersPage() {
  const router = useRouter();
  const isToolsPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/tools/profilemitraa');
  const [users, setUsers] = useState<UserCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Get current user info
  useEffect(() => {
    fetch('/api/profilemitraa/profile')
      .then(async (r) => {
        if (r.status === 401) { router.push(isToolsPath ? '/tools/profilemitraa/login' : '/login'); return; }
        const d = await r.json();
        if (d.success) setCurrentUsername(d.user?.username ?? null);
      })
      .catch(() => {});
  }, [router]);

  // Fetch users list
  useEffect(() => {
    setLoading(true);
    fetch(`/api/profilemitraa/users?search=${encodeURIComponent(debouncedSearch)}`)
      .then(r => r.json())
      .then(d => { if (d.success) setUsers(d.users); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [debouncedSearch]);

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const getProfileUrl = (username: string) => {
    if (typeof window !== 'undefined' && (window.location.hostname.endsWith('localhost') || window.location.hostname === '127.0.0.1')) {
      return `http://profilemitraa.localhost:3000/${username}/profile`;
    }
    return `http://profilemitraa.shridevfreelance.online/${username}/profile`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href={isToolsPath ? "/tools/profilemitraa/dashboard" : "/dashboard"} className="flex items-center gap-2.5">
          <img src="/images/tools/ProfileMitraa/logo/profilemitraalogo.png" alt="Logo" className="h-8 w-auto" />
          <span className="text-lg font-black text-slate-900 tracking-tight">
            Profile<span className="text-[#009670]">Mitraa</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
          <Link href={isToolsPath ? "/tools/profilemitraa/dashboard" : "/dashboard"} className="hover:text-[#009670]">Dashboard</Link>
          <Link href={isToolsPath ? "/tools/profilemitraa/users" : "/users"} className="text-[#009670] border-b-2 border-[#009670] pb-4 pt-4">Users</Link>
        </nav>
        <Link href={isToolsPath ? "/tools/profilemitraa/dashboard" : "/dashboard"} className="text-xs font-bold text-slate-500 hover:text-[#009670] transition-colors">
          ← Back to Dashboard
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Community</h1>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Discover and connect with professionals on ProfileMitraa.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="w-4.5 h-4.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name or username..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#009670] focus:border-[#009670] text-sm font-semibold text-slate-700 placeholder:text-slate-400 shadow-sm transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-3 mb-6 text-xs font-bold text-slate-500">
          <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-full shadow-xs">
            {loading ? '—' : users.length} {users.length === 1 ? 'user' : 'users'}
          </span>
          {debouncedSearch && (
            <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-[#009670] rounded-full">
              Search: &quot;{debouncedSearch}&quot;
            </span>
          )}
        </div>

        {/* Users grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-9 h-9 border-4 border-[#009670]/30 border-t-[#009670] rounded-full animate-spin mb-3" />
            <p className="text-sm font-semibold text-slate-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <h3 className="text-base font-black text-slate-700">No users found</h3>
            <p className="text-sm text-slate-400 mt-1">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {users.map(user => (
              <UserCard
                key={user.id}
                user={user}
                isCurrentUser={user.username === currentUsername}
                profileUrl={getProfileUrl(user.username)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UserCard({ user, isCurrentUser, profileUrl }: {
  user: UserCard;
  isCurrentUser: boolean;
  profileUrl: string;
}) {
  const initials = user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-4">
      {/* Top section: avatar + name */}
      <div className="flex items-start gap-3.5">
        <div className="shrink-0">
          {user.profile_photo_url ? (
            <img
              src={user.profile_photo_url}
              alt={user.full_name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-100"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#009670] flex items-center justify-center text-sm font-black">
              {initials}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-900 truncate">{user.full_name}</h3>
            {isCurrentUser && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-[#009670] text-[9px] font-black border border-emerald-100 shrink-0">You</span>
            )}
          </div>
          <p className="text-[11px] font-bold text-slate-400 mt-0.5">@{user.username}</p>
          {user.professional_title && (
            <p className="text-[11px] font-semibold text-slate-500 mt-0.5 truncate">{user.professional_title}</p>
          )}
        </div>
      </div>

      {/* Headline */}
      {user.headline && (
        <p className="text-[11.5px] text-slate-500 font-medium leading-relaxed line-clamp-2 border-t border-slate-50 pt-2">
          {user.headline}
        </p>
      )}

      {/* Meta: location + followers */}
      <div className="flex items-center justify-between text-[10.5px] font-semibold text-slate-400">
        <div className="flex items-center gap-1">
          {user.location && (
            <>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <span className="truncate max-w-[100px]">{user.location}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <span>{user.followers} follower{user.followers !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* View Profile button */}
      <a
        href={profileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-2 bg-slate-900 hover:bg-[#009670] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200"
      >
        View Profile
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </a>
    </div>
  );
}
