'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import ContactForm from '@/components/ContactForm';

export default function GlobalContactModal() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const disabled = useMemo(() => {
    if (!pathname) return false;
    return (
      pathname.startsWith('/admin') ||
      pathname.startsWith('/member') ||
      pathname === '/contact' ||
      pathname.startsWith('/plans')
    );
  }, [pathname]);

  useEffect(() => {
    if (disabled) {
      setOpen(false);
      return;
    }

    setOpen(false);
    const timer = window.setTimeout(() => setOpen(true), 4800);
    return () => window.clearTimeout(timer);
  }, [pathname, disabled]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/35 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="relative w-[92vw] max-w-xl max-h-[85vh] overflow-auto rounded-2xl">
        <button
          type="button"
          aria-label="Close"
          onClick={() => setOpen(false)}
          className="absolute right-3 top-3 z-20 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md px-2.5 py-2 hover:bg-white/10 transition-colors"
        >
          <svg className="w-5 h-5 text-white/70 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-1">
          <ContactForm
            showBackLink={false}
            onSubmitted={() => setOpen(false)}
            title="Contact Us"
            description="You can contact us if you have any queries or if you want to build website or application"
          />
        </div>
      </div>
    </div>
  );
}
