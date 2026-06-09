'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

interface ModernHeroProps {
  projectImages?: string[];
}

export default function ModernHero({ projectImages = [] }: ModernHeroProps) {
  // If we don't have enough images to tile, we'll repeat the array to make the masonry grid dense
  const gridImages = [...projectImages, ...projectImages, ...projectImages, ...projectImages].slice(0, 16);

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0F172A]">
      {/* Sticky Overall Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/images/hero-bg/hero-bg.png" 
          alt="Hero Background" 
          fill
          priority
          className="object-cover opacity-70"
        />
      </div>

      {/* Dynamic Background Grid (Local Images) */}
      {gridImages.length > 0 && (
        <div className="absolute inset-0 z-0 overflow-hidden opacity-90 flex gap-4 p-4 items-center justify-center -rotate-6 scale-125 pointer-events-none">
          <motion.div 
            animate={{ x: [0, -1000] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="flex gap-4 flex-nowrap"
          >
            {/* Render 2 identical sets of columns for seamless infinite scrolling */}
            {[0, 1].map((setIndex) => (
              <div key={setIndex} className="flex gap-4 flex-nowrap">
                {/* Column 1 - Downwards */}
                <div className="flex flex-col gap-4 min-w-[250px] md:min-w-[350px]">
                  {gridImages.slice(0, 4).map((img, i) => (
                    <div key={`${setIndex}-col1-${i}`} className="relative w-full h-[200px] md:h-[300px]">
                      <Image 
                        src={img} 
                        alt="Project" 
                        fill
                        sizes="(max-width: 768px) 250px, 350px"
                        priority={setIndex === 0 && i < 2}
                        className="object-cover rounded-2xl border border-white/10 shadow-2xl"
                      />
                    </div>
                  ))}
                </div>
                {/* Column 2 - Offset upwards */}
                <div className="flex flex-col gap-4 min-w-[250px] md:min-w-[350px] -translate-y-24">
                  {gridImages.slice(4, 8).map((img, i) => (
                    <div key={`${setIndex}-col2-${i}`} className="relative w-full h-[200px] md:h-[300px]">
                      <Image 
                        src={img} 
                        alt="Project" 
                        fill
                        sizes="(max-width: 768px) 250px, 350px"
                        priority={setIndex === 0 && i < 2}
                        className="object-cover rounded-2xl border border-white/10 shadow-2xl"
                      />
                    </div>
                  ))}
                </div>
                {/* Column 3 - Downwards */}
                <div className="flex flex-col gap-4 min-w-[250px] md:min-w-[350px]">
                  {gridImages.slice(8, 12).map((img, i) => (
                    <div key={`${setIndex}-col3-${i}`} className="relative w-full h-[200px] md:h-[300px]">
                      <Image 
                        src={img} 
                        alt="Project" 
                        fill
                        sizes="(max-width: 768px) 250px, 350px"
                        className="object-cover rounded-2xl border border-white/10 shadow-2xl"
                      />
                    </div>
                  ))}
                </div>
                {/* Column 4 - Offset upwards */}
                <div className="flex flex-col gap-4 min-w-[250px] md:min-w-[350px] -translate-y-12">
                  {gridImages.slice(12, 16).map((img, i) => (
                    <div key={`${setIndex}-col4-${i}`} className="relative w-full h-[200px] md:h-[300px]">
                      <Image 
                        src={img} 
                        alt="Project" 
                        fill
                        sizes="(max-width: 768px) 250px, 350px"
                        className="object-cover rounded-2xl border border-white/10 shadow-2xl"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      )}

      {/* Dark Overlays for Text Legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-[#0F172A]/40 z-0 pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent,_#0F172A_80%)] z-0 pointer-events-none opacity-80"></div>

      {/* Static Background Orbs for Color */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full bg-gradient-to-tr from-[#00C896]/25 to-[#0F766E]/15 blur-[120px] pointer-events-none z-0 mix-blend-screen" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center mt-10">
        
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 shadow-2xl mb-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E6A8] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E6A8]"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">Premium Web Solutions</span>
        </motion.div>

        {/* Hero Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] font-black text-white tracking-tighter leading-[1.05] mb-8 drop-shadow-2xl"
        >
          Build your <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C896] via-[#00E6A8] to-[#7CFFD6] filter drop-shadow-[0_0_30px_rgba(0,200,150,0.4)]">
            digital presence.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg sm:text-xl md:text-2xl text-slate-200 font-medium max-w-3xl mx-auto mb-12 leading-relaxed drop-shadow-xl bg-black/30 p-4 rounded-2xl backdrop-blur-md"
        >
          We engineer high-performance websites, dynamic web apps, and stunning UI designs tailored to scale modern businesses.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto"
        >
          <Link
            href="/contact"
            className="group relative flex items-center justify-center px-10 py-4 w-full sm:w-auto rounded-full bg-gradient-to-r from-[#00C896] to-[#00E6A8] text-[#020617] font-extrabold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(0,200,150,0.5)] active:scale-95"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
            <span className="relative flex items-center gap-2">
              Start Your Project
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Link>
          
          <Link
            href="/projects"
            className="group flex items-center justify-center px-10 py-4 w-full sm:w-auto rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg hover:bg-white/20 hover:border-white/30 transition-all hover:scale-105 active:scale-95 shadow-lg"
          >
            View Our Work
          </Link>
        </motion.div>

      </div>

      {/* Mouse Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60 z-20 pointer-events-none"
      >
        <div className="w-5 h-8 border-2 border-white/40 rounded-full flex justify-center p-1">
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 bg-white/80 rounded-full"
          />
        </div>
        <span className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Scroll</span>
      </motion.div>

    </section>
  );
}
