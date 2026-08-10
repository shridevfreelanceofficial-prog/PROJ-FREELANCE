/* eslint-disable @next/next/no-img-element */
'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';

// ── Rich Sample Data ─────────────────────────────────────────────────────────
const SAMPLE = {
  name: 'Alex Rivera',
  username: 'alexrivera',
  role: 'Full Stack Developer',
  tagline: 'Building scalable web apps & elegant digital experiences',
  description: 'I\'m a passionate full-stack developer with 5+ years of experience crafting high-performance web applications. I specialize in React, Node.js, and cloud infrastructure, turning complex business problems into clean, maintainable solutions.',
  about: 'Originally from Bangalore, I started coding at 16 and never stopped. I\'ve worked with startups and mid-size companies, shipping products used by millions. Outside of code, I contribute to open-source and mentor junior developers in my community.',
  location: 'Bengaluru, Karnataka, India',
  company: 'TechVenture Labs',
  experience: '5+',
  employment: 'Full-time',
  avatar: '', // will use emoji fallback
  techSkills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'GraphQL', 'Tailwind CSS', 'Docker'],
  tools: ['VS Code', 'Figma', 'GitHub', 'AWS', 'Vercel', 'Postman'],
  softSkills: ['Leadership', 'Communication', 'Problem Solving'],
  projects: [
    {
      id: '1',
      title: 'SaaS Analytics Dashboard',
      description: 'A real-time analytics platform serving 50K+ daily active users. Built with Next.js, Prisma, and Redis for sub-100ms query performance. Includes cohort analysis, funnel tracking, and custom report builder.',
      url: 'https://github.com/alexrivera',
      tech: 'Next.js, TypeScript, Prisma, Redis, PostgreSQL',
    },
    {
      id: '2',
      title: 'E-Commerce Microservices Platform',
      description: 'Architected a distributed e-commerce backend handling 10K transactions/day. Implemented event-driven architecture with RabbitMQ, containerized with Docker, deployed on AWS ECS.',
      url: 'https://github.com/alexrivera',
      tech: 'Node.js, Docker, RabbitMQ, AWS ECS, MongoDB',
    },
    {
      id: '3',
      title: 'AI Resume Builder',
      description: 'GPT-powered resume generator that creates tailored resumes from LinkedIn profiles. 20K users in 3 months post-launch, featured in Product Hunt #1 of the day.',
      url: 'https://github.com/alexrivera',
      tech: 'React, OpenAI API, Python, FastAPI, Supabase',
    },
    {
      id: '4',
      title: 'DevCollab — Remote Team OS',
      description: 'An all-in-one remote work platform with async video, Kanban boards, shared docs, and Slack integration — built during a 48-hour hackathon. Won 1st place.',
      url: 'https://github.com/alexrivera',
      tech: 'React, WebRTC, Socket.IO, Express, Firebase',
    },
  ],
  education: [
    { id: '1', degree: 'B.Tech', field: 'Computer Science & Engineering', school: 'Indian Institute of Technology, Bombay', start: '2015', end: '2019' },
    { id: '2', degree: 'Diploma', field: 'Cloud Architecture', school: 'AWS Training & Certification', start: '2021', end: '2021' },
  ],
  certifications: [
    { name: 'AWS Solutions Architect – Associate', issuer: 'Amazon Web Services' },
    { name: 'Google Professional Cloud Developer', issuer: 'Google Cloud' },
    { name: 'Meta Frontend Developer', issuer: 'Meta / Coursera' },
  ],
};

const ALL_SECTIONS = ['hero', 'about', 'skills', 'projects', 'experience', 'education', 'certifications', 'contact'];

