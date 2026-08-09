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
  if (!validTemplates.includes(template)) return notFound();

  // ── TEMPLATE 1: Tech Minimalist Dark ────────────────────────────────────
  if (template === 'minimal_dark') {
    return (
      <div className="min-h-screen bg-[#070C14] text-[#E2E8F0] pb-24" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Inter:wght@400;500;700;900&display=swap');
          .tag-t1 { transition: all 200ms; }
          .tag-t1:hover { border-color: #10B981; color: #34D399; box-shadow: 0 0 10px rgba(16,185,129,.25); }
        `}</style>

        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Demo badge */}
        <div className="fixed top-4 right-4 z-50 bg-amber-500 text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
          DEMO — Tech Minimalist
        </div>

        {/* Nav */}
        <nav className="sticky top-0 z-30 bg-[#070C14]/90 backdrop-blur-md border-b border-emerald-500/10 px-6 py-4 flex items-center justify-between">
          <span className="text-xs font-bold text-[#10B981] tracking-[0.25em] uppercase">{SAMPLE.name}</span>
          <div className="flex gap-5 text-[11px] text-slate-400 font-bold tracking-wider">
            {['ABOUT', 'STACK', 'PROJECTS', 'CONTACT'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#10B981] transition-colors">{item}</a>
            ))}
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 pt-16 space-y-20">
          {/* Hero */}
          <section id="hero" className="flex flex-col sm:flex-row items-start gap-8 border-b border-emerald-500/15 pb-14">
            <div className="w-28 h-28 rounded-xl bg-[#0F172A] border-2 border-[#10B981] flex items-center justify-center text-5xl shrink-0" style={{ boxShadow: '0 0 28px rgba(16,185,129,0.3)' }}>💻</div>
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-bold text-[#10B981] tracking-[0.3em] uppercase bg-[#10B981]/10 px-3 py-1 rounded border border-[#10B981]/25">ACTIVE &bull; OPEN TO WORK</span>
                <h1 className="text-4xl sm:text-5xl font-black text-white mt-3 tracking-tight">{SAMPLE.name}</h1>
                <p className="text-[#10B981] font-bold text-sm mt-2 tracking-wider">&gt; {SAMPLE.tagline}</p>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed max-w-xl" style={{ fontFamily: 'Inter, sans-serif' }}>{SAMPLE.description}</p>
              <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#10B981] text-[#10B981] hover:bg-[#10B981] hover:text-white text-xs font-black rounded-lg transition-all tracking-widest uppercase">
                INITIATE CONTACT ▶
              </a>
            </div>
          </section>

          {/* About */}
          <section id="about" className="space-y-5">
            <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2">
              <span className="w-6 h-px bg-[#10B981]" /> ABOUT_ME.md
            </h2>
            <div className="bg-[#0A111E] border border-[#10B981]/15 rounded-xl p-6 space-y-4 relative overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
              <div className="absolute left-0 top-0 bottom-0 w-px bg-[#10B981]" />
              <p className="text-sm text-slate-300 leading-relaxed">{SAMPLE.about}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div><span className="text-[#10B981]">LOC:</span><p className="text-slate-300 mt-0.5">Bengaluru, IN</p></div>
                <div><span className="text-[#10B981]">EXP:</span><p className="text-slate-300 mt-0.5">5+ Years</p></div>
                <div><span className="text-[#10B981]">TYPE:</span><p className="text-slate-300 mt-0.5">Full-time</p></div>
                <div><span className="text-[#10B981]">LNG:</span><p className="text-slate-300 mt-0.5">English</p></div>
              </div>
            </div>
          </section>

          {/* Skills */}
          <section id="skills" className="space-y-5">
            <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2">
              <span className="w-6 h-px bg-[#10B981]" /> TECH_STACK.json
            </h2>
            <div className="space-y-4">
              <div>
                <span className="text-[9px] text-[#10B981] font-black tracking-widest uppercase mb-2 block">LANGUAGES & FRAMEWORKS</span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE.techSkills.map(s => <span key={s} className="tag-t1 px-3 py-1.5 bg-[#10B981]/5 border border-[#10B981]/25 rounded text-xs font-bold text-[#34D399]">{s}</span>)}
                </div>
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-black tracking-widest uppercase mb-2 block">TOOLS & PLATFORMS</span>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE.tools.map(t => <span key={t} className="tag-t1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded text-xs text-slate-400">{t}</span>)}
                </div>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section id="projects" className="space-y-5">
            <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2">
              <span className="w-6 h-px bg-[#10B981]" /> PROJECTS.log
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {SAMPLE.projects.map(p => (
                <div key={p.id} className="bg-[#0A111E] border border-slate-800 hover:border-[#10B981]/40 rounded-xl p-5 space-y-3 transition-all group" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-black text-white group-hover:text-[#10B981] transition-colors">{p.title}</h3>
                    <a href={p.url} className="text-[10px] text-[#10B981] hover:underline shrink-0 ml-2">URL ▶</a>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{p.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800">
                    {p.tech.split(',').map(t => <span key={t} className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-500">{t.trim()}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience */}
          <section id="experience" className="space-y-5">
            <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2">
              <span className="w-6 h-px bg-[#10B981]" /> WORK_HISTORY.csv
            </h2>
            <div className="bg-[#0A111E] border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row justify-between gap-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              <div>
                <h3 className="text-sm font-black text-white">{SAMPLE.role}</h3>
                <p className="text-xs text-slate-400 mt-1">{SAMPLE.company} &bull; Bengaluru, India</p>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-md">Leading a team of 6 engineers building a B2B SaaS analytics product. Responsible for system architecture, API design, code reviews, and stakeholder communication.</p>
              </div>
              <div className="text-left sm:text-right shrink-0">
                <span className="inline-block text-[10px] font-bold bg-[#10B981]/10 text-[#34D399] px-3 py-1 rounded border border-[#10B981]/20">{SAMPLE.experience} Years Exp</span>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{SAMPLE.employment}</p>
              </div>
            </div>
          </section>

          {/* Education */}
          <section id="education" className="space-y-5">
            <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2">
              <span className="w-6 h-px bg-[#10B981]" /> ACADEMIC_LOG.db
            </h2>
            <div className="space-y-3">
              {SAMPLE.education.map(edu => (
                <div key={edu.id} className="bg-[#0A111E] border border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row justify-between gap-3 sm:items-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <div>
                    <h3 className="text-xs font-black text-white">{edu.degree} in {edu.field}</h3>
                    <p className="text-[11px] text-slate-400 mt-1">{edu.school}</p>
                  </div>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-3 py-1 rounded shrink-0">{edu.start} – {edu.end}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          <section id="certifications" className="space-y-5">
            <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2">
              <span className="w-6 h-px bg-[#10B981]" /> VERIFIED_CERTS.x509
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE.certifications.map((c, i) => (
                <div key={i} className="bg-[#0A111E] border border-slate-800 rounded-xl p-4 flex items-center gap-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="text-xl shrink-0">🏆</span>
                  <div><p className="text-xs font-black text-white">{c.name}</p><p className="text-[9px] text-[#10B981] mt-0.5">{c.issuer}</p></div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="space-y-5">
            <h2 className="text-[10px] font-black text-[#10B981] tracking-[0.3em] uppercase flex items-center gap-2">
              <span className="w-6 h-px bg-[#10B981]" /> ESTABLISH_CONTACT.sh
            </h2>
            <div className="bg-[#0A111E] border border-slate-800 rounded-xl p-6 space-y-4 max-w-lg" style={{ fontFamily: 'Inter, sans-serif' }}>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-[9px] text-slate-500 uppercase block mb-1">Name</label><input type="text" placeholder="Your Name" className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#10B981]" /></div>
                <div><label className="text-[9px] text-slate-500 uppercase block mb-1">Email</label><input type="email" placeholder="your@email.com" className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#10B981]" /></div>
              </div>
              <div><label className="text-[9px] text-slate-500 uppercase block mb-1">Message</label><textarea rows={4} placeholder="Tell me about your project..." className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-[#10B981] resize-none" /></div>
              <button className="w-full py-2.5 bg-[#10B981] hover:bg-emerald-600 text-white text-xs font-black rounded-lg transition-colors uppercase tracking-widest">EXECUTE._SEND()</button>
            </div>
          </section>
        </div>

        <footer className="mt-24 border-t border-slate-800/50 py-6 text-center">
          <p className="text-[10px] text-slate-600">Built with <span className="text-[#10B981]">ProfileMitraa</span> &bull; {SAMPLE.name}</p>
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

  // ── TEMPLATE 3: Corporate Grid ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');`}</style>

      {/* Demo badge */}
      <div className="fixed top-4 right-4 z-50 bg-amber-400 text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-widest">
        DEMO — Corporate Blue
      </div>

      {/* Nav */}
      <nav className="bg-[#1E293B] sticky top-0 z-30 px-6 py-4 flex items-center justify-between shadow-lg">
        <span className="text-sm font-black text-white">{SAMPLE.name}</span>
        <div className="flex gap-6 text-xs text-slate-400 font-semibold">
          {['About', 'Skills', 'Projects', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className={`hover:text-white transition-colors ${item === 'Projects' ? 'font-bold text-sky-400' : ''}`}>{item}</a>
          ))}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-12 space-y-14">
        {/* Hero */}
        <section id="hero" className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col sm:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-5xl shrink-0">💼</div>
          <div className="text-center sm:text-left space-y-3">
            <span className="inline-block text-[9px] font-black tracking-widest text-sky-600 bg-sky-50 px-3 py-1 rounded border border-sky-200 uppercase">Professional Portfolio</span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{SAMPLE.name}</h1>
            <p className="text-sm font-bold text-slate-500">{SAMPLE.tagline}</p>
            <p className="text-sm text-slate-500 leading-relaxed max-w-xl">{SAMPLE.description}</p>
            <a href="#contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E293B] hover:bg-slate-700 text-white text-xs font-black rounded-xl transition-all shadow-sm">
              Schedule Consultation →
            </a>
          </div>
        </section>

        {/* About */}
        <section id="about" className="space-y-4">
          <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Professional Profile</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 space-y-5">
            <p className="text-sm text-slate-600 leading-relaxed">{SAMPLE.about}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-600">
              <div><span className="text-slate-400 uppercase text-[9px] block mb-1">Location</span>{SAMPLE.location}</div>
              <div><span className="text-slate-400 uppercase text-[9px] block mb-1">Experience</span>{SAMPLE.experience} Years</div>
              <div><span className="text-slate-400 uppercase text-[9px] block mb-1">Employment</span>{SAMPLE.employment}</div>
              <div><span className="text-slate-400 uppercase text-[9px] block mb-1">Language</span>English</div>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="space-y-4">
          <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Technical Competencies</h2>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-7 space-y-4">
            <div className="flex flex-wrap gap-2">
              {SAMPLE.techSkills.map(s => <span key={s} className="px-3.5 py-1.5 bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg hover:border-sky-400 hover:text-sky-700 transition-all">{s}</span>)}
              {SAMPLE.tools.map(t => <span key={t} className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 text-xs text-slate-500 rounded-lg">{t}</span>)}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="space-y-4">
          <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Key Deliverables</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SAMPLE.projects.map(p => (
              <div key={p.id} className="bg-white border border-slate-200 hover:border-sky-400 hover:shadow-md rounded-2xl p-6 space-y-3 transition-all flex flex-col">
                <div>
                  <h3 className="text-sm font-black text-slate-900 leading-snug">{p.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-3">{p.description}</p>
                </div>
                <a href={p.url} className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 mt-auto">View Resource →</a>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="space-y-4">
          <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Tenure Timeline</h2>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-7 flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-slate-900">{SAMPLE.role}</h3>
              <p className="text-xs text-slate-500 mt-1">{SAMPLE.company} &bull; {SAMPLE.location}</p>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-md">Leading product engineering and cross-functional teams to deliver B2B analytics solutions at enterprise scale.</p>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <span className="inline-block text-[10px] font-black bg-sky-50 text-sky-700 border border-sky-200 rounded px-3 py-1">{SAMPLE.experience} Years</span>
              <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider">{SAMPLE.employment}</p>
            </div>
          </div>
        </section>

        {/* Education */}
        <section id="education" className="space-y-4">
          <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Educational Background</h2>
          <div className="space-y-3">
            {SAMPLE.education.map(edu => (
              <div key={edu.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="text-xs font-black text-slate-900">{edu.degree} in {edu.field}</h3>
                  <p className="text-[11px] text-slate-500 mt-1">{edu.school}</p>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">{edu.start} – {edu.end}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Certifications */}
        <section id="certifications" className="space-y-4">
          <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Certifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE.certifications.map((c, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                <span className="text-xl">🏆</span>
                <div><p className="text-xs font-black text-slate-900">{c.name}</p><p className="text-[9px] text-sky-600 font-bold mt-0.5">{c.issuer}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="space-y-4">
          <h2 className="text-[10px] font-black text-slate-700 uppercase tracking-widest border-l-4 border-sky-500 pl-3">Schedule a Consultation</h2>
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-7 space-y-4 max-w-lg">
            <p className="text-xs text-slate-500">Fill in your details below to request a professional consultation:</p>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Full Name" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-sky-400" />
                <input type="email" placeholder="Email Address" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-sky-400" />
              </div>
              <textarea rows={4} placeholder="Briefly describe your requirements..." className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-sky-400 resize-none" />
              <button className="w-full py-2.5 bg-[#1E293B] hover:bg-slate-700 text-white font-black text-xs rounded-xl uppercase tracking-widest transition-all shadow-sm">Submit Request →</button>
            </div>
          </div>
        </section>
      </div>

      <footer className="mt-20 border-t border-slate-200 py-6 text-center bg-white">
        <p className="text-xs text-slate-400">Built with <span className="text-sky-600 font-bold">ProfileMitraa</span> &bull; {SAMPLE.name}</p>
      </footer>
    </div>
  );
}
