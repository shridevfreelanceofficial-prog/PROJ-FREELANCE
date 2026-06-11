import Image from 'next/image';
import Link from 'next/link';
import ModernHero from '@/components/animations/ModernHero';
import Reveal from '@/components/animations/Reveal';
import TiltCard from '@/components/animations/TiltCard';
import { query } from '@/lib/db';

export const revalidate = 300;

type FeaturedProject = {
  id: string;
  title: string;
  client_name: string | null;
  description: string | null;
};

export default async function Home() {
  const featuredProjects = await query<FeaturedProject>(
    `SELECT id, title, client_name, description
     FROM project_showcase
     WHERE is_visible = true
     ORDER BY end_date DESC
     LIMIT 2`
  );

  const localBackgroundImages = [
    '/images/hero-bg/1773646749985-mridulashray.png',
    '/images/hero-bg/1773648219823-reu.png',
    '/images/hero-bg/1774172195808-genius_website_cover.png',
    '/images/hero-bg/1779193475577-jaintrading.png',
    '/images/hero-bg/1780742929681-gunesh_car_service_website.png'
  ];

  return (
    <div className="relative w-full">

      {/* ===================== SECTION 1 — HERO ===================== */}
      <div className="sticky top-0 h-screen overflow-hidden z-10">
        <ModernHero projectImages={localBackgroundImages} />
      </div>

      {/* ===================== SECTION 2 — SERVICES ===================== */}
      <div className="sticky top-[85px] h-[calc(100vh-85px)] z-20 bg-white rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.15)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="py-20 flex flex-col justify-center relative min-h-[calc(100vh-85px)]">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#10B981]/8 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 right-[-10%] w-[500px] h-[500px] bg-[#0F766E]/8 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D1FAE5]/60 border border-[#D1FAE5] text-[#0F766E] font-bold tracking-wide text-sm">
                Services
              </div>
              <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">What We Do</h2>
              <p className="mt-4 text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto">
                Clean UX, modern UI, and performance-first builds — crafted end-to-end.
              </p>
            </Reveal>

            <div className="grid lg:grid-cols-2 gap-8">
              <Reveal delay={0.04}>
                <TiltCard className="group h-full">
                  <div className="h-full rounded-3xl p-8 bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-[#00C896]/5 hover:shadow-2xl hover:shadow-[#00C896]/10 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-br from-[#00C896]/20 to-transparent rounded-full blur-2xl opacity-70" />
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00C896] to-[#00E6A8] shadow-md flex items-center justify-center text-white">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="mt-6 text-2xl font-extrabold text-[#0F172A]">Web Development</h3>
                      <p className="mt-3 text-[#475569] text-base leading-relaxed">Websites and web apps with a modern UI, clean UX, and performance-first approach.</p>
                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Link href="/plans/website" className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-[#0F172A] text-white font-black hover:bg-[#10B981] transition-colors">View Packages</Link>
                        <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border border-[#0F172A]/10 bg-white text-[#0F172A] font-black hover:border-[#10B981] hover:text-[#10B981] transition-colors">Talk to Us</Link>
                      </div>
                      <div className="mt-8 flex flex-wrap items-center gap-2 text-sm font-bold text-[#0F766E]">
                        Performance tuned <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> SEO ready <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" /> Scalable
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>

              <Reveal delay={0.08}>
                <TiltCard className="group h-full">
                  <div className="h-full rounded-3xl p-8 bg-[#0F172A] text-white border border-white/10 shadow-2xl transition-all duration-500 relative overflow-hidden">
                    <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#00E6A8]/10 rounded-full blur-2xl" />
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center">
                        <svg className="w-7 h-7 text-[#00E6A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h3 className="mt-6 text-2xl font-extrabold">Mobile App Development</h3>
                      <p className="mt-3 text-white/70 text-base leading-relaxed">Mobile apps with clean UI, stable performance, and scalable architecture.</p>
                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Link href="/plans/app" className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00C896] to-[#00E6A8] text-[#0F172A] font-black hover:opacity-90 transition-opacity">View Packages</Link>
                        <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border border-white/20 text-white font-black hover:border-white/40 transition-colors">Talk to Us</Link>
                      </div>
                      <div className="mt-8 flex flex-wrap items-center gap-2 text-sm font-bold text-white/70">
                        Smooth UX <span className="w-1.5 h-1.5 rounded-full bg-[#00E6A8]" /> Strong architecture <span className="w-1.5 h-1.5 rounded-full bg-[#00E6A8]" /> Maintainable
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== SECTION 3 — PROCESS ===================== */}
      <div className="sticky top-[85px] h-[calc(100vh-85px)] z-30 bg-[#F8FAFC] shadow-[0_-20px_50px_rgba(0,0,0,0.10)] border-t border-slate-200 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="py-20 flex flex-col justify-center min-h-[calc(100vh-85px)]">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D1FAE5]/60 border border-[#D1FAE5] text-[#0F766E] font-bold tracking-wide text-sm">
                Process
              </div>
              <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">How We Work</h2>
              <p className="mt-4 text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto">
                A transparent workflow that keeps you in the loop.
              </p>
            </Reveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Discover', desc: 'Understand goals, users, scope, and timeline.', step: '01' },
                { title: 'Design', desc: 'Wireframes + UI direction with feedback loops.', step: '02' },
                { title: 'Develop', desc: 'Build fast, secure, and maintainable features.', step: '03' },
                { title: 'Launch', desc: 'Deploy, monitor, and support improvements.', step: '04' },
              ].map((s, idx) => (
                <Reveal key={s.title} delay={0.04 * idx}>
                  <TiltCard className="group h-full">
                    <div className="h-full rounded-3xl p-7 bg-white border border-white shadow-xl shadow-[#00C896]/5 hover:shadow-2xl hover:shadow-[#00C896]/10 transition-all duration-500 relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00C896]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <p className="text-xs font-black tracking-[0.25em] text-[#10B981] uppercase">{s.step}</p>
                      <h3 className="mt-3 text-lg font-extrabold text-[#0F172A]">{s.title}</h3>
                      <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">{s.desc}</p>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===================== SECTION 4 — WHY US ===================== */}
      <div className="sticky top-[85px] h-[calc(100vh-85px)] z-40 bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.08)] border-t border-slate-100 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="py-20 flex flex-col justify-center relative min-h-[calc(100vh-85px)]">
          <div className="absolute inset-0 -z-10 pointer-events-none">
            <div className="absolute top-1/2 left-[-10%] w-[520px] h-[520px] bg-[#00E6A8]/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <Reveal>
                <div className="h-full">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D1FAE5]/60 border border-[#D1FAE5] text-[#0F766E] font-bold tracking-wide text-sm">
                    Why Us
                  </div>
                  <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">Why choose ShriDev Freelance?</h2>
                  <div className="mt-8 space-y-4">
                    {[
                      { t: 'Modern stack', d: 'Next.js + clean UI patterns for speed.' },
                      { t: 'Clean UX', d: 'Polished interfaces that users understand.' },
                      { t: 'Reliable delivery', d: 'Clear scope, milestones, and support.' },
                    ].map((x) => (
                      <div key={x.t} className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-2xl bg-[#D1FAE5] flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-extrabold text-[#0F172A] text-base">{x.t}</p>
                          <p className="text-sm text-[#6B7280] leading-relaxed">{x.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="h-full rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-[#00C896]/10 p-10 relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-56 h-56 bg-gradient-to-br from-[#00C896]/20 to-transparent rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-extrabold text-[#0F172A]">Start with a quick message</h3>
                    <p className="mt-3 text-[#6B7280] text-base">Tell us what you&apos;re building, and we&apos;ll reply with a plan.</p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                      <Link href="/contact" className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-[#0F172A] text-white font-black text-sm hover:bg-[#10B981] transition-colors">Contact Us</Link>
                      <a href="mailto:shridevfreelanceofficial@gmail.com" className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl border border-[#0F172A]/10 bg-white font-black text-sm text-[#0F172A] hover:border-[#10B981] hover:text-[#10B981] transition-colors">Email Directly</a>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== SECTION 5 — FOUNDER ===================== */}
      <div className="sticky top-[85px] h-[calc(100vh-85px)] z-50 bg-[#F8FAFC] shadow-[0_-20px_50px_rgba(0,0,0,0.08)] border-t border-slate-200 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="py-20 flex flex-col justify-center relative min-h-[calc(100vh-85px)]">
          <div className="absolute -top-24 left-[-10%] w-[520px] h-[520px] bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 right-[-10%] w-[520px] h-[520px] bg-[#00E6A8]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D1FAE5]/60 border border-[#D1FAE5] text-[#0F766E] font-bold tracking-wide text-sm">
                Founder
              </div>
              <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">Meet the founder</h2>
            </Reveal>

            <Reveal>
              <div className="max-w-3xl mx-auto">
                <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-[#00C896]/10 px-6 py-10 sm:px-10 sm:py-12 relative overflow-hidden">
                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-gradient-to-b from-[#00C896]/18 via-[#00E6A8]/10 to-transparent rounded-full blur-3xl" />
                  <div className="absolute -bottom-24 right-[-15%] w-[420px] h-[420px] bg-[#0F766E]/10 rounded-full blur-3xl" />
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#00C896] to-[#00E6A8] blur-lg opacity-30" />
                      <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[#0F172A] ring-4 ring-white/70 shadow-xl">
                        <Image src="/images/developer-img/Shrikesh.png" alt="Shrikesh Uday Shetty" fill className="object-cover" priority={false} />
                      </div>
                    </div>
                    
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-[#D1FAE5] text-[#0F766E] font-black text-xs tracking-[0.25em] uppercase">
                      Founder
                    </div>
                    
                    <h3 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">Shrikesh Uday Shetty</h3>
                    
                    <p className="mt-4 text-sm text-[#475569] font-medium leading-relaxed max-w-2xl">
                      Passionate Computer Science Graduate with a strong foundation in full-stack development. I love building web applications.
                    </p>

                    <div className="mt-7 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-[#F8FAFC] border border-[#D1FAE5] p-4 text-left">
                        <p className="text-[11px] font-black tracking-[0.25em] uppercase text-[#6B7280]">Phone</p>
                        <p className="mt-1.5 text-base font-extrabold text-[#0F172A]">+91 7045332855</p>
                      </div>
                      <div className="rounded-2xl bg-[#F8FAFC] border border-[#D1FAE5] p-4 text-left">
                        <p className="text-[11px] font-black tracking-[0.25em] uppercase text-[#6B7280]">Degree</p>
                        <p className="mt-1.5 text-base font-extrabold text-[#0F172A]">B.Sc CS</p>
                      </div>
                    </div>

                    <div className="mt-7 flex flex-col sm:flex-row gap-3 w-full">
                      <a href="https://shrikeshshettyportfolio.vercel.app/" target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center px-6 py-3.5 rounded-2xl bg-[#0F172A] text-white font-black text-sm hover:bg-[#10B981] transition-colors">Portfolio</a>
                      <a href="mailto:shrikesh123shetty@gmail.com" className="inline-flex flex-1 items-center justify-center px-6 py-3.5 rounded-2xl border border-[#0F172A]/10 bg-white text-[#0F172A] font-black text-sm hover:border-[#10B981] hover:text-[#10B981] transition-colors">Email</a>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* ===================== SECTION 6 — PROJECTS + CTA ===================== */}
      <div className="sticky top-[85px] h-[calc(100vh-85px)] z-[60] bg-white shadow-[0_-20px_50px_rgba(0,0,0,0.08)] border-t border-slate-100 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="py-20 flex flex-col justify-center min-h-[calc(100vh-85px)]">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
            <Reveal className="mb-10">
              <div className="flex items-end justify-between gap-6 flex-wrap">
                <div>
                  <h2 className="text-3xl font-bold text-[#111827]">Projects</h2>
                  <p className="text-[#6B7280] mt-2 text-base">A quick look at our latest work.</p>
                </div>
                <Link href="/projects" className="hidden md:inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#0F172A] text-white font-bold hover:bg-[#10B981] transition-colors">View All</Link>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-6">
              {featuredProjects.map((p) => (
                <Link key={p.id} href={`/shridevfreelance/projectShowcase/${p.id}`} className="block bg-white/80 border border-[#D1FAE5] rounded-2xl p-6 hover:border-[#10B981] hover:shadow-lg hover:shadow-[#10B981]/10 transition-all">
                  <h3 className="text-xl font-extrabold text-[#0F172A] line-clamp-1">{p.title}</h3>
                  {p.client_name && <p className="mt-2 text-sm font-semibold text-[#0F766E]">Client: {p.client_name}</p>}
                  <p className="mt-3 text-[#6B7280] text-base line-clamp-2">{p.description || 'No description available'}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-[#10B981] font-bold text-base">
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 md:hidden flex justify-center">
              <Link href="/projects" className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#0F172A] text-white font-bold text-sm hover:bg-[#10B981] transition-colors">View All Projects</Link>
            </div>

            <div className="mt-16">
              <div className="rounded-3xl bg-gradient-to-r from-[#0F766E] to-[#10B981] p-10 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <h3 className="text-3xl font-extrabold">Verify a certificate?</h3>
                    <p className="mt-2 text-white/85 text-base">Enter the code to confirm authenticity instantly.</p>
                  </div>
                  <Link href="/certificate-verification" className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-[#0F172A] font-black text-sm hover:bg-[#D1FAE5] transition-colors whitespace-nowrap">
                    Verify Certificate
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