export default function TemplateDemoPage({ params }: { params: Promise<{ template: string }> }) {
  const { template } = use(params);

  const validTemplates = ['minimal_dark', 'creative_glass', 'corporate_blue'];
  if (!validTemplates.includes(template)) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-bold font-mono">TEMPLATE_NOT_FOUND</h1>
        <p className="text-xs text-slate-500 mt-2 font-mono">The requested design matrix does not exist.</p>
      </div>
    );
  }

  if (template === 'minimal_dark') {
    return (
      <div className="min-h-screen bg-[#030712] text-[#E2E8F0] font-mono selection:bg-[#10B981]/30 pb-24 relative overflow-x-hidden">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;600;700;800&family=Inter:wght@300;400;500;700;950&display=swap');
          
          body { 
            background-color: #030712; 
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            overflow-x: hidden;
          }
          
          /* Custom grid background */
          .cyber-grid {
            background-image: 
              linear-gradient(to right, rgba(16, 185, 129, 0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(16, 185, 129, 0.03) 1px, transparent 1px);
            background-size: 30px 30px;
          }

          /* Scanline Animation */
          @keyframes scanline {
            0% { transform: translateY(-100vh); }
            100% { transform: translateY(100vh); }
          }
          .cyber-scanline {
            content: '';
            position: fixed;
            top: 0; left: 0; right: 0;
            height: 10px;
            background: linear-gradient(to bottom, transparent, rgba(16, 185, 129, 0.06), transparent);
            pointer-events: none;
            z-index: 50;
            animation: scanline 12s linear infinite;
          }

          /* LED Active Light */
          .led-pulse {
            box-shadow: 0 0 8px rgba(16, 185, 129, 0.8), 0 0 16px rgba(16, 185, 129, 0.4);
            animation: led-pulse-anim 2s infinite ease-in-out;
          }
          @keyframes led-pulse-anim {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.3; transform: scale(0.9); }
          }

          /* Tech Card hover */
          .tech-card {
            background: rgba(10, 17, 30, 0.7);
            border: 1px solid rgba(16, 185, 129, 0.12);
            transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
          }
          .tech-card:hover {
            border-color: rgba(16, 185, 129, 0.4);
            background: rgba(10, 17, 30, 0.95);
            box-shadow: 0 10px 30px -10px rgba(16, 185, 129, 0.15);
            transform: translateY(-2px);
          }

          /* Interactive corners */
          .corner-brkt::before, .corner-brkt::after {
            content: '';
            position: absolute;
            width: 8px;
            height: 8px;
            border-color: rgba(16, 185, 129, 0.3);
            border-style: solid;
            transition: all 300ms ease;
            pointer-events: none;
          }
          .corner-brkt::before { top: -1px; left: -1px; border-width: 1px 0 0 1px; }
          .corner-brkt::after { bottom: -1px; right: -1px; border-width: 0 1px 1px 0; }
          .tech-card:hover .corner-brkt::before { border-color: #10B981; width: 14px; height: 14px; }
          .tech-card:hover .corner-brkt::after { border-color: #10B981; width: 14px; height: 14px; }

          /* Staggered entrance animation */
          .reveal-item {
            opacity: 0;
            transform: translateY(20px);
            animation: revealUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          @keyframes revealUp {
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Scanline overlay */}
        <div className="cyber-scanline" />

        {/* Ambient Grid Backplane */}
        <div className="fixed inset-0 cyber-grid pointer-events-none z-0" />

        {/* High-end ambient blur lights */}
        <div className="fixed -top-40 -right-40 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="fixed -bottom-40 -left-40 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none z-0" />

        {/* Demo badge */}
        <div className="fixed top-4 right-4 z-50 bg-emerald-600 border border-emerald-400/40 text-emerald-100 text-[9px] font-black px-3.5 py-1.5 rounded shadow-lg uppercase tracking-widest led-pulse">
          DEMO — Tech Minimalist
        </div>

        {/* Nav Bar */}
        <nav className="sticky top-0 z-30 bg-[#030712]/80 backdrop-blur-xl border-b border-emerald-500/10 px-6 py-4 flex items-center justify-between z-40">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full led-pulse bg-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 tracking-[0.2em] uppercase font-mono">{SAMPLE.name}</span>
          </div>
          <div className="flex gap-5 text-[10px] text-slate-450 font-bold tracking-wider font-mono">
            {['ABOUT', 'STACK', 'PROJECTS', 'CONTACT'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-emerald-400 transition-colors uppercase border-b border-transparent hover:border-emerald-400/30 pb-0.5">
                // {item}
              </a>
            ))}
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 pt-16 space-y-24 relative z-10">
          {/* Header Card */}
          <header id="hero" className="tech-card rounded-xl p-8 flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden reveal-item">
            <div className="corner-brkt absolute inset-0" />
            
            <div className="w-28 h-28 rounded-xl bg-[#0b1329] border border-[#10B981]/50 flex items-center justify-center text-4xl shrink-0 shadow-lg shadow-emerald-500/10 relative group">
              <div className="absolute inset-0 rounded-xl bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors" />
              💻
            </div>
            
            <div className="text-center sm:text-left space-y-3">
              <div className="inline-flex items-center gap-2 text-[9px] font-black text-emerald-400 tracking-widest uppercase bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 led-pulse" />
                Active_System_Core
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-sans">{SAMPLE.name}</h1>
              <p className="text-xs text-emerald-400 font-bold tracking-wide font-mono">&gt; {SAMPLE.tagline}</p>
            </div>
          </header>

          {/* System Intro */}
          <section className="tech-card rounded-xl p-8 relative overflow-hidden reveal-item" style={{ animationDelay: '100ms' }}>
            <div className="corner-brkt absolute inset-0" />
            <div className="absolute top-0 left-0 w-1 h-full bg-[#10B981]/70" />
            <div className="space-y-4">
              <h3 className="text-xs uppercase font-extrabold tracking-widest text-[#10B981] flex items-center gap-2">
                <span>⚡</span> SYSTEM._INTRO()
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed font-sans font-light">{SAMPLE.description}</p>
              <div className="pt-2">
                <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white text-xs font-bold rounded transition-all duration-300 tracking-widest uppercase hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  INITIATE_COLLAB ▶
                </a>
              </div>
            </div>
          </section>

          {/* About */}
          <section id="about" className="space-y-4 reveal-item" style={{ animationDelay: '200ms' }}>
            <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2 font-mono">
              <span className="w-6 h-px bg-[#10B981]/50" /> ABOUT_ME.md
            </h2>
            <div className="tech-card rounded-xl p-8 space-y-6 relative overflow-hidden">
              <div className="corner-brkt absolute inset-0" />
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#10B981]/40" />
              <p className="text-sm text-slate-300 leading-relaxed font-sans font-light whitespace-pre-wrap">{SAMPLE.about}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80 text-xs font-mono">
                <div className="bg-[#0b1329]/40 border border-slate-800/50 p-3 rounded">
                  <span className="text-emerald-500 block text-[9px] uppercase tracking-wider mb-1">LOC:</span>
                  <span className="text-slate-300 font-semibold">{SAMPLE.location}</span>
                </div>
                <div className="bg-[#0b1329]/40 border border-slate-800/50 p-3 rounded">
                  <span className="text-emerald-500 block text-[9px] uppercase tracking-wider mb-1">LNG:</span>
                  <span className="text-slate-300 font-semibold">English</span>
                </div>
                <div className="bg-[#0b1329]/40 border border-slate-800/50 p-3 rounded">
                  <span className="text-emerald-500 block text-[9px] uppercase tracking-wider mb-1">EXP:</span>
                  <span className="text-slate-300 font-semibold">{SAMPLE.experience} Years</span>
                </div>
                <div className="bg-[#0b1329]/40 border border-slate-800/50 p-3 rounded">
                  <span className="text-emerald-500 block text-[9px] uppercase tracking-wider mb-1">TYPE:</span>
                  <span className="text-slate-300 font-semibold text-ellipsis overflow-hidden block">{SAMPLE.employment}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section id="skills" className="space-y-4 reveal-item" style={{ animationDelay: '300ms' }}>
            <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2 font-mono">
              <span className="w-6 h-px bg-[#10B981]/50" /> TECH_STACK.json
            </h2>
            <div className="tech-card rounded-xl p-8 space-y-6 relative">
              <div className="corner-brkt absolute inset-0" />
              <p className="text-xs text-slate-450 font-sans italic">Core competencies, technical frameworks, and productivity tools utilized:</p>
              <div className="space-y-5 font-mono">
                <div>
                  <span className="text-[9px] text-[#10B981] font-bold tracking-widest uppercase mb-3 block">&lt;LANGUAGES_&_FRAMEWORKS&gt;</span>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE.techSkills.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 bg-emerald-950/20 border border-emerald-500/20 rounded text-xs font-bold text-emerald-400 hover:border-emerald-400 hover:shadow-[0_0_8px_rgba(16,185,129,0.15)] transition-all duration-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-[9px] text-slate-450 font-bold tracking-widest uppercase mb-3 block">&lt;TOOLS_&_PLATFORMS&gt;</span>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE.tools.map((tool) => (
                      <span key={tool} className="px-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded text-xs text-slate-400 hover:border-slate-700 transition-colors">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="space-y-4 reveal-item" style={{ animationDelay: '400ms' }}>
            <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2 font-mono">
              <span className="w-6 h-px bg-[#10B981]/50" /> PROJECTS.log
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {SAMPLE.projects.map((project) => (
                <div key={project.id} className="tech-card rounded-xl p-6 space-y-4 group">
                  <div className="corner-brkt absolute inset-0" />
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors font-sans">{project.title}</h3>
                    <a href={project.url} className="text-[9px] text-emerald-400 hover:underline flex items-center gap-1 font-semibold shrink-0 ml-2">
                      URL_LINK ▶
                    </a>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-sans font-light line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-800/80">
                    {project.tech.split(',').map((t) => (
                      <span key={t} className="px-2.5 py-0.5 bg-[#0b1329]/40 border border-slate-800/60 rounded text-[9px] text-slate-500 hover:text-slate-400 transition-colors">
                        {t.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section id="experience" className="space-y-4 reveal-item" style={{ animationDelay: '500ms' }}>
            <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2 font-mono">
              <span className="w-6 h-px bg-[#10B981]/50" /> WORK_HISTORY.csv
            </h2>
            <div className="tech-card rounded-xl p-6 flex flex-col sm:flex-row justify-between gap-4 font-sans relative">
              <div className="corner-brkt absolute inset-0" />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white font-mono">{SAMPLE.role}</h3>
                <p className="text-xs text-slate-400 font-light">{SAMPLE.company} &bull; Bengaluru, India</p>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-md font-light">Leading software engineering initiatives, architecting scalable features, and building beautiful user experiences.</p>
              </div>
              <div className="text-left sm:text-right shrink-0 font-mono space-y-1">
                <span className="inline-block text-[9px] font-bold bg-emerald-950/40 text-emerald-400 px-3 py-1 rounded border border-emerald-500/30 led-pulse">{SAMPLE.experience} Years_Exp</span>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest block">{SAMPLE.employment}</p>
              </div>
            </div>
          </section>

          {/* Education */}
          <section id="education" className="space-y-4 reveal-item" style={{ animationDelay: '600ms' }}>
            <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2 font-mono">
              <span className="w-6 h-px bg-[#10B981]/50" /> ACADEMIC_LOG.db
            </h2>
            <div className="space-y-3">
              {SAMPLE.education.map((edu) => (
                <div key={edu.id} className="tech-card rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-3 sm:items-center font-sans relative">
                  <div className="corner-brkt absolute inset-0" />
                  <div>
                    <h3 className="text-xs font-bold text-white font-mono">{edu.degree} in {edu.field}</h3>
                    <p className="text-[11px] text-slate-400 font-light mt-1">{edu.school}</p>
                  </div>
                  <span className="text-[9px] bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1 rounded font-mono shrink-0">
                    [{edu.start} – {edu.end}]
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section id="certifications" className="space-y-4 reveal-item" style={{ animationDelay: '700ms' }}>
            <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2 font-mono">
              <span className="w-6 h-px bg-[#10B981]/50" /> VERIFIED_CERTS.x509
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE.certifications.map((c, i) => (
                <div key={i} className="tech-card rounded-xl p-4 flex items-center gap-3 relative font-sans">
                  <div className="corner-brkt absolute inset-0" />
                  <span className="text-xl shrink-0 filter drop-shadow-[0_0_4px_rgba(16,185,129,0.3)]">🏆</span>
                  <div>
                    <p className="text-xs font-bold text-white font-mono">{c.name}</p>
                    <p className="text-[9px] text-[#10B981] font-mono mt-0.5">{c.issuer}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="space-y-4 reveal-item" style={{ animationDelay: '800ms' }}>
            <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2 font-mono">
              <span className="w-6 h-px bg-[#10B981]/50" /> ESTABLISH_CONTACT.sh
            </h2>
            <div className="tech-card rounded-xl p-8 space-y-5 max-w-lg relative">
              <div className="corner-brkt absolute inset-0" />
              <p className="text-xs text-slate-400 font-sans font-light">Inject parameters to execute secure messaging & collaboration broadcast:</p>
              <div className="space-y-3 font-sans">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">sender_name</label>
                    <input type="text" placeholder="Your Name" className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-emerald-500 focus:shadow-[0_0_8px_rgba(16,185,129,0.15)] transition-all font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">sender_email</label>
                    <input type="email" placeholder="your@email.com" className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-emerald-500 focus:shadow-[0_0_8px_rgba(16,185,129,0.15)] transition-all font-mono" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] text-slate-500 font-mono uppercase tracking-wider">payload_body</label>
                  <textarea rows={4} placeholder="Compose your collaboration proposals..." className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded text-xs text-slate-200 focus:outline-none focus:border-emerald-500 focus:shadow-[0_0_8px_rgba(16,185,129,0.15)] transition-all resize-none font-mono" />
                </div>
                <button className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-black rounded transition-all tracking-widest uppercase hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  EXECUTE._SEND()
                </button>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-24 border-t border-slate-800/40 py-8 text-center relative z-10">
          <p className="text-[9px] font-mono text-slate-500 tracking-wider">
            SYSTEM_COMPILED_BY <span className="text-[#10B981] font-bold">ProfileMitraa</span> &bull; {SAMPLE.name} &bull; ALL RIGHTS RESERVED
          </p>
        </footer>
      </div>
    );
  }

  // ── TEMPLATE 2: Creative Glassmorphism ──────────────────────────────────
  if (template === 'creative_glass') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1E1B4B] via-[#3B0764] to-[#881337] text-white pb-24 relative overflow-x-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;900&family=Playfair+Display:wght@700;900&display=swap');
          .glass2 { background: rgba(255,255,255,0.06); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.12); }
          .glass2-hover:hover { background: rgba(255,255,255,0.10); border-color: rgba(255,255,255,0.22); }
        `}</style>

        <div className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-rose-600/20 blur-[120px] pointer-events-none" />
        <div className="fixed top-1/2 left-0 w-[300px] h-[300px] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none" />

        {/* Demo badge */}
        <div className="fixed top-4 right-4 z-50 bg-amber-400 text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
          DEMO — Creative Glass
        </div>

        {/* Nav */}
        <nav className="sticky top-0 z-30 glass2 border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <span className="text-sm font-black tracking-tight bg-gradient-to-r from-violet-300 to-rose-300 bg-clip-text text-transparent">{SAMPLE.name}</span>
          <div className="flex gap-5 text-xs text-white/60 font-semibold">
            {['About', 'Skills', 'Works', 'Contact'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors">{item}</a>
            ))}
          </div>
        </nav>

        <div className="max-w-3xl mx-auto px-6 pt-16 space-y-16 relative z-10">
          {/* Hero */}
          <section id="hero" className="text-center flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-500 to-rose-500 blur-xl opacity-60 scale-110" />
              <div className="relative w-32 h-32 rounded-full glass2 flex items-center justify-center text-5xl">🎨</div>
            </div>
            <div className="space-y-3">
              <span className="text-[10px] font-bold tracking-widest text-rose-300 uppercase bg-rose-500/20 px-4 py-1.5 rounded-full border border-rose-400/25">Creative Portfolio</span>
              <h1 className="text-5xl sm:text-6xl font-black tracking-tight leading-tight" style={{ fontFamily: 'Playfair Display, serif' }}>{SAMPLE.name}</h1>
              <p className="text-base text-white/70 font-semibold">{SAMPLE.tagline}</p>
              <p className="text-sm text-white/55 leading-relaxed max-w-lg mx-auto font-light">{SAMPLE.description}</p>
            </div>
            <a href="#contact" className="px-8 py-3 bg-gradient-to-r from-violet-500 to-rose-500 hover:from-violet-600 hover:to-rose-600 text-white font-black text-sm rounded-2xl shadow-xl uppercase tracking-widest transition-all">
              Let&apos;s Collaborate ✦
            </a>
          </section>

          {/* About */}
          <section id="about" className="space-y-5">
            <h2 className="text-sm font-black text-rose-300 uppercase tracking-widest flex items-center gap-2"><span className="text-violet-400">✦</span> About</h2>
            <div className="glass2 rounded-3xl p-7 space-y-5">
              <p className="text-sm text-white/75 leading-relaxed font-light">{SAMPLE.about}</p>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs font-semibold">
                <div className="glass2 rounded-2xl p-4"><span className="text-white/40 block mb-1">Location</span><span className="text-white">{SAMPLE.location}</span></div>
                <div className="glass2 rounded-2xl p-4"><span className="text-white/40 block mb-1">Experience</span><span className="text-white">{SAMPLE.experience} Years</span></div>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section id="skills" className="space-y-5">
            <h2 className="text-sm font-black text-rose-300 uppercase tracking-widest flex items-center gap-2"><span className="text-violet-400">✦</span> Skillsets</h2>
            <div className="glass2 rounded-3xl p-7 space-y-4">
              <p className="text-xs text-white/50 font-light italic">Creative technologies and engineering systems I specialise in:</p>
              <div className="flex flex-wrap gap-2">
                {SAMPLE.techSkills.map(s => <span key={s} className="px-4 py-2 rounded-full bg-violet-500/20 border border-violet-400/25 text-xs font-bold text-violet-200 hover:bg-violet-500/30 transition-all">{s}</span>)}
                {SAMPLE.tools.map(t => <span key={t} className="px-4 py-2 rounded-full bg-rose-500/15 border border-rose-400/20 text-xs text-rose-200">{t}</span>)}
                {SAMPLE.softSkills.map(s => <span key={s} className="px-4 py-2 rounded-full bg-amber-500/10 border border-amber-400/15 text-xs text-amber-200">{s}</span>)}
              </div>
            </div>
          </section>

          {/* Projects */}
          <section id="works" className="space-y-5">
            <h2 className="text-sm font-black text-rose-300 uppercase tracking-widest flex items-center gap-2"><span className="text-violet-400">✦</span> Selected Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {SAMPLE.projects.map(p => (
                <div key={p.id} className="glass2 glass2-hover rounded-3xl p-6 space-y-3 transition-all group">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-black text-white uppercase tracking-wide group-hover:text-rose-300 transition-colors">{p.title}</h3>
                    <a href={p.url} className="text-[10px] text-rose-300 hover:underline shrink-0 ml-2">View ↗</a>
                  </div>
                  <p className="text-xs text-white/55 leading-relaxed font-light line-clamp-3">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {p.tech.split(',').map(t => <span key={t} className="px-2 py-0.5 rounded bg-white/10 text-[9px] font-semibold text-white/60">{t.trim()}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section id="experience" className="space-y-5">
            <h2 className="text-sm font-black text-rose-300 uppercase tracking-widest flex items-center gap-2"><span className="text-violet-400">✦</span> Tenure</h2>
            <div className="glass2 rounded-3xl p-7 flex flex-col sm:flex-row justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-white">{SAMPLE.role}</h3>
                <p className="text-xs text-white/50 mt-1">{SAMPLE.company}</p>
                <p className="text-xs text-white/40 leading-relaxed mt-2 max-w-sm font-light">Leading creative direction and engineering of client-facing products. Bridging design and code at scale.</p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="inline-block text-[10px] font-bold bg-violet-600/30 text-violet-300 px-3 py-1.5 rounded-full border border-violet-500/20">{SAMPLE.experience} Years Exp</span>
                <p className="text-[10px] text-white/40 mt-1 uppercase tracking-wider">{SAMPLE.employment}</p>
              </div>
            </div>
          </section>

          {/* Education */}
          <section id="education" className="space-y-5">
            <h2 className="text-sm font-black text-rose-300 uppercase tracking-widest flex items-center gap-2"><span className="text-violet-400">✦</span> Credentials</h2>
            <div className="space-y-3">
              {SAMPLE.education.map(edu => (
                <div key={edu.id} className="glass2 rounded-3xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wide">{edu.degree} in {edu.field}</h3>
                    <p className="text-[11px] text-white/50 mt-1">{edu.school}</p>
                  </div>
                  <span className="text-[10px] glass2 px-3 py-1 rounded-full text-white/60 shrink-0">{edu.start} – {edu.end}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="space-y-5">
            <h2 className="text-sm font-black text-rose-300 uppercase tracking-widest flex items-center gap-2"><span className="text-violet-400">✦</span> Contact</h2>
            <div className="glass2 rounded-3xl p-7 space-y-4 max-w-lg">
              <p className="text-xs text-white/50 font-light">{"Let's connect and co-create something extraordinary:"}</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Your Name" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
                  <input type="email" placeholder="Email Address" className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30" />
                </div>
                <textarea rows={4} placeholder="Tell me about your project..." className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/30 resize-none" />
                <button className="w-full py-3 bg-gradient-to-r from-violet-500 to-rose-500 hover:from-violet-600 hover:to-rose-600 text-white font-black text-xs rounded-2xl uppercase tracking-widest transition-all">Send Message ✦</button>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-24 border-t border-white/10 py-6 text-center">
          <p className="text-xs text-white/30">Crafted with <span className="text-rose-400">ProfileMitraa</span> &bull; {SAMPLE.name}</p>
        </footer>
      </div>
    );
  }

  // ── TEMPLATE 3: Corporate Executive (Premium Dark Navy) ──────────────────
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-white font-sans pb-24 relative overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #0A0F1E; overflow-x: hidden; }
        .corp-bg::before {
          content: '';
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background-image: 
            linear-gradient(rgba(56, 189, 248, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(56, 189, 248, 0.03) 1px, transparent 1px);
          background-size: 60px 60px;
          pointer-events: none; z-index: 0;
        }
        .exec-card {
          background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9));
          border: 1px solid rgba(56, 189, 248, 0.1);
          backdrop-filter: blur(8px);
          transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
        }
        .exec-card:hover {
          border-color: rgba(56, 189, 248, 0.3);
          box-shadow: 0 0 0 1px rgba(56, 189, 248, 0.1), 0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05);
          transform: translateY(-4px);
        }
        .sky-accent { background: linear-gradient(90deg, #38BDF8, #0EA5E9, #7DD3FC); }
        .slide-in-left {
          opacity: 0; transform: translateX(-20px);
          animation: slideInLeft 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .slide-in-right {
          opacity: 0; transform: translateX(20px);
          animation: slideInRight 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .fade-up {
          opacity: 0; transform: translateY(16px);
          animation: fadeUp 700ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes slideInLeft { to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeUp { to { opacity: 1; transform: translateY(0); } }
        .skill-tag { transition: all 300ms ease; }
        .skill-tag:hover {
          background: rgba(56, 189, 248, 0.15);
          border-color: rgba(56, 189, 248, 0.5);
          color: #7DD3FC;
          box-shadow: 0 0 12px rgba(56, 189, 248, 0.15);
        }
        .section-label {
          display: flex; align-items: center; gap: 12px;
          font-size: 10px; font-weight: 900; letter-spacing: 0.2em;
          text-transform: uppercase; color: #38BDF8;
        }
        .section-label::after {
          content: '';
          flex: 1; height: 1px;
          background: linear-gradient(90deg, rgba(56, 189, 248, 0.4), transparent);
        }
      `}</style>

      {/* Grid background layer */}
      <div className="corp-bg" />

      {/* Demo badge */}
      <div className="fixed top-4 right-4 z-50 bg-amber-400 text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest animate-bounce">
        DEMO — Corporate Blue
      </div>

      {/* Ambient glow */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full bg-sky-600/5 blur-[150px] pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-700/8 blur-[120px] pointer-events-none z-0" />

      {/* Executive Nav */}
      <nav className="sticky top-0 z-40 bg-[#060B17]/90 backdrop-blur-xl border-b border-sky-500/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full sky-accent inline-block" />
          <span className="text-sm font-black text-white tracking-tight">{SAMPLE.name}</span>
        </div>
        <div className="flex gap-6 text-[11px] text-slate-500 font-semibold tracking-wider flex-wrap">
          {['About', 'Skills', 'Projects', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-sky-400 transition-colors capitalize">{item}</a>
          ))}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-14 relative z-10">
        {/* Hero Header */}
        <header className="exec-card rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-8 slide-in-left">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-2xl bg-sky-400/20 blur-lg scale-110" />
            <div className="relative w-28 h-28 rounded-2xl exec-card flex items-center justify-center text-5xl shrink-0">💼</div>
          </div>
          <div className="text-center sm:text-left space-y-3 flex-1">
            <span className="inline-block text-[9px] font-black tracking-[0.25em] text-sky-400 uppercase bg-sky-400/10 px-4 py-1.5 rounded border border-sky-500/20">Executive Portfolio</span>
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">{SAMPLE.name}</h1>
            <p className="text-sm font-semibold text-sky-300/80">{SAMPLE.tagline}</p>
            <p className="text-xs text-slate-450 leading-relaxed max-w-xl">{SAMPLE.description}</p>
            <a href="#contact" className="inline-flex items-center gap-2 px-6 py-2.5 bg-sky-500 hover:bg-sky-400 text-white text-xs font-black rounded-xl transition-all shadow-lg shadow-sky-500/20 uppercase tracking-widest">
              Schedule Consultation →
            </a>
          </div>
        </header>

        {/* About */}
        <section id="about" className="space-y-4 slide-in-right" style={{ animationDelay: '100ms' }}>
          <div className="section-label">Professional Profile</div>
          <div className="exec-card rounded-2xl p-7 space-y-5">
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{SAMPLE.about}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5">
              {[
                { label: 'Location', value: SAMPLE.location },
                { label: 'Experience', value: `${SAMPLE.experience} Years` },
                { label: 'Employment', value: SAMPLE.employment },
                { label: 'Language', value: 'English' },
              ].map(({ label, value }) => (
                <div key={label} className="exec-card rounded-xl p-3 text-center cursor-default">
                  <span className="text-sky-400/60 uppercase text-[8px] tracking-widest block mb-1">{label}</span>
                  <span className="text-xs font-bold text-slate-200">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="space-y-4 slide-in-left" style={{ animationDelay: '200ms' }}>
          <div className="section-label">Technical Competencies</div>
          <div className="exec-card rounded-2xl p-7 space-y-5">
            <p className="text-xs text-slate-500 italic">Corporate stack and professional domain expertise:</p>
            <div className="space-y-4">
              <div>
                <span className="text-[9px] text-sky-400/60 uppercase tracking-widest block mb-2">Primary Stack</span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE.techSkills.map((skill) => (
                    <span key={skill} className="skill-tag px-3.5 py-1.5 bg-sky-400/5 border border-sky-500/20 text-xs font-bold text-sky-200 rounded-lg cursor-default">{skill}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-2">Tools & Platforms</span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE.tools.map((tool) => (
                    <span key={tool} className="skill-tag px-3.5 py-1.5 bg-slate-800/60 border border-slate-700/50 text-xs text-slate-400 rounded-lg cursor-default">{tool}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="space-y-4 slide-in-right" style={{ animationDelay: '300ms' }}>
          <div className="section-label">Key Deliverables</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SAMPLE.projects.map((project) => (
              <div key={project.id} className="exec-card rounded-2xl p-6 space-y-3 flex flex-col group">
                <div className="flex-1">
                  <h3 className="text-sm font-black text-white group-hover:text-sky-300 transition-colors leading-snug">{project.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2 line-clamp-3">{project.description}</p>
                </div>
                <a href={project.url} className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 mt-auto pt-1">
                  View Resource →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="space-y-4 slide-in-left" style={{ animationDelay: '400ms' }}>
          <div className="section-label">Tenure Timeline</div>
          <div className="exec-card rounded-2xl p-7 flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-white">{SAMPLE.role}</h3>
              <p className="text-xs text-slate-400 mt-1">{SAMPLE.company} &bull; {SAMPLE.location}</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-md">Leading product engineering and cross-functional teams to deliver B2B analytics solutions at enterprise scale.</p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="inline-block text-[10px] font-black bg-sky-400/10 text-sky-300 border border-sky-500/20 rounded-lg px-3 py-1.5">{SAMPLE.experience} Years Exp</span>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">{SAMPLE.employment}</p>
            </div>
          </div>
        </section>

        {/* Education */}
        <section id="education" className="space-y-4 slide-in-right" style={{ animationDelay: '500ms' }}>
          <div className="section-label">Educational Background</div>
          <div className="space-y-3">
            {SAMPLE.education.map((edu) => (
              <div key={edu.id} className="exec-card rounded-2xl p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="text-xs font-black text-white">{edu.degree} in {edu.field}</h3>
                  <p className="text-[11px] text-slate-400 mt-1">{edu.school}</p>
                </div>
                <span className="text-[10px] bg-slate-800/60 text-slate-400 font-bold px-3 py-1.5 rounded-lg border border-slate-700/50 shrink-0">
                  {edu.start} – {edu.end}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section id="certifications" className="space-y-4 slide-in-left" style={{ animationDelay: '600ms' }}>
          <div className="section-label">Certifications</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE.certifications.map((c, i) => (
              <div key={i} className="exec-card rounded-2xl p-4 flex items-center gap-3">
                <span className="text-xl shrink-0 filter drop-shadow-[0_0_6px_rgba(56,189,248,0.3)]">🏆</span>
                <div>
                  <p className="text-xs font-black text-white">{c.name}</p>
                  <p className="text-[9px] text-sky-400 font-semibold mt-0.5">{c.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="space-y-4 slide-in-right" style={{ animationDelay: '700ms' }}>
          <div className="section-label">Schedule a Consultation</div>
          <div className="exec-card rounded-2xl p-7 space-y-4 max-w-lg">
            <p className="text-xs text-slate-400">Fill in your details below to request a professional consultation:</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Full Name" className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors" />
                <input type="email" placeholder="Email Address" className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors" />
              </div>
              <textarea rows={4} placeholder="Briefly describe your requirements..." className="w-full px-3 py-2.5 bg-slate-900/60 border border-slate-700/50 rounded-xl text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors resize-none" />
              <button className="w-full py-3 bg-sky-500 hover:bg-sky-400 text-white font-black text-xs rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-sky-500/20">
                Submit Request →
              </button>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-20 border-t border-sky-500/10 py-8 text-center relative z-10">
        <p className="text-[10px] text-slate-600 tracking-wider uppercase">Built with <span className="text-sky-400 font-bold">ProfileMitraa</span> &bull; {SAMPLE.name} &bull; All Rights Reserved</p>
      </footer>
    </div>
  );
}
