/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';

interface FollowUser { id: string; full_name: string; username: string; profile_photo_url: string | null; }

export default function ProfileMitraaPublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const getProfileUrl = (uname: string) => {
    if (typeof window !== 'undefined' && (window.location.hostname.endsWith('localhost') || window.location.hostname === '127.0.0.1')) {
      return `http://profilemitraa.localhost:3000/${uname}/profile`;
    }
    return `http://profilemitraa.shridevfreelance.online/${uname}/profile`;
  };

  const getPortfolioPageUrl = (slug: string) => {
    if (typeof window !== 'undefined') {
      const { protocol, host } = window.location;
      return `${protocol}//${host}/${slug}`;
    }
    return `/${slug}`;
  };

  // Follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [followLoading, setFollowLoading] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSelf, setIsSelf] = useState(false);

  useEffect(() => {
    // Fetch profile data
    fetch(`/api/profilemitraa/profile/${username}`)
      .then(async r => {
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || 'Failed to load profile.');
        setData(j.data);
      })
      .catch(e => setErrorMsg(e.message))
      .finally(() => setLoading(false));

    // Increment profile view counter
    fetch(`/api/profilemitraa/profile/${username}/view`, { method: 'POST' }).catch(() => {});

    // Fetch follow data
    fetch(`/api/profilemitraa/follow/${username}`)
      .then(async r => {
        if (!r.ok) return;
        const j = await r.json();
        if (j.success) {
          setIsFollowing(j.isFollowing);
          setFollowersCount(j.followersCount);
          setFollowingCount(j.followingCount);
          setFollowers(j.followers);
          setFollowing(j.following);
        }
      })
      .catch(() => {});

    // Check if current user is logged in
    fetch('/api/profilemitraa/profile')
      .then(async r => {
        if (!r.ok) return;
        const j = await r.json();
        if (j.success) {
          setIsLoggedIn(true);
          if (j.user?.username?.toLowerCase() === username.toLowerCase()) setIsSelf(true);
        }
      })
      .catch(() => {});
  }, [username]);

  const handleFollow = async () => {
    if (!isLoggedIn) { window.location.href = '/tools/profilemitraa/login'; return; }
    setFollowLoading(true);
    try {
      const method = isFollowing ? 'DELETE' : 'POST';
      const res = await fetch(`/api/profilemitraa/follow/${username}`, { method });
      const j = await res.json();
      if (j.success) {
        setIsFollowing(j.isFollowing);
        setFollowersCount(j.followersCount);
        // Refresh full follower list
        fetch(`/api/profilemitraa/follow/${username}`)
          .then(r => r.json())
          .then(j2 => { if (j2.success) { setFollowers(j2.followers); setFollowing(j2.following); } })
          .catch(() => {});
      }
    } catch { /* ignore */ }
    setFollowLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
      <div className="w-10 h-10 border-4 border-[#009670]/40 border-t-[#009670] rounded-full animate-spin mb-4" />
      <p className="text-sm font-semibold text-slate-500">Loading Profile...</p>
    </div>
  );

  if (errorMsg || !data) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <h1 className="text-xl font-black text-slate-800">Profile Not Found</h1>
      <p className="text-sm text-slate-500 mt-1 max-w-sm">The username &quot;{username}&quot; does not exist or their profile has not been set up yet.</p>
      <Link href="/tools/profilemitraa" className="mt-5 px-6 py-2.5 bg-[#009670] text-white hover:bg-[#047857] font-bold text-xs rounded-xl shadow-md transition-colors">Go to Home</Link>
    </div>
  );

  const { user, profile, portfolio } = data;
  const initials = user.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() : 'PM';

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-16">
      <style>{`
        @keyframes border-glow-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes vip-sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.85; }
          50% { transform: scale(1.15) rotate(180deg); opacity: 1; }
        }
        
        .vip-glowing-card {
          position: relative;
          border-radius: 24px;
          background: linear-gradient(135deg, #090d16 0%, #151d30 100%);
          color: #f8fafc;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.15), 0 8px 16px -6px rgba(99, 102, 241, 0.1);
        }
        
        .vip-glowing-card::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 24px;
          padding: 2.5px;
          background: linear-gradient(90deg, #10b981, #3b82f6, #6366f1, #ec4899, #10b981);
          background-size: 300% 300%;
          animation: border-glow-flow 5s linear infinite;
          -webkit-mask: 
             linear-gradient(#fff 0 0) content-box, 
             linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        
        .vip-glowing-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 35px -5px rgba(16, 185, 129, 0.3), 0 12px 24px -8px rgba(99, 102, 241, 0.2);
        }

        .vip-badge-glow {
          background: linear-gradient(90deg, #10b981, #3b82f6, #ec4899, #10b981);
          background-size: 200% auto;
          animation: border-glow-flow 4s linear infinite;
        }

        .vip-button {
          background: linear-gradient(90deg, #009670, #10b981, #009670);
          background-size: 200% auto;
          transition: all 0.3s ease;
        }

        .vip-button:hover {
          background-position: right center;
          box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
        }
      `}</style>
      {/* Header */}
      <header className="bg-white border-b border-slate-100 py-3.5 px-6 md:px-12 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-2">
          <img src="/images/tools/ProfileMitraa/logo/profilemitraalogo.png" alt="Logo" className="h-7 w-auto" />
          <span className="font-extrabold text-slate-800 text-sm tracking-tight">Profile<span className="text-[#009670]">Mitraa</span></span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/tools/profilemitraa/users" className="text-xs font-bold text-slate-500 hover:text-[#009670] transition-colors">← Community</Link>
          <Link href="/tools/profilemitraa/register" className="px-4 py-1.5 bg-[#009670] hover:bg-[#047857] text-white font-bold text-xs rounded-lg transition-colors">Create Yours</Link>
        </div>
      </header>

      <div className="max-w-4xl w-full mx-auto px-4 mt-8 space-y-6">
        {/* Hero Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/60 rounded-bl-full -z-0" />

          {/* Avatar */}
          <div className="shrink-0 z-10">
            {profile.profile_photo_url ? (
              <img src={profile.profile_photo_url} alt={user.fullName} className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-2 border-emerald-50 shadow-md" />
            ) : (
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-emerald-50 text-[#009670] flex items-center justify-center text-3xl font-black shadow-sm">{initials}</div>
            )}
          </div>

          {/* Info */}
          <div className="text-center md:text-left space-y-3 flex-1 z-10">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{user.fullName}</h1>
              <p className="text-sm font-bold text-[#009670] mt-0.5">@{user.username}</p>
              {profile.headline && <p className="text-sm font-semibold text-slate-500 mt-1">{profile.headline}</p>}
            </div>

            {/* Follow counts */}
            <div className="flex items-center justify-center md:justify-start gap-5 text-sm font-bold text-slate-700">
              <button
                onClick={() => setShowFollowersModal(true)}
                className="flex flex-col items-center hover:text-[#009670] transition-colors cursor-pointer"
              >
                <span className="text-xl font-black text-slate-900">{followersCount}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Followers</span>
              </button>
              <div className="w-px h-8 bg-slate-100" />
              <button
                onClick={() => setShowFollowingModal(true)}
                className="flex flex-col items-center hover:text-[#009670] transition-colors cursor-pointer"
              >
                <span className="text-xl font-black text-slate-900">{followingCount}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Following</span>
              </button>
            </div>

            {/* Contacts */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-slate-500 text-xs font-semibold">
              {profile.location && <div className="flex items-center gap-1"><span>📍</span><span>{profile.location}</span></div>}
              {profile.phone && <div className="flex items-center gap-1"><span>📞</span><span>{profile.phone}</span></div>}
              <div className="flex items-center gap-1"><span>✉️</span><span className="break-all">{user.email}</span></div>
            </div>
          </div>

          {/* Follow / Edit button */}
          <div className="z-10 shrink-0">
            {isSelf ? (
              <Link href="/tools/profilemitraa/complete-profile" className="px-5 py-2.5 border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors">
                Edit Profile
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
                </svg>
              </Link>
            ) : (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`px-5 py-2.5 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 ${
                  isFollowing
                    ? 'bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-slate-200 text-slate-700'
                    : 'bg-[#009670] hover:bg-[#047857] text-white shadow-sm shadow-emerald-700/20'
                } disabled:opacity-60`}
              >
                {followLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                ) : isFollowing ? (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                    Following
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                    Follow
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* VIP Portfolio Showcase */}
        {portfolio && (
          <div className="vip-glowing-card p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
            {/* Background decorative glows */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#6366f1]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center gap-5 z-10 text-center md:text-left">
              {/* Animated VIP Icon */}
              <div className="relative shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-inner">
                <span className="text-3xl animate-[vip-sparkle_3s_ease-in-out_infinite]">✨</span>
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>

              <div className="space-y-1.5 max-w-lg">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="vip-badge-glow text-[10px] font-black tracking-wider text-white px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1 shadow-sm">
                    <span>👑</span> VIP Portfolio
                  </span>
                  <span className="text-[10px] bg-slate-800 text-emerald-400 font-bold px-2 py-0.5 rounded-md border border-slate-700">
                    Live Verified
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
                  {portfolio.title || `${user.fullName}'s Portfolio`}
                </h2>
                <p className="text-xs text-slate-300 font-medium leading-relaxed">
                  Explore the full interactive, responsive portfolio website generated for this user using ProfileMitraa.
                </p>
                {portfolio.designTheme && (
                  <p className="text-[10px] text-slate-455 text-slate-400 font-semibold uppercase tracking-wider flex items-center justify-center md:justify-start gap-1">
                    <span>🎨</span> Theme: <span className="text-slate-300">{portfolio.designTheme.replace('_', ' ')}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="shrink-0 z-10 w-full md:w-auto">
              <a
                href={getPortfolioPageUrl(portfolio.slug)}
                target="_blank"
                rel="noopener noreferrer"
                className="vip-button w-full md:w-auto px-6 py-3.5 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Launch Website</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </div>
        )}

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main content */}
          <div className="md:col-span-8 space-y-6">
            {profile.about_me && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-[14px] font-black text-slate-900 border-b border-slate-50 pb-2 mb-3">About Me</h3>
                <p className="text-slate-600 text-xs leading-relaxed font-medium whitespace-pre-line">{profile.about_me}</p>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-[14px] font-black text-slate-900 border-b border-slate-50 pb-2 mb-4">Professional Background</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ProfileItem label="Professional Title" value={profile.professional_title} />
                <ProfileItem label="Experience Level" value={profile.experience_level} />
                {profile.experience_level !== 'Fresher' && (
                  <>
                    <ProfileItem label="Current Role" value={profile.current_job_role} />
                    <ProfileItem label="Years of Experience" value={profile.experience_years} />
                    <ProfileItem label="Company / Organization" value={profile.company} />
                  </>
                )}
                <ProfileItem label="Employment Type" value={profile.employment_type} />
              </div>
            </div>

            {profile.certifications && profile.certifications.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-[14px] font-black text-slate-900 border-b border-slate-50 pb-2 mb-3">Certifications</h3>
                <div className="divide-y divide-slate-50">
                  {profile.certifications.map((cert: any, i: number) => (
                    <div key={i} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#009670] shrink-0" />
                        <span className="text-xs font-bold text-slate-800">{cert.name}</span>
                      </div>
                      <span className="text-[11px] font-black text-slate-400 ml-4">{cert.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education History */}
            {profile.education && profile.education.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-[14px] font-black text-slate-900 border-b border-slate-50 pb-2 mb-3">Education History</h3>
                <div className="divide-y divide-slate-50">
                  {profile.education.map((edu: any, i: number) => (
                    <div key={i} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{edu.degree}</p>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{edu.school}</p>
                      </div>
                      <span className="text-[11px] font-black text-[#009670] ml-4 bg-emerald-50 px-2 py-0.5 rounded">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Showcase */}
            {profile.projects && profile.projects.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
                <h3 className="text-[14px] font-black text-slate-900 border-b border-slate-50 pb-2 mb-3">Projects Showcase</h3>
                <div className="space-y-4">
                  {profile.projects.map((proj: any, i: number) => (
                    <div key={i} className="group border border-slate-100 rounded-xl p-4 hover:border-[#009670]/30 transition-all bg-slate-50/20">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#009670]" />
                          {proj.title}
                        </h4>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#009670] hover:underline text-[10.5px] font-black shrink-0"
                          >
                            Live Demo ↗
                          </a>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 font-semibold mt-1.5 whitespace-pre-line leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <h3 className="text-[14px] font-black text-slate-900 border-b border-slate-50 pb-2">Skills & Abilities</h3>
              {profile.tech_skills?.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Technical Skills</p>
                  <div className="flex flex-wrap gap-1">{profile.tech_skills.map((s: string) => <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-[10.5px] font-bold text-[#009670]">{s}</span>)}</div>
                </div>
              )}
              {profile.tools?.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Tools</p>
                  <div className="flex flex-wrap gap-1">{profile.tools.map((s: string) => <span key={s} className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-[10.5px] font-bold text-blue-700">{s}</span>)}</div>
                </div>
              )}
              {profile.soft_skills?.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Soft Skills</p>
                  <div className="flex flex-wrap gap-1">{profile.soft_skills.map((s: string) => <span key={s} className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-100 text-[10.5px] font-bold text-amber-700">{s}</span>)}</div>
                </div>
              )}
              {profile.languages?.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Languages</p>
                  <div className="flex flex-wrap gap-1">{profile.languages.map((s: string) => <span key={s} className="px-2 py-0.5 rounded-md bg-violet-50 border border-violet-100 text-[10.5px] font-bold text-violet-700">{s}</span>)}</div>
                </div>
              )}
              {!profile.tech_skills?.length && !profile.tools?.length && !profile.soft_skills?.length && !profile.languages?.length && (
                <p className="text-xs text-slate-400 font-medium">No skills listed yet.</p>
              )}
            </div>

            {/* QR code share card */}
            <div className="bg-slate-900 rounded-2xl p-5 text-white text-center space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-700/20 rounded-full blur-lg pointer-events-none" />
              <h4 className="text-[13px] font-black">Scan to Share Profile</h4>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(getProfileUrl(username))}`}
                alt="QR Code"
                className="w-28 h-28 mx-auto rounded-lg border border-slate-800 bg-white p-1"
              />
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">Scan with any mobile device to open this profile instantly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Followers Modal */}
      {showFollowersModal && (
        <FollowModal
          title={`Followers (${followersCount})`}
          users={followers}
          onClose={() => setShowFollowersModal(false)}
        />
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <FollowModal
          title={`Following (${followingCount})`}
          users={following}
          onClose={() => setShowFollowingModal(false)}
        />
      )}
    </div>
  );
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="space-y-0.5">
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className="text-xs font-bold text-slate-800">{value}</p>
    </div>
  );
}

function FollowModal({ title, users, onClose }: { title: string; users: FollowUser[]; onClose: () => void }) {
  const getProfileUrl = (uname: string) => {
    if (typeof window !== 'undefined' && (window.location.hostname.endsWith('localhost') || window.location.hostname === '127.0.0.1')) {
      return `http://profilemitraa.localhost:3000/${uname}/profile`;
    }
    return `http://profilemitraa.shridevfreelance.online/${uname}/profile`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl border border-slate-100 overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
          {users.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400 font-semibold">No users yet.</div>
          ) : users.map(u => {
            const initials = u.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
            return (
              <a
                key={u.id}
                href={getProfileUrl(u.username)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors"
              >
                {u.profile_photo_url ? (
                  <img src={u.profile_photo_url} alt={u.full_name} className="w-9 h-9 rounded-full object-cover border border-slate-100 shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-emerald-50 text-[#009670] flex items-center justify-center text-xs font-black shrink-0">{initials}</div>
                )}
                <div>
                  <p className="text-xs font-black text-slate-900">{u.full_name}</p>
                  <p className="text-[10px] font-bold text-slate-400">@{u.username}</p>
                </div>
                <svg className="w-3.5 h-3.5 text-slate-300 ml-auto" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
