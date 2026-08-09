/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Step4ReviewPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [prevRoute, setPrevRoute] = useState('/complete-profile/step-3');
  const [dashboardRoute, setDashboardRoute] = useState('/tools/profilemitraa/dashboard');
  const [editRoutes, setEditRoutes] = useState({
    step1: '/complete-profile',
    step2: '/complete-profile/step-2',
    step3: '/complete-profile/step-3',
  });

  const [basic, setBasic] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    dob: '',
    location: '',
    headline: '',
    profilePhotoUrl: '',
  });

  const [professional, setProfessional] = useState({
    title: '',
    experienceLevel: '',
    currentRole: '',
    experience: '',
    employmentType: '',
    company: '',
    about: '',
  });

  const [skills, setSkills] = useState<{
    techSkills: string[];
    tools: string[];
    softSkills: string[];
    languages: string[];
  }>({
    techSkills: [],
    tools: [],
    softSkills: [],
    languages: [],
  });

  const [certifications, setCertifications] = useState<{ name: string; year: string }[]>([]);
  const [education, setEducation] = useState<{ degree: string; school: string; year: string }[]>([]);
  const [projects, setProjects] = useState<{ title: string; description: string; link?: string }[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/tools/profilemitraa')) {
      setPrevRoute('/tools/profilemitraa/complete-profile/step-3');
      setDashboardRoute('/tools/profilemitraa/dashboard');
      setEditRoutes({
        step1: '/tools/profilemitraa/complete-profile',
        step2: '/tools/profilemitraa/complete-profile/step-2',
        step3: '/tools/profilemitraa/complete-profile/step-3',
      });
    }

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
          const userObj = data.user || {};
          const profObj = data.profile || {};
          
          setBasic({
            fullName: userObj.fullName || '',
            username: userObj.username || '',
            email: userObj.email || '',
            phone: profObj.phone || 'Not set',
            dob: profObj.dob || 'Not set',
            location: profObj.location || 'Not set',
            headline: profObj.headline || 'Not set',
            profilePhotoUrl: profObj.profile_photo_url || '',
          });

          setProfessional({
            title: profObj.professional_title || 'Not set',
            experienceLevel: profObj.experience_level || 'Not set',
            currentRole: profObj.current_job_role || 'Not set',
            experience: profObj.experience_years || 'Not set',
            employmentType: profObj.employment_type || 'Not set',
            company: profObj.company || 'Not set',
            about: profObj.about_me || 'Not set',
          });

          setSkills({
            techSkills: Array.isArray(profObj.tech_skills) ? profObj.tech_skills : [],
            tools: Array.isArray(profObj.tools) ? profObj.tools : [],
            softSkills: Array.isArray(profObj.soft_skills) ? profObj.soft_skills : [],
            languages: Array.isArray(profObj.languages) ? profObj.languages : [],
          });

          setCertifications(Array.isArray(profObj.certifications) ? profObj.certifications : []);
          setEducation(Array.isArray(profObj.education) ? profObj.education : []);
          setProjects(Array.isArray(profObj.projects) ? profObj.projects : []);
        }
      })
      .catch((err) => {
        console.error('Error fetching step 4 profile details:', err);
      });
  }, [router]);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate final data verification submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1800);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-sans p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 rounded-full bg-[#E8F6F2] flex items-center justify-center mx-auto shadow-lg shadow-emerald-200/60">
            <svg className="w-12 h-12 text-[#009670]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Profile <span className="text-[#009670]">Complete!</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Congratulations! Your profile has been successfully completed. You can now explore job opportunities and connect with employers.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-slate-100">
            {[
              { label: 'Profile Score', value: '85%' },
              { label: 'Skills Added', value: '10+' },
              { label: 'Status', value: 'Active' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-lg font-black text-[#009670]">{stat.value}</div>
                <div className="text-[10px] font-semibold text-slate-400 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3">
            <Link href={dashboardRoute} className="w-full px-6 py-3 bg-[#009670] hover:bg-[#047857] text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-emerald-700/15 flex items-center justify-center gap-2">
              Go to Dashboard
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-white flex flex-col lg:flex-row font-sans selection:bg-[#009670] selection:text-white">

      {/* ─── Left Column ─── */}
      <div
        className="w-full lg:w-[58%] xl:w-[56%] bg-white flex flex-col p-6 sm:p-10 lg:p-12 lg:h-screen lg:overflow-y-auto shrink-0 [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="max-w-[620px] w-full mx-auto space-y-5 flex flex-col justify-start">

          {/* Logo + Back */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img src="/images/tools/ProfileMitraa/logo/profilemitraalogo.png" alt="ProfileMitraa Logo" className="h-8 sm:h-9 w-auto object-contain" />
              <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Profile<span className="text-[#009670]">Mitraa</span>
              </span>
            </div>
            <Link href={prevRoute} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#009670] transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Link>
          </div>

          {/* Title */}
          <div className="space-y-1 pt-1">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Let&apos;s Complete Your Profile</h1>
            <p className="text-xs sm:text-sm font-bold text-[#009670]">Step 4 of 4</p>
          </div>

          {/* Stepper */}
          <div className="relative flex items-center justify-between pt-2 pb-4 border-b border-slate-100 select-none">
            <div className="absolute top-[26px] left-[10%] right-[10%] h-[2px] bg-slate-200 z-0" />
            <div className="absolute top-[26px] left-[10%] w-[90%] h-[2px] bg-[#009670] z-0" />
            {[
              { label: 'Basic Info', done: true },
              { label: 'Professional Info', done: true },
              { label: 'Skills', done: true },
              { label: 'Review', done: false, active: true },
            ].map((step, i) => (
              <div key={step.label} className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm
                  ${step.done ? 'bg-[#009670] text-white shadow-emerald-700/20' : step.active ? 'bg-[#009670] text-white shadow-md shadow-emerald-700/20 ring-4 ring-emerald-50' : 'border-2 border-slate-300 text-slate-400 bg-white'}`}>
                  {step.done ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`text-[11px] font-bold ${step.done || step.active ? 'text-[#009670]' : 'text-slate-400'}`}>{step.label}</span>
              </div>
            ))}
          </div>

          {/* Section header */}
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Review Your Profile</h2>
            <p className="text-[12px] text-slate-500 font-medium mt-0.5">Please review your details before we create your profile.</p>
          </div>

          {/* ─── Basic Information ─── */}
          <ReviewSection title="Basic Information" editHref={editRoutes.step1} icon={
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          }>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3 px-4 py-3">
              <ReviewField label="Full Name" value={basic.fullName} icon="user" />
              <ReviewField label="Username" value={basic.username} icon="at" />
              <ReviewField label="Date of Birth" value={basic.dob} icon="calendar" />
              <div className="col-span-2 sm:col-span-2">
                <ReviewField label="Email" value={basic.email} icon="email" />
              </div>
              <ReviewField label="Phone" value={basic.phone} icon="phone" />
              <div className="col-span-2 sm:col-span-2">
                <ReviewField label="Location" value={basic.location} icon="location" />
              </div>
              <ReviewField label="Headline" value={basic.headline} icon="tag" />
              <div className="flex flex-col gap-1">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Profile Photo</p>
                {basic.profilePhotoUrl ? (
                  <img
                    src={basic.profilePhotoUrl}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover mt-0.5 border-2 border-emerald-100"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-[#009670] flex items-center justify-center text-white text-xs font-black select-none mt-0.5">
                    {basic.fullName ? basic.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '?'}
                  </div>
                )}
              </div>
            </div>
          </ReviewSection>

          {/* ─── Professional Information ─── */}
          <ReviewSection title="Professional Information" editHref={editRoutes.step2} icon={
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
          }>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 px-4 py-3">
              <ReviewField label="Professional Title" value={professional.title} />
              <ReviewField label="Experience Level" value={professional.experienceLevel} />
              <ReviewField label="Current Role" value={professional.currentRole} />
              <ReviewField label="Experience" value={professional.experience} />
              <ReviewField label="Employment Type" value={professional.employmentType} />
              <div className="col-span-2 sm:col-span-3">
                <ReviewField label="Company" value={professional.company} />
              </div>
            </div>
            <div className="px-4 pb-3 border-t border-slate-100 pt-3">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">About You</p>
              <p className="text-[11.5px] font-medium text-slate-700 leading-relaxed">{professional.about}</p>
            </div>
          </ReviewSection>

          {/* ─── Education History ─── */}
          <ReviewSection title="Education History" editHref={editRoutes.step2} icon={
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          }>
            <div className="px-4 py-3 space-y-2.5">
              {education.length === 0 ? (
                <p className="text-[11.5px] font-medium text-slate-400 italic">No education details added.</p>
              ) : (
                education.map((edu, i) => (
                  <div key={i} className="flex items-start justify-between border-b border-slate-50 last:border-0 pb-2.5 last:pb-0">
                    <div>
                      <h4 className="text-[12px] font-bold text-slate-800">{edu.degree}</h4>
                      <p className="text-[11px] text-slate-500 font-semibold mt-0.5">{edu.school}</p>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 shrink-0">{edu.year}</span>
                  </div>
                ))
              )}
            </div>
          </ReviewSection>

          {/* ─── Skills & Expertise ─── */}
          <ReviewSection title="Skills & Expertise" editHref={editRoutes.step3} icon={
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
          }>
            <div className="px-4 py-3 space-y-2.5">
              {/* Technical Skills */}
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Technical Skills</p>
                <div className="flex flex-wrap gap-1">
                  {skills.techSkills.slice(0, 6).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-[10.5px] font-bold text-[#009670]">{s}</span>
                  ))}
                  {skills.techSkills.length > 6 && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[10.5px] font-bold text-slate-500">+{skills.techSkills.length - 6}</span>
                  )}
                </div>
              </div>
              {/* Tools */}
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tools &amp; Technologies</p>
                <div className="flex flex-wrap gap-1">
                  {skills.tools.map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200 text-[10.5px] font-semibold text-slate-700">{s}</span>
                  ))}
                </div>
              </div>
              {/* Soft skills & languages in one row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Soft Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {skills.softSkills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-sky-50 border border-sky-100 text-[10.5px] font-semibold text-sky-700">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Languages</p>
                  <div className="flex flex-wrap gap-1">
                    {skills.languages.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-violet-50 border border-violet-100 text-[10.5px] font-semibold text-violet-700">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ReviewSection>

          {/* ─── Certifications ─── */}
          <ReviewSection title="Certifications" editHref={editRoutes.step3} icon={
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          }>
            <div className="px-4 py-3 space-y-2">
              {certifications.map((cert, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#009670] shrink-0" />
                    <span className="text-[12px] font-semibold text-slate-800">{cert.name}</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 ml-4 shrink-0">{cert.year}</span>
                </div>
              ))}
            </div>
          </ReviewSection>

          {/* ─── Projects Showcase ─── */}
          <ReviewSection title="Projects Showcase" editHref={editRoutes.step3} icon={
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          }>
            <div className="px-4 py-3 space-y-3">
              {projects.length === 0 ? (
                <p className="text-[11.5px] font-medium text-slate-400 italic">No projects added.</p>
              ) : (
                projects.map((proj, i) => (
                  <div key={i} className="border-b border-slate-50 last:border-0 pb-2.5 last:pb-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[12.5px] font-bold text-slate-800">{proj.title}</h4>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-[#009670] hover:underline text-[10.5px] font-bold">
                          🔗 Link
                        </a>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium whitespace-pre-line leading-relaxed mt-1">{proj.description}</p>
                  </div>
                ))
              )}
            </div>
          </ReviewSection>

          {/* ─── Bottom Actions ─── */}
          <div className="flex items-center justify-between pt-2 pb-2">
            <Link href={prevRoute} className="px-5 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white font-bold text-[12.5px] rounded-xl transition-all flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Previous
            </Link>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#009670] hover:bg-[#047857] disabled:bg-slate-300 text-white font-bold text-[12.5px] rounded-xl transition-all shadow-md shadow-emerald-700/10 flex items-center gap-2 select-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Complete Profile
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </>
              )}
            </button>
          </div>

          {/* Security note */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-semibold select-none pb-4">
            <svg className="w-3.5 h-3.5 text-[#009670]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Your information is safe with us. We never share your data.</span>
          </div>

        </div>
      </div>

      {/* ─── Right Column ─── */}
      <div className="hidden lg:flex w-[42%] xl:w-[44%] bg-[#F5FAFA] flex-col p-8 xl:p-10 relative overflow-hidden shrink-0 select-none h-full justify-between border-l border-slate-100/50">

        {/* Decorative dot grid - top right */}
        <div className="absolute top-8 right-8 grid grid-cols-5 gap-2 opacity-40 pointer-events-none z-0">
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#A3D9C9]" />
          ))}
        </div>

        {/* Large character illustration at the top */}
        <div className="relative z-10 w-full flex items-start justify-end h-[300px] xl:h-[330px] shrink-0">

          {/* Floating profile card overlay - top left of illustration */}
          <div className="absolute left-0 top-[10%] z-20 shadow-xl shadow-slate-900/10">
            <div className="bg-white rounded-2xl p-3.5 border border-slate-100 w-[150px] space-y-2.5">
              {/* Avatar row */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-[#009670] flex items-center justify-center text-white text-[10px] font-black shrink-0">RD</div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="w-16 h-1.5 bg-slate-200 rounded-full" />
                  <div className="w-10 h-1 bg-slate-100 rounded-full" />
                </div>
              </div>
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">★</span>
                ))}
              </div>
              {/* Skill bars */}
              <div className="space-y-1.5">
                <div className="w-full h-1 bg-emerald-100 rounded-full">
                  <div className="h-full w-[80%] bg-[#009670] rounded-full" />
                </div>
                <div className="w-full h-1 bg-emerald-100 rounded-full">
                  <div className="h-full w-[60%] bg-[#009670] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Green checkmark badge - top right */}
          <div className="absolute right-4 top-4 z-20 w-9 h-9 rounded-full bg-[#009670] flex items-center justify-center shadow-lg shadow-emerald-700/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Character image */}
          <div className="relative h-full flex items-end justify-end w-[75%] pointer-events-none ml-auto">
            <img
              src="/images/tools/ProfileMitraa/registration-img/registration4.png"
              alt="Review Illustration"
              className="w-full h-full object-contain object-bottom"
            />
          </div>
        </div>

        {/* "You're Almost Done!" benefits card */}
        <div className="relative z-10 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex-1 flex flex-col mt-4">
          <div className="px-5 pt-5 pb-3 border-b border-slate-100">
            <h3 className="text-[15px] font-black text-slate-900 leading-tight">
              You&apos;re Almost Done! 🎉
            </h3>
            <p className="text-[11.5px] text-slate-500 font-medium mt-1 leading-snug">
              Once you complete your profile, you can:
            </p>
          </div>

          <div className="px-5 py-4 space-y-4 flex-1">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                ),
                title: 'Get discovered by recruiters',
                desc: 'Increase your chances of getting hired.',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                ),
                title: 'Apply to relevant jobs',
                desc: 'Find and apply to jobs that match your skills.',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
                ),
                title: 'Build your professional brand',
                desc: 'Showcase your work and achievements.',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                ),
                title: 'Your privacy is our priority',
                desc: 'We keep your data secure and private.',
                light: true,
              },
            ].map((item) => (
              <div key={item.title} className={`flex items-start gap-3 p-3 rounded-xl ${item.light ? 'bg-[#F0FAF7] border border-[#D1F0E6]' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.light ? 'bg-[#E8F6F2] text-[#009670]' : 'bg-[#E8F6F2] text-[#009670]'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    {item.icon}
                  </svg>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-slate-800 leading-tight">{item.title}</p>
                  <p className="text-[10.5px] text-slate-400 font-medium mt-0.5 leading-tight">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Reusable sub-components ───

function ReviewSection({ title, editHref, icon, children }: {
  title: string;
  editHref: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/70 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-lg bg-[#E8F6F2] text-[#009670] flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              {icon}
            </svg>
          </div>
          <h3 className="text-[12px] font-black text-slate-800 tracking-wide">{title}</h3>
        </div>
        <Link href={editHref} className="text-[11px] font-bold text-[#009670] hover:underline flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125" />
          </svg>
          Edit
        </Link>
      </div>
      {children}
    </div>
  );
}

function ReviewField({ label, value, icon }: { label: string; value: string; icon?: string }) {
  const icons: Record<string, React.ReactNode> = {
    user: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />,
    at: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />,
    email: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />,
    phone: <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />,
    calendar: <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />,
    location: <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />,
    tag: <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z M6 6h.008v.008H6V6z" />,
  };

  return (
    <div className="flex flex-col gap-0.5 min-w-0 overflow-hidden">
      <div className="flex items-center gap-1">
        {icon && icons[icon] && (
          <svg className="w-3 h-3 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            {icons[icon]}
          </svg>
        )}
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate">{label}</p>
      </div>
      <p className="text-[11.5px] font-semibold text-slate-800 leading-snug break-all">{value}</p>
    </div>
  );
}
