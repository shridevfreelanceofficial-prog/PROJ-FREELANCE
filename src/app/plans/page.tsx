import HomeHeader from '@/components/HomeHeader';
import Link from 'next/link';
import Reveal from '@/components/animations/Reveal';
import TiltCard from '@/components/animations/TiltCard';

export default function PlansPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#F8FAFC] via-[#D1FAE5]/25 to-[#10B981]/10" />
      <div className="fixed top-0 right-0 -z-10 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl" />
      <div className="fixed bottom-0 left-0 -z-10 w-96 h-96 bg-[#0F766E]/5 rounded-full blur-3xl" />

      <HomeHeader />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <Reveal className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-[#111827]">Plans</h1>
            <p className="mt-3 text-[#374151]">
              Choose a package that fits your goals. Transparent pricing. Clean deliverables.
            </p>
          </Reveal>

          <div className="mt-10 grid lg:grid-cols-2 gap-8">
            <Reveal delay={0.05}>
              <div className="group">
                <TiltCard>
                  <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-[#D1FAE5] p-8 hover:border-[#10B981] transition-all duration-300">
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background:
                          'linear-gradient(120deg, rgba(16,185,129,0.10), rgba(15,118,110,0.06), rgba(209,250,229,0.10))',
                      }}
                    />
                    <div className="relative">
                      <h2 className="text-2xl font-bold text-[#111827]">Website Development</h2>
                      <p className="mt-2 text-[#6B7280]">
                        Landing pages, business websites, dynamic portals, and e-commerce.
                      </p>
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <Link
                          href="/plans/website"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#10B981] text-white font-semibold hover:bg-[#0F766E] transition-colors"
                        >
                          View Packages
                        </Link>
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-[#10B981] text-[#10B981] font-semibold hover:bg-[#D1FAE5] transition-colors"
                        >
                          Talk to Us
                        </Link>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="group">
                <TiltCard>
                  <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-[#D1FAE5] p-8 hover:border-[#10B981] transition-all duration-300">
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background:
                          'linear-gradient(120deg, rgba(16,185,129,0.10), rgba(15,118,110,0.06), rgba(209,250,229,0.10))',
                      }}
                    />
                    <div className="relative">
                      <h2 className="text-2xl font-bold text-[#111827]">App Development</h2>
                      <p className="mt-2 text-[#6B7280]">
                        Android/iOS apps with clean UI, scalable architecture, and long-term support.
                      </p>
                      <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <Link
                          href="/plans/app"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#10B981] text-white font-semibold hover:bg-[#0F766E] transition-colors"
                        >
                          View Packages
                        </Link>
                        <Link
                          href="/contact"
                          className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-[#10B981] text-[#10B981] font-semibold hover:bg-[#D1FAE5] transition-colors"
                        >
                          Talk to Us
                        </Link>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="bg-[#0F766E] text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm opacity-80">© 2026 ShriDev Freelance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
