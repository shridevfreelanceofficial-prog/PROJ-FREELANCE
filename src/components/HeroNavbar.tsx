'use client';

import { useState, useEffect } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function HeroNavbar() {
  const pathname = usePathname();
  
  const { scrollY } = useScroll();
  const [isOpen, setIsOpen] = useState(false);
  
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/member')) {
    return null;
  }

  // Floating pill glassmorphism logic (appears on scroll, pill width stays proper)
  const navBackground = useTransform(scrollY, [0, 50], ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.85)']);
  const navBorder = useTransform(scrollY, [0, 50], ['rgba(255, 255, 255, 0)', 'rgba(209, 250, 229, 0.5)']);
  const navShadow = useTransform(scrollY, [0, 50], ['none', '0 10px 30px -10px rgba(16, 185, 129, 0.15)']);
  const navBackdropBlur = useTransform(scrollY, [0, 50], ['blur(0px)', 'blur(16px)']);

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Plans', path: '/plans' },
    { name: 'Contact', path: '/contact' },
    { name: 'Verify Certificate', path: '/certificate-verification', highlight: true }
  ];

  return (
    <>
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none px-4">
        <motion.nav
          style={{
            backgroundColor: navBackground,
            borderColor: navBorder,
            boxShadow: navShadow,
            backdropFilter: navBackdropBlur,
            WebkitBackdropFilter: navBackdropBlur,
          }}
          className="pointer-events-auto border rounded-full transition-all duration-300 ease-out w-full max-w-5xl"
        >
          <div className="mx-auto px-5 h-[68px] flex items-center justify-between w-full">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group hover:opacity-90 transition-opacity" onClick={() => setIsOpen(false)}>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                <Image 
                  src="/images/logo/ShriDev_Freelance_logo.png" 
                  alt="ShriDev Freelance Icon" 
                  fill
                  className="object-contain group-hover:scale-105 transition-transform drop-shadow-sm"
                />
              </div>
              <div className="flex flex-col items-center justify-center mt-0.5">
                <span className="text-[#1E293B] font-black tracking-tight text-[20px] sm:text-[26px] leading-none mb-0.5">
                  ShriDev
                </span>
                <div className="flex items-center gap-1 sm:gap-1.5 w-full">
                  <div className="flex-1 h-[1.5px] bg-gradient-to-r from-transparent to-[#00C896] rounded-full" />
                  <span className="text-[#00C896] font-bold tracking-[0.2em] text-[9px] sm:text-[11px] uppercase">
                    Freelance
                  </span>
                  <div className="flex-1 h-[1.5px] bg-gradient-to-l from-transparent to-[#00C896] rounded-full" />
                </div>
              </div>
            </Link>

            {/* Desktop Center Links */}
            <div className="hidden lg:flex items-center gap-8 text-[#1E293B] text-sm font-bold tracking-wide">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.path} 
                  className={link.highlight 
                    ? "text-[#0F766E] hover:text-[#00C896] hover:-translate-y-0.5 transition-all border-b border-[#0F766E]/30 hover:border-transparent"
                    : "hover:text-[#00C896] hover:-translate-y-0.5 transition-all"
                  }
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop Right CTA */}
            <div className="hidden lg:flex gap-4">
              <Link 
                href="/contact"
                className="flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white shadow-xl shadow-[#00C896]/20 bg-gradient-to-r from-[#00C896] to-[#00E6A8] hover:scale-105 hover:shadow-2xl hover:shadow-[#00C896]/40 active:scale-95 rounded-full transition-all duration-300"
              >
                Start a Project
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button 
              className={`lg:hidden p-2 transition-colors focus:outline-none ${isOpen ? 'text-white' : 'text-[#0F172A] hover:text-[#00C896]'}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Navigation Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-[#0F172A] pt-24 pb-8 px-6 flex flex-col justify-between items-center text-center overflow-y-auto lg:hidden"
          >
            {/* Background glowing orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E6A8]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-20 left-0 w-64 h-64 bg-[#00C896]/10 rounded-full blur-[100px] pointer-events-none" />

            <motion.div 
              className="space-y-4 flex flex-col mt-4 w-full relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
            >
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut", delay: i * 0.05 }}
                >
                  <Link
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block text-base sm:text-lg font-bold uppercase tracking-wider py-2 hover:scale-105 transition-all duration-300 ${
                      link.highlight ? 'text-[#00C896]' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div 
              className="mt-8 relative w-full max-w-sm z-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center py-5 bg-white text-[#0F172A] font-black tracking-widest uppercase text-lg rounded-2xl hover:bg-[#00E6A8] active:scale-95 transition-all shadow-xl shadow-[#00E6A8]/10"
              >
                Start a Project
              </Link>
              <div className="mt-8 flex items-center justify-center gap-2 text-sm font-bold tracking-widest uppercase text-white/30">
                <span className="w-2 h-2 rounded-full bg-[#00C896] animate-pulse"></span>
                Crafted for the future
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
