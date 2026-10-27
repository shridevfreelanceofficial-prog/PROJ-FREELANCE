import React from 'react';

export type IconType = 'sparkles' | 'rocket' | 'shopping-bag' | 'smartphone' | 'layers' | 'shield' | string;

interface PackageIconProps {
  type?: IconType;
  className?: string;
}

export default function PackageIcon({ type = 'sparkles', className = 'w-8 h-8' }: PackageIconProps) {
  switch (type?.toLowerCase()) {
    case 'sparkles':
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    case 'rocket':
    case 'bolt':
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case 'shopping-bag':
    case 'ecommerce':
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    case 'smartphone':
    case 'mobile':
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    case 'layers':
    case 'cross-platform':
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      );
    case 'shield':
    case 'enterprise':
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    default:
      return (
        <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={className}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
  }
}
