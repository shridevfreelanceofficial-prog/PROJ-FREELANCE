'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { isToolSubdomain } from '@/lib/subdomain';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isTool, setIsTool] = useState(false);

  useEffect(() => {
    setIsTool(isToolSubdomain(pathname));
  }, [pathname]);

  const hideFooter =
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/member') ||
    pathname?.startsWith('/proposals') ||
    pathname?.startsWith('/content-collection') ||
    isTool;

  return (
    <>
      {children}
      {!hideFooter && (
        <footer className="bg-[#0F766E] text-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm opacity-80">© 2026 ShriDev Freelance. All rights reserved.</p>
          </div>
        </footer>
      )}
    </>
  );
}
