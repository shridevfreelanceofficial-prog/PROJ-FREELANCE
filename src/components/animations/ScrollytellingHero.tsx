'use client';

import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';
import CanvasImageSequence from './CanvasImageSequence';

export default function ScrollytellingHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [bgColor, setBgColor] = useState('#F4FFFA');
  const [activeLayer, setActiveLayer] = useState(0);
  const [showScrollHint, setShowScrollHint] = useState(true);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setShowScrollHint(latest <= 0.001);
    if (latest < 0.16) setActiveLayer(0);
    else if (latest < 0.37) setActiveLayer(1);
    else if (latest < 0.61) setActiveLayer(2);
    else if (latest < 0.84) setActiveLayer(3);
    else setActiveLayer(4);
  });

  // Floating UI elements transformations during/after explosion (between 0.4 to 0.85)
  // Float left and right away from center
  const floatLeftX = useTransform(scrollYProgress, [0.4, 0.5, 0.85], [0, -250, -300]);
  const floatRightX = useTransform(scrollYProgress, [0.4, 0.5, 0.85], [0, 250, 300]);
  const floatTopY = useTransform(scrollYProgress, [0.4, 0.5, 0.85], [0, -180, -200]);
  const floatBottomY = useTransform(scrollYProgress, [0.4, 0.5, 0.85], [0, 180, 200]);

  const uiOpacity = useTransform(scrollYProgress, [0.4, 0.45, 0.8, 0.9], [0, 1, 1, 0]);
  const uiScale = useTransform(scrollYProgress, [0.4, 0.5], [0.8, 1]);

  return (
    <section ref={containerRef} className="relative w-full h-[500vh] transition-colors duration-1000 ease-out" style={{ backgroundColor: bgColor }}>
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden flex items-center justify-center">

        <AnimatePresence>
          {showScrollHint && (
            <motion.div
              key="scroll-hint"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="px-4 py-2 rounded-full bg-white/55 backdrop-blur-md border border-white/40 shadow-md">
                  <p className="text-xs sm:text-sm font-black tracking-wide text-[#0F172A]">
                    Scroll to explore
                  </p>
                </div>
                <motion.div
                  aria-hidden="true"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-8 h-8 rounded-full bg-white/40 backdrop-blur-md border border-white/40 flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-[#0F172A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Background Effect: Glow during explosion */}
        <motion.div 
          className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#00C896_0%,_transparent_60%)] opacity-0 mix-blend-screen"
          style={{ 
            opacity: useTransform(scrollYProgress, [0.35, 0.5, 0.8, 1], [0, 0.4, 0.2, 0]) 
          }}
        />

        {/* 1. Underlying Canvas Sequence */}
        <div className="absolute inset-0 z-0">
          <CanvasImageSequence 
            progress={scrollYProgress} 
            frameCount={240} 
            onBgColorExtracted={(color) => setBgColor(color)}
          />
        </div>

        {/* 2. Floating Explosion UI Components (Laptops, wireframes, dashboards) */}
        <motion.div 
          className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center"
          style={{ opacity: uiOpacity, scale: uiScale }}
        >
          {/* Laptop Wireframe */}
          <motion.div 
            style={{ x: floatLeftX, y: floatTopY }}
            className="absolute rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl p-4 w-64 h-40 flex flex-col gap-2 rotate-[-5deg]"
          >
            <div className="w-full h-4 bg-white/20 rounded-md" />
            <div className="w-full h-full bg-white/10 rounded-md" />
          </motion.div>

          {/* Mobile Screen */}
          <motion.div 
            style={{ x: floatRightX, y: floatTopY }}
            className="absolute rounded-[2rem] border-4 border-white/20 bg-white/10 backdrop-blur-md shadow-2xl p-2 w-32 h-64 flex flex-col gap-2 rotate-[10deg]"
          >
            <div className="w-10 h-1 mx-auto bg-white/20 rounded-full mt-2 mb-4" />
            <div className="w-full h-8 bg-[#00C896]/20 rounded-lg" />
            <div className="w-full h-full bg-white/10 rounded-lg" />
          </motion.div>

          {/* Dashboard Card */}
          <motion.div 
            style={{ x: floatLeftX, y: floatBottomY }}
            className="absolute rounded-xl border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl p-4 w-56 h-32 flex flex-col gap-3 rotate-[5deg]"
          >
            <div className="flex gap-2 items-center">
              <div className="w-8 h-8 rounded-full bg-[#00E6A8]/30" />
              <div className="w-20 h-3 bg-white/20 rounded-md" />
            </div>
            <div className="w-full flex-1 bg-gradient-to-r from-transparent to-white/10 rounded-md" />
          </motion.div>

          {/* Code Snippet Card */}
          <motion.div 
            style={{ x: floatRightX, y: floatBottomY }}
            className="absolute rounded-xl border border-[#00C896]/30 bg-[#0F172A]/80 backdrop-blur-md shadow-2xl p-4 w-64 h-40 flex flex-col gap-2 rotate-[-8deg] overflow-hidden"
          >
             <div className="flex gap-1 mb-2">
                <div className="w-2 h-2 rounded-full bg-red-400"/>
                <div className="w-2 h-2 rounded-full bg-yellow-400"/>
                <div className="w-2 h-2 rounded-full bg-green-400"/>
             </div>
             <div className="w-3/4 h-2 bg-[#7CFFD6]/50 rounded-md" />
             <div className="w-1/2 h-2 bg-white/30 rounded-md pl-4 ml-4" />
             <div className="w-full h-2 bg-white/20 rounded-md pl-4 mx-4 mt-2" />
             <div className="w-4/5 h-2 bg-white/20 rounded-md pl-4 mx-4" />
          </motion.div>
        </motion.div>

        {/* 3. Text Layers (Managed by AnimatePresence for strict removal) */}
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center p-8 text-center bg-gradient-to-t from-black/20 to-transparent">
          <AnimatePresence mode="wait">
            
            {activeLayer === 0 && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute flex flex-col items-center bottom-[15%]"
              >
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#0F172A] mb-4 drop-shadow-[0_4px_4px_rgba(255,255,255,0.7)] backdrop-blur-sm rounded-2xl p-4 border border-white/10 bg-white/40">
                  Great websites start with a simple idea.
                </h1>
                <p className="text-xl md:text-2xl text-[#1E293B] font-bold max-w-2xl text-center bg-white/40 px-6 py-2 rounded-full drop-shadow-md backdrop-blur-sm">
                  We turn ideas into powerful digital experiences.
                </p>
              </motion.div>
            )}

            {activeLayer === 1 && (
              <motion.div
                key="act1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="absolute flex flex-col items-center bottom-[15%]"
              >
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] mb-4 drop-shadow-[0_4px_4px_rgba(255,255,255,0.7)] backdrop-blur-sm rounded-2xl p-4 border border-white/10 bg-white/40">
                  Where ideas meet technology.
                </h2>
                <p className="text-lg md:text-xl text-[#047857] font-black tracking-wide drop-shadow-md bg-white/80 px-4 py-2 rounded-full backdrop-blur-lg border border-white/50">
                  Modern frameworks &middot; Beautiful UI design &middot; High-performance web development
                </p>
              </motion.div>
            )}

            {activeLayer === 2 && (
              <motion.div
                key="explode"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="absolute flex flex-col items-center bottom-[15%]"
              >
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] mb-4 drop-shadow-[0_4px_4px_rgba(255,255,255,0.7)] backdrop-blur-sm rounded-2xl p-4 border border-white/10 bg-white/40">
                  Engineered for the modern web.
                </h2>
                <div className="text-lg md:text-xl text-[#0F172A] font-bold mx-auto flex flex-col sm:flex-row gap-3">
                  <span className="inline-block bg-white/80 px-5 py-2 rounded-full border border-white shadow-lg backdrop-blur-md">Fast Next.js</span>
                  <span className="inline-block bg-white/80 px-5 py-2 rounded-full border border-white shadow-lg backdrop-blur-md">Responsive UX</span>
                  <span className="inline-block bg-white/80 px-5 py-2 rounded-full border border-white shadow-lg backdrop-blur-md">Scalable APIs</span>
                </div>
              </motion.div>
            )}

            {activeLayer === 3 && (
              <motion.div
                key="eco"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="absolute flex flex-col items-center bottom-[15%]"
              >
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#0F172A] mb-4 drop-shadow-[0_4px_4px_rgba(255,255,255,0.7)] backdrop-blur-sm rounded-2xl p-4 border border-white/10 bg-white/40">
                  Designed to perform everywhere.
                </h2>
                <p className="text-lg md:text-xl text-[#1E293B] font-black drop-shadow-md bg-white/80 px-6 py-2 rounded-full backdrop-blur-md border border-white">
                  Websites &middot; Web Apps &middot; Mobile Experiences
                </p>
              </motion.div>
            )}
            
            {activeLayer === 4 && (
              <motion.div
                key="final"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute flex flex-col items-center justify-center inset-0 bg-[#F8FAFC]/80 backdrop-blur-md pointer-events-auto"
              >
                <div className="max-w-3xl px-6 text-center transform -translate-y-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#00C896] to-[#00E6A8] rounded-2xl mx-auto shadow-2xl shadow-[#00C896]/50 mb-8 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-[#0F172A] mb-6">
                    Build your digital presence.
                  </h1>
                  <p className="text-xl md:text-2xl text-[#475569] mb-10 font-bold">
                    Premium websites crafted for modern businesses.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href="/contact"
                      className="px-8 py-4 bg-[#0F172A] text-white rounded-full font-bold shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 text-lg flex items-center justify-center gap-2"
                    >
                      Start Your Project
                    </a>
                    <a 
                      href="/projects"
                      className="px-8 py-4 bg-white text-[#0F172A] border-2 border-slate-200 rounded-full font-bold shadow-sm hover:border-[#00C896] hover:text-[#00C896] transition-all duration-300 text-lg flex items-center justify-center"
                    >
                      View Projects
                    </a>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
