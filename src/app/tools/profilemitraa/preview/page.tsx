/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';

interface EducationItem {
  id: string;
  degree: string;
  fieldOfStudy: string;
  school: string;
  startYear: string;
  endYear: string;
  description?: string;
}

interface ProjectItem {
  id: string;
  title: string;
  description: string;
  projectUrl?: string;
  technologies?: string;
}

export default function ProfileMitraaPreviewPage() {
  const [profile, setProfile] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const latestMessageRef = React.useRef<any>(null);

  // Sync state with postMessage updates from parent editor
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.type === 'portfolio-update') {
        const update = e.data.data;
        latestMessageRef.current = update;
        setPortfolio((prev: any) => ({
          ...prev,
          ...update
        }));
      }
    };
    window.addEventListener('message', handleMessage);
    
    // Fetch baseline profile data
    fetch('/api/profilemitraa/profile')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setProfile(d);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));

    // Fetch baseline portfolio data (if exists)
    fetch('/api/profilemitraa/portfolio')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.portfolio) {
          setPortfolio((prev: any) => ({
            ...d.portfolio,
            ...prev,
            ...latestMessageRef.current
          }));
        }
      })
      .catch(() => {});

    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white font-sans">
        <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase font-extrabold tracking-wider text-slate-400">Loading Preview Canvas</p>
      </div>
    );
  }

  // Merging fields from profile + portfolio defaults + customized overrides
  const userObj = profile?.user || {};
  const profileDetails = profile?.profile || {};

  const getArray = (val: any) => {
    if (!val) return [];
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch { return []; }
    }
    return Array.isArray(val) ? val : [];
  };

  const educationList: EducationItem[] = getArray(profileDetails?.education);
  const projectsList: ProjectItem[] = getArray(profileDetails?.projects);

  const rawTheme = portfolio?.design_theme || 'minimal_dark';
  const themeKey = rawTheme === 'minimal' ? 'minimal_dark' : rawTheme;
  const customData = portfolio?.customized_data || {};

  // Custom data overrides helper
  const getVal = (section: string, field: string, fallback: string) => {
    if (customData[section] && customData[section][field] !== undefined && customData[section][field] !== '') {
      return customData[section][field];
    }
    return fallback;
  };

  const sectionsToShow = Array.isArray(portfolio?.sections)
    ? portfolio.sections
    : [];

  const isEnabled = (secId: string) => {
    const s = sectionsToShow.find((item: any) => (item.id || item) === secId);
    return s ? s.enabled : false;
  };

  // Profile photo fallback code
  const profilePic = portfolio?.profile_image_url || profileDetails?.profile_photo_url || '';

  // Render Template 1: Tech Minimalist (Dark Mode)
  if (themeKey === 'minimal_dark') {
    return (
      <div className="min-h-screen bg-[#070C14] text-[#E2E8F0] font-mono selection:bg-[#10B981]/30 pb-20">
        {/* Glow Element */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 pt-16 space-y-16">
          {/* Header Section */}
          <header className="flex flex-col sm:flex-row items-center gap-6 border-b border-emerald-500/20 pb-8">
            {profilePic ? (
              <img src={profilePic} alt="Avatar" className="w-[100px] h-[100px] rounded-lg object-cover border-2 border-[#10B981] shadow-lg shadow-emerald-500/25 shrink-0" />
            ) : (
              <div className="w-[100px] h-[100px] rounded-lg bg-[#0F172A] border-2 border-dashed border-[#10B981] flex items-center justify-center text-4xl shrink-0">💻</div>
            )}
            <div className="text-center sm:text-left space-y-2">
              <span className="text-[10px] font-bold text-[#10B981] tracking-widest uppercase bg-[#10B981]/15 px-2.5 py-0.5 rounded border border-[#10B981]/30">Active Developer Mode</span>
              <h1 className="text-3xl font-black tracking-tight text-white">{getVal('hero', 'title', portfolio?.title || `${userObj.fullName || 'User'} Portfolio`)}</h1>
              <p className="text-xs text-[#10B981] font-bold">&gt; {getVal('hero', 'subtitle', portfolio?.tagline || profileDetails?.headline || 'Creative Engineer')}</p>
            </div>
          </header>

          {/* Dynamic Sections Loop */}
          {sectionsToShow
            .filter((sec: any) => {
              const secId = sec.id || sec;
              const enabled = sec.enabled !== undefined ? sec.enabled : true;
              if (!enabled) return false;
              const validIds = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'certifications', 'contact'];
              return validIds.includes(secId) || secId?.startsWith('custom_');
            })
            .map((sec: any) => {
              const secId = sec.id || sec;
              switch (secId) {
              case 'hero':
                return (
                  <section key="hero" className="space-y-4 bg-[#0A111E] border border-emerald-500/10 rounded-xl p-6 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#10B981]" />
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#10B981] flex items-center gap-1.5">
                      <span>⚡</span> SYSTEM._INTRO
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-sans">{getVal('hero', 'description', portfolio?.description || profileDetails?.about_me || 'Developer description goes here.')}</p>
                  </section>
                );
              case 'about':
                return (
                  <section key="about" className="space-y-4">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#10B981] flex items-center gap-1.5 pb-2 border-b border-slate-800">
                      <span>👤</span> ABOUT_ME
                    </h3>
                    <div className="space-y-4 font-sans text-sm text-[#94A3B8] leading-relaxed">
                      <p>{getVal('about', 'text', profileDetails?.about_me || 'About section content goes here.')}</p>
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2">
                        <div className="bg-[#0F172A] p-3 rounded border border-slate-800">
                          <span className="text-[#10B981]">LOC:</span> {portfolio?.location || profileDetails?.location || 'Not set'}
                        </div>
                        <div className="bg-[#0F172A] p-3 rounded border border-slate-800">
                          <span className="text-[#10B981]">LNG:</span> {portfolio?.language || 'English'}
                        </div>
                      </div>
                    </div>
                  </section>
                );
              case 'skills':
                return (
                  <section key="skills" className="space-y-4">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#10B981] flex items-center gap-1.5 pb-2 border-b border-slate-800">
                      <span>🛠️</span> CORE_STACK
                    </h3>
                    <p className="text-xs text-slate-400 font-sans italic">{getVal('skills', 'description', 'Core competencies, technical frameworks, and productivity tools:')}</p>
                    <div className="flex flex-wrap gap-2 pt-2">
                      {Array.isArray(profileDetails?.tech_skills) && profileDetails.tech_skills.length > 0 ? (
                        profileDetails.tech_skills.map((skill: string, idx: number) => (
                          <span key={`tech-${skill}-${idx}`} className="px-3 py-1 bg-[#10B981]/5 border border-[#10B981]/30 hover:border-[#10B981] rounded text-xs font-semibold text-[#34D399] transition-all">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500 font-sans">No skills listed in profile.</span>
                      )}
                      {Array.isArray(profileDetails?.tools) && profileDetails.tools.map((tool: string, idx: number) => (
                        <span key={`tool-${tool}-${idx}`} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </section>
                );
              case 'projects':
                return (
                  <section key="projects" className="space-y-4">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#10B981] flex items-center gap-1.5 pb-2 border-b border-slate-800">
                      <span>📁</span> LOGGED_PROJECTS
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {projectsList.length > 0 ? (
                        projectsList.map((project, index) => (
                          <div key={project.id || `proj-${index}`} className="bg-[#0A111E] border border-slate-800 hover:border-[#10B981]/50 rounded-xl p-5 space-y-3 transition-all group font-sans">
                            <div className="flex justify-between items-start">
                              <h4 className="text-sm font-bold text-white font-mono group-hover:text-[#10B981] transition-colors">{project.title}</h4>
                              {project.projectUrl && (
                                <a href={project.projectUrl} target="_blank" rel="noreferrer" className="text-xs font-mono text-[#10B981] hover:underline flex items-center gap-1">URL ➔</a>
                              )}
                            </div>
                            <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-3">{project.description}</p>
                            {project.technologies && (
                              <div className="flex flex-wrap gap-1.5 pt-2">
                                {project.technologies.split(',').map((t, idx) => (
                                  <span key={`tech-tag-${t}-${idx}`} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                                    {t.trim()}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="p-4 bg-slate-900 rounded border border-slate-800 text-xs text-slate-500 font-sans col-span-2 text-center">No projects added yet under Complete Profile.</div>
                      )}
                    </div>
                  </section>
                );
              case 'experience':
                return (
                  <section key="experience" className="space-y-4">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#10B981] flex items-center gap-1.5 pb-2 border-b border-slate-800">
                      <span>💼</span> WORK_RECORDS
                    </h3>
                    <div className="space-y-4 pt-2">
                      <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 font-sans space-y-4 divide-y divide-slate-800">
                        <div className="pb-3 flex justify-between items-start gap-4">
                          <div>
                            <h4 className="text-xs font-black text-white">{profileDetails?.current_job_role || profileDetails?.current_role || 'Software Engineer'}</h4>
                            <p className="text-[11px] text-slate-400 mt-1">{profileDetails?.company || 'Freelancer / Personal Studio'}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-mono bg-[#10B981]/10 text-[#34D399] px-2 py-0.5 rounded border border-[#10B981]/25">{profileDetails?.experience_years || '1-3'} Years Exp</span>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">{profileDetails?.employment_type || 'Full-time'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              case 'education':
                return (
                  <section key="education" className="space-y-4">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#10B981] flex items-center gap-1.5 pb-2 border-b border-slate-800">
                      <span>🎓</span> ACADEMIC_LOG
                    </h3>
                    <div className="space-y-3 pt-2">
                      {educationList.length > 0 ? (
                        educationList.map((edu, index) => (
                          <div key={edu.id || `edu-${index}`} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row justify-between gap-2 sm:items-center font-sans">
                            <div>
                              <h4 className="text-xs font-black text-white">{edu.degree} in {edu.fieldOfStudy}</h4>
                              <p className="text-[11px] text-slate-400 mt-1">{edu.school}</p>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                              <span className="text-[10px] font-mono bg-slate-800 text-slate-350 px-2 py-0.5 rounded border border-slate-755">{edu.startYear} - {edu.endYear}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 bg-slate-900 rounded border border-slate-800 text-xs text-slate-500 font-sans text-center">No education records added yet under Complete Profile.</div>
                      )}
                    </div>
                  </section>
                );
              case 'certifications':
                return (
                  <section key="certifications" className="space-y-4">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#10B981] flex items-center gap-1.5 pb-2 border-b border-slate-800">
                      <span>🏆</span> VERIFIED_CERTS
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {Array.isArray(profileDetails?.certifications) && profileDetails.certifications.length > 0 ? (
                        profileDetails.certifications.map((c: any, index: number) => (
                          <div key={`cert-${index}`} className="bg-[#0A111E] border border-slate-850 p-4 rounded-xl flex items-center gap-3 font-sans">
                            <div className="text-xl">🏆</div>
                            <div>
                              <h4 className="text-xs font-black text-white leading-snug">{c.name || c}</h4>
                              <p className="text-[9px] text-[#10B981] font-mono mt-0.5">{c.issuer || 'Online Certification'}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 bg-slate-900 rounded border border-slate-800 text-xs text-slate-500 font-sans text-center col-span-2">No certificates found.</div>
                      )}
                    </div>
                  </section>
                );
              case 'contact':
                return (
                  <section key="contact" className="space-y-4">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#10B981] flex items-center gap-1.5 pb-2 border-b border-slate-800">
                      <span>✉️</span> ESTABLISH_CONTACT
                    </h3>
                    <p className="text-xs text-slate-400 font-sans">{getVal('contact', 'prompt', 'Input parameters to broadcast custom queries of execution or collaboration:')}</p>
                    <div className="bg-[#0A111E] border border-slate-800 rounded-2xl p-5 space-y-4 max-w-lg font-sans">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono uppercase text-slate-500">Sender Name</label>
                          <input disabled type="text" placeholder="John Doe" className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-450 focus:outline-none" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-mono uppercase text-slate-500">Sender Email</label>
                          <input disabled type="email" placeholder="john@example.com" className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-450 focus:outline-none" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-mono uppercase text-slate-500">Payload Message</label>
                        <textarea disabled rows={3} placeholder="Compose your inquiries of collaboration..." className="w-full px-3 py-2 text-xs bg-slate-905 border border-slate-800 rounded-lg text-slate-455 focus:outline-none resize-none" />
                      </div>
                      <button disabled className="w-full py-2 bg-[#10B981] hover:bg-emerald-600 text-white font-mono text-xs font-bold rounded-lg transition-colors border border-[#10B981]/30">
                        EXECUTE._SEND()
                      </button>
                    </div>
                  </section>
                );
              default:
                if (secId?.startsWith('custom_')) {
                  const customText = customData[secId]?.text || sec.description || '';
                  return (
                    <section key={secId} className="space-y-4">
                      <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#10B981] flex items-center gap-1.5 pb-2 border-b border-slate-800">
                        <span>✨</span> {sec.name || 'CUSTOM SECTION'}
                      </h3>
                      <div className="space-y-4 font-sans text-sm text-[#94A3B8] leading-relaxed">
                        <p className="whitespace-pre-wrap">{customText}</p>
                      </div>
                    </section>
                  );
                }
                return null;
            }
          })}
        </div>
      </div>
    );
  }

  // Render Template 2: Creative Glassmorphism (Fluid Gradients)
  if (themeKey === 'creative_glass') {
    return (
      <div className="min-h-screen bg-gradient-to-tr from-[#1E1B4B] via-[#311042] to-[#450A0A] text-slate-100 font-sans pb-20 relative overflow-hidden select-none">
        {/* Colorful fluid ambient blobs */}
        <div className="absolute top-20 left-10 w-80 h-80 rounded-full bg-violet-600/25 blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-rose-600/25 blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto px-6 pt-16 space-y-12 relative z-10">
          {/* Header Frosted Box */}
          <header className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-xl">
            {profilePic ? (
              <img src={profilePic} alt="Avatar" className="w-[110px] h-[110px] rounded-2xl object-cover border-2 border-white/20 shadow-2xl shrink-0" />
            ) : (
              <div className="w-[110px] h-[110px] rounded-2xl bg-white/10 border-2 border-dashed border-white/25 flex items-center justify-center text-4xl shrink-0">🎨</div>
            )}
            <div className="text-center md:text-left space-y-2">
              <span className="inline-block text-[10px] font-extrabold tracking-wider text-rose-300 uppercase bg-rose-500/20 px-3 py-1 rounded-full border border-rose-400/25">Design Portfolio</span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-violet-200 via-rose-200 to-amber-200 bg-clip-text text-transparent">
                {getVal('hero', 'title', portfolio?.title || `${userObj.fullName || 'User'} Portfolio`)}
              </h1>
              <p className="text-sm font-semibold text-slate-350">{getVal('hero', 'subtitle', portfolio?.tagline || profileDetails?.headline || 'Creative Designer')}</p>
            </div>
          </header>

          {/* Dynamic Sections Loop */}
          {sectionsToShow
            .filter((sec: any) => {
              const secId = sec.id || sec;
              const enabled = sec.enabled !== undefined ? sec.enabled : true;
              if (!enabled) return false;
              const validIds = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'certifications', 'contact'];
              return validIds.includes(secId) || secId?.startsWith('custom_');
            })
            .map((sec: any) => {
              const secId = sec.id || sec;
              switch (secId) {
              case 'hero':
                return (
                  <section key="hero" className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-4">
                    <h3 className="text-sm font-black text-rose-300 tracking-wider uppercase flex items-center gap-2">
                      <span className="text-violet-400">★</span> Overview
                    </h3>
                    <p className="text-sm text-slate-300 leading-relaxed font-light">{getVal('hero', 'description', portfolio?.description || profileDetails?.about_me || 'Creative description highlights here.')}</p>
                  </section>
                );
              case 'about':
                return (
                  <section key="about" className="space-y-4">
                    <h3 className="text-sm font-black text-rose-300 tracking-wider uppercase flex items-center gap-2">
                      <span className="text-violet-400">★</span> About
                    </h3>
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl space-y-5">
                      <p className="text-sm text-slate-300 font-light leading-relaxed">{getVal('about', 'text', profileDetails?.about_me || 'About section content goes here.')}</p>
                      <div className="grid grid-cols-2 gap-4 text-xs font-semibold pt-2">
                        <div className="bg-white/10 border border-white/5 px-4 py-3 rounded-2xl">
                          <span className="text-slate-400">Base Location:</span> <p className="text-slate-200 mt-1">{portfolio?.location || profileDetails?.location || 'Not set'}</p>
                        </div>
                        <div className="bg-white/10 border border-white/5 px-4 py-3 rounded-2xl">
                          <span className="text-slate-400">Language:</span> <p className="text-slate-200 mt-1">{portfolio?.language || 'English'}</p>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              case 'skills':
                return (
                  <section key="skills" className="space-y-4">
                    <h3 className="text-sm font-black text-rose-300 tracking-wider uppercase flex items-center gap-2">
                      <span className="text-violet-400">★</span> Skillsets
                    </h3>
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                      <p className="text-xs text-slate-400 italic">{getVal('skills', 'description', 'Specialized tools, systems, and creative technologies:')}</p>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(profileDetails?.tech_skills) && profileDetails.tech_skills.length > 0 ? (
                          profileDetails.tech_skills.map((skill: string, idx: number) => (
                            <span key={`tech-${skill}-${idx}`} className="px-4 py-1.5 rounded-full bg-violet-500/20 border border-violet-400/20 text-xs font-semibold text-violet-200">{skill}</span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">No tech skills documented.</span>
                        )}
                        {Array.isArray(profileDetails?.tools) && profileDetails.tools.map((tool: string, idx: number) => (
                          <span key={`tool-${tool}-${idx}`} className="px-4 py-1.5 rounded-full bg-pink-500/20 border border-pink-400/25 text-xs text-rose-200">{tool}</span>
                        ))}
                        {Array.isArray(profileDetails?.soft_skills) && profileDetails.soft_skills.map((soft: string, idx: number) => (
                          <span key={`soft-${soft}-${idx}`} className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/20 text-xs text-amber-200">{soft}</span>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              case 'projects':
                return (
                  <section key="projects" className="space-y-4">
                    <h3 className="text-sm font-black text-rose-300 tracking-wider uppercase flex items-center gap-2">
                      <span className="text-violet-400">★</span> Selected Works
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {projectsList.length > 0 ? (
                        projectsList.map((project, index) => (
                          <div key={project.id || `proj-${index}`} className="backdrop-blur-md bg-white/5 border border-white/10 hover:border-rose-400/50 hover:bg-white/10 rounded-3xl p-6 space-y-3 shadow-xl transition-all group">
                            <div className="flex justify-between items-center">
                              <h4 className="text-sm font-extrabold text-white group-hover:text-rose-300 transition-colors uppercase tracking-wide">{project.title}</h4>
                              {project.projectUrl && <a href={project.projectUrl} target="_blank" rel="noreferrer" className="text-xs text-rose-400 hover:underline">Link</a>}
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 font-light">{project.description}</p>
                            {project.technologies && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {project.technologies.split(',').map((tech, idx) => (
                                  <span key={`tech-tag-${tech}-${idx}`} className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-semibold text-slate-300">{tech.trim()}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-3xl text-xs text-slate-400 text-center col-span-2">No projects added yet under Complete Profile.</div>
                      )}
                    </div>
                  </section>
                );
              case 'experience':
                return (
                  <section key="experience" className="space-y-4">
                    <h3 className="text-sm font-black text-rose-300 tracking-wider uppercase flex items-center gap-2">
                      <span className="text-violet-400">★</span> Work Experience
                    </h3>
                    <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                      <div className="flex justify-between items-start gap-4 pb-2">
                        <div className="space-y-1">
                          <h4 className="text-sm font-extrabold text-white">{profileDetails?.current_job_role || profileDetails?.current_role || 'Creative Lead'}</h4>
                          <p className="text-xs text-slate-400">{profileDetails?.company || 'Freelance Design Studio'}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="inline-block text-[10px] font-bold bg-violet-600/30 text-violet-300 px-3 py-1 rounded-full border border-violet-500/20">{profileDetails?.experience_years || '1-3'} Years Exp</span>
                          <p className="text-[10px] text-slate-400 uppercase font-extrabold">{profileDetails?.employment_type || 'Full-time'}</p>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              case 'education':
                return (
                  <section key="education" className="space-y-4">
                    <h3 className="text-sm font-black text-rose-300 tracking-wider uppercase flex items-center gap-2">
                      <span className="text-violet-400">★</span> Credentials
                    </h3>
                    <div className="space-y-3">
                      {educationList.length > 0 ? (
                        educationList.map((edu, index) => (
                          <div key={edu.id || `edu-${index}`} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                            <div>
                              <h4 className="text-xs font-extrabold text-white uppercase">{edu.degree} in {edu.fieldOfStudy}</h4>
                              <p className="text-[11px] text-slate-400 mt-1">{edu.school}</p>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                              <span className="text-[10px] bg-slate-900/60 text-slate-300 px-3 py-1 rounded-full border border-white/5">{edu.startYear} - {edu.endYear}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-3xl text-sm text-slate-400 text-center">No credentials registered yet.</div>
                      )}
                    </div>
                  </section>
                );
              case 'certifications':
                return (
                  <section key="certifications" className="space-y-4">
                    <h3 className="text-sm font-black text-rose-300 tracking-wider uppercase flex items-center gap-2">
                      <span className="text-violet-400">★</span> Certifications
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Array.isArray(profileDetails?.certifications) && profileDetails.certifications.length > 0 ? (
                        profileDetails.certifications.map((c: any, index: number) => (
                          <div key={`cert-${index}`} className="backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                            <div className="text-xl">🏆</div>
                            <div>
                              <h4 className="text-xs font-extrabold text-white">{c.name || c}</h4>
                              <p className="text-[9px] text-rose-300 mt-0.5">{c.issuer || 'Online Certification'}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-3xl text-xs text-slate-400 text-center col-span-2">No certifications added yet.</div>
                      )}
                    </div>
                  </section>
                );
              case 'contact':
                return (
                  <section key="contact" className="space-y-4">
                    <h3 className="text-sm font-black text-rose-300 tracking-wider uppercase flex items-center gap-2">
                      <span className="text-violet-400">★</span> Contact
                    </h3>
                    <div className="backdrop-blur-md bg-white/5 border border-white/15 rounded-3xl p-6 md:p-8 space-y-4 max-w-lg shadow-2xl">
                      <p className="text-xs text-slate-300">{getVal('contact', 'prompt', 'Let us connect and co-create details of code or dynamic visuals:')}</p>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input disabled type="text" placeholder="Name" className="w-full px-4 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-slate-300 focus:outline-none" />
                          <input disabled type="email" placeholder="Email" className="w-full px-4 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-slate-300 focus:outline-none" />
                        </div>
                        <textarea disabled rows={3} placeholder="What project details do you want to collaborate on?" className="w-full px-4 py-2.5 text-xs bg-white/5 border border-white/10 rounded-xl text-slate-300 focus:outline-none resize-none" />
                        <button disabled className="w-full py-2.5 bg-gradient-to-r from-violet-500 to-rose-500 text-white font-extrabold text-xs rounded-xl uppercase tracking-widest">
                          Deliver Message
                        </button>
                      </div>
                    </div>
                  </section>
                );
              default:
                if (secId?.startsWith('custom_')) {
                  const customText = customData[secId]?.text || sec.description || '';
                  return (
                    <section key={secId} className="space-y-4">
                      <h3 className="text-sm font-black text-rose-300 tracking-wider uppercase flex items-center gap-2">
                        <span className="text-violet-400">✨</span> {sec.name || 'Custom Section'}
                      </h3>
                      <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-3xl p-6 shadow-xl">
                        <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{customText}</p>
                      </div>
                    </section>
                  );
                }
                return null;
            }
          })}
        </div>
      </div>
    );
  }

  // Render Template 3: Corporate Grid (Professional Navy Blue & Slate)
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* Upper Navigation Bar */}
      <nav className="bg-[#1E293B] border-b border-[#0F172A]/10 text-white py-5 px-6 shadow-sm sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <span className="text-sm font-extrabold tracking-tight uppercase">
            {portfolio?.title ? portfolio.title.slice(0, 18) + (portfolio.title.length > 18 ? '...' : '') : 'Portfolio'}
          </span>
          <div className="flex gap-4 text-xs font-bold text-slate-300">
            {isEnabled('about') && <span className="hover:text-white cursor-pointer select-none">About</span>}
            {isEnabled('skills') && <span className="hover:text-white cursor-pointer select-none">Skills</span>}
            {isEnabled('projects') && <span className="hover:text-white cursor-pointer select-none font-black text-sky-400">Projects</span>}
            {isEnabled('contact') && <span className="hover:text-white cursor-pointer select-none">Contact</span>}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-16">
        {/* Pro Header bannercard */}
        <header className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          {profilePic ? (
            <img src={profilePic} alt="Avatar" className="w-[110px] h-[110px] rounded-full object-cover border-4 border-slate-100 shadow-md shrink-0" />
          ) : (
            <div className="w-[110px] h-[110px] rounded-full bg-slate-100 border-2 border-slate-205 flex items-center justify-center text-4xl shrink-0 text-slate-400">💼</div>
          )}
          <div className="text-center sm:text-left space-y-2">
            <span className="inline-block text-[9px] font-black tracking-wider text-sky-600 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-150 uppercase">Corporate Associate</span>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{getVal('hero', 'title', portfolio?.title || `${userObj.fullName || 'User'} Portfolio`)}</h1>
            <p className="text-sm font-bold text-slate-500">{getVal('hero', 'subtitle', portfolio?.tagline || profileDetails?.headline || 'Consulting Specialist')}</p>
          </div>
        </header>

        {/* Dynamic Sections Loop */}
        {sectionsToShow
          .filter((sec: any) => {
            const secId = sec.id || sec;
            const enabled = sec.enabled !== undefined ? sec.enabled : true;
            if (!enabled) return false;
            const validIds = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'certifications', 'contact'];
            return validIds.includes(secId) || secId?.startsWith('custom_');
          })
          .map((sec: any) => {
            const secId = sec.id || sec;
            switch (secId) {
            case 'hero':
              return (
                <section key="hero" className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-4">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#1E293B] border-l-4 border-sky-500 pl-2.5">Executive Summary</h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">{getVal('hero', 'description', portfolio?.description || profileDetails?.about_me || 'Professional statement description.')}</p>
                </section>
              );
            case 'about':
              return (
                <section key="about" className="space-y-4">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#1E293B] border-l-4 border-sky-500 pl-2.5">Professional Profile</h3>
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
                    <p className="text-sm text-slate-600 leading-relaxed">{getVal('about', 'text', profileDetails?.about_me || 'About section content goes here.')}</p>
                    <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-600 pt-2 border-t border-slate-100">
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase">Office Location</span>
                        <p className="text-slate-800 mt-1">{portfolio?.location || profileDetails?.location || 'Not set'}</p>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase">Primary Language</span>
                        <p className="text-slate-800 mt-1">{portfolio?.language || 'English'}</p>
                      </div>
                    </div>
                  </div>
                </section>
              );
            case 'skills':
              return (
                <section key="skills" className="space-y-4">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#1E293B] border-l-4 border-sky-500 pl-2.5">Technical Competencies</h3>
                  <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
                    <p className="text-xs text-slate-400 italic">{getVal('skills', 'description', 'Corporate stack, credentials, and framework knowledge:')}</p>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(profileDetails?.tech_skills) && profileDetails.tech_skills.length > 0 ? (
                        profileDetails.tech_skills.map((skill: string, idx: number) => (
                          <span key={`tech-${skill}-${idx}`} className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg">{skill}</span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 font-sans">No technical stack recorded.</span>
                      )}
                      {Array.isArray(profileDetails?.tools) && profileDetails.tools.map((tool: string, idx: number) => (
                        <span key={`tool-${tool}-${idx}`} className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 text-xs text-slate-500 rounded-lg">{tool}</span>
                      ))}
                    </div>
                  </div>
                </section>
              );
            case 'projects':
              return (
                <section key="projects" className="space-y-4">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#1E293B] border-l-4 border-sky-500 pl-2.5">Key Deliverables</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {projectsList.length > 0 ? (
                      projectsList.map((project, index) => (
                        <div key={project.id || `proj-${index}`} className="bg-white border border-slate-200 hover:border-sky-500 hover:shadow-md rounded-2xl p-5 space-y-3 transition-all flex flex-col justify-between">
                          <div className="space-y-2">
                            <h4 className="text-sm font-black text-slate-900 leading-snug">{project.title}</h4>
                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{project.description}</p>
                          </div>
                          {project.projectUrl && (
                            <a href={project.projectUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-sky-600 hover:text-sky-700 mt-2 flex items-center gap-1">
                              View Resource ➔
                            </a>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl text-xs text-slate-400 text-center col-span-2">No key projects highlighted.</div>
                    )}
                  </div>
                </section>
              );
            case 'experience':
              return (
                <section key="experience" className="space-y-4">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#1E293B] border-l-4 border-sky-500 pl-2.5">Tenure Timeline</h3>
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{profileDetails?.current_job_role || profileDetails?.current_role || 'Management Consultant'}</h4>
                        <p className="text-xs text-slate-500 mt-1">{profileDetails?.company || 'Corporate Enterprise Inc.'}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="inline-block text-[10px] font-black bg-sky-50 text-sky-700 border border-sky-100 rounded px-2.5 py-0.5">{profileDetails?.experience_years || '1-3'} Years Tenure</span>
                        <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{profileDetails?.employment_type || 'Full-time'}</p>
                      </div>
                    </div>
                  </div>
                </section>
              );
            case 'education':
              return (
                <section key="education" className="space-y-4">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#1E293B] border-l-4 border-sky-500 pl-2.5">Educational Profile</h3>
                  <div className="space-y-3">
                    {educationList.length > 0 ? (
                      educationList.map((edu, index) => (
                        <div key={edu.id || `edu-${index}`} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div>
                            <h4 className="text-xs font-black text-slate-900">{edu.degree} in {edu.fieldOfStudy}</h4>
                            <p className="text-[11px] text-slate-500 mt-1">{edu.school}</p>
                          </div>
                          <div className="text-left sm:text-right shrink-0">
                            <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-3 py-1 rounded-full border border-slate-200">{edu.startYear} - {edu.endYear}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl text-xs text-slate-400 text-center">No academic credentials registered yet.</div>
                    )}
                  </div>
                </section>
              );
            case 'certifications':
              return (
                <section key="certifications" className="space-y-4">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#1E293B] border-l-4 border-sky-500 pl-2.5">Certifications</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.isArray(profileDetails?.certifications) && profileDetails.certifications.length > 0 ? (
                      profileDetails.certifications.map((c: any, index: number) => (
                        <div key={`cert-${index}`} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-3">
                          <div className="text-xl">🏆</div>
                          <div>
                            <h4 className="text-xs font-black text-slate-900">{c.name || c}</h4>
                            <p className="text-[9px] text-sky-600 mt-0.5">{c.issuer || 'Online Certification'}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-white border border-slate-200 p-6 rounded-2xl text-xs text-slate-400 text-center col-span-2">No certifications added yet.</div>
                    )}
                  </div>
                </section>
              );
            case 'contact':
              return (
                <section key="contact" className="space-y-4">
                  <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#1E293B] border-l-4 border-sky-500 pl-2.5">Request Consultation</h3>
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 space-y-4 max-w-lg shadow-sm">
                    <p className="text-xs text-slate-500">{getVal('contact', 'prompt', 'Please input your details to schedule a professional consultation:')}</p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input disabled type="text" placeholder="Full Name" className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none" />
                        <input disabled type="email" placeholder="Email Address" className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none" />
                      </div>
                      <textarea disabled rows={3} placeholder="Brief details regarding consult topic..." className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none resize-none" />
                      <button disabled className="w-full py-2 bg-[#1E293B] hover:bg-slate-800 text-white font-bold text-xs rounded-lg uppercase tracking-wider transition-colors shadow-sm">
                        Submit Schedule Request
                      </button>
                    </div>
                  </div>
                </section>
              );
            default:
              if (secId?.startsWith('custom_')) {
                const customText = customData[secId]?.text || sec.description || '';
                return (
                  <section key={secId} className="space-y-4">
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#1E293B] border-l-4 border-sky-500 pl-2.5">{sec.name || 'Custom Section'}</h3>
                    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{customText}</p>
                    </div>
                  </section>
                );
              }
              return null;
          }
        })}
      </div>
    </div>
  );
}
