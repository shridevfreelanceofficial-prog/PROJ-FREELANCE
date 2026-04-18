'use client';

import { usePathname } from 'next/navigation';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Hide footer on admin and member dashboard routes
  const hideFooter = pathname?.startsWith('/admin') || pathname?.startsWith('/member');

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
