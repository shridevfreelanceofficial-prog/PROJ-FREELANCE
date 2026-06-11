'use client';

import { useEffect } from 'react';

/**
 * Adds 'snap-page' class to body while mounted (homepage only).
 * This locks body scroll so the snap container owns all scrolling.
 * Automatically cleaned up when navigating away from the homepage.
 */
export default function SnapPageLock() {
  useEffect(() => {
    document.body.classList.add('snap-page');
    return () => {
      document.body.classList.remove('snap-page');
    };
  }, []);

  return null;
}
