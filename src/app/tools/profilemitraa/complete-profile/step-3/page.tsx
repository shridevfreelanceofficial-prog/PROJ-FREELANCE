/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Certification {
  name: string;
  year: string;
}

export default function Step3SkillsPage() {
  const router = useRouter();

  // Dynamic tags/skills lists
  const [techSkills, setTechSkills] = useState<string[]>([
    'HTML', 'CSS', 'JavaScript', 'React.js', 'Node.js', 'MongoDB'
  ]);
  const [tools, setTools] = useState<string[]>([
    'VS Code', 'Git', 'Figma', 'Postman'
  ]);
  const [softSkills, setSoftSkills] = useState<string[]>([
    'Problem Solving', 'Teamwork', 'Communication', 'Time Management'
  ]);
  const [languages, setLanguages] = useState<string[]>([
    'English', 'Hindi', 'Marathi'
  ]);

  // Certifications
  const [certifications, setCertifications] = useState<Certification[]>([
    { name: 'Responsive Web Design - freeCodeCamp', year: '2024' }
  ]);

  interface Project {
    title: string;
    description: string;
    link?: string;
  }

  const [projects, setProjects] = useState<Project[]>([]);
  const [projectTitleInput, setProjectTitleInput] = useState('');
  const [projectDescInput, setProjectDescInput] = useState('');
  const [projectLinkInput, setProjectLinkInput] = useState('');

  // Inputs for adding content
  const [techInput, setTechInput] = useState('');
  const [toolInput, setToolInput] = useState('');
  const [softInput, setSoftInput] = useState('');
  const [langInput, setLangInput] = useState('');
  const [certNameInput, setCertNameInput] = useState('');
  const [certYearInput, setCertYearInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [prevRoute, setPrevRoute] = useState('/complete-profile/step-2');
  const [nextRoute, setNextRoute] = useState('/complete-profile/step-4');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/tools/profilemitraa')) {
      setPrevRoute('/tools/profilemitraa/complete-profile/step-2');
      setNextRoute('/tools/profilemitraa/complete-profile/step-4');
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
          if (Array.isArray(data.profile.tech_skills)) {
            setTechSkills(data.profile.tech_skills);
          }
          if (Array.isArray(data.profile.tools)) {
            setTools(data.profile.tools);
          }
          if (Array.isArray(data.profile.soft_skills)) {
            setSoftSkills(data.profile.soft_skills);
          }
          if (Array.isArray(data.profile.languages)) {
            setLanguages(data.profile.languages);
          }
          if (Array.isArray(data.profile.certifications)) {
            setCertifications(data.profile.certifications);
          }
          if (Array.isArray(data.profile.projects)) {
            setProjects(data.profile.projects);
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching step 3 details:', err);
      });
  }, [router]);

  // Standard lists for predefined tags
  const defaultLanguages = ['English', 'Hindi', 'Marathi', 'Spanish', 'French', 'German', 'Tamil', 'Telugu', 'Kannada', 'Bengali'];

  // Add handlers
  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && techInput.trim()) {
      e.preventDefault();
      const val = techInput.trim().replace(/,$/, '');
      if (techSkills.length >= 20) {
        setErrorMsg('Maximum 20 technical skills allowed.');
        return;
      }
      if (!techSkills.includes(val)) {
        setTechSkills([...techSkills, val]);
      }
      setTechInput('');
    }
  };

  const handleRemoveTech = (index: number) => {
    setTechSkills(techSkills.filter((_, i) => i !== index));
  };

  const handleAddTool = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && toolInput.trim()) {
      e.preventDefault();
      const val = toolInput.trim().replace(/,$/, '');
      if (tools.length >= 15) {
        setErrorMsg('Maximum 15 tools allowed.');
        return;
      }
      if (!tools.includes(val)) {
        setTools([...tools, val]);
      }
      setToolInput('');
    }
  };

  const handleRemoveTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const handleAddSoft = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',') && softInput.trim()) {
      e.preventDefault();
      const val = softInput.trim().replace(/,$/, '');
      if (softSkills.length >= 15) {
        setErrorMsg('Maximum 15 soft skills allowed.');
        return;
      }
      if (!softSkills.includes(val)) {
        setSoftSkills([...softSkills, val]);
      }
      setSoftInput('');
    }
  };

  const handleRemoveSoft = (index: number) => {
    setSoftSkills(softSkills.filter((_, i) => i !== index));
  };

  const handleAddLanguage = (val: string) => {
    if (val && !languages.includes(val)) {
      if (languages.length >= 10) {
        setErrorMsg('Maximum 10 languages allowed.');
        return;
      }
      setLanguages([...languages, val]);
    }
    setLangInput('');
  };

  const handleRemoveLanguage = (index: number) => {
    setLanguages(languages.filter((_, i) => i !== index));
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certNameInput.trim()) {
      setErrorMsg('Please enter a certification name.');
      return;
    }
    if (!certYearInput) {
      setErrorMsg('Please select a certification year.');
      return;
    }
    const newCert: Certification = {
      name: certNameInput.trim(),
      year: certYearInput
    };
    setCertifications([...certifications, newCert]);
    setCertNameInput('');
    setCertYearInput('');
    setErrorMsg('');
  };

  const handleRemoveCert = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleAddProject = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!projectTitleInput.trim() || !projectDescInput.trim()) {
      setErrorMsg('Please enter a Project Title and Description to add.');
      return;
    }
    const newProj: Project = {
      title: projectTitleInput.trim(),
      description: projectDescInput.trim(),
      link: projectLinkInput.trim() || undefined
    };
    setProjects([...projects, newProj]);
    setProjectTitleInput('');
    setProjectDescInput('');
    setProjectLinkInput('');
    setErrorMsg('');
  };

  const handleRemoveProject = (index: number) => {
    setProjects(projects.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (techSkills.length === 0) {
      setErrorMsg('Please add at least one technical skill.');
      return;
    }

    setIsLoading(true);
    fetch('/api/profilemitraa/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tech_skills: techSkills,
        tools: tools,
        soft_skills: softSkills,
        languages: languages,
        certifications: certifications,
        projects: projects,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to save skills options.');
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

  const yearsRange = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= currentYear - 30; y--) {
    yearsRange.push(y.toString());
  }

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-white flex flex-col lg:flex-row font-sans selection:bg-[#009670] selection:text-white">
      
      {/* Left Column - Form Section */}
      <div 
        className="w-full lg:w-[58%] xl:w-[56%] bg-white flex flex-col justify-between p-6 sm:p-10 lg:p-12 lg:h-screen lg:overflow-y-auto shrink-0 [&::-webkit-scrollbar]:hidden" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
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
              Step 3 of 4
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="relative flex items-center justify-between pt-2 pb-6 border-b border-slate-100 select-none">
            
            {/* Connector Line in Background */}
            <div className="absolute top-[26px] left-[10%] right-[10%] h-[2px] bg-slate-200 z-0" />
            <div className="absolute top-[26px] left-[10%] w-[66%] h-[2px] bg-[#009670] z-0" />

            {/* Step 1 - Completed */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
              <div className="w-8 h-8 rounded-full bg-[#009670] text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-emerald-700/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-[#009670]">Basic Info</span>
            </div>

            {/* Step 2 - Completed */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
              <div className="w-8 h-8 rounded-full bg-[#009670] text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-emerald-700/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[11px] font-bold text-[#009670]">Professional Info</span>
            </div>

            {/* Step 3 - Active */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
              <div className="w-8 h-8 rounded-full bg-[#009670] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-emerald-700/20 ring-4 ring-emerald-50">
                3
              </div>
              <span className="text-[11px] font-bold text-[#009670]">Skills</span>
            </div>

            {/* Step 4 - Upcoming */}
            <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
              <div className="w-8 h-8 rounded-full border-2 border-slate-300 text-slate-400 bg-white flex items-center justify-center font-bold text-xs">
                4
              </div>
              <span className="text-[11px] font-medium text-slate-400">Review</span>
            </div>

          </div>

          <div className="pt-2">
            <h2 className="text-base font-extrabold text-slate-900">Your Skills</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Add the skills you have. This helps us suggest better opportunities for you.
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold flex items-center gap-2">
              <span className="w-4 h-4 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center shrink-0">!</span>
              {errorMsg}
            </div>
          )}

          {/* Form Content */}
          <div className="space-y-4 text-left">
            
            {/* Grid Row 1: Technical Skills & Tools & Technologies */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Technical Skills */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Technical Skills *
                </label>
                <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-200 focus-within:border-[#009670] focus-within:ring-1 focus-within:ring-[#009670] transition-all min-h-[140px] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="relative flex items-center">
                      <span className="absolute left-2.5 text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        placeholder="Search or add skills"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyDown={handleAddTech}
                        className="w-full pl-7 pr-2 py-1 bg-transparent text-[12.5px] font-medium text-slate-700 outline-none placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pt-1 font-semibold">
                      {techSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 shadow-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveTech(index)}
                            className="text-slate-400 hover:text-rose-500 font-bold transition-colors ml-0.5 text-[10px]"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 text-right select-none pt-2">
                    {techSkills.length} / 20
                  </div>
                </div>
              </div>

              {/* Tools & Technologies */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Tools & Technologies
                </label>
                <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-200 focus-within:border-[#009670] focus-within:ring-1 focus-within:ring-[#009670] transition-all min-h-[140px] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="relative flex items-center">
                      <span className="absolute left-2.5 text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        placeholder="Search or add tools"
                        value={toolInput}
                        onChange={(e) => setToolInput(e.target.value)}
                        onKeyDown={handleAddTool}
                        className="w-full pl-7 pr-2 py-1 bg-transparent text-[12.5px] font-medium text-slate-700 outline-none placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pt-1 font-semibold">
                      {tools.map((tool, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 shadow-sm"
                        >
                          {tool}
                          <button
                            type="button"
                            onClick={() => handleRemoveTool(index)}
                            className="text-slate-400 hover:text-rose-500 font-bold transition-colors ml-0.5 text-[10px]"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 text-right select-none pt-2">
                    {tools.length} / 15
                  </div>
                </div>
              </div>

            </div>

            {/* Grid Row 2: Soft Skills & Languages Known */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Soft Skills */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Soft Skills
                </label>
                <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-200 focus-within:border-[#009670] focus-within:ring-1 focus-within:ring-[#009670] transition-all min-h-[140px] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="relative flex items-center">
                      <span className="absolute left-2.5 text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        placeholder="Search or add soft skills"
                        value={softInput}
                        onChange={(e) => setSoftInput(e.target.value)}
                        onKeyDown={handleAddSoft}
                        className="w-full pl-7 pr-2 py-1 bg-transparent text-[12.5px] font-medium text-slate-700 outline-none placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pt-1 font-semibold">
                      {softSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 shadow-sm"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSoft(index)}
                            className="text-slate-400 hover:text-rose-500 font-bold transition-colors ml-0.5 text-[10px]"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 text-right select-none pt-2">
                    {softSkills.length} / 15
                  </div>
                </div>
              </div>

              {/* Languages Known */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Languages Known
                </label>
                <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-200 focus-within:border-[#009670] focus-within:ring-1 focus-within:ring-[#009670] transition-all min-h-[140px] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="relative flex items-center">
                      <span className="absolute left-2.5 text-slate-400">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5m3.007-4.637a9 9 0 01-.1a12.593 12.593 0 01-1.396.945.5.5 0 00-.236.42V12a1 1 0 01-1 1h-1a2 2 0 00-2 2v2.5a.5.5 0 01-.5.5h-1a1 1 0 01-1-1v-2.5a2 2 0 00-2-2m-2-3H7a1 1 0 00-1-1v-.5a2 2 0 012-2h1a2 2 0 002-2V4" />
                        </svg>
                      </span>
                      <select
                        value={langInput}
                        onChange={(e) => handleAddLanguage(e.target.value)}
                        className="w-full pl-7 pr-2 py-1 bg-transparent text-[12.5px] font-semibold text-slate-700 outline-none appearance-none cursor-pointer"
                      >
                        <option value="">Select languages</option>
                        {defaultLanguages.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                      <span className="absolute right-1 text-slate-400 pointer-events-none">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto pt-1 font-semibold">
                      {languages.map((lang, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-700 shadow-sm"
                        >
                          {lang}
                          <button
                            type="button"
                            onClick={() => handleRemoveLanguage(index)}
                            className="text-slate-400 hover:text-rose-500 font-bold transition-colors ml-0.5 text-[10px]"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 text-right select-none pt-2">
                    {languages.length} / 10
                  </div>
                </div>
              </div>

            </div>

            {/* Certifications (Optional) */}
            <div className="space-y-2.5 pt-2">
              <label className="block text-xs font-bold text-slate-800">
                Certifications (Optional)
              </label>

              {/* Add form row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 flex items-center">
                  <span className="absolute left-3.5 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Enter certification name"
                    value={certNameInput}
                    onChange={(e) => setCertNameInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] bg-white transition-colors"
                  />
                </div>

                <div className="relative w-full sm:w-[160px] flex items-center">
                  <span className="absolute left-3.5 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <select
                    value={certYearInput}
                    onChange={(e) => setCertYearInput(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[13px] bg-white transition-colors appearance-none text-slate-700 font-semibold cursor-pointer"
                  >
                    <option value="" disabled>Select year</option>
                    {yearsRange.map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>
                  <span className="absolute right-3 text-slate-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleAddCert}
                  className="px-6 py-2.5 border border-[#009670] text-[#009670] hover:bg-emerald-50 bg-white font-bold text-[12.5px] rounded-xl transition-all flex items-center justify-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add
                </button>
              </div>

              {/* Added Certifications List */}
              <div className="space-y-2 pt-1 font-semibold max-h-[140px] overflow-y-auto">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#009670]" />
                      <span className="text-[12.5px] text-slate-800 font-bold">{cert.name}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Year Indicator */}
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-semibold selection:bg-slate-200">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {cert.year}
                      </span>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveCert(index)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            {/* Projects Editor */}
            <div className="space-y-2.5 pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-800">
                Projects Showcase
              </label>

              {/* Add form inputs */}
              <div className="space-y-3 bg-slate-50/30 border border-slate-100 rounded-xl p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={projectTitleInput}
                      onChange={(e) => setProjectTitleInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[12.5px] rounded-lg"
                    />
                  </div>

                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Project Link (Optional)"
                      value={projectLinkInput}
                      onChange={(e) => setProjectLinkInput(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[12.5px] rounded-lg"
                    />
                  </div>
                </div>

                <textarea
                  rows={2}
                  maxLength={200}
                  placeholder="Describe your project, technologies used, and your role..."
                  value={projectDescInput}
                  onChange={(e) => setProjectDescInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 focus:border-[#009670] focus:ring-1 focus:ring-[#009670] focus:outline-none text-[12.5px] rounded-lg resize-none"
                />

                <div className="flex justify-between items-center pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">{projectDescInput.length}/200 characters</span>
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="px-5 py-1.5 bg-[#009670] hover:bg-[#047857] text-white font-bold text-[12px] rounded-lg transition-all"
                  >
                    Add Project
                  </button>
                </div>
              </div>

              {/* List of projects */}
              {projects.length > 0 && (
                <div className="space-y-2 pt-1 font-semibold max-h-[200px] overflow-y-auto">
                  {projects.map((proj, index) => (
                    <div
                      key={index}
                      className="flex items-start justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#009670]" />
                          <h4 className="text-[12.5px] text-slate-800 font-bold">{proj.title}</h4>
                          {proj.link && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#009670] hover:underline text-[10.5px] font-bold"
                            >
                              🔗 Link
                            </a>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium whitespace-pre-line leading-relaxed pl-3">{proj.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(index)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors shrink-0"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                type="button"
                onClick={handleSubmit}
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

      {/* Right Column - Product Showcase (Visible on lg screens) */}
      <div className="hidden lg:flex w-[42%] xl:w-[44%] bg-[#F5FAFA] flex-col p-8 xl:p-10 relative overflow-hidden shrink-0 select-none h-full justify-between border-l border-slate-100/50">
        
        {/* Decorative Mint Dots Matrix in top right */}
        <div className="absolute top-10 right-10 grid grid-cols-4 gap-2 opacity-50 pointer-events-none z-0">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#A3D9C9]" />
          ))}
        </div>

        {/* Backdrop blob circle shapes */}
        <div className="absolute right-[-20px] top-[18%] w-[380px] h-[380px] rounded-full bg-[#E0F2ED]/90 pointer-events-none z-0" />
        <div className="absolute right-[-60px] top-[8%] w-[180px] h-[180px] rounded-full border-[14px] border-white/50 pointer-events-none z-0" />
        <div className="absolute right-[120px] top-[3%] w-[90px] h-[90px] rounded-full border-[1.5px] border-[#009670]/10 pointer-events-none z-0" />

        {/* Middle Visual Group: Floating Cards + Curved Dotted Lines + Graphic */}
        <div className="relative w-full h-[370px] xl:h-[400px] mt-2 flex items-end justify-center z-10 overflow-visible">
          
          {/* Widget 1: Term / Code Badge */}
          <div className="absolute left-[40px] top-[12%] z-20 shadow-lg shadow-slate-900/10 hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="bg-[#101F30] rounded-xl p-3 border border-slate-800 flex items-center justify-center w-12 h-12">
              <span className="text-white font-mono font-black text-lg select-none">&lt;/&gt;</span>
            </div>
          </div>


          {/* Widget 2: Chart Card */}
          <div className="absolute left-[70px] top-[32%] z-20 shadow-md shadow-slate-200/50 hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="bg-white rounded-xl p-2.5 border border-slate-100 w-20 flex flex-col gap-1">
              <div className="w-8 h-1 bg-slate-200 rounded-full" />
              <div className="flex items-end gap-1.5 h-7 pt-1">
                <div className="w-2.5 bg-emerald-100 rounded-sm h-[35%]" />
                <div className="w-2.5 bg-[#009670] rounded-sm h-[80%]" />
                <div className="w-2.5 bg-emerald-200 rounded-sm h-[55%]" />
              </div>
            </div>
          </div>


          {/* Widget 3: Stars Badge */}
          <div className="absolute left-[20px] top-[52%] z-20 shadow-md shadow-slate-200/50 hover:scale-105 transition-transform duration-200 cursor-pointer">
            <div className="bg-white rounded-xl p-3 border border-slate-100 w-36 space-y-1.5">
              <div className="flex items-center gap-2">
                {/* Green Avatar Icon */}
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#009670] flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="w-12 h-1 bg-slate-200 rounded-full" />
                  <div className="w-8 h-1 bg-slate-150 rounded-full" />
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-xs">★</span>
                ))}
              </div>
            </div>
          </div>


          {/* Right Side Illustration - registration3.png */}
          <div className="absolute bottom-0 right-[-15px] w-[350px] xl:w-[410px] h-full flex items-end justify-end pointer-events-none select-none z-10 shrink-0">
            <img
              src="/images/tools/ProfileMitraa/registration-img/registration3.png"
              alt="Skills Illustrative Graphic"
              className="w-full h-auto object-contain object-bottom scale-[1.08] origin-bottom-right"
            />
          </div>

        </div>

        {/* Why add skills checklist & profile completion progress bar */}
        <div className="bg-white rounded-2xl p-5 xl:p-6 shadow-sm border border-slate-100/80 w-full space-y-4 relative z-10">
          
          <div className="space-y-3.5 pb-4 border-b border-slate-100">
            <h3 className="text-xs font-black text-slate-800 tracking-wider uppercase">
              Why add skills?
            </h3>
            
            {/* Checklist items */}
            <div className="space-y-3">
              
              {/* Item 1 */}
              <div className="flex items-start gap-3">
                <div className="w-6.5 h-6.5 rounded-lg bg-[#E8F6F2] text-[#009670] flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-[12px] font-bold text-slate-800 leading-none mb-1">Better Opportunities</h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-tight">Get matched with jobs that fit your skills.</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-start gap-3">
                <div className="w-6.5 h-6.5 rounded-lg bg-[#E8F6F2] text-[#009670] flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-[12px] font-bold text-slate-800 leading-none mb-1">Increase Visibility</h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-tight">Complete profiles are 3x more likely to get noticed.</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-start gap-3">
                <div className="w-6.5 h-6.5 rounded-lg bg-[#E8F6F2] text-[#009670] flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-[12px] font-bold text-slate-800 leading-none mb-1">Showcase Your Strengths</h4>
                  <p className="text-[10px] text-slate-400 font-medium leading-tight">Highlight what you do best.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Progress bar container */}
          <div className="space-y-2 pt-1">
            <div className="flex justify-between items-center text-[11px] font-bold">
              <span className="text-slate-700">Profile Completion</span>
              <span className="text-[#009670]">50% Complete</span>
            </div>
            
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-[#009670] rounded-full transition-all duration-500" style={{ width: '50%' }} />
            </div>
          </div>

        </div>

        {/* Need Help? Link Block */}
        <div className="relative z-10 w-full bg-[#F4FAF8] rounded-2xl p-4 border border-slate-100/70 flex items-center gap-3.5 mt-2">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-emerald-100/30">
            <svg className="w-5 h-5 text-[#009670]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V12a3 3 0 016 0v.75a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <h4 className="text-[12px] font-extrabold text-slate-900 leading-tight">Need help?</h4>
            <p className="text-[10px] text-slate-400 font-semibold leading-tight mt-0.5">We&apos;re here to help you build the perfect profile.</p>
            <Link
              href="/support"
              className="text-[10px] font-bold text-[#009670] hover:underline inline-flex items-center gap-0.5 mt-1"
            >
              Contact Support
              <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
