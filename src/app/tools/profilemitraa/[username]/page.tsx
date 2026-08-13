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

  // Color Theme & Mode parameters
  const themeColor = customData.theme_color || '#10B981';
  const isLightMode = customData.theme_mode === 'light';
  
  // Hex to RGB helper
  let hexCode = (themeColor || '#10B981').replace('#', '');
  if (hexCode.length === 3) hexCode = hexCode.split('').map((x: string) => x + x).join('');
  const num = parseInt(hexCode, 16) || 0x10B981;
  const rgb = {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };

  // Images & Placement Shifting
  const heroPic = customData.hero_image_url || portfolio.profile_image_url || profile.profile_photo_url || '';
  const heroPos = customData.hero_image_position || 'left';

  const aboutPic = customData.about?.image_url || portfolio.profile_image_url || profile.profile_photo_url || '';
  const aboutPos = customData.about?.image_position || 'right';

  const defaultProjectBanner = customData.projects?.default_banner || '';

  const getHeroFlexClass = (pos: string) => {
    if (pos === 'right') return 'flex-col sm:flex-row-reverse text-center sm:text-right';
    if (pos === 'center') return 'flex-col text-center items-center justify-center';
    return 'flex-col sm:flex-row text-center sm:text-left';
  };

  const getAboutFlexClass = (pos: string) => {
    if (pos === 'left') return 'flex-col md:flex-row';
    if (pos === 'center') return 'flex-col text-center items-center';
    return 'flex-col md:flex-row-reverse';
  };

  // ── TEMPLATE 1: Tech Minimalist ──────────────────────────────────
  if (themeKey === 'minimal_dark') {
    const bgColor = isLightMode ? '#F8FAFC' : '#030712';
    const textColor = isLightMode ? '#0F172A' : '#E2E8F0';
    const cardBg = isLightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(10, 17, 30, 0.7)';
    const cardBorder = isLightMode ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)` : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;

    return (
      <div className="min-h-screen font-mono selection:bg-emerald-500/30 pb-24 relative overflow-x-hidden" style={{ backgroundColor: bgColor, color: textColor }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700;800&family=Inter:wght@300;400;500;700;950&display=swap');
          
          body { 
            background-color: ${bgColor}; 
            color: ${textColor};
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            overflow-x: hidden;
          }
          
          .cyber-grid {
            background-image: 
              linear-gradient(to right, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.04) 1px, transparent 1px);
            background-size: 30px 30px;
          }

          .led-pulse {
            box-shadow: 0 0 8px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8), 0 0 16px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4);
            animation: led-pulse-anim 2s infinite ease-in-out;
          }
          @keyframes led-pulse-anim {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(0.9); }
          }

          .tech-card {
            background: ${cardBg};
            border: 1px solid ${cardBorder};
            transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
          }
          .tech-card:hover {
            border-color: ${themeColor};
            box-shadow: 0 10px 30px -10px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2);
            transform: translateY(-2px);
          }

          .corner-brkt::before, .corner-brkt::after {
            content: '';
            position: absolute;
            width: 8px; height: 8px;
            border-color: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4);
            border-style: solid;
            transition: all 300ms ease;
            pointer-events: none;
          }
          .corner-brkt::before { top: -1px; left: -1px; border-width: 1px 0 0 1px; }
          .corner-brkt::after { bottom: -1px; right: -1px; border-width: 0 1px 1px 0; }
          .tech-card:hover .corner-brkt::before { border-color: ${themeColor}; width: 14px; height: 14px; }
          .tech-card:hover .corner-brkt::after { border-color: ${themeColor}; width: 14px; height: 14px; }

          .reveal-item {
            opacity: 0;
            transform: translateY(20px);
            animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes revealUp { to { opacity: 1; transform: translateY(0); } }
        `}</style>

        <div className="fixed inset-0 cyber-grid pointer-events-none z-0" />
        <div className="fixed -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none z-0 animate-pulse" style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`, animationDuration: '8s' }} />

        <div className="max-w-4xl mx-auto px-6 pt-16 space-y-20 relative z-10">
          <header className={`tech-card rounded-2xl p-8 flex items-center gap-8 relative overflow-hidden reveal-item ${getHeroFlexClass(heroPos)}`}>
            <div className="corner-brkt absolute inset-0" />
            {heroPic ? (
              <div className="relative group shrink-0">
                <div className="absolute inset-0 rounded-2xl blur-md opacity-70 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)` }} />
                <img src={heroPic} alt={user.full_name || 'Hero Avatar'} className="relative w-32 h-32 rounded-2xl object-cover border shadow-xl shrink-0 transition-transform group-hover:scale-105" style={{ borderColor: themeColor }} />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-2xl border border-dashed flex items-center justify-center text-4xl shrink-0 shadow-lg relative group" style={{ borderColor: themeColor, backgroundColor: isLightMode ? '#F1F5F9' : '#0b1329' }}>💻</div>
            )}
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded border" style={{ color: themeColor, borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`, backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)` }}>
                <span className="w-1.5 h-1.5 rounded-full led-pulse" style={{ backgroundColor: themeColor }} />
                ACTIVE_PORTFOLIO_SYSTEM
              </div>
              <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight font-sans ${isLightMode ? 'text-slate-900' : 'text-white'}`}>
                {getVal('hero', 'title', portfolio.title || `${user.full_name || user.username} Portfolio`)}
              </h1>
              <p className="text-xs font-bold tracking-wide font-mono" style={{ color: themeColor }}>&gt; {getVal('hero', 'subtitle', portfolio.tagline || profile.headline || 'Creative Professional')}</p>
            </div>
          </header>

          {sectionsArr.filter((sec: any) => { const secId = sec.id || sec; const enabled = sec.enabled !== undefined ? sec.enabled : true; return enabled; }).map((sec: any, index: number) => {
            const secId = sec.id || sec;
            const revealDelay = `${(index + 1) * 100}ms`;
            switch (secId) {
              case 'hero': return null;
              case 'about': return (
                <section key="about" className="space-y-4 reveal-item" style={{ animationDelay: revealDelay }}>
                  <h2 className="text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-2 font-mono" style={{ color: themeColor }}><span className="w-6 h-px" style={{ backgroundColor: themeColor }} /> ABOUT_ME.md</h2>
                  <div className={`tech-card rounded-2xl p-8 gap-8 relative overflow-hidden flex ${getAboutFlexClass(aboutPos)}`}>
                    <div className="corner-brkt absolute inset-0" />
                    <div className="space-y-6 flex-1">
                      <p className={`text-sm leading-relaxed font-sans whitespace-pre-wrap ${isLightMode ? 'text-slate-700' : 'text-slate-300'}`}>{getVal('about', 'text', profile.about_me || 'About section content goes here.')}</p>
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2">
                        <div className="p-3 rounded border" style={{ backgroundColor: isLightMode ? '#F1F5F9' : 'rgba(11, 19, 41, 0.4)', borderColor: isLightMode ? '#E2E8F0' : '#1E293B' }}>
                          <span className="block text-[9px] uppercase tracking-wider mb-1 font-bold" style={{ color: themeColor }}>LOCATION:</span>
                          <span className={isLightMode ? 'text-slate-800 font-semibold' : 'text-slate-300 font-semibold'}>{portfolio.location || profile.location || 'Not set'}</span>
                        </div>
                        <div className="p-3 rounded border" style={{ backgroundColor: isLightMode ? '#F1F5F9' : 'rgba(11, 19, 41, 0.4)', borderColor: isLightMode ? '#E2E8F0' : '#1E293B' }}>
                          <span className="block text-[9px] uppercase tracking-wider mb-1 font-bold" style={{ color: themeColor }}>LANGUAGE:</span>
                          <span className={isLightMode ? 'text-slate-800 font-semibold' : 'text-slate-300 font-semibold'}>{portfolio.language || 'English'}</span>
                        </div>
                      </div>
                    </div>
                    {aboutPic && <div className="shrink-0 max-w-[220px] w-full flex flex-col items-center justify-center"><img src={aboutPic} alt="About Us" className="w-full h-48 object-cover rounded-xl border shadow-md" style={{ borderColor: themeColor }} /></div>}
                  </div>
                </section>
              );
              case 'skills': return (
                <section key="skills" className="space-y-4 reveal-item" style={{ animationDelay: revealDelay }}>
                  <h2 className="text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-2 font-mono" style={{ color: themeColor }}><span className="w-6 h-px" style={{ backgroundColor: themeColor }} /> TECH_STACK.json</h2>
                  <div className="tech-card rounded-2xl p-8 space-y-6 relative">
                    <div className="corner-brkt absolute inset-0" />
                    <p className={`text-xs font-sans italic ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>{getVal('skills', 'description', 'Core competencies, technical frameworks, and productivity tools:')}</p>
                    <div className="space-y-5 font-mono">
                      {Array.isArray(profile.tech_skills) && profile.tech_skills.length > 0 && (<div><span className="text-[9px] font-bold tracking-widest uppercase mb-3 block" style={{ color: themeColor }}>&lt;LANGUAGES_&_FRAMEWORKS&gt;</span><div className="flex flex-wrap gap-2">{profile.tech_skills.map((s: string, i: number) => <span key={i} className="px-3 py-1.5 border rounded text-xs font-bold transition-all" style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`, borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`, color: themeColor }}>{s}</span>)}</div></div>)}
                      {Array.isArray(profile.tools) && profile.tools.length > 0 && (<div><span className="text-[9px] font-bold tracking-widest uppercase mb-3 block text-slate-400">&lt;TOOLS_&_PLATFORMS&gt;</span><div className="flex flex-wrap gap-2">{profile.tools.map((t: string, i: number) => <span key={i} className={`px-3 py-1.5 border rounded text-xs ${isLightMode ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900/60 border-slate-800 text-slate-300'}`}>{t}</span>)}</div></div>)}
                    </div>
                  </div>
                </section>
              );
              case 'projects': return (
                <section key="projects" className="space-y-4 reveal-item" style={{ animationDelay: revealDelay }}>
                  <h2 className="text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-2 font-mono" style={{ color: themeColor }}><span className="w-6 h-px" style={{ backgroundColor: themeColor }} /> PROJECTS.log</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{projects.length > 0 ? projects.map((p: any, i: number) => <div key={i} className="tech-card rounded-2xl overflow-hidden flex flex-col group">{p.bannerUrl && <img src={p.bannerUrl} alt={p.title} className="w-full h-36 object-cover border-b" style={{ borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)` }} />}<div className="p-6 space-y-3 flex-1 flex flex-col justify-between relative"><div className="corner-brkt absolute inset-0 pointer-events-none" /><div className="space-y-2"><div className="flex justify-between items-start"><h3 className={`text-sm font-bold ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{p.title}</h3>{p.projectUrl && <a href={p.projectUrl} target="_blank" rel="noreferrer" className="text-[9px] hover:underline flex items-center gap-1 font-semibold shrink-0 ml-2" style={{ color: themeColor }}>LINK ↗</a>}</div><p className={`text-xs leading-relaxed font-sans line-clamp-3 ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>{p.description}</p></div>{p.technologies && <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/40">{p.technologies.split(',').map((t: string, i: number) => <span key={i} className={`px-2.5 py-0.5 border rounded text-[9px] ${isLightMode ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>{t.trim()}</span>)}</div>}</div></div>) : <div className="col-span-2 tech-card rounded-2xl p-8 text-center text-xs text-slate-500 relative"><div className="corner-brkt absolute inset-0" />No projects published yet.</div>}</div>
                </section>
              );
              case 'experience': return (
                <section key="experience" className="space-y-4 reveal-item" style={{ animationDelay: revealDelay }}>
                  <h2 className="text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-2 font-mono" style={{ color: themeColor }}><span className="w-6 h-px" style={{ backgroundColor: themeColor }} /> WORK_HISTORY.csv</h2>
                  <div className="tech-card rounded-2xl p-6 flex flex-col sm:flex-row justify-between gap-4 font-sans relative"><div className="corner-brkt absolute inset-0" /><div className="space-y-1"><h3 className={`text-sm font-bold font-mono ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{profile.current_job_role || profile.current_role || 'Software Engineer'}</h3><p className={`text-xs ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>{profile.company || 'Freelance / Open Source Studio'}</p></div><div className="text-left sm:text-right shrink-0 font-mono space-y-1"><span className="inline-block text-[9px] font-bold px-3 py-1 rounded border led-pulse" style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`, borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`, color: themeColor }}>{profile.experience_years || 'N/A'} Years_Exp</span><p className="text-[9px] text-slate-400 uppercase tracking-widest block">{profile.employment_type || 'Full-time'}</p></div></div>
                </section>
              );
              case 'education': return (
                <section key="education" className="space-y-4 reveal-item" style={{ animationDelay: revealDelay }}>
                  <h2 className="text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-2 font-mono" style={{ color: themeColor }}><span className="w-6 h-px" style={{ backgroundColor: themeColor }} /> ACADEMIC_LOG.db</h2>
                  <div className="space-y-3">{education.length > 0 ? education.map((e: any, i: number) => <div key={i} className="tech-card rounded-2xl p-5 flex flex-col sm:flex-row justify-between gap-3 sm:items-center font-sans relative"><div className="corner-brkt absolute inset-0" /><div><h3 className={`text-xs font-bold font-mono ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{e.degree} in {e.fieldOfStudy}</h3><p className={`text-[11px] mt-1 ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>{e.school}</p></div><span className={`text-[9px] border px-3 py-1 rounded font-mono shrink-0 ${isLightMode ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-400'}`}>[{e.startYear} - {e.endYear}]</span></div>) : <div className="tech-card rounded-2xl p-5 text-xs text-slate-500 font-sans text-center relative"><div className="corner-brkt absolute inset-0" />No education records registered.</div>}</div>
                </section>
              );
              case 'certifications': return (
                <section key="certifications" className="space-y-4 reveal-item" style={{ animationDelay: revealDelay }}>
                  <h2 className="text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-2 font-mono" style={{ color: themeColor }}><span className="w-6 h-px" style={{ backgroundColor: themeColor }} /> VERIFIED_CERTS.x509</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{Array.isArray(profile.certifications) && profile.certifications.length > 0 ? profile.certifications.map((c: any, i: number) => <div key={i} className="tech-card rounded-2xl p-4 flex items-center gap-3 relative"><div className="corner-brkt absolute inset-0" /><span className="text-xl">🏆</span><div className="font-sans"><p className={`text-xs font-bold font-mono ${isLightMode ? 'text-slate-900' : 'text-white'}`}>{c.name || c}</p><p className="text-[9px] font-mono mt-0.5" style={{ color: themeColor }}>{c.issuer || 'Online Certification'}</p></div></div>) : <div className="tech-card rounded-2xl p-4 text-xs text-slate-500 font-sans text-center col-span-2 relative"><div className="corner-brkt absolute inset-0" />No certificates registered.</div>}</div>
                </section>
              );
              case 'contact': return (
                <section key="contact" className="space-y-4 reveal-item" style={{ animationDelay: revealDelay }}>
                  <h2 className="text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-2 font-mono" style={{ color: themeColor }}><span className="w-6 h-px" style={{ backgroundColor: themeColor }} /> ESTABLISH_CONTACT.sh</h2>
                  <div className="tech-card rounded-2xl p-8 space-y-5 max-w-lg relative"><div className="corner-brkt absolute inset-0" /><p className={`text-xs font-sans ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>{getVal('contact', 'prompt', 'Send a direct message below:')}</p><form action={`mailto:${user.email || ''}`} method="post" className="space-y-3 font-sans"><div className="grid grid-cols-2 gap-3"><input required type="text" placeholder="Name" className={`w-full px-3 py-2 border rounded text-xs ${isLightMode ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950/40 border-slate-800 text-slate-200'}`} /><input required type="email" placeholder="Email" className={`w-full px-3 py-2 border rounded text-xs ${isLightMode ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950/40 border-slate-800 text-slate-200'}`} /></div><textarea required rows={3} placeholder="Message..." className={`w-full px-3 py-2 border rounded text-xs ${isLightMode ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-950/40 border-slate-800 text-slate-200'}`} /><button type="submit" className="w-full py-3 text-white font-mono text-xs font-bold rounded transition-colors border" style={{ backgroundColor: themeColor, borderColor: themeColor }}>SEND MESSAGE ➔</button></form></div>
                </section>
              );
              default: return null;
            }
          })}
        </div>
        <footer className="mt-20 border-t py-8 text-center relative z-10" style={{ borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)` }}><p className="text-[10px] text-slate-500 tracking-wider uppercase">Built with <span className="font-bold" style={{ color: themeColor }}>ProfileMitraa</span> &bull; {user.full_name || user.username} &bull; All Rights Reserved</p></footer>
      </div>
    );
  }

  // ── TEMPLATE 4: Aesthetic Violet (Emmy Rose Hero + Dominic About) ─────────
  if (themeKey === 'aesthetic_violet') {
    const bgColor = isLightMode ? '#F8FAFC' : '#0B0713';
    const textColor = isLightMode ? '#0F172A' : '#F1F5F9';
    const cardBg = isLightMode ? 'rgba(255, 255, 255, 0.95)' : 'rgba(20, 14, 33, 0.7)';
    const cardBorder = isLightMode ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)';

    let calculatedAge = 'N/A';
    if (profile.dob) {
      try {
        const birthDate = new Date(profile.dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
        calculatedAge = String(age);
      } catch { }
    }

    const transparentHeroPic = customData.hero_image_url_transparent || heroPic;
    // About pic uses ONLY its own transparent image — never inherit the hero image
    const transparentAboutPic = customData.about_image_url_transparent || aboutPic;

    return (
      <div className="min-h-screen font-sans selection:bg-purple-500/30 pb-24 relative overflow-x-hidden" style={{ backgroundColor: bgColor, color: textColor }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Outfit:wght@300;400;500;600;700;900&display=swap');
          body { 
            background-color: ${bgColor}; 
            color: ${textColor};
            font-family: 'Plus Jakarta Sans', sans-serif;
            overflow-x: hidden;
          }
          .av-card {
            background: ${cardBg};
            border: 1px solid ${cardBorder};
            backdrop-filter: blur(16px);
            transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
          }
          .av-card:hover {
            border-color: ${themeColor};
            transform: translateY(-3px);
            box-shadow: 0 16px 36px -10px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2);
          }
        `}</style>

        {/* Ambient backdrop glow */}
        <div className="fixed top-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none z-0 opacity-25" style={{ backgroundColor: themeColor }} />

        <div className="max-w-5xl mx-auto px-6 pt-12 md:pt-20 space-y-24 relative z-10">

          {/* 1. HERO SECTION (Emmy Rose Design) */}
          <header className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-16 pt-4">
            {/* Left Content */}
            <div className={`space-y-6 flex-1 text-center ${heroPos === 'right' ? 'md:text-right' : heroPos === 'center' ? 'md:text-center' : 'md:text-left'}`}>
              <div className="space-y-2">
                <p className="text-lg md:text-xl font-bold tracking-wide opacity-90">
                  Hi, I&apos;m <span className="font-extrabold">{user.full_name || user.username}</span>!
                </p>
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-none" style={{ color: themeColor }}>
                  {getVal('hero', 'headline', profile.current_job_role || profile.professional_title || portfolio.tagline || 'WEB DESIGNER')}
                </h1>
              </div>

              <p className={`text-sm md:text-base leading-relaxed max-w-xl mx-auto ${heroPos === 'right' ? 'md:mr-0' : heroPos === 'left' ? 'md:ml-0' : ''} ${isLightMode ? 'text-slate-600' : 'text-slate-300'}`}>
                {getVal('hero', 'description', portfolio.description || profile.about_me || 'Passionate professional known for crafting visually stunning, user-friendly digital experiences and scalable applications.')}
              </p>

              {/* Action Buttons */}
              <div className={`flex flex-wrap items-center gap-4 justify-center ${heroPos === 'right' ? 'md:justify-end' : heroPos === 'center' ? 'md:justify-center' : 'md:justify-start'}`}>
                <a
                  href="#projects"
                  className="px-7 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
                  style={{ backgroundColor: isLightMode ? '#334155' : themeColor }}
                >
                  PROJECTS &lt;/&gt;
                </a>
                <a
                  href="#contact"
                  className="px-7 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider border-2 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2"
                  style={{ borderColor: themeColor, color: themeColor }}
                >
                  HIRE ME ↗
                </a>
              </div>

              {/* Social Outline Circles */}
              <div className={`flex items-center gap-3 pt-2 justify-center ${heroPos === 'right' ? 'md:justify-end' : heroPos === 'center' ? 'md:justify-center' : 'md:justify-start'}`}>
                {[
                  { name: 'Facebook', icon: 'f', href: `https://facebook.com` },
                  { name: 'Instagram', icon: '📷', href: `https://instagram.com` },
                  { name: 'LinkedIn', icon: 'in', href: `https://linkedin.com` },
                ].map((s, idx) => (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all hover:scale-110"
                    style={{ borderColor: isLightMode ? '#CBD5E1' : '#334155', color: isLightMode ? '#475569' : '#94A3B8' }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Right Transparent Photo (No Background) — large & dominant */}
            <div className="shrink-0 relative group flex-shrink-0">
              <div className="w-72 h-[420px] sm:w-[420px] sm:h-[560px] lg:w-[480px] lg:h-[630px] relative flex items-end justify-center">
                {/* Soft radial glow behind person */}
                <div className="absolute inset-x-0 bottom-0 top-12 rounded-full blur-3xl opacity-20 group-hover:opacity-35 transition-opacity duration-500" style={{ backgroundColor: themeColor }} />

                {transparentHeroPic ? (
                  <img
                    src={transparentHeroPic}
                    alt={user.full_name || 'Hero Avatar'}
                    className="relative w-full h-full object-contain z-10 transition-transform duration-700 group-hover:scale-[1.03]"
                    style={{ filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.4))' }}
                  />
                ) : (
                  <div className="w-full h-full rounded-3xl av-card flex items-center justify-center text-9xl relative z-10">👩‍💻</div>
                )}
              </div>
            </div>
          </header>

          {/* DYNAMIC SECTIONS LIST */}
          {sectionsArr.filter((sec: any) => { const secId = sec.id || sec; const enabled = sec.enabled !== undefined ? sec.enabled : true; return enabled; }).map((sec: any, index: number) => {
            const secId = sec.id || sec;
            switch (secId) {
              case 'hero': return null;

              {/* 2. ABOUT SECTION (Light Blue Diamond Shape + Background Removed Cutout) */}
              case 'about': return (
                <section id="about" key="about" className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                    {/* Left Stylized Photo Card with Light Blue Diamond Shape */}
                    <div className="lg:col-span-5 flex justify-center py-4">
                      <div className="relative w-[300px] h-[320px] sm:w-[340px] sm:h-[360px] flex items-center justify-center">
                        
                        {/* Soft Cyan/Light Blue Glow */}
                        <div 
                          className="absolute w-56 h-56 sm:w-64 sm:h-64 rounded-[40px] rotate-45 blur-2xl opacity-40 transition-opacity" 
                          style={{ backgroundColor: '#38BDF8' }} 
                        />

                        {/* Light Blue Diamond Background Container */}
                        <div 
                          className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-[36px] rotate-45 shadow-2xl border-4 overflow-hidden flex items-center justify-center transition-transform hover:rotate-[47deg] duration-500"
                          style={{ 
                            background: 'linear-gradient(135deg, #7DD3FC 0%, #38BDF8 50%, #0284C7 100%)', 
                            borderColor: themeColor 
                          }}
                        >
                          {/* Decorative inner diamond ring */}
                          <div className="w-44 h-44 sm:w-48 sm:h-48 rounded-[28px] border-2 border-white/40" />
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/25 to-transparent pointer-events-none" />
                        </div>

                        {/* Vertical Rotated Name Tag */}
                        <div className="absolute left-[-10px] sm:left-[-15px] top-1/2 -translate-y-1/2 origin-center -rotate-90 text-white font-black tracking-[0.25em] text-xs sm:text-sm uppercase select-none whitespace-nowrap z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          {(user.full_name || user.username).split('').join(' ')}
                        </div>

                        {/* Cutout Portrait Image with Background Removed */}
                        <div className="relative z-10 w-60 h-72 sm:w-68 sm:h-80 flex items-end justify-center">
                          {transparentAboutPic ? (
                            <img
                              src={transparentAboutPic}
                              alt={user.full_name || 'About Avatar'}
                              className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                              style={{ filter: 'drop-shadow(0 16px 28px rgba(0, 0, 0, 0.45))' }}
                            />
                          ) : (
                            <div className="w-44 h-44 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-6xl text-white border border-white/20">
                              📸
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    {/* Right Info Content */}
                    <div className="lg:col-span-7 space-y-5">
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                          Hello, I Am <span style={{ color: themeColor }}>{profile.current_job_role || profile.professional_title || 'Photographer'}</span>
                        </h2>
                      </div>

                      <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isLightMode ? 'text-slate-600' : 'text-slate-300'}`}>
                        {getVal('about', 'text', profile.about_me || 'Passionate digital creator focused on building responsive web solutions, user experiences, and innovative digital designs.')}
                      </p>

                      {/* Details Table */}
                      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-xs sm:text-sm border-t border-b py-4 my-4 font-mono ${isLightMode ? 'border-slate-200 text-slate-700' : 'border-slate-800 text-slate-300'}`}>
                        <div className="flex justify-between sm:justify-start gap-2">
                          <span className="w-24 font-bold opacity-60">Name</span>
                          <span>: {user.full_name || user.username}</span>
                        </div>
                        <div className="flex justify-between sm:justify-start gap-2">
                          <span className="w-24 font-bold opacity-60">Age</span>
                          <span>: {calculatedAge}</span>
                        </div>
                        <div className="flex justify-between sm:justify-start gap-2">
                          <span className="w-24 font-bold opacity-60">Address</span>
                          <span className="truncate">: {portfolio.location || profile.location || 'Not set'}</span>
                        </div>
                        <div className="flex justify-between sm:justify-start gap-2">
                          <span className="w-24 font-bold opacity-60">Phone</span>
                          <span>: {profile.phone || '+(00) 223 126 499'}</span>
                        </div>
                        <div className="flex justify-between sm:justify-start gap-2">
                          <span className="w-24 font-bold opacity-60">e-mail</span>
                          <span className="truncate">: {user.email}</span>
                        </div>
                        <div className="flex justify-between sm:justify-start gap-2">
                          <span className="w-24 font-bold opacity-60">Freelance</span>
                          <span>: {profile.employment_type || 'Available'}</span>
                        </div>
                      </div>

                      {/* Download CV button */}
                      <div>
                        <a
                          href="#contact"
                          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-extrabold text-xs text-white uppercase tracking-wider shadow-md transition-all hover:scale-105"
                          style={{ backgroundColor: themeColor }}
                        >
                          Download CV
                        </a>
                      </div>
                    </div>
                  </div>
                </section>
              );

              {/* 3. SKILLS SECTION */}
              case 'skills': return (
                <section id="skills" key="skills" className="space-y-4 pt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black tracking-widest uppercase" style={{ color: themeColor }}>02 //</span>
                    <h2 className="text-lg font-extrabold uppercase tracking-wider">Skills &amp; Tools</h2>
                    <div className="h-px flex-1 bg-slate-500/20" />
                  </div>
                  <div className="av-card rounded-2xl p-6 sm:p-8 space-y-6">
                    <p className={`text-xs italic ${isLightMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      {getVal('skills', 'description', 'Specialized technical competencies and productivity platforms:')}
                    </p>
                    <div className="space-y-4">
                      {Array.isArray(profile.tech_skills) && profile.tech_skills.length > 0 && (
                        <div className="flex flex-wrap gap-2.5">
                          {profile.tech_skills.map((s: string, i: number) => (
                            <span key={i} className="px-4 py-2 rounded-xl text-xs font-bold border transition-all" style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.12)`, borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`, color: themeColor }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      {Array.isArray(profile.tools) && profile.tools.length > 0 && (
                        <div className="flex flex-wrap gap-2.5">
                          {profile.tools.map((t: string, i: number) => (
                            <span key={i} className={`px-4 py-2 rounded-xl text-xs font-semibold border ${isLightMode ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-slate-900 border-slate-800 text-slate-300'}`}>
                              ⚡ {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </section>
              );

              {/* 4. PROJECTS SECTION */}
              case 'projects': return (
                <section id="projects" key="projects" className="space-y-4 pt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black tracking-widest uppercase" style={{ color: themeColor }}>03 //</span>
                    <h2 className="text-lg font-extrabold uppercase tracking-wider">Featured Projects</h2>
                    <div className="h-px flex-1 bg-slate-500/20" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {projects.length > 0 ? projects.map((p: any, i: number) => (
                      <div key={i} className="av-card rounded-2xl overflow-hidden flex flex-col group">
                        {p.bannerUrl && (
                          <div className="w-full h-40 overflow-hidden relative border-b border-slate-800/30">
                            <img src={p.bannerUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          </div>
                        )}
                        <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <h3 className="text-sm sm:text-base font-extrabold tracking-tight">{p.title}</h3>
                              {p.projectUrl && (
                                <a href={p.projectUrl} target="_blank" rel="noreferrer" className="text-xs font-bold hover:underline shrink-0" style={{ color: themeColor }}>
                                  LINK ↗
                                </a>
                              )}
                            </div>
                            <p className={`text-xs leading-relaxed line-clamp-3 ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>{p.description}</p>
                          </div>
                          {p.technologies && (
                            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/20">
                              {p.technologies.split(',').map((t: string, idx: number) => (
                                <span key={idx} className={`px-2.5 py-0.5 rounded-lg text-[9px] font-semibold ${isLightMode ? 'bg-slate-100 text-slate-600' : 'bg-slate-900 text-slate-400'}`}>{t.trim()}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="col-span-2 av-card rounded-2xl p-8 text-center text-xs text-slate-400">No projects added.</div>
                    )}
                  </div>
                </section>
              );

              {/* 5. WORK EXPERIENCE SECTION */}
              case 'experience': return (
                <section id="experience" key="experience" className="space-y-4 pt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black tracking-widest uppercase" style={{ color: themeColor }}>04 //</span>
                    <h2 className="text-lg font-extrabold uppercase tracking-wider">Experience</h2>
                    <div className="h-px flex-1 bg-slate-500/20" />
                  </div>
                  <div className="av-card rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-extrabold">{profile.current_job_role || profile.current_role || 'Senior Professional'}</h3>
                      <p className={`text-xs ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>{profile.company || 'Enterprise / Independent Studio'}</p>
                    </div>
                    <span className="px-4 py-1.5 rounded-full text-xs font-extrabold border shrink-0" style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`, borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`, color: themeColor }}>
                      {profile.experience_years || 'N/A'} Years Exp &bull; {profile.employment_type || 'Full-time'}
                    </span>
                  </div>
                </section>
              );

              {/* 6. EDUCATION SECTION */}
              case 'education': return (
                <section id="education" key="education" className="space-y-4 pt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black tracking-widest uppercase" style={{ color: themeColor }}>05 //</span>
                    <h2 className="text-lg font-extrabold uppercase tracking-wider">Academic Record</h2>
                    <div className="h-px flex-1 bg-slate-500/20" />
                  </div>
                  <div className="space-y-3">
                    {education.length > 0 ? education.map((e: any, i: number) => (
                      <div key={i} className="av-card rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div>
                          <h3 className="text-xs sm:text-sm font-extrabold">{e.degree} in {e.fieldOfStudy}</h3>
                          <p className={`text-xs mt-0.5 ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>{e.school}</p>
                        </div>
                        <span className="text-[10px] font-mono px-3 py-1 rounded-full border border-slate-700/30 opacity-70 shrink-0">
                          {e.startYear} - {e.endYear}
                        </span>
                      </div>
                    )) : (
                      <div className="av-card rounded-2xl p-6 text-xs text-slate-400 text-center">No education records added.</div>
                    )}
                  </div>
                </section>
              );

              {/* 7. CERTIFICATIONS SECTION */}
              case 'certifications': return (
                <section id="certifications" key="certifications" className="space-y-4 pt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black tracking-widest uppercase" style={{ color: themeColor }}>06 //</span>
                    <h2 className="text-lg font-extrabold uppercase tracking-wider">Certifications</h2>
                    <div className="h-px flex-1 bg-slate-500/20" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {Array.isArray(profile.certifications) && profile.certifications.length > 0 ? profile.certifications.map((c: any, i: number) => (
                      <div key={i} className="av-card rounded-2xl p-4 flex items-center gap-3.5">
                        <span className="text-2xl shrink-0">🏆</span>
                        <div>
                          <p className="text-xs font-extrabold">{c.name || c}</p>
                          <p className="text-[10px] font-semibold mt-0.5" style={{ color: themeColor }}>{c.issuer || 'Verified Credential'}</p>
                        </div>
                      </div>
                    )) : (
                      <div className="av-card rounded-2xl p-6 text-xs text-slate-400 text-center col-span-2">No certificates added.</div>
                    )}
                  </div>
                </section>
              );

              {/* 8. CONTACT SECTION */}
              case 'contact': return (
                <section id="contact" key="contact" className="space-y-4 pt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black tracking-widest uppercase" style={{ color: themeColor }}>07 //</span>
                    <h2 className="text-lg font-extrabold uppercase tracking-wider">Get In Touch</h2>
                    <div className="h-px flex-1 bg-slate-500/20" />
                  </div>
                  <div className="av-card rounded-2xl p-6 sm:p-8 space-y-5 max-w-xl">
                    <p className={`text-xs ${isLightMode ? 'text-slate-600' : 'text-slate-400'}`}>
                      {getVal('contact', 'prompt', 'Have a project in mind or want to collaborate? Send a message directly:')}
                    </p>
                    <form action={`mailto:${user.email || ''}`} method="post" className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input required type="text" placeholder="Your Name" className={`w-full px-4 py-3 rounded-xl text-xs border ${isLightMode ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'}`} />
                        <input required type="email" placeholder="Your Email" className={`w-full px-4 py-3 rounded-xl text-xs border ${isLightMode ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'}`} />
                      </div>
                      <textarea required rows={3} placeholder="Your Message..." className={`w-full px-4 py-3 rounded-xl text-xs border resize-none ${isLightMode ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-slate-900 border-slate-800 text-slate-200'}`} />
                      <button type="submit" className="w-full py-3.5 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all shadow-md hover:scale-[1.01]" style={{ backgroundColor: themeColor }}>
                        Send Message ➔
                      </button>
                    </form>
                  </div>
                </section>
              );

              default: return null;
            }
          })}

        </div>
        <footer className="mt-24 border-t py-8 text-center relative z-10" style={{ borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)` }}>
          <p className="text-[10px] text-slate-500 tracking-wider uppercase">Built with <span className="font-bold" style={{ color: themeColor }}>ProfileMitraa</span> &bull; {user.full_name || user.username} &bull; All Rights Reserved</p>
        </footer>
      </div>
    );
  }

  // ── TEMPLATE 2 & 3: Creative / Corporate ──────────────────────────────────
  const bgStyle = isLightMode ? '#F1F5F9' : '#070514';
  const textStyle = isLightMode ? '#0F172A' : '#FFFFFF';
  const cardBgStyle = isLightMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.03)';
  const borderStyle = isLightMode ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)` : `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`;

  return (
    <div className="min-h-screen font-sans pb-20 relative overflow-x-hidden" style={{ backgroundColor: bgStyle, color: textStyle }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;900&display=swap');
        body { font-family: 'Outfit', sans-serif; background-color: ${bgStyle}; color: ${textStyle}; overflow-x: hidden; }
        .custom-card {
          background: ${cardBgStyle};
          border: 1px solid ${borderStyle};
          backdrop-filter: blur(20px);
          transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .custom-card:hover {
          border-color: ${themeColor};
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15);
        }
      `}</style>
      <div className="fixed top-12 left-1/4 w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none z-0" style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)` }} />
      <div className="max-w-3xl mx-auto px-6 pt-16 space-y-16 relative z-10">
        <header className={`custom-card rounded-3xl p-8 flex items-center gap-8 ${getHeroFlexClass(heroPos)}`}>
          {heroPic ? (
            <div className="relative group shrink-0">
              <div className="absolute inset-0 rounded-2xl blur-xl opacity-60 scale-110" style={{ backgroundColor: themeColor }} />
              <img src={heroPic} alt="Hero Avatar" className="relative w-32 h-32 rounded-2xl object-cover border-2 shadow-2xl" style={{ borderColor: themeColor }} />
            </div>
          ) : (<div className="w-32 h-32 rounded-2xl custom-card flex items-center justify-center text-5xl shrink-0">🎨</div>)}
          <div className="space-y-3 flex-1">
            <span className="inline-block text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full border" style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`, color: themeColor, borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)` }}>Featured Portfolio</span>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-tight">{getVal('hero', 'title', portfolio.title || `${user.full_name || user.username} Portfolio`)}</h1>
            <p className="text-base font-semibold" style={{ color: themeColor }}>{getVal('hero', 'subtitle', portfolio.tagline || profile.headline || 'Creative Professional')}</p>
          </div>
        </header>

        {sectionsArr.filter((sec: any) => { const secId = sec.id || sec; const enabled = sec.enabled !== undefined ? sec.enabled : true; return enabled; }).map((sec: any, idx: number) => {
          const secId = sec.id || sec;
          switch (secId) {
            case 'hero': return <section key="hero" className="custom-card rounded-3xl p-8 space-y-3"><p className={`text-sm leading-relaxed font-light ${isLightMode ? 'text-slate-700' : 'text-white/80'}`}>{getVal('hero', 'description', portfolio.description || profile.about_me || 'Description text goes here.')}</p></section>;
            case 'about': return <section key="about" className="space-y-4"><h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: themeColor }}><span>✦</span> About Us</h2><div className={`custom-card rounded-3xl p-8 gap-8 flex ${getAboutFlexClass(aboutPos)}`}><div className="space-y-4 flex-1"><p className={`text-sm leading-relaxed font-light whitespace-pre-wrap ${isLightMode ? 'text-slate-700' : 'text-white/80'}`}>{getVal('about', 'text', profile.about_me || 'About section content goes here.')}</p><div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/20 text-xs font-semibold"><div className="custom-card rounded-2xl p-4"><span className="block mb-1 text-[10px] uppercase tracking-wider font-bold" style={{ color: themeColor }}>Location</span><span className="font-bold">{portfolio.location || profile.location || 'Not set'}</span></div><div className="custom-card rounded-2xl p-4"><span className="block mb-1 text-[10px] uppercase tracking-wider font-bold" style={{ color: themeColor }}>Language</span><span className="font-bold">{portfolio.language || 'English'}</span></div></div></div>{aboutPic && <div className="shrink-0 max-w-[220px] w-full flex flex-col items-center justify-center"><img src={aboutPic} alt="About Us" className="w-full h-48 object-cover rounded-2xl border shadow-lg" style={{ borderColor: themeColor }} /></div>}</div></section>;
            case 'skills': return <section key="skills" className="space-y-4"><h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: themeColor }}><span>✦</span> Skills & Tools</h2><div className="custom-card rounded-3xl p-8 space-y-4"><p className={`text-xs font-light italic ${isLightMode ? 'text-slate-500' : 'text-white/50'}`}>{getVal('skills', 'description', 'Specialized tools and technical frameworks:')}</p><div className="flex flex-wrap gap-2">{Array.isArray(profile.tech_skills) && profile.tech_skills.map((s: string, i: number) => <span key={i} className="px-4 py-2 rounded-full border text-xs font-bold" style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`, borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`, color: themeColor }}>{s}</span>)}{Array.isArray(profile.tools) && profile.tools.map((t: string, i: number) => <span key={i} className={`px-4 py-2 rounded-full border text-xs ${isLightMode ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-white/70'}`}>{t}</span>)}</div></div></section>;
            case 'projects': return <section key="projects" className="space-y-4"><h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: themeColor }}><span>✦</span> Featured Projects</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{projects.length > 0 ? projects.map((p: any, i: number) => <div key={i} className="custom-card rounded-3xl overflow-hidden flex flex-col group">{p.bannerUrl && <img src={p.bannerUrl} alt={p.title} className="w-full h-36 object-cover border-b" style={{ borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)` }} />}<div className="p-6 space-y-3 flex-1 flex flex-col justify-between"><div className="space-y-2"><div className="flex justify-between items-start"><h3 className="text-sm font-black uppercase tracking-wide">{p.title}</h3>{p.projectUrl && <a href={p.projectUrl} target="_blank" rel="noreferrer" className="text-[10px] font-bold hover:underline" style={{ color: themeColor }}>Link ↗</a>}</div><p className={`text-xs leading-relaxed font-light line-clamp-3 ${isLightMode ? 'text-slate-600' : 'text-white/60'}`}>{p.description}</p></div>{p.technologies && <div className="flex flex-wrap gap-1.5 pt-2">{p.technologies.split(',').map((t: string, i: number) => <span key={i} className={`px-2.5 py-0.5 rounded text-[9px] font-semibold ${isLightMode ? 'bg-slate-100 text-slate-600' : 'bg-white/5 text-white/50'}`}>{t.trim()}</span>)}</div>}</div></div>) : <div className="col-span-2 custom-card rounded-3xl p-8 text-center text-xs text-slate-400">No projects added.</div>}</div></section>;
            case 'experience': return <section key="experience" className="space-y-4"><h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: themeColor }}><span>✦</span> Experience</h2><div className="custom-card rounded-3xl p-8 flex flex-col sm:flex-row justify-between gap-4"><div className="space-y-1"><h3 className="text-sm font-black">{profile.current_job_role || 'Specialist'}</h3><p className={`text-xs ${isLightMode ? 'text-slate-600' : 'text-white/60'}`}>{profile.company || 'Enterprise'}</p></div><div className="text-left sm:text-right shrink-0"><span className="inline-block text-[10px] font-bold px-3 py-1 rounded-full border" style={{ backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)`, color: themeColor, borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)` }}>{profile.experience_years || 'N/A'} Years Exp</span></div></div></section>;
            case 'education': return <section key="education" className="space-y-4"><h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: themeColor }}><span>✦</span> Education</h2><div className="space-y-3">{education.length > 0 ? education.map((e: any, i: number) => <div key={i} className="custom-card rounded-3xl p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-3"><div><h3 className="text-xs font-black uppercase tracking-wide">{e.degree} in {e.fieldOfStudy}</h3><p className={`text-[11px] mt-1 font-light ${isLightMode ? 'text-slate-600' : 'text-white/60'}`}>{e.school}</p></div><span className="text-[9px] custom-card px-3 py-1 rounded-full text-slate-400 shrink-0">{e.startYear} - {e.endYear}</span></div>) : <div className="custom-card rounded-3xl p-6 text-xs text-slate-400 text-center">No education records added.</div>}</div></section>;
            case 'certifications': return <section key="certifications" className="space-y-4"><h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: themeColor }}><span>✦</span> Certifications</h2><div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{Array.isArray(profile.certifications) && profile.certifications.length > 0 ? profile.certifications.map((c: any, i: number) => <div key={i} className="custom-card rounded-3xl p-4 flex items-center gap-3"><span className="text-xl shrink-0">🏆</span><div><p className="text-xs font-black">{c.name || c}</p><p className="text-[9px] font-medium mt-0.5" style={{ color: themeColor }}>{c.issuer || 'Certification'}</p></div></div>) : <div className="custom-card rounded-3xl p-6 text-xs text-slate-400 text-center col-span-2">No certifications listed.</div>}</div></section>;
            case 'contact': return <section key="contact" className="space-y-4"><h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: themeColor }}><span>✦</span> Contact</h2><div className="custom-card rounded-3xl p-8 space-y-4 max-w-lg"><p className={`text-xs font-light ${isLightMode ? 'text-slate-600' : 'text-white/60'}`}>{getVal('contact', 'prompt', "Let's connect:")}</p><form action={`mailto:${user.email || ''}`} method="post" className="space-y-3"><div className="grid grid-cols-2 gap-3"><input required type="text" placeholder="Name" className={`w-full px-4 py-3 border rounded-2xl text-xs ${isLightMode ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-white/80'}`} /><input required type="email" placeholder="Email" className={`w-full px-4 py-3 border rounded-2xl text-xs ${isLightMode ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-white/80'}`} /></div><textarea required rows={3} placeholder="Message..." className={`w-full px-4 py-3 border rounded-2xl text-xs resize-none ${isLightMode ? 'bg-slate-100 border-slate-200 text-slate-700' : 'bg-white/5 border-white/10 text-white/80'}`} /><button type="submit" className="w-full py-3.5 font-black text-xs rounded-2xl uppercase tracking-widest text-white border" style={{ backgroundColor: themeColor, borderColor: themeColor }}>Send Message ✦</button></form></div></section>;
            default: return null;
          }
        })}
      </div>
      <footer className="mt-20 border-t py-8 text-center relative z-10" style={{ borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15)` }}><p className="text-[10px] text-slate-500 tracking-wider uppercase">Built with <span className="font-bold" style={{ color: themeColor }}>ProfileMitraa</span> &bull; {user.full_name || user.username} &bull; All Rights Reserved</p></footer>
    </div>
  );
}
