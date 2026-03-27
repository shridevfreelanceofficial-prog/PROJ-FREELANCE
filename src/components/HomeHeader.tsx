'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomeHeader() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header className="bg-white shadow-sm">
      <div ref={ref} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo/ShriDev_Freelance_logo.png"
            alt="ShriDev Freelance"
            width={40}
            height={40}
            className="w-10 h-10 rounded-lg"
          />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-[#10B981]">ShriDev</span>{' '}
            <span className="text-[#0F766E]">Freelance</span>
          </span>
        </Link>

        <nav className="hidden sm:flex flex-wrap gap-4">
          <Link
            href="/"
            className="px-4 py-2 text-[#0F766E] hover:text-[#10B981] font-semibold transition-colors"
          >
            Home
          </Link>
          <Link
            href="/projects"
            className="px-4 py-2 text-[#0F766E] hover:text-[#10B981] font-semibold transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/contact"
            className="px-4 py-2 text-[#0F766E] hover:text-[#10B981] font-semibold transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="/plans"
            className="px-4 py-2 text-[#0F766E] hover:text-[#10B981] font-semibold transition-colors"
          >
            Plans
          </Link>
        </nav>

        <button
          type="button"
          className="sm:hidden p-2 rounded-lg hover:bg-[#F8FAFC]"
          onClick={() => setOpen((v) => !v)}
          aria-label="Open menu"
        >
          <svg className="w-7 h-7 text-[#111827]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {open && (
          <div className="sm:hidden absolute left-0 right-0 top-[72px] z-50">
            <div className="mx-4 rounded-xl border border-[#E5E7EB] bg-white shadow-lg overflow-hidden">
              <div className="p-2">
                <Link
                  href="/"
                  className="block px-4 py-3 rounded-lg text-[#0F766E] font-semibold hover:bg-[#D1FAE5]/40"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/projects"
                  className="block px-4 py-3 rounded-lg text-[#0F766E] font-semibold hover:bg-[#D1FAE5]/40"
                  onClick={() => setOpen(false)}
                >
                  Projects
                </Link>
                <Link
                  href="/contact"
                  className="block px-4 py-3 rounded-lg text-[#0F766E] font-semibold hover:bg-[#D1FAE5]/40"
                  onClick={() => setOpen(false)}
                >
                  Contact Us
                </Link>
                <Link
                  href="/plans"
                  className="block px-4 py-3 rounded-lg text-[#0F766E] font-semibold hover:bg-[#D1FAE5]/40"
                  onClick={() => setOpen(false)}
                >
                  Plans
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
