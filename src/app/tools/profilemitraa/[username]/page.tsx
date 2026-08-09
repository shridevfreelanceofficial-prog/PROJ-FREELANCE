/* eslint-disable @next/next/no-img-element */
import { neon } from '@neondatabase/serverless';
import { notFound } from 'next/navigation';

interface Education { id: string; degree: string; fieldOfStudy: string; school: string; startYear: string; endYear: string; }
interface Project { id: string; title: string; description: string; projectUrl?: string; technologies?: string; }

async function getPortfolioData(slug: string) {
  try {
    const dbUrl = process.env.NEON_DATABASE_URL;
    if (!dbUrl) {
      console.error('[getPortfolioData ERROR] NEON_DATABASE_URL is missing!');
      return null;
    }
    const sql = neon(dbUrl);

    // Look up portfolio by slug directly
    const portfolios = await sql`SELECT * FROM profilemitraa_portfolios WHERE slug = ${slug} LIMIT 1`;
    console.log('[getPortfolioData] portfolios for slug', slug, ':', portfolios.length);
    if (!portfolios.length) return null;
    const portfolio = portfolios[0];
    console.log('[getPortfolioData] portfolio status:', portfolio.status);
    if (portfolio.status !== 'published') return null;

    const userId = portfolio.user_id;

    // Load user
    const users = await sql`SELECT id, username, full_name FROM profilemitraa_users WHERE id = ${userId} LIMIT 1`;
    if (!users.length) return null;

    // Load profile
    const profiles = await sql`SELECT * FROM profilemitraa_profiles WHERE user_id = ${userId} LIMIT 1`;
    const profile = profiles[0] || {};

    // Load education and projects from profile JSONB fields
    const rawEducation = Array.isArray(profile.education)
      ? profile.education
      : (typeof profile.education === 'string'
          ? JSON.parse(profile.education || '[]')
          : []);

    const rawProjects = Array.isArray(profile.projects)
      ? profile.projects
      : (typeof profile.projects === 'string'
          ? JSON.parse(profile.projects || '[]')
          : []);

    const educationData = rawEducation.map((e: any, index: number) => ({
      id: e.id || String(index),
      degree: e.degree || '',
      fieldOfStudy: e.fieldOfStudy || e.field_of_study || '',
      school: e.school || '',
      startYear: e.startYear || e.start_year || '',
      endYear: e.endYear || e.end_year || e.year || '',
    })) as Education[];

    const projectsData = rawProjects.map((p: any, index: number) => ({
      id: p.id || String(index),
      title: p.title || '',
      description: p.description || '',
      projectUrl: p.projectUrl || p.project_url || p.link || '',
      technologies: p.technologies || '',
    })) as Project[];

    return {
      user: users[0],
      profile,
      portfolio,
      education: educationData,
      projects: projectsData,
    };
  } catch (err: any) {
    console.error('[getPortfolioData EXCEPTION]:', err?.message || err);
    return null;
  }
}

