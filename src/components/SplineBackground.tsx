'use client';

import dynamic from 'next/dynamic';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

export default function SplineBackground() {
  return (
    <div className="fixed inset-0 -z-20">
      <Spline scene="https://prod.spline.design/ggghIvoFHrhAZTTe/scene.splinecode" />
    </div>
  );
}
