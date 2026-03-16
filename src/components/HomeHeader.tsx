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
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo/ShriDev_Freelance_logo.png"
            alt="ShriDev Freelance"
            width={40}
            height={40}
            className="w-10 h-10 rounded-lg"
          />
          <span className="text-xl font-bold text-[#111827]">ShriDev Freelance</span>
        </div>

        <nav className="hidden sm:flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="px-4 py-2 text-[#10B981] hover:text-[#0F766E] font-medium transition-colors"
          >
            Contact Us
          </Link>
          <Link
            href="/admin/login"
            className="px-4 py-2 text-[#10B981] hover:text-[#0F766E] font-medium transition-colors"
          >
            Admin Login
          </Link>
          <Link
            href="/member/login"
            className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#0F766E] font-medium transition-colors shadow-md"
          >
            Member Login
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
                  href="/contact"
                  className="block px-4 py-3 rounded-lg text-[#111827] hover:bg-[#F8FAFC]"
                  onClick={() => setOpen(false)}
                >
                  Contact Us
                </Link>
                <Link
                  href="/admin/login"
                  className="block px-4 py-3 rounded-lg text-[#111827] hover:bg-[#F8FAFC]"
                  onClick={() => setOpen(false)}
                >
                  Admin Login
                </Link>
                <Link
                  href="/member/login"
                  className="block px-4 py-3 rounded-lg bg-[#10B981] text-white hover:bg-[#0F766E]"
                  onClick={() => setOpen(false)}
                >
                  Member Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