export default async function PublicPortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;
  console.log('[DEBUG PublicPortfolioPage] resolvedParams:', JSON.stringify(resolvedParams));
  const { username } = resolvedParams;
  const data = await getPortfolioData(username);
  console.log('[DEBUG PublicPortfolioPage] data:', data ? 'FOUND' : 'NOT_FOUND', 'for username/slug:', username);
  if (!data) return notFound();

  const { user, profile, portfolio, education, projects } = data;
  const themeKey = portfolio.design_theme || 'minimal_dark';
  const rawSections = typeof portfolio.sections === 'string' ? JSON.parse(portfolio.sections || '[]') : (portfolio.sections || []);
  const sectionsArr: any[] = Array.isArray(rawSections) ? rawSections : [];
  const customData = typeof portfolio.customized_data === 'string' ? JSON.parse(portfolio.customized_data || '{}') : (portfolio.customized_data || {});

  const isEnabled = (secId: string) => {
    const s = sectionsArr.find((item) => (item?.id || item) === secId);
    return s ? s.enabled : false;
  };

  const getVal = (section: string, field: string, fallback: string) => {
    if (customData[section]?.[field]) return customData[section][field];
    return fallback;
  };

  const profilePic = portfolio.profile_image_url || profile.profile_photo_url || '';
  const techSkills: string[] = Array.isArray(profile.tech_skills) ? profile.tech_skills : [];
  const tools: string[] = Array.isArray(profile.tools) ? profile.tools : [];
  const softSkills: string[] = Array.isArray(profile.soft_skills) ? profile.soft_skills : [];

  // ── TEMPLATE 1: Tech Minimalist (Dark) ──────────────────────────────────
  if (themeKey === 'minimal_dark') {
    return (
      <div className="min-h-screen bg-[#070C14] text-[#E2E8F0] font-mono selection:bg-[#10B981]/30 pb-24">
        <style>{`
          body { background-color: #070C14; font-family: 'JetBrains Mono', 'Fira Code', monospace; }
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Inter:wght@400;500;700;900&display=swap');
          .glow-green { box-shadow: 0 0 28px rgba(16,185,129,0.3), 0 0 60px rgba(16,185,129,0.1); }
          .tag-item { transition: all 200ms ease; }
          .tag-item:hover { border-color: #10B981; color: #34D399; box-shadow: 0 0 10px rgba(16,185,129,0.25); }
        `}</style>

        {/* Ambient glow decorations */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Nav */}
        <nav className="sticky top-0 z-30 bg-[#070C14]/90 backdrop-blur-md border-b border-emerald-500/10 px-6 py-4 flex items-center justify-between">
          <span className="text-xs font-bold text-[#10B981] tracking-[0.25em] uppercase">{user.full_name || user.username}</span>
          <div className="flex gap-5 text-[11px] text-slate-400 font-bold tracking-wider flex-wrap">
            {sectionsArr.filter((sec: any) => sec.enabled && sec.id !== 'hero').map((sec: any) => (
              <a key={sec.id} href={`#${sec.id}`} className="hover:text-[#10B981] transition-colors uppercase">{sec.name?.toUpperCase().replace(' ME', '').replace('FORM', '').slice(0, 15)}</a>
            ))}
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 pt-16 space-y-20">
          {/* Header Section */}
          <header className="flex flex-col sm:flex-row items-center gap-6 border-b border-emerald-500/20 pb-8">
            {profilePic ? (
              <img src={profilePic} alt="Avatar" className="w-[100px] h-[100px] rounded-lg object-cover border-2 border-[#10B981] shadow-lg shadow-emerald-500/25 shrink-0" />
            ) : (
              <div className="w-[100px] h-[100px] rounded-lg bg-[#0F172A] border-2 border-dashed border-[#10B981] flex items-center justify-center text-4xl shrink-0">💻</div>
            )}
            <div className="text-center sm:text-left space-y-2">
              <span className="text-[10px] font-bold text-[#10B981] tracking-widest uppercase bg-[#10B981]/15 px-2.5 py-0.5 rounded border border-[#10B981]/30">Active Developer Mode</span>
              <h1 className="text-3xl font-black tracking-tight text-white">{getVal('hero', 'title', portfolio.title || user.full_name || user.username)}</h1>
              <p className="text-xs text-[#10B981] font-bold">&gt; {getVal('hero', 'subtitle', portfolio.tagline || profile.headline || 'Creative Engineer')}</p>
            </div>
          </header>

          {/* Dynamic Sections Loop */}
          {sectionsArr.map((sec: any) => {
            const secId = sec.id || sec;
            const enabled = sec.enabled !== undefined ? sec.enabled : true;
            if (!enabled) return null;

            switch (secId) {
              case 'hero':
                return (
                  <section id="hero" key="hero" className="space-y-4 bg-[#0A111E] border border-emerald-500/10 rounded-xl p-6 shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#10B981]" />
                    <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#10B981] flex items-center gap-1.5">
                      <span>⚡</span> SYSTEM._INTRO
                    </h3>
                    <p className="text-sm text-slate-350 leading-relaxed font-sans">{getVal('hero', 'description', portfolio.description || profile.about_me || '')}</p>
                    {isEnabled('contact') && (
                      <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white text-xs font-black rounded-lg transition-all tracking-widest uppercase">
                        INITIATE CONTACT ▶
                      </a>
                    )}
                  </section>
                );
              case 'about':
                return (
                  <section id="about" key="about" className="space-y-5">
                    <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2 font-mono">
                      <span className="w-6 h-px bg-[#10B981]" /> ABOUT_ME.md
                    </h2>
                    <div className="bg-[#0A111E] border border-[#10B981]/15 rounded-xl p-6 space-y-4 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-px bg-[#10B981]" />
                      <p className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">{getVal('about', 'text', profile.about_me || portfolio.description || '')}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
                        <div><span className="text-[#10B981]">LOC:</span><p className="text-slate-300 mt-0.5">{portfolio.location || profile.location || 'Remote'}</p></div>
                        <div><span className="text-[#10B981]">LNG:</span><p className="text-slate-300 mt-0.5">{portfolio.language || 'English'}</p></div>
                        <div><span className="text-[#10B981]">EXP:</span><p className="text-slate-300 mt-0.5">{profile.experience_years || 'N/A'} yrs</p></div>
                        <div><span className="text-[#10B981]">TYPE:</span><p className="text-slate-300 mt-0.5">{profile.employment_type || 'Full-time'}</p></div>
                      </div>
                    </div>
                  </section>
                );
              case 'skills':
                return (
                  <section id="skills" key="skills" className="space-y-5">
                    <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2 font-mono">
                      <span className="w-6 h-px bg-[#10B981]" /> TECH_STACK.json
                    </h2>
                    <p className="text-xs text-slate-500 font-sans italic">{getVal('skills', 'description', 'Technologies, frameworks, and tools I work with professionally:')}</p>
                    <div className="space-y-4">
                      {techSkills.length > 0 && (
                        <div>
                          <span className="text-[9px] text-[#10B981] font-black tracking-widest uppercase mb-2 block font-mono">LANGUAGES & FRAMEWORKS</span>
                          <div className="flex flex-wrap gap-2">
                            {techSkills.map((skill) => (
                              <span key={skill} className="tag-item px-3 py-1.5 bg-[#10B981]/5 border border-[#10B981]/25 rounded text-xs font-bold text-[#34D399]">{skill}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {tools.length > 0 && (
                        <div>
                          <span className="text-[9px] text-slate-500 font-black tracking-widest uppercase mb-2 block font-mono">TOOLS & PLATFORMS</span>
                          <div className="flex flex-wrap gap-2">
                            {tools.map((tool) => (
                              <span key={tool} className="tag-item px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400">{tool}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                );
              case 'projects':
                return (
                  <section id="projects" key="projects" className="space-y-5">
                    <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2 font-mono">
                      <span className="w-6 h-px bg-[#10B981]" /> PROJECTS.log
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {projects.length > 0 ? projects.map((project) => (
                        <div key={project.id} className="bg-[#0A111E] border border-slate-800 hover:border-[#10B981]/40 rounded-xl p-5 space-y-3 transition-all group">
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-black text-white font-mono group-hover:text-[#10B981] transition-colors">{project.title}</h3>
                            {project.projectUrl && (
                              <a href={project.projectUrl} target="_blank" rel="noreferrer" className="text-[10px] text-[#10B981] font-mono hover:underline shrink-0 ml-2">URL ▶</a>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed font-sans line-clamp-3">{project.description}</p>
                          {project.technologies && (
                            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                              {project.technologies.split(',').map((t) => (
                                <span key={t} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] font-mono text-slate-500">{t.trim()}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )) : (
                        <div className="col-span-2 bg-[#0A111E] border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-500 font-sans">
                          No projects have been published yet.
                        </div>
                      )}
                    </div>
                  </section>
                );
              case 'experience':
                return (
                  <section id="experience" key="experience" className="space-y-5">
                    <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2 font-mono">
                      <span className="w-6 h-px bg-[#10B981]" /> WORK_HISTORY.csv
                    </h2>
                    <div className="bg-[#0A111E] border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row justify-between gap-4 font-sans">
                      <div>
                        <h3 className="text-sm font-black text-white font-mono">{profile.current_job_role || profile.current_role || 'Software Engineer'}</h3>
                        <p className="text-xs text-slate-400 mt-1">{profile.company || 'Freelance / Open Source'}</p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="inline-block text-[10px] font-bold bg-[#10B981]/10 text-[#34D399] px-3 py-1 rounded border border-[#10B981]/20">{profile.experience_years || 'N/A'} Years</span>
                        <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-mono">{profile.employment_type || 'Full-time'}</p>
                      </div>
                    </div>
                  </section>
                );
              case 'education':
                return (
                  <section id="education" key="education" className="space-y-5">
                    <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2 font-mono">
                      <span className="w-6 h-px bg-[#10B981]" /> ACADEMIC_LOG.db
                    </h2>
                    <div className="space-y-3">
                      {education.length > 0 ? education.map((edu) => (
                        <div key={edu.id} className="bg-[#0A111E] border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-3 sm:items-center font-sans">
                          <div>
                            <h3 className="text-xs font-black text-white">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</h3>
                            <p className="text-[11px] text-slate-400 mt-1">{edu.school}</p>
                          </div>
                          <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1 rounded font-mono shrink-0">
                            {edu.startYear && edu.endYear ? `${edu.startYear} – ${edu.endYear}` : (edu.endYear || edu.startYear || '')}
                          </span>
                        </div>
                      )) : (
                        <p className="text-xs text-slate-500 font-sans p-4 bg-[#0A111E] rounded-xl border border-slate-800">No education records added yet.</p>
                      )}
                    </div>
                  </section>
                );
              case 'certifications':
                return (
                  <section id="certifications" key="certifications" className="space-y-5">
                    <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2 font-mono">
                      <span className="w-6 h-px bg-[#10B981]" /> VERIFIED_CERTS.x509
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Array.isArray(profile.certifications) && profile.certifications.length > 0 ? profile.certifications.map((c: any, index: number) => (
                        <div key={index} className="bg-[#0A111E] border border-slate-800 rounded-xl p-4 flex items-center gap-3 font-sans">
                          <span className="text-xl shrink-0">🏆</span>
                          <div>
                            <p className="text-xs font-black text-white">{c.name || c}</p>
                            <p className="text-[9px] text-[#10B981] font-mono mt-0.5">{c.issuer || 'Online Certification'}</p>
                          </div>
                        </div>
                      )) : (
                        <p className="text-xs text-slate-500 font-sans p-4 bg-[#0A111E] rounded-xl border border-slate-800 col-span-2">No certificates found.</p>
                      )}
                    </div>
                  </section>
                );
              case 'contact':
                return (
                  <section id="contact" key="contact" className="space-y-5">
                    <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2 font-mono">
                      <span className="w-6 h-px bg-[#10B981]" /> ESTABLISH_CONTACT.sh
                    </h2>
                    <p className="text-xs text-slate-400 font-sans">{getVal('contact', 'prompt', 'Input parameters below to initiate collaboration or send a message:')}</p>
                    <div className="bg-[#0A111E] border border-slate-800 rounded-xl p-6 space-y-4 max-w-lg font-sans">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 font-mono uppercase">Name</label>
                          <input type="text" placeholder="Your Name" className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#10B981]" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] text-slate-500 font-mono uppercase">Email</label>
                          <input type="email" placeholder="your@email.com" className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#10B981]" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-slate-500 font-mono uppercase">Message</label>
                        <textarea rows={4} placeholder="Tell me about your project or collaboration idea..." className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#10B981] resize-none" />
                      </div>
                      <button className="w-full py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white font-mono text-xs font-black rounded-lg transition-colors uppercase tracking-widest">
                        EXECUTE._SEND()
                      </button>
                    </div>
                  </section>
                );
              default:
                if (secId?.startsWith('custom_')) {
                  const customText = customData[secId]?.text || sec.description || '';
                  return (
                    <section id={secId} key={secId} className="space-y-5">
                      <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2 font-mono">
                        <span className="w-6 h-px bg-[#10B981]" /> {sec.name ? `${sec.name.replace(/\s+/g, '_').toUpperCase()}.txt` : 'CUSTOM_SECTION.txt'}
                      </h2>
                      <div className="bg-[#0A111E] border border-emerald-500/10 rounded-xl p-6 relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-[#10B981]" />
                        <p className="text-sm text-slate-305 leading-relaxed font-sans whitespace-pre-wrap">{customText}</p>
                      </div>
                    </section>
                  );
                }
                return null;
            }
          })}
        </div>

        <footer className="mt-24 border-t border-slate-800/50 py-6 text-center">
          <p className="text-[10px] font-mono text-slate-600">Built with <span className="text-[#10B981]">ProfileMitraa</span> &bull; {user.full_name || user.username}</p>
        </footer>
      </div>
    );
  }

  // ── TEMPLATE 2: Creative Glassmorphism ──────────────────────────────────
  if (themeKey === 'creative_glass') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#3B0764] to-[#881337] text-white font-sans pb-24 relative overflow-x-hidden">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;900&family=Playfair+Display:wght@700;900&display=swap');
          body { font-family: 'Outfit', sans-serif; }
          .glass { background: rgba(255,255,255,0.06); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.12); }
          .glass-hover:hover { background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.22); }
        `}</style>

        {/* Fluid blob decorations */}
        <div className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-rose-600/20 blur-[120px] pointer-events-none" />
        <div className="fixed top-1/2 left-0 w-[300px] h-[300px] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

        {/* Nav */}
        <nav className="sticky top-0 z-30 glass border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <span className="text-sm font-black tracking-tight bg-gradient-to-r from-violet-300 to-rose-300 bg-clip-text text-transparent">{user.full_name || user.username}</span>
          <div className="flex gap-5 text-xs text-white/60 font-semibold flex-wrap">
            {sectionsArr.filter((sec: any) => sec.enabled && sec.id !== 'hero').map((sec: any) => (
              <a key={sec.id} href={`#${sec.id}`} className="hover:text-white transition-colors capitalize">{sec.name?.replace(' Me', '').replace('Form', '').slice(0, 15)}</a>
            ))}
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 pt-16 space-y-16 relative z-10">
          {/* Hero Header */}
          <header className="text-center flex flex-col items-center space-y-6">
            {profilePic ? (
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-500 to-rose-500 blur-xl opacity-60 scale-110" />
                <img src={profilePic} alt={user.full_name} className="relative w-32 h-32 rounded-full object-cover border-2 border-white/30 shadow-2xl" />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full glass flex items-center justify-center text-5xl">🎨</div>
            )}
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-widest text-rose-300 uppercase bg-rose-500/20 px-4 py-1.5 rounded-full border border-rose-400/25">Creative Portfolio</span>
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>
                {getVal('hero', 'title', portfolio.title || user.full_name || user.username)}
              </h1>
              <p className="text-base text-white/70 font-semibold">{getVal('hero', 'subtitle', portfolio.tagline || profile.headline || 'Creative Professional')}</p>
            </div>
            {isEnabled('contact') && (
              <a href="#contact" className="px-8 py-3 bg-gradient-to-r from-violet-500 to-rose-500 hover:from-violet-600 hover:to-rose-600 text-white font-black text-sm rounded-2xl transition-all shadow-xl shadow-rose-900/30 uppercase tracking-widest">
                Let&apos;s Collaborate ✦
              </a>
            )}
          </header>

          {/* Dynamic Sections Loop */}
          {sectionsArr.map((sec: any) => {
            const secId = sec.id || sec;
            const enabled = sec.enabled !== undefined ? sec.enabled : true;
            if (!enabled) return null;

            switch (secId) {
              case 'hero':
                return (
                  <section id="hero" key="hero" className="space-y-4">
                    <p className="text-sm text-white/60 leading-relaxed font-light text-center max-w-lg mx-auto">{getVal('hero', 'description', portfolio.description || profile.about_me || '')}</p>
                  </section>
                );
              case 'about':
                return (
                  <section id="about" key="about" className="space-y-5">
                    <h2 className="text-sm font-black text-rose-300 uppercase tracking-widest flex items-center gap-2">
                      <span className="text-violet-400">✦</span> About
                    </h2>
                    <div className="glass rounded-3xl p-7 space-y-5">
                      <p className="text-sm text-white/75 leading-relaxed font-light whitespace-pre-wrap">{getVal('about', 'text', profile.about_me || portfolio.description || '')}</p>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs font-semibold">
                        <div className="glass rounded-2xl p-4"><span className="text-white/40 block mb-1">Location</span><span className="text-white">{portfolio.location || profile.location || 'Remote'}</span></div>
                        <div className="glass rounded-2xl p-4"><span className="text-white/40 block mb-1">Experience</span><span className="text-white">{profile.experience_years || 'N/A'} Years</span></div>
                      </div>
                    </div>
                  </section>
                );
              case 'skills':
                return (
                  <section id="skills" key="skills" className="space-y-5">
                    <h2 className="text-sm font-black text-rose-300 uppercase tracking-widest flex items-center gap-2">
                      <span className="text-violet-400">✦</span> Skillsets
                    </h2>
                    <div className="glass rounded-3xl p-7 space-y-5">
                      <p className="text-xs text-white/50 font-light italic">{getVal('skills', 'description', 'Creative technologies and design systems I specialise in:')}</p>
                      <div className="flex flex-wrap gap-2">
                        {techSkills.map((skill) => (
                          <span key={skill} className="px-4 py-2 rounded-full bg-violet-500/20 border border-violet-400/25 text-xs font-bold text-violet-200 hover:bg-violet-500/30 transition-all">{skill}</span>
                        ))}
                        {tools.map((tool) => (
                          <span key={tool} className="px-4 py-2 rounded-full bg-rose-500/15 border border-rose-400/20 text-xs text-rose-200">{tool}</span>
                        ))}
                        {softSkills.map((s) => (
                          <span key={s} className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/15 text-xs text-amber-200">{s}</span>
                        ))}
                      </div>
                    </div>
                  </section>
                );
              case 'projects':
                return (
                  <section id="projects" key="projects" className="space-y-5">
                    <h2 className="text-sm font-black text-rose-300 uppercase tracking-widest flex items-center gap-2">
                      <span className="text-violet-400">✦</span> Selected Works
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {projects.length > 0 ? projects.map((project) => (
                        <div key={project.id} className="glass glass-hover rounded-3xl p-6 space-y-3 transition-all group cursor-default">
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-black text-white uppercase tracking-wide group-hover:text-rose-300 transition-colors">{project.title}</h3>
                            {project.projectUrl && (
                              <a href={project.projectUrl} target="_blank" rel="noreferrer" className="text-[10px] text-rose-300 hover:underline shrink-0 ml-2">View ↗</a>
                            )}
                          </div>
                          <p className="text-xs text-white/55 leading-relaxed font-light line-clamp-3">{project.description}</p>
                          {project.technologies && (
                            <div className="flex flex-wrap gap-1.5 pt-2">
                              {project.technologies.split(',').map((t) => (
                                <span key={t} className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-semibold text-white/60">{t.trim()}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      )) : (
                        <div className="col-span-2 glass rounded-3xl p-8 text-center text-xs text-white/40">No works published yet.</div>
                      )}
                    </div>
                  </section>
                );
              case 'experience':
                return (
                  <section id="experience" key="experience" className="space-y-5">
                    <h2 className="text-sm font-black text-rose-300 uppercase tracking-widest flex items-center gap-2">
                      <span className="text-violet-400">✦</span> Tenure
                    </h2>
                    <div className="glass rounded-3xl p-7 flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <h3 className="text-sm font-black text-white">{profile.current_job_role || profile.current_role || 'Creative Director'}</h3>
                        <p className="text-xs text-white/50 mt-1">{profile.company || 'Freelance Creative Studio'}</p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="inline-block text-[10px] font-bold bg-violet-600/30 text-violet-300 px-3 py-1.5 rounded-full border border-violet-500/20">{profile.experience_years || 'N/A'} Years Exp</span>
                        <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">{profile.employment_type || 'Full-time'}</p>
                      </div>
                    </div>
                  </section>
                );
              case 'education':
                return (
                  <section id="education" key="education" className="space-y-5">
                    <h2 className="text-sm font-black text-rose-300 uppercase tracking-widest flex items-center gap-2">
                      <span className="text-violet-400">✦</span> Credentials
                    </h2>
                    <div className="space-y-3">
                      {education.length > 0 ? education.map((edu) => (
                        <div key={edu.id} className="glass rounded-3xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                          <div>
                            <h3 className="text-xs font-black text-white uppercase tracking-wide">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</h3>
                            <p className="text-[11px] text-white/50 mt-1">{edu.school}</p>
                          </div>
                          <span className="text-[10px] glass px-3 py-1 rounded-full text-white/60 shrink-0">
                            {edu.startYear && edu.endYear ? `${edu.startYear} – ${edu.endYear}` : (edu.endYear || edu.startYear || '')}
                          </span>
                        </div>
                      )) : <p className="glass rounded-3xl p-6 text-xs text-white/40 text-center">No credentials registered yet.</p>}
                    </div>
                  </section>
                );
              case 'certifications':
                return (
                  <section id="certifications" key="certifications" className="space-y-5">
                    <h2 className="text-sm font-black text-rose-300 uppercase tracking-widest flex items-center gap-2">
                      <span className="text-violet-400">✦</span> Certifications
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Array.isArray(profile.certifications) && profile.certifications.length > 0 ? profile.certifications.map((c: any, index: number) => (
                        <div key={index} className="glass rounded-3xl p-4 flex items-center gap-3">
                          <span className="text-xl shrink-0">🏆</span>
                          <div>
                            <p className="text-xs font-black text-white">{c.name || c}</p>
                            <p className="text-[9px] text-rose-300 mt-0.5">{c.issuer || 'Professional Certification'}</p>
                          </div>
                        </div>
                      )) : <p className="glass rounded-3xl p-6 text-xs text-white/40 text-center col-span-2">No certifications listed yet.</p>}
                    </div>
                  </section>
                );
              case 'contact':
                return (
                  <section id="contact" key="contact" className="space-y-5">
                    <h2 className="text-sm font-black text-rose-300 uppercase tracking-widest flex items-center gap-2">
                      <span className="text-violet-400">✦</span> Contact
                    </h2>
                    <div className="glass rounded-3xl p-7 space-y-4 max-w-lg">
                      <p className="text-xs text-white/50 font-light">{getVal('contact', 'prompt', "Let's connect and co-create something extraordinary:")}</p>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="Your Name" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
                          <input type="email" placeholder="Email Address" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
                        </div>
                        <textarea rows={4} placeholder="Tell me about your project..." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 resize-none" />
                        <button className="w-full py-3 bg-gradient-to-r from-violet-500 to-rose-500 hover:from-violet-600 hover:to-rose-600 text-white font-black text-xs rounded-2xl shadow-lg uppercase tracking-widest transition-all">
                          Send Message ✦
                        </button>
                      </div>
                    </div>
                  </section>
                );
              default:
                if (secId?.startsWith('custom_')) {
                  const customText = customData[secId]?.text || sec.description || '';
                  return (
                    <section id={secId} key={secId} className="space-y-5">
                      <h2 className="text-sm font-black text-rose-300 uppercase tracking-widest flex items-center gap-2">
                        <span className="text-violet-400">✦</span> {sec.name || 'Custom Section'}
                      </h2>
                      <div className="glass rounded-3xl p-7">
                        <p className="text-sm text-white/75 leading-relaxed font-light whitespace-pre-wrap">{customText}</p>
                      </div>
                    </section>
                  );
                }
                return null;
            }
          })}
        </div>

        <footer className="mt-24 border-t border-white/10 py-6 text-center">
          <p className="text-xs text-white/30">Crafted with <span className="text-rose-400">ProfileMitraa</span> &bull; {user.full_name || user.username}</p>
        </footer>
      </div>
    );
  }

  // ── TEMPLATE 3: Corporate Blue (Default) ───────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #F8FAFC; }
      `}</style>

      {/* Nav */}
      <nav className="bg-[#1E293B] sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-lg">
        <span className="text-sm font-black text-white tracking-tight">{user.full_name || user.username}</span>
        <div className="flex gap-6 text-xs text-slate-400 font-semibold flex-wrap">
          {sectionsArr.filter((sec: any) => sec.enabled && sec.id !== 'hero').map((sec: any) => (
            <a key={sec.id} href={`#${sec.id}`} className="hover:text-white transition-colors capitalize">{sec.name?.replace(' Me', '').replace('Form', '').slice(0, 15)}</a>
          ))}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-14">
        {/* Hero Header */}
        <header className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col sm:flex-row items-center gap-8">
          {profilePic ? (
            <img src={profilePic} alt={user.full_name} className="w-32 h-32 rounded-full object-cover border-4 border-slate-100 shadow-lg shrink-0" />
          ) : (
            <div className="w-32 h-32 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-5xl shrink-0">💼</div>
          )}
          <div className="text-center sm:text-left space-y-3">
            <span className="inline-block text-[9px] font-black tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded border border-sky-200 uppercase">Professional Portfolio</span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{getVal('hero', 'title', portfolio.title || user.full_name || user.username)}</h1>
            <p className="text-sm font-bold text-slate-500">{getVal('hero', 'subtitle', portfolio.tagline || profile.headline || 'Business Consultant')}</p>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xl font-normal">{getVal('hero', 'description', portfolio.description || profile.about_me || '')}</p>
            {isEnabled('contact') && (
              <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E293B] hover:bg-slate-700 text-white text-xs font-black rounded-xl transition-all shadow-sm">
                Schedule Consultation →
              </a>
            )}
          </div>
        </header>

        {/* Dynamic Sections Loop */}
        {sectionsArr.map((sec: any) => {
          const secId = sec.id || sec;
          const enabled = sec.enabled !== undefined ? sec.enabled : true;
          if (!enabled) return null;

          switch (secId) {
            case 'hero':
              return null; // Already rendered in header above
            case 'about':
              return (
                <section id="about" key="about" className="space-y-4">
                  <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Professional Profile</h2>
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 space-y-5">
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{getVal('about', 'text', profile.about_me || portfolio.description || '')}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-600">
                      <div><span className="text-slate-400 uppercase text-[9px] block mb-1">Location</span>{portfolio.location || profile.location || 'Remote'}</div>
                      <div><span className="text-slate-400 uppercase text-[9px] block mb-1">Experience</span>{profile.experience_years || 'N/A'} Years</div>
                      <div><span className="text-slate-400 uppercase text-[9px] block mb-1">Employment</span>{profile.employment_type || 'Full-time'}</div>
                      <div><span className="text-slate-400 uppercase text-[9px] block mb-1">Language</span>{portfolio.language || 'English'}</div>
                    </div>
                  </div>
                </section>
              );
            case 'skills':
              return (
                <section id="skills" key="skills" className="space-y-4">
                  <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Technical Competencies</h2>
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 space-y-4">
                    <p className="text-xs text-slate-400 italic">{getVal('skills', 'description', 'Corporate stack and professional domain expertise:')}</p>
                    <div className="flex flex-wrap gap-2">
                      {techSkills.map((skill) => (
                        <span key={skill} className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg hover:border-sky-400 hover:text-sky-700 transition-all">{skill}</span>
                      ))}
                      {tools.map((tool) => (
                        <span key={tool} className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-500 rounded-lg">{tool}</span>
                      ))}
                    </div>
                  </div>
                </section>
              );
            case 'projects':
              return (
                <section id="projects" key="projects" className="space-y-4">
                  <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Key Deliverables</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {projects.length > 0 ? projects.map((project) => (
                      <div key={project.id} className="bg-white border border-slate-200 hover:border-sky-400 hover:shadow-md rounded-2xl p-6 space-y-3 transition-all flex flex-col">
                        <div>
                          <h3 className="text-sm font-black text-slate-900 leading-snug">{project.title}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-3">{project.description}</p>
                        </div>
                        {project.technologies && (
                          <div className="flex flex-wrap gap-1.5">
                            {project.technologies.split(',').map((t) => (
                              <span key={t} className="px-2 py-0.5 bg-sky-50 border border-sky-200 text-[9px] text-sky-700 rounded font-semibold">{t.trim()}</span>
                            ))}
                          </div>
                        )}
                        {project.projectUrl && (
                          <a href={project.projectUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 mt-auto">
                            View Resource →
                          </a>
                        )}
                      </div>
                    )) : (
                      <div className="col-span-2 bg-white border border-slate-200 p-8 rounded-2xl text-center text-xs text-slate-400">No key deliverables published yet.</div>
                    )}
                  </div>
                </section>
              );
            case 'experience':
              return (
                <section id="experience" key="experience" className="space-y-4">
                  <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Tenure Timeline</h2>
                  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-7 flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">{profile.current_job_role || profile.current_role || 'Senior Consultant'}</h3>
                      <p className="text-xs text-slate-500 mt-1">{profile.company || 'Corporate Enterprise Ltd.'}</p>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <span className="inline-block text-[10px] font-black bg-sky-50 text-sky-700 border border-sky-200 rounded px-3 py-1">{profile.experience_years || 'N/A'} Years</span>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{profile.employment_type || 'Full-time'}</p>
                    </div>
                  </div>
                </section>
              );
            case 'education':
              return (
                <section id="education" key="education" className="space-y-4">
                  <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Educational Background</h2>
                  <div className="space-y-3">
                    {education.length > 0 ? education.map((edu) => (
                      <div key={edu.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div>
                          <h3 className="text-xs font-black text-slate-900">{edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}</h3>
                          <p className="text-[11px] text-slate-500 mt-1">{edu.school}</p>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
                          {edu.startYear && edu.endYear ? `${edu.startYear} – ${edu.endYear}` : (edu.endYear || edu.startYear || '')}
                        </span>
                      </div>
                    )) : <div className="bg-white border border-slate-200 p-6 rounded-2xl text-xs text-slate-400 text-center">No academic credentials yet.</div>}
                  </div>
                </section>
              );
            case 'certifications':
              return (
                <section id="certifications" key="certifications" className="space-y-4">
                  <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Certifications</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Array.isArray(profile.certifications) && profile.certifications.length > 0 ? profile.certifications.map((c: any, i: number) => (
                      <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                        <span className="text-xl">🏆</span>
                        <div>
                          <p className="text-xs font-black text-slate-900">{c.name || c}</p>
                          <p className="text-[9px] text-sky-600 font-bold mt-0.5">{c.issuer || 'Professional Certification'}</p>
                        </div>
                      </div>
                    )) : <div className="col-span-2 bg-white border border-slate-200 p-6 rounded-2xl text-xs text-slate-400 text-center">No certifications listed yet.</div>}
                  </div>
                </section>
              );
            case 'contact':
              return (
                <section id="contact" key="contact" className="space-y-4">
                  <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Schedule a Consultation</h2>
                  <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-7 space-y-4 max-w-lg">
                    <p className="text-xs text-slate-500">{getVal('contact', 'prompt', 'Fill in your details below to request a professional consultation or enquiry:')}</p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input type="text" placeholder="Full Name" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-sky-400" />
                        <input type="email" placeholder="Email Address" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-sky-400" />
                      </div>
                      <textarea rows={4} placeholder="Briefly describe your requirements..." className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-sky-400 resize-none" />
                      <button className="w-full py-2.5 bg-[#1E293B] hover:bg-slate-700 text-white font-black text-xs rounded-xl uppercase tracking-widest transition-all shadow-sm">
                        Submit Request →
                      </button>
                    </div>
                  </div>
                </section>
              );
            default:
              if (secId?.startsWith('custom_')) {
                const customText = customData[secId]?.text || sec.description || '';
                return (
                  <section id={secId} key={secId} className="space-y-4">
                    <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-l-4 border-sky-500 pl-3">{sec.name || 'Custom Section'}</h2>
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7">
                      <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{customText}</p>
                    </div>
                  </section>
                );
              }
              return null;
          }
        })}
      </div>

      <footer className="mt-20 border-t border-slate-200 py-6 text-center bg-white">
        <p className="text-xs text-slate-400">Built with <span className="text-sky-600 font-bold">ProfileMitraa</span> &bull; {user.full_name || user.username}</p>
      </footer>
    </div>
  );
}
