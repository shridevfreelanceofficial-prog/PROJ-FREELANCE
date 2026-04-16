import Link from 'next/link';
import Reveal from '@/components/animations/Reveal';
import TiltCard from '@/components/animations/TiltCard';

export default function PlansPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#F4FFFA]">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00C896]/10 via-transparent to-transparent opacity-80" />
      <div className="fixed top-[-10%] right-[-5%] -z-10 w-[600px] h-[600px] bg-[#00E6A8]/5 rounded-full blur-[120px]" />
      
      <main className="flex-1 pt-32 pb-24 relative z-10 w-full">
        <section className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <Reveal className="max-w-4xl mx-auto text-center mb-20" delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#0F172A] mb-6 drop-shadow-sm">
              Plans & Pricing
            </h1>
            <p className="text-xl md:text-2xl font-medium text-[#475569]">
              Choose a package that fits your goals. Transparent pricing. Clean deliverables.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-10">
            <Reveal delay={0.15} y={40} className="h-full">
              <TiltCard className="h-full w-full">
                <div className="h-full rounded-3xl bg-white/60 backdrop-blur-xl border border-white p-10 hover:border-[#00C896]/50 hover:shadow-2xl hover:shadow-[#00C896]/20 transition-all duration-500 flex flex-col relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#00C896]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00C896] to-[#00E6A8] p-4 shadow-lg shadow-[#00C896]/30 mb-8 flex items-center justify-center text-white">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  <h2 className="text-3xl font-extrabold text-[#0F172A] mb-4">Website Development</h2>
                  <p className="text-lg text-[#475569] mb-10 leading-relaxed max-w-sm">
                    Landing pages, business websites, dynamic portals, and e-commerce. Designed to scale and convert beautifully.
                  </p>
                  
                  <div className="mt-auto flex flex-col sm:flex-row gap-4 relative z-10 w-full">
                    <Link
                      href="/plans/website"
                      className="inline-flex lg:flex-1 items-center justify-center px-8 py-4 rounded-full bg-[#0F172A] text-white font-bold hover:bg-[#00C896] hover:shadow-lg hover:shadow-[#00C896]/30 hover:-translate-y-1 active:scale-95 transition-all duration-300"
                    >
                      View Packages
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex lg:flex-1 items-center justify-center px-8 py-4 rounded-full border-2 border-[#0F172A]/10 text-[#0F172A] bg-white/50 font-bold hover:border-[#00C896] hover:text-[#00C896] hover:-translate-y-1 active:scale-95 transition-all duration-300"
                    >
                      Talk to Us
                    </Link>
                  </div>
                </div>
              </TiltCard>
            </Reveal>

            <Reveal delay={0.25} y={40} className="h-full">
              <TiltCard className="h-full w-full">
                <div className="h-full rounded-3xl bg-[#0F172A] backdrop-blur-xl border border-white/10 p-10 hover:border-[#00E6A8]/50 hover:shadow-2xl hover:shadow-[#00E6A8]/20 transition-all duration-500 flex flex-col relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#00E6A8]/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="w-16 h-16 rounded-2xl bg-white/10 p-4 border border-white/10 shadow-lg mb-8 flex items-center justify-center text-white">
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-full h-full text-[#00E6A8]">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  <h2 className="text-3xl font-extrabold text-white mb-4">App Development</h2>
                  <p className="text-lg text-white/60 mb-10 leading-relaxed max-w-sm">
                    Android/iOS apps with ultra-clean UI, scalable architecture, and long-term ecosystem support.
                  </p>
                  
                  <div className="mt-auto flex flex-col sm:flex-row gap-4 relative z-10 w-full">
                    <Link
                      href="/plans/app"
                      className="inline-flex lg:flex-1 items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-[#00C896] to-[#00E6A8] text-[#0F172A] font-bold shadow-lg hover:shadow-[#00C896]/30 hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      View Packages
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex lg:flex-1 items-center justify-center px-8 py-4 rounded-full border-2 border-white/20 text-white font-bold hover:border-white/50 hover:bg-white/10 hover:-translate-y-1 active:scale-95 transition-all duration-300"
                    >
                      Talk to Us
                    </Link>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  );
}
