/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfileMitraaSettingsPage() {
  const router = useRouter();
  const isToolsPath = typeof window !== 'undefined' && window.location.pathname.startsWith('/tools/profilemitraa');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'basic' | 'professional' | 'skills' | 'portfolio'>('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [location, setLocation] = useState('');
  const [headline, setHeadline] = useState('');
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [currentJobRole, setCurrentJobRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [experienceYears, setExperienceYears] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');
  const [company, setCompany] = useState('');
  const [aboutMe, setAboutMe] = useState('');

  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Arrays
  const [techSkills, setTechSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [tools, setTools] = useState<string[]>([]);
  const [newTool, setNewTool] = useState('');
  const [softSkills, setSoftSkills] = useState<string[]>([]);
  const [newSoftSkill, setNewSoftSkill] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [newLanguage, setNewLanguage] = useState('');

  // Certifications, Education, Projects
  const [certifications, setCertifications] = useState<{ name: string; year: string }[]>([]);
  const [newCertName, setNewCertName] = useState('');
  const [newCertYear, setNewCertYear] = useState('');

  const [education, setEducation] = useState<{ degree: string; school: string; year: string }[]>([]);
  const [newEduDegree, setNewEduDegree] = useState('');
  const [newEduSchool, setNewEduSchool] = useState('');
  const [newEduYear, setNewEduYear] = useState('');

  const [projects, setProjects] = useState<{ title: string; description: string; link?: string }[]>([]);
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');
  const [newProjLink, setNewProjLink] = useState('');

  useEffect(() => {
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
          const u = data.user || {};
          const p = data.profile || {};

          setFullName(u.fullName || '');
          setUsername(u.username || '');
          setEmail(u.email || '');

          setPhone(p.phone || '');
          setDob(p.dob || '');
          setLocation(p.location || '');
          setHeadline(p.headline || '');
          setProfessionalTitle(p.professional_title || '');
          setCurrentJobRole(p.current_job_role || '');
          setExperienceLevel(p.experience_level || 'Intermediate');
          setExperienceYears(p.experience_years || '');
          setEmploymentType(p.employment_type || 'Full-time');
          setCompany(p.company || '');
          setAboutMe(p.about_me || '');

          if (p.profile_photo_url) {
            setAvatarPreview(p.profile_photo_url);
          }

          if (Array.isArray(p.tech_skills)) setTechSkills(p.tech_skills);
          if (Array.isArray(p.tools)) setTools(p.tools);
          if (Array.isArray(p.soft_skills)) setSoftSkills(p.soft_skills);
          if (Array.isArray(p.languages)) setLanguages(p.languages);
          if (Array.isArray(p.certifications)) setCertifications(p.certifications);
          if (Array.isArray(p.education)) setEducation(p.education);
          if (Array.isArray(p.projects)) setProjects(p.projects);
        }
      })
      .catch((err) => console.error('Failed to load profile for settings:', err))
      .finally(() => setLoading(false));
  }, [router, isToolsPath]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTag = (val: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>, clearInput: () => void) => {
    const trimmed = val.trim();
    if (trimmed && !list.includes(trimmed)) {
      setter([...list, trimmed]);
      clearInput();
    }
  };

  const removeTag = (item: string, list: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(list.filter((x) => x !== item));
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg('');
    setSaveSuccess(false);

    try {
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('username', username);
      formData.append('phone', phone);
      formData.append('dob', dob);
      formData.append('location', location);
      formData.append('headline', headline);
      formData.append('professional_title', professionalTitle);
      formData.append('current_job_role', currentJobRole);
      formData.append('experience_level', experienceLevel);
      formData.append('experience_years', experienceYears);
      formData.append('employment_type', employmentType);
      formData.append('company', company);
      formData.append('about_me', aboutMe);

      formData.append('tech_skills', JSON.stringify(techSkills));
      formData.append('tools', JSON.stringify(tools));
      formData.append('soft_skills', JSON.stringify(softSkills));
      formData.append('languages', JSON.stringify(languages));
      formData.append('certifications', JSON.stringify(certifications));
      formData.append('education', JSON.stringify(education));
      formData.append('projects', JSON.stringify(projects));

      if (avatarFile) {
        formData.append('profile_photo', avatarFile);
      }

      const res = await fetch('/api/profilemitraa/profile', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save settings.');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#009670] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500">Loading settings...</p>
        </div>
      </div>
    );
  }

  const dashboardRoute = isToolsPath ? '/tools/profilemitraa/dashboard' : '/dashboard';
  const publicProfileRoute = isToolsPath
    ? `/tools/profilemitraa/${username}/profile`
    : `/${username}/profile`;

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-slate-900 font-sans selection:bg-[#009670] selection:text-white pb-16">
      
      {/* ─── Top Navbar ─── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={dashboardRoute} className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#E8F6F2] group-hover:text-[#009670] text-slate-600 flex items-center justify-center transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <img
                src="/images/tools/ProfileMitraa/logo/profilemitraalogo.png"
                alt="ProfileMitraa"
                className="h-8 w-auto object-contain"
              />
              <span className="text-lg font-black tracking-tight text-slate-900">
                Profile<span className="text-[#009670]">Mitraa</span>
              </span>
              <span className="text-slate-300 mx-1.5">/</span>
              <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Account Settings</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href={publicProfileRoute}
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 text-xs font-bold transition-all bg-white shadow-xs"
            >
              <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              View Live Profile
            </Link>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 bg-[#009670] hover:bg-[#047857] disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Creative Hero Header Banner ─── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#009670] via-emerald-600 to-teal-800 p-6 sm:p-8 text-white overflow-hidden shadow-lg shadow-emerald-900/10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              {/* Creative Interactive Profile Photo Uploader */}
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 p-1 backdrop-blur-md shadow-md ring-4 ring-white/30 transition-transform group-hover:scale-105 overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-full rounded-xl bg-white/30 flex items-center justify-center text-2xl font-black text-white">
                      {fullName ? fullName.slice(0, 2).toUpperCase() : 'PM'}
                    </div>
                  )}
                </div>

                {/* Change photo badge overlay */}
                <div className="absolute inset-0 rounded-2xl bg-slate-900/60 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                  <span className="text-[10px] font-bold">Change</span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">{fullName || 'Your Name'}</h1>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold tracking-wide">
                    @{username || 'username'}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100 font-medium">
                  {headline || professionalTitle || 'Set up your headline and title below'}
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] font-bold text-white/90 hover:text-white underline inline-flex items-center gap-1 cursor-pointer pt-0.5"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  Upload New Photo
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <span className="text-[11px] font-bold text-emerald-100/90 bg-emerald-950/30 px-3 py-1.5 rounded-xl border border-white/10">
                ✦ Public Profile Active
              </span>
            </div>
          </div>
        </div>

        {/* Status Alerts */}
        {saveSuccess && (
          <div className="mt-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">✓</span>
              All profile details updated successfully!
            </div>
            <Link href={dashboardRoute} className="text-emerald-700 underline font-black hover:text-emerald-900">
              Back to Dashboard &rarr;
            </Link>
          </div>
        )}

        {errorMsg && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs font-black">!</span>
            {errorMsg}
          </div>
        )}

        {/* ─── Creative Section Tabs ─── */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-1 select-none scrollbar-none">
          {[
            { id: 'basic', label: 'Basic Info & Contact', icon: '👤' },
            { id: 'professional', label: 'Professional & Bio', icon: '💼' },
            { id: 'skills', label: 'Skills & Tools', icon: '⚡' },
            { id: 'portfolio', label: 'Education & Projects', icon: '🎓' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shadow-xs ${
                activeTab === tab.id
                  ? 'bg-white text-[#009670] border-2 border-[#009670] shadow-sm'
                  : 'bg-white/70 text-slate-600 hover:bg-white hover:text-slate-900 border border-slate-200/70'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Tab Content Panels ─── */}
        <div className="mt-4 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">

          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-slate-900">Personal &amp; Contact Details</h2>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  Update your contact information, username, and public headline.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Shrikesh Shetty"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Username</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400 text-xs font-bold">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="username"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] text-xs font-semibold outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 text-xs font-semibold cursor-not-allowed outline-none"
                  />
                  <span className="text-[10px] text-slate-400 font-medium mt-1 block">Account login email cannot be changed.</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai, India"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Full-Stack Developer &amp; UI/UX Designer crafting web experiences"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] text-xs font-semibold outline-none transition-colors"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFESSIONAL & BIO */}
          {activeTab === 'professional' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-slate-900">Career &amp; Professional Summary</h2>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  Highlight your current role, experience level, and professional story.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Professional Title</label>
                  <input
                    type="text"
                    value={professionalTitle}
                    onChange={(e) => setProfessionalTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Current Role / Job Title</label>
                  <input
                    type="text"
                    value={currentJobRole}
                    onChange={(e) => setCurrentJobRole(e.target.value)}
                    placeholder="e.g. Frontend Lead"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Company / Organization</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Acme Innovations"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Years of Experience</label>
                  <input
                    type="text"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(e.target.value)}
                    placeholder="e.g. 5+ Years"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] text-xs font-semibold outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Experience Level</label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] text-xs font-semibold outline-none transition-colors bg-white"
                  >
                    <option value="Entry-level">Entry-level (0-2 years)</option>
                    <option value="Intermediate">Intermediate (2-5 years)</option>
                    <option value="Mid-Senior">Mid-Senior (5-8 years)</option>
                    <option value="Senior">Senior (8+ years)</option>
                    <option value="Lead / Executive">Lead / Executive (10+ years)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Employment Type</label>
                  <select
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] text-xs font-semibold outline-none transition-colors bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract / Freelance">Contract / Freelance</option>
                    <option value="Remote">Remote</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">About Me (Bio)</label>
                  <textarea
                    rows={4}
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                    placeholder="Tell your professional story, what you love building, and what makes you unique..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] text-xs font-semibold outline-none transition-colors leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS & TOOLS */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-slate-900">Skills, Tools &amp; Languages</h2>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">
                  Manage the competencies that show up on your portfolio and public resume.
                </p>
              </div>

              {/* Tech Skills */}
              <div className="space-y-2.5">
                <label className="block text-xs font-black text-slate-800">Technical Skills</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newSkill, techSkills, setTechSkills, () => setNewSkill('')))}
                    placeholder="e.g. React.js, TypeScript, Next.js..."
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#009670]"
                  />
                  <button
                    type="button"
                    onClick={() => addTag(newSkill, techSkills, setTechSkills, () => setNewSkill(''))}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {techSkills.map((sk) => (
                    <span
                      key={sk}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#009670] text-xs font-bold border border-emerald-100"
                    >
                      {sk}
                      <button
                        type="button"
                        onClick={() => removeTag(sk, techSkills, setTechSkills)}
                        className="text-emerald-700 hover:text-rose-600 font-black cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {techSkills.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No technical skills added yet.</span>
                  )}
                </div>
              </div>

              {/* Tools & Platforms */}
              <div className="space-y-2.5 pt-2">
                <label className="block text-xs font-black text-slate-800">Tools &amp; Platforms</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newTool, tools, setTools, () => setNewTool('')))}
                    placeholder="e.g. Figma, GitHub, Docker, Postman..."
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#009670]"
                  />
                  <button
                    type="button"
                    onClick={() => addTag(newTool, tools, setTools, () => setNewTool(''))}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tools.map((tl) => (
                    <span
                      key={tl}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100"
                    >
                      {tl}
                      <button
                        type="button"
                        onClick={() => removeTag(tl, tools, setTools)}
                        className="text-blue-700 hover:text-rose-600 font-black cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {tools.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No tools added yet.</span>
                  )}
                </div>
              </div>

              {/* Soft Skills */}
              <div className="space-y-2.5 pt-2">
                <label className="block text-xs font-black text-slate-800">Soft Skills</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSoftSkill}
                    onChange={(e) => setNewSoftSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newSoftSkill, softSkills, setSoftSkills, () => setNewSoftSkill('')))}
                    placeholder="e.g. Team Leadership, Problem Solving..."
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#009670]"
                  />
                  <button
                    type="button"
                    onClick={() => addTag(newSoftSkill, softSkills, setSoftSkills, () => setNewSoftSkill(''))}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {softSkills.map((ss) => (
                    <span
                      key={ss}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100"
                    >
                      {ss}
                      <button
                        type="button"
                        onClick={() => removeTag(ss, softSkills, setSoftSkills)}
                        className="text-purple-700 hover:text-rose-600 font-black cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {softSkills.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No soft skills added yet.</span>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-2.5 pt-2">
                <label className="block text-xs font-black text-slate-800">Languages Known</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag(newLanguage, languages, setLanguages, () => setNewLanguage('')))}
                    placeholder="e.g. English (Fluent), Hindi (Native)..."
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#009670]"
                  />
                  <button
                    type="button"
                    onClick={() => addTag(newLanguage, languages, setLanguages, () => setNewLanguage(''))}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {languages.map((lng) => (
                    <span
                      key={lng}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-100"
                    >
                      {lng}
                      <button
                        type="button"
                        onClick={() => removeTag(lng, languages, setLanguages)}
                        className="text-amber-800 hover:text-rose-600 font-black cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EDUCATION & PROJECTS */}
          {activeTab === 'portfolio' && (
            <div className="space-y-8">
              {/* Certifications */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-base font-black text-slate-900">Certifications</h2>
                  <p className="text-xs font-semibold text-slate-400">Add credentials, licenses and certificates.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newCertName}
                    onChange={(e) => setNewCertName(e.target.value)}
                    placeholder="Certificate Title (e.g. AWS Certified Solutions Architect)"
                    className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#009670]"
                  />
                  <input
                    type="text"
                    value={newCertYear}
                    onChange={(e) => setNewCertYear(e.target.value)}
                    placeholder="Year (e.g. 2024)"
                    className="w-full sm:w-28 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#009670]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newCertName.trim()) {
                        setCertifications([...certifications, { name: newCertName.trim(), year: newCertYear.trim() || '2024' }]);
                        setNewCertName('');
                        setNewCertYear('');
                      }
                    }}
                    className="px-4 py-2 bg-[#009670] hover:bg-[#047857] text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Add Certificate
                  </button>
                </div>

                <div className="space-y-2">
                  {certifications.map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{c.name}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{c.year}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setCertifications(certifications.filter((_, idx) => idx !== i))}
                        className="text-xs text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-base font-black text-slate-900">Education</h2>
                  <p className="text-xs font-semibold text-slate-400">Degrees, colleges, and academic background.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newEduDegree}
                    onChange={(e) => setNewEduDegree(e.target.value)}
                    placeholder="Degree (e.g. B.Tech Computer Science)"
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#009670]"
                  />
                  <input
                    type="text"
                    value={newEduSchool}
                    onChange={(e) => setNewEduSchool(e.target.value)}
                    placeholder="University / College"
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#009670]"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newEduYear}
                      onChange={(e) => setNewEduYear(e.target.value)}
                      placeholder="Graduation Year"
                      className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#009670]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newEduDegree.trim() && newEduSchool.trim()) {
                          setEducation([...education, { degree: newEduDegree.trim(), school: newEduSchool.trim(), year: newEduYear.trim() || '2023' }]);
                          setNewEduDegree('');
                          setNewEduSchool('');
                          setNewEduYear('');
                        }
                      }}
                      className="px-4 py-2 bg-[#009670] hover:bg-[#047857] text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {education.map((e, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{e.degree}</p>
                        <p className="text-[10.5px] text-slate-500 font-semibold">{e.school} • {e.year}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEducation(education.filter((_, idx) => idx !== i))}
                        className="text-xs text-rose-500 hover:text-rose-700 font-bold cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2">
                  <h2 className="text-base font-black text-slate-900">Featured Projects</h2>
                  <p className="text-xs font-semibold text-slate-400">Showcase your best software, designs or client work.</p>
                </div>

                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newProjTitle}
                      onChange={(e) => setNewProjTitle(e.target.value)}
                      placeholder="Project Name"
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#009670]"
                    />
                    <input
                      type="text"
                      value={newProjLink}
                      onChange={(e) => setNewProjLink(e.target.value)}
                      placeholder="Project Link (Optional)"
                      className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#009670]"
                    />
                  </div>
                  <div className="flex gap-2">
                    <textarea
                      rows={2}
                      value={newProjDesc}
                      onChange={(e) => setNewProjDesc(e.target.value)}
                      placeholder="Brief description of technologies used and impact..."
                      className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold outline-none focus:border-[#009670]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newProjTitle.trim()) {
                          setProjects([...projects, { title: newProjTitle.trim(), description: newProjDesc.trim(), link: newProjLink.trim() || undefined }]);
                          setNewProjTitle('');
                          setNewProjDesc('');
                          setNewProjLink('');
                        }
                      }}
                      className="px-4 py-2 bg-[#009670] hover:bg-[#047857] text-white rounded-xl text-xs font-bold cursor-pointer self-end"
                    >
                      Add Project
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {projects.map((p, i) => (
                    <div key={i} className="flex items-start justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-800">{p.title}</p>
                          {p.link && (
                            <a href={p.link} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-[#009670] hover:underline">
                              Link &rarr;
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{p.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProjects(projects.filter((_, idx) => idx !== i))}
                        className="text-xs text-rose-500 hover:text-rose-700 font-bold cursor-pointer shrink-0 ml-3"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              href={dashboardRoute}
              className="px-5 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all"
            >
              Cancel
            </Link>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-[#009670] hover:bg-[#047857] disabled:bg-slate-300 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-700/10 flex items-center gap-2 cursor-pointer"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Save Profile Changes
                </>
              )}
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

