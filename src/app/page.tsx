import Link from 'next/link';
import HomeHeader from '@/components/HomeHeader';
import ParticlesHeroBackground from '@/components/ParticlesHeroBackground';
import Reveal from '@/components/animations/Reveal';
import TiltCard from '@/components/animations/TiltCard';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Page Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#F8FAFC] via-[#D1FAE5]/30 to-[#10B981]/10" />
      <div className="fixed top-0 right-0 -z-10 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl" />
      <div className="fixed bottom-0 left-0 -z-10 w-96 h-96 bg-[#0F766E]/5 rounded-full blur-3xl" />
      {/* Header */}
      <HomeHeader />

      {/* Hero Section */}
      <main className="flex-1">
        <section
          className="w-full pt-16 pb-10 min-h-[560px] sm:min-h-[520px] md:min-h-0 relative overflow-hidden"
        >
          <ParticlesHeroBackground />

          <div className="max-w-7xl mx-auto">
            <div className="max-w-4xl mx-auto text-center relative z-10 px-4 py-10">
            <Reveal delay={0.05} y={22} once={false}>
              <h1 className="text-5xl md:text-6xl font-bold text-[#0B1220] mb-6">
                Build. Launch. Scale.
                <span className="block text-[#059669]">Modern Web Solutions for Your Business</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12} y={18} once={false}>
              <p className="text-xl text-[#0B1220]/80 mb-8 max-w-2xl mx-auto">
                We build clean, fast, and reliable web experiences from landing pages to full dashboards.
                Manage projects, collaborate with your team, and showcase your work professionally.
              </p>
            </Reveal>
            <Reveal delay={0.18} y={14} once={false}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/projects"
                  className="px-8 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#0F766E] font-medium transition-colors shadow-lg"
                >
                  View Projects
                </Link>
                <Link
                  href="/certificate-verification"
                  className="px-8 py-3 border-2 border-[#0F766E]/40 text-[#0B1220] rounded-lg hover:bg-[#D1FAE5]/35 font-medium transition-colors"
                >
                  Verify Certificate
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3 bg-white/80 backdrop-blur border-2 border-white text-[#111827] rounded-lg hover:bg-[#F8FAFC] font-medium transition-colors"
                >
                  Get a Quote
                </Link>
              </div>
            </Reveal>
            </div>
          </div>
        </section>

        {/* What We Do */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="mb-12">
              <h2 className="text-3xl font-bold text-center text-[#111827]">
                What We Do
              </h2>
            </Reveal>
            <div className="grid md:grid-cols-3 gap-8">
              <Reveal delay={0.04}>
                <TiltCard className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#D1FAE5] hover:border-[#10B981] transition-all duration-300 cursor-default">
                  <div className="w-12 h-12 bg-[#D1FAE5] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#111827] mb-2">Web Development</h3>
                  <p className="text-[#6B7280]">Websites and web apps with a modern UI, clean UX, and performance-first approach.</p>
                </TiltCard>
              </Reveal>
              <Reveal delay={0.08}>
                <TiltCard className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#D1FAE5] hover:border-[#10B981] transition-all duration-300 cursor-default">
                  <div className="w-12 h-12 bg-[#D1FAE5] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#111827] mb-2">Mobile App Development</h3>
                  <p className="text-[#6B7280]">Mobile apps with clean UI, stable performance, and scalable architecture.</p>
                </TiltCard>
              </Reveal>
              <Reveal delay={0.12}>
                <TiltCard className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#D1FAE5] hover:border-[#10B981] transition-all duration-300 cursor-default">
                  <div className="w-12 h-12 bg-[#D1FAE5] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[#111827] mb-2">Certificates & Automation</h3>
                  <p className="text-[#6B7280]">Generate documents, send emails, and streamline internal workflows.</p>
                </TiltCard>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal>
              <h2 className="text-3xl font-bold text-center text-[#111827] mb-4">How We Work</h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="text-center text-[#6B7280] max-w-2xl mx-auto mb-12">
                A transparent process that keeps you updated from idea to launch.
              </p>
            </Reveal>

            <div className="grid md:grid-cols-4 gap-6">
              {[{ title: 'Discover', desc: 'Understand goals, users, scope, and timeline.' },
              { title: 'Design', desc: 'Wireframes + UI direction with feedback loops.' },
              { title: 'Develop', desc: 'Build fast, secure, and maintainable features.' },
              { title: 'Launch', desc: 'Deploy, monitor, and support improvements.' },
              ].map((s, idx) => (
                <Reveal key={s.title} delay={0.04 * idx}>
                  <div
                    className={`md:transform-none ${
                      idx % 2 === 0
                        ? '-rotate-[2deg] -translate-x-1'
                        : 'rotate-[2deg] translate-x-1'
                    }`}
                  >
                    <TiltCard className="group bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-[#D1FAE5] hover:border-[#10B981] transition-all duration-300 cursor-default">
                      <p className="text-sm font-bold text-[#10B981]">Step {idx + 1}</p>
                      <h3 className="text-lg font-semibold text-[#111827] mt-2">{s.title}</h3>
                      <p className="text-sm text-[#6B7280] mt-2">{s.desc}</p>
                    </TiltCard>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Why us */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#111827]">Why choose ShriDev Freelance?</h2>
                <p className="text-[#6B7280] mt-3">
                  You get production-quality delivery, clear communication, and an approach focused on your business outcomes.
                </p>

                <div className="mt-6 space-y-4">
                  {[{ t: 'Modern stack', d: 'Next.js + clean UI patterns for speed and maintainability.' },
                  { t: 'Clean UX', d: 'Polished interfaces that users can understand quickly.' },
                  { t: 'Reliable delivery', d: 'Clear scope, milestones, and post-launch support.' },
                  ].map((x) => (
                    <div key={x.t} className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#D1FAE5] flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-[#111827]">{x.t}</p>
                        <p className="text-sm text-[#6B7280]">{x.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-[#D1FAE5] rounded-2xl p-8 hover:border-[#10B981] hover:shadow-lg hover:shadow-[#10B981]/10 hover:bg-gradient-to-br hover:from-white hover:to-[#D1FAE5]/30 transition-all duration-300">
                <h3 className="text-xl font-bold text-[#111827]">Start with a quick message</h3>
                <p className="text-[#6B7280] mt-2">
                  Tell us what you’re building, and we’ll reply with a plan and estimate.
                </p>
                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/contact"
                    className="px-6 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#0F766E] font-medium transition-colors text-center"
                  >
                    Contact Us
                  </Link>
                  <a
                    href="mailto:shridevfreelanceofficial@gmail.com"
                    className="px-6 py-3 border-2 border-[#10B981] text-[#10B981] rounded-lg hover:bg-[#D1FAE5] font-medium transition-colors text-center"
                  >
                    Email Directly
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#0F766E] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm opacity-80">© 2026 ShriDev Freelance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
