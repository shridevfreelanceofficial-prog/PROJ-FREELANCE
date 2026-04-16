import Image from 'next/image';
import Link from 'next/link';
import ScrollytellingHero from '@/components/animations/ScrollytellingHero';
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

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-clip">
      {/* Page Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#F8FAFC] via-[#D1FAE5]/30 to-[#10B981]/10" />
      <div className="fixed top-0 right-0 -z-10 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl" />
      <div className="fixed bottom-0 left-0 -z-10 w-96 h-96 bg-[#0F766E]/5 rounded-full blur-3xl" />
      {/* New Scrollytelling Hero */}
      <main className="flex-1">
        <ScrollytellingHero />        {/* What We Do */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-[#10B981]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 right-[-10%] w-[600px] h-[600px] bg-[#0F766E]/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-[#D1FAE5] text-[#0F766E] font-bold tracking-wide">
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
                  <div className="h-full rounded-3xl p-8 bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-[#00C896]/5 hover:shadow-2xl hover:shadow-[#00C896]/15 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-br from-[#00C896]/25 to-transparent rounded-full blur-2xl opacity-70" />
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#00C896] to-[#00E6A8] shadow-lg shadow-[#00C896]/30 flex items-center justify-center text-white">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="mt-6 text-2xl font-extrabold text-[#0F172A]">Web Development</h3>
                      <p className="mt-3 text-[#475569] text-base leading-relaxed">
                        Websites and web apps with a modern UI, clean UX, and performance-first approach.
                      </p>
                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Link
                          href="/plans/website"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-[#0F172A] text-white font-black hover:bg-[#10B981] hover:-translate-y-0.5 active:scale-[0.99] transition-all"
                        >
                          View Packages
                        </Link>
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border border-[#0F172A]/10 bg-white text-[#0F172A] font-black hover:border-[#10B981] hover:text-[#10B981] hover:-translate-y-0.5 active:scale-[0.99] transition-all"
                        >
                          Talk to Us
                        </Link>
                      </div>
                      <div className="mt-8 flex items-center gap-2 text-sm font-bold text-[#0F766E]">
                        Performance tuned
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        SEO ready
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        Scalable
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>

              <Reveal delay={0.08}>
                <TiltCard className="group h-full">
                  <div className="h-full rounded-3xl p-8 bg-[#0F172A] text-white border border-white/10 shadow-2xl shadow-[#0F172A]/10 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                    <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#00E6A8]/10 rounded-full blur-2xl" />
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 shadow-lg flex items-center justify-center">
                        <svg className="w-7 h-7 text-[#00E6A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="mt-6 text-2xl font-extrabold">Mobile App Development</h3>
                      <p className="mt-3 text-white/70 text-base leading-relaxed">
                        Mobile apps with clean UI, stable performance, and scalable architecture.
                      </p>
                      <div className="mt-7 flex flex-wrap items-center gap-3">
                        <Link
                          href="/plans/app"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-gradient-to-r from-[#00C896] to-[#00E6A8] text-[#0F172A] font-black hover:shadow-lg hover:shadow-[#00C896]/30 hover:-translate-y-0.5 active:scale-[0.99] transition-all"
                        >
                          View Packages
                        </Link>
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-2xl border border-white/20 text-white font-black hover:border-white/50 hover:bg-white/10 hover:-translate-y-0.5 active:scale-[0.99] transition-all"
                        >
                          Talk to Us
                        </Link>
                      </div>
                      <div className="mt-8 flex items-center gap-2 text-sm font-bold text-white/80">
                        Smooth UX
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E6A8]" />
                        Strong architecture
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00E6A8]" />
                        Maintainable
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-[#D1FAE5] text-[#0F766E] font-bold tracking-wide">
                Process
              </div>
              <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">How We Work</h2>
              <p className="mt-4 text-lg md:text-xl text-[#6B7280] max-w-2xl mx-auto">
                A transparent workflow that keeps you in the loop — from idea to launch.
              </p>
            </Reveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[{ title: 'Discover', desc: 'Understand goals, users, scope, and timeline.' },
              { title: 'Design', desc: 'Wireframes + UI direction with feedback loops.' },
              { title: 'Develop', desc: 'Build fast, secure, and maintainable features.' },
              { title: 'Launch', desc: 'Deploy, monitor, and support improvements.' },
              ].map((s, idx) => (
                <Reveal key={s.title} delay={0.04 * idx}>
                  <TiltCard className="group h-full">
                    <div className="h-full rounded-3xl p-7 bg-white/70 backdrop-blur-xl border border-white shadow-xl shadow-[#00C896]/5 hover:shadow-2xl hover:shadow-[#00C896]/10 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#00C896]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <p className="text-xs font-black tracking-[0.25em] text-[#10B981] uppercase">Step {idx + 1}</p>
                      <h3 className="mt-3 text-lg font-extrabold text-[#0F172A]">{s.title}</h3>
                      <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">{s.desc}</p>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-[-10%] w-[520px] h-[520px] bg-[#00E6A8]/10 rounded-full blur-3xl" />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-stretch">
              <Reveal>
                <div className="h-full">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-[#D1FAE5] text-[#0F766E] font-bold tracking-wide">
                    Why Us
                  </div>
                  <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
                    Why choose ShriDev Freelance?
                  </h2>
                  <p className="mt-4 text-lg text-[#6B7280]">
                    You get production-quality delivery, clear communication, and an approach focused on your business outcomes.
                  </p>

                  <div className="mt-8 space-y-4">
                    {[{ t: 'Modern stack', d: 'Next.js + clean UI patterns for speed and maintainability.' },
                    { t: 'Clean UX', d: 'Polished interfaces that users can understand quickly.' },
                    { t: 'Reliable delivery', d: 'Clear scope, milestones, and post-launch support.' },
                    ].map((x) => (
                      <div key={x.t} className="flex gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-[#D1FAE5] ring-1 ring-[#10B981]/10 flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-extrabold text-[#0F172A]">{x.t}</p>
                          <p className="text-sm text-[#6B7280] leading-relaxed">{x.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.08} y={20}>
                <div className="h-full rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-2xl shadow-[#00C896]/10 p-8 sm:p-10 relative overflow-hidden">
                  <div className="absolute -top-12 -right-12 w-56 h-56 bg-gradient-to-br from-[#00C896]/25 to-transparent rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <h3 className="text-2xl font-extrabold text-[#0F172A]">Start with a quick message</h3>
                    <p className="mt-3 text-[#6B7280] text-base">
                      Tell us what you’re building, and we’ll reply with a plan and estimate.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-3">
                      <Link
                        href="/contact"
                        className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl bg-[#0F172A] text-white font-black hover:bg-[#10B981] hover:-translate-y-0.5 active:scale-[0.99] transition-all"
                      >
                        Contact Us
                      </Link>
                      <a
                        href="mailto:shridevfreelanceofficial@gmail.com"
                        className="inline-flex items-center justify-center px-7 py-3.5 rounded-2xl border border-[#0F172A]/10 bg-white font-black text-[#0F172A] hover:border-[#10B981] hover:text-[#10B981] hover:-translate-y-0.5 active:scale-[0.99] transition-all"
                      >
                        Email Directly
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute -top-24 left-[-10%] w-[520px] h-[520px] bg-[#10B981]/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 right-[-10%] w-[520px] h-[520px] bg-[#00E6A8]/10 rounded-full blur-3xl" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-[#D1FAE5] text-[#0F766E] font-bold tracking-wide">
                Founder
              </div>
              <h2 className="mt-5 text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">Meet the founder</h2>
              <p className="mt-4 text-lg text-[#6B7280] max-w-2xl mx-auto">
                The human behind the builds — focused on clean code, clean UX, and real outcomes.
              </p>
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
                        <Image
                          src="/images/developer-img/Shrikesh.png"
                          alt="Shrikesh Uday Shetty"
                          fill
                          className="object-cover"
                          priority={false}
                        />
                      </div>
                    </div>

                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-[#D1FAE5] text-[#0F766E] font-black text-xs tracking-[0.25em] uppercase">
                      Founder
                    </div>

                    <h3 className="mt-4 text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                      Shrikesh Uday Shetty
                    </h3>

                    <p className="mt-4 text-[#475569] font-medium leading-relaxed max-w-2xl">
                      I&apos;m a passionate Computer Science Graduate with a strong foundation in full-stack development. I love building web applications and solving complex problems through code. My journey in tech has equipped me with diverse skills in both frontend and backend technologies.
                    </p>

                    <div className="mt-7 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-[#F8FAFC] border border-[#D1FAE5] p-4 text-left">
                        <p className="text-[11px] font-black tracking-[0.25em] uppercase text-[#6B7280]">Phone</p>
                        <p className="mt-1.5 text-base font-extrabold text-[#0F172A]">+91 7045332855</p>
                      </div>
                      <div className="rounded-2xl bg-[#F8FAFC] border border-[#D1FAE5] p-4 text-left">
                        <p className="text-[11px] font-black tracking-[0.25em] uppercase text-[#6B7280]">Degree</p>
                        <p className="mt-1.5 text-base font-extrabold text-[#0F172A]">B.Sc Computer Science</p>
                      </div>
                    </div>

                    <div className="mt-7 flex flex-col sm:flex-row gap-3 w-full">
                      <a
                        href="https://shrikeshshettyportfolio.vercel.app/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex flex-1 items-center justify-center px-6 py-3.5 rounded-2xl bg-[#0F172A] text-white font-black hover:bg-[#10B981] hover:-translate-y-0.5 active:scale-[0.99] transition-all"
                      >
                        View Portfolio
                      </a>
                      <a
                        href="mailto:shrikesh123shetty@gmail.com"
                        className="inline-flex flex-1 items-center justify-center px-6 py-3.5 rounded-2xl border border-[#0F172A]/10 bg-white text-[#0F172A] font-black hover:border-[#10B981] hover:text-[#10B981] hover:-translate-y-0.5 active:scale-[0.99] transition-all"
                      >
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="mb-10">
              <div className="flex items-end justify-between gap-6 flex-wrap">
                <div>
                  <h2 className="text-3xl font-bold text-[#111827]">Projects</h2>
                  <p className="text-[#6B7280] mt-2">A quick look at our latest work.</p>
                </div>
              </div>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-6">
              {featuredProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/shridevfreelance/projectShowcase/${p.id}`}
                  className="block bg-white/80 backdrop-blur-sm border border-[#D1FAE5] rounded-2xl p-6 hover:border-[#10B981] hover:shadow-lg hover:shadow-[#10B981]/10 transition-all"
                >
                  <h3 className="text-xl font-extrabold text-[#0F172A]">{p.title}</h3>
                  {p.client_name ? (
                    <p className="mt-2 text-sm font-semibold text-[#0F766E]">Client: {p.client_name}</p>
                  ) : null}
                  <p className="mt-3 text-[#6B7280] line-clamp-3">{p.description || 'No description available'}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-[#10B981] font-bold">
                    View Details
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 flex justify-center">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#0F172A] text-white font-bold hover:bg-[#10B981] transition-colors"
              >
                View More
              </Link>
            </div>
          </div>
        </section>

        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-3xl bg-gradient-to-r from-[#0F766E] to-[#10B981] p-8 sm:p-10 text-white overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold">Want to verify a certificate?</h3>
                  <p className="mt-2 text-white/85">Enter the certificate code to confirm authenticity instantly.</p>
                </div>
                <Link
                  href="/certificate-verification"
                  className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-white text-[#0F172A] font-black hover:bg-[#D1FAE5] transition-colors"
                >
                  Verify Certificate
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
