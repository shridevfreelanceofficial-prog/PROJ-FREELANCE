/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Step2ProfessionalInfoPage() {
  const router = useRouter();

  // Form states
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [currentRole, setCurrentRole] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [company, setCompany] = useState('');
  const [about, setAbout] = useState('');
  const [education, setEducation] = useState<any[]>([]);
  const [degreeInput, setDegreeInput] = useState('');
  const [schoolInput, setSchoolInput] = useState('');
  const [eduYearInput, setEduYearInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [prevRoute, setPrevRoute] = useState('/complete-profile');
  const [nextRoute, setNextRoute] = useState('/complete-profile/step-3');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/tools/profilemitraa')) {
      setPrevRoute('/tools/profilemitraa/complete-profile');
      setNextRoute('/tools/profilemitraa/complete-profile/step-3');
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
        if (data.success && data.profile) {
          setProfessionalTitle(data.profile.professional_title || '');
          setExperienceLevel(data.profile.experience_level || '');
          setCurrentRole(data.profile.current_job_role || '');
          setYearsOfExperience(data.profile.experience_years || '');
          setEmploymentType(data.profile.employment_type || '');
          setCompany(data.profile.company || '');
          setAbout(data.profile.about_me || '');
          if (Array.isArray(data.profile.education)) {
            setEducation(data.profile.education);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching step 2 profile details:', err);
      });
  }, [router]);

  const handleAddEducation = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!degreeInput.trim() || !schoolInput.trim() || !eduYearInput.trim()) {
      setErrorMsg('Please fill in Degree, School, and Graduation Year to add education.');
      return;
    }
    const newEdu = {
      degree: degreeInput.trim(),
      school: schoolInput.trim(),
      year: eduYearInput.trim()
    };
    setEducation([...education, newEdu]);
    setDegreeInput('');
    setSchoolInput('');
    setEduYearInput('');
    setErrorMsg('');
  };

  const handleRemoveEducation = (index: number) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const isFresher = experienceLevel === 'Fresher';

    if (!professionalTitle || !experienceLevel || !employmentType || !about) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    if (!isFresher && !yearsOfExperience) {
      setErrorMsg('Please select your years of experience.');
      return;
    }

    setIsLoading(true);
    fetch('/api/profilemitraa/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        professional_title: professionalTitle,
        experience_level: experienceLevel,
        current_job_role: experienceLevel === 'Fresher' ? '' : currentRole,
        experience_years: experienceLevel === 'Fresher' ? '' : yearsOfExperience,
        employment_type: employmentType,
        company: experienceLevel === 'Fresher' ? '' : company,
        about_me: about,
        education,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to save professional details.');
        }
        router.push(nextRoute);
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
      
      {/* Left Column - Form Section */}
      <div className="w-full lg:w-[58%] xl:w-[56%] bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 lg:h-screen lg:overflow-y-auto shrink-0">
        <div className="max-w-[620px] w-full mx-auto space-y-6 flex flex-col justify-start">
          
          {/* Top Logo & Back Header */}
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <img
                src="/images/tools/ProfileMitraa/logo/profilemitraalogo.png"
                alt="ProfileMitraa Logo"
                className="h-8 sm:h-9 w-auto object-contain"
              />
              <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Profile<span className="text-[#009670]">Mitraa</span>
              </span>
            </div>

            {/* Back Button */}
            <Link
              href={prevRoute}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-[#009670] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </Link>
          </div>

          {/* Header Title & Subtitle */}
          <div className="space-y-1 pt-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Let&apos;s Complete Your Profile
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#009670]">
              Step 2 of 4
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="relative flex items-center justify-between pt-2 pb-6 border-b border-slate-100 select-none">
            
            {/* Connector Line in Background */}
            <div className="absolute top-[26px] left-[10%] right-[10%] h-[2px] bg-slate-200 z-0" />
            <div className="absolute top-[26px] left-[10%] w-[33%] h-[2px] bg-[#009670] z-0" />

            {/* Step 1 - Completed */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
              <div className="w-8 h-8 rounded-full bg-[#009670] text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-emerald-700/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-[#009670]">Basic Info</span>
            </div>

            {/* Step 2 - Active */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
              <div className="w-8 h-8 rounded-full bg-[#009670] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-700/20 ring-4 ring-emerald-50">
                2
              </div>
              <span className="text-[11px] font-bold text-[#009670]">Professional Info</span>
            </div>

            {/* Step 3 - Upcoming */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
              <div className="w-8 h-8 rounded-full border-2 border-slate-300 text-slate-400 bg-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <span className="text-[11px] font-medium text-slate-400">Skills</span>
            </div>

            {/* Step 4 - Upcoming */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
              <div className="w-8 h-8 rounded-full border-2 border-slate-300 text-slate-400 bg-white flex items-center justify-center font-bold text-xs">
                4
              </div>
              <span className="text-[11px] font-medium text-slate-400">Review</span>
            </div>

          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span className="w-4 h-4 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0">!</span>
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Grid Row 1: Professional Title & Experience Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Professional Title */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Professional Title *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </span>
                  <select
                    required
                    value={professionalTitle}
                    onChange={(e) => setProfessionalTitle(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] bg-white transition-colors appearance-none text-slate-700 font-medium cursor-pointer"
                  >
                    <option value="" disabled>e.g. Full Stack Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="UI/UX Designer">UI/UX Designer</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Data Scientist">Data Scientist</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Mobile Developer">Mobile Developer</option>
                    <option value="QA Engineer">QA Engineer</option>
                  </select>
                  <span className="absolute right-3 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Experience Level *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </span>
                  <select
                    required
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] bg-white transition-colors appearance-none text-slate-700 font-medium cursor-pointer"
                  >
                    <option value="" disabled>Select your experience level</option>
                    <option value="Fresher">Fresher (No Experience)</option>
                    <option value="Entry Level (0-1 yrs)">Entry Level (0-1 yrs)</option>
                    <option value="Junior (1-3 yrs)">Junior (1-3 yrs)</option>
                    <option value="Mid-Level (3-5 yrs)">Mid-Level (3-5 yrs)</option>
                    <option value="Senior (5-8 yrs)">Senior (5-8 yrs)</option>
                    <option value="Lead / Manager (8+ yrs)">Lead / Manager (8+ yrs)</option>
                    <option value="Executive">Executive</option>
                  </select>
                  <span className="absolute right-3 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

            </div>

            {/* Fresher notice banner */}
            {experienceLevel === 'Fresher' && (
              <div className="flex items-start gap-3 p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-[#009670] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[12.5px] font-bold text-[#009670]">Welcome, Fresher! 🎓</p>
                  <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Since you are a fresher, fields like Current Role, Years of Experience, and Company are not required. Just fill in your Employment Type and About You.</p>
                </div>
              </div>
            )}

            {/* Current Role — hidden for Fresher */}
            {experienceLevel !== 'Fresher' && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Current Role
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    value={currentRole}
                    onChange={(e) => setCurrentRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] bg-white transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Grid Row 2: Years of Experience & Employment Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Years of Experience — hidden for Fresher */}
              {experienceLevel !== 'Fresher' && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Years of Experience *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <select
                    value={yearsOfExperience}
                    onChange={(e) => setYearsOfExperience(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] bg-white transition-colors appearance-none text-slate-700 font-medium cursor-pointer"
                  >
                    <option value="" disabled>Select years of experience</option>
                    <option value="0-1 years">0-1 years</option>
                    <option value="1-3 years">1-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-8 years">5-8 years</option>
                    <option value="8+ years">8+ years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                  <span className="absolute right-3 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>
              )}

              {/* Employment Type */}
              <div className={experienceLevel === 'Fresher' ? 'md:col-span-2' : ''}>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Employment Type *
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <select
                    required
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] bg-white transition-colors appearance-none text-slate-700 font-medium cursor-pointer"
                  >
                    <option value="" disabled>Select employment type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                    <option value="Self-employed">Self-employed</option>
                  </select>
                  <span className="absolute right-3 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>
              </div>

            </div>

            {/* Company / Organization — hidden for Fresher */}
            {experienceLevel !== 'Fresher' && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Company / Organization
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9m4 0V7m0 0h4m-4 0H9" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Enter your current company name"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] bg-white transition-colors"
                  />
                </div>
              </div>
            )}

            {/* About You */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                About You *
              </label>
              <div className="relative rounded-xl border border-slate-200 focus-within:border-[#009670] focus-within:ring-1 focus-within:ring-[#009670] transition-colors bg-white overflow-hidden">
                <span className="absolute left-3.5 top-3 text-slate-400 pointer-events-none">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </span>
                <textarea
                  required
                  rows={4}
                  maxLength={550}
                  placeholder="Write a short summary about yourself, your role and what you do."
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  className="w-full pl-10 pr-4 pt-2.5 pb-7 text-[13px] focus:outline-none resize-none text-slate-800 font-medium"
                />
                <div className="absolute right-3 bottom-2 text-[10px] font-medium text-slate-400 select-none">
                  {about.length} / 550
                </div>
              </div>
            </div>

            {/* Education History Editor */}
            <div className="border border-slate-100 rounded-xl p-4 bg-slate-50/30 space-y-3">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Education History</h3>
              
              {/* Existing list */}
              {education.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {education.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-white border border-slate-100 rounded-lg p-2.5 shadow-xs">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{edu.degree}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{edu.school} • {edu.year}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(idx)}
                        className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add form */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  type="text"
                  placeholder="Degree, e.g. B.Tech"
                  value={degreeInput}
                  onChange={(e) => setDegreeInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[12px] bg-white rounded-lg"
                />
                <input
                  type="text"
                  placeholder="School/University"
                  value={schoolInput}
                  onChange={(e) => setSchoolInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[12px] bg-white rounded-lg"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Year, e.g. 2024"
                    value={eduYearInput}
                    onChange={(e) => setEduYearInput(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[12px] bg-white rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="px-3.5 py-2 bg-[#009670] hover:bg-[#047857] text-white text-[12px] font-bold rounded-lg transition-all shrink-0"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4">
              <Link
                href={prevRoute}
                className="px-6 py-2.5 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 bg-white font-bold text-[12.5px] rounded-xl transition-all flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Previous
              </Link>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-[#009670] hover:bg-[#047857] disabled:bg-slate-300 text-white font-bold text-[12.5px] rounded-xl transition-all shadow-md shadow-emerald-700/10 flex items-center gap-1.5 select-none"
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

      {/* Right Column - Product Showcase (Visible on lg screens) */}
      <div className="hidden lg:flex flex-1 bg-[#F5FAFA] flex-col p-8 xl:p-12 relative overflow-hidden shrink-0 select-none h-full justify-between">
        
        {/* Decorative Mint Dots Matrix in top right */}
        <div className="absolute top-10 right-10 grid grid-cols-4 gap-2 opacity-50 pointer-events-none">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#A3D9C9]" />
          ))}
        </div>

        {/* Showcase Text Header */}
        <div className="relative z-10 space-y-1 pt-2">
          <h2 className="text-[32px] xl:text-[38px] font-black tracking-tight leading-[1.15] text-slate-900">
            Your professional story <br />
            <span className="text-[#009670]">starts here</span>
          </h2>
          <div className="w-12 h-1 bg-[#009670] rounded-full my-3" />
          <p className="text-[13px] text-slate-500 font-medium leading-relaxed max-w-sm">
            Add your professional details and let opportunities find you.
          </p>
        </div>

        {/* Middle Visual Group: Circular Backdrop + Floating Cards + Character Graphic */}
        <div className="relative z-10 my-auto flex items-center justify-between w-full h-[360px] py-4">
          
          {/* Soft Circular Mint Background Shape Behind Illustration */}
          <div className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-[#E0F2ED] z-0 pointer-events-none" />

          {/* Stacked Floating Feature Cards (Left side of Showcase) */}
          <div className="relative flex flex-col gap-4 z-20 w-[240px] shrink-0">
            
            {/* Card 1: Web Developer */}
            <div className="bg-white rounded-xl p-3 shadow-md shadow-slate-200/60 border border-slate-100 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-[12px] text-slate-900 leading-tight">Web Developer</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">5+ Years Experience</p>
                </div>
              </div>
              <div className="w-4.5 h-4.5 rounded-full bg-[#009670] text-white flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Card 2: Tech Solutions */}
            <div className="bg-white rounded-xl p-3 shadow-md shadow-slate-200/60 border border-slate-100 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h4m-4 0V11m0 0h4m-4 0H9m4 0V7m0 0h4m-4 0H9" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-[12px] text-slate-900 leading-tight">Tech Solutions Pvt. Ltd.</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">Software Engineer</p>
                </div>
              </div>
              <div className="w-4.5 h-4.5 rounded-full bg-[#009670] text-white flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Card 3: Education */}
            <div className="bg-white rounded-xl p-3 shadow-md shadow-slate-200/60 border border-slate-100 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-[12px] text-slate-900 leading-tight">B.Tech in Computer Science</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">University of Mumbai</p>
                </div>
              </div>
              <div className="w-4.5 h-4.5 rounded-full bg-[#009670] text-white flex items-center justify-center shrink-0">
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Connecting Dotted Curves */}
            <div className="absolute left-[238px] top-4 bottom-4 w-[60px] pointer-events-none">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 60 180" fill="none">
                <path d="M 0 20 Q 30 20 50 50" stroke="#009670" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
                <path d="M 0 90 H 50" stroke="#009670" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
                <path d="M 0 160 Q 30 160 50 130" stroke="#009670" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
              </svg>
            </div>

          </div>

          {/* Right Side Character Image - registration2.png */}
          <div className="relative z-10 w-[290px] h-full flex items-end justify-end pointer-events-none select-none shrink-0">
            <img
              src="/images/tools/ProfileMitraa/registration-img/registration2.png"
              alt="Professional Character Illustration"
              className="w-full h-auto object-contain object-bottom"
            />
          </div>

        </div>

        {/* Bottom Floating Quote Box */}
        <div className="relative z-10 max-w-sm w-full bg-white rounded-2xl p-4 shadow-md shadow-slate-200/50 border border-slate-100 flex items-center gap-3">
          <span className="text-[#009670] text-2xl font-serif leading-none shrink-0 select-none">
            “
          </span>
          <p className="text-[11.5px] font-bold text-slate-700 leading-snug">
            A complete profile opens doors to better opportunities.
          </p>
        </div>

      </div>

    </div>
  );
}
