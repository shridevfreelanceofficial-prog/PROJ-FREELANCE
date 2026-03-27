'use client';

import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function TiltCard({
  children,
  className,
  glowClassName,
}: {
  children: React.ReactNode;
  className?: string;
  glowClassName?: string;
}) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(rotateX, { stiffness: 170, damping: 18, mass: 0.6 });
  const springY = useSpring(rotateY, { stiffness: 170, damping: 18, mass: 0.6 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;

    rotateY.set((px - 0.5) * 32);
    rotateX.set(-(py - 0.5) * 32);

    e.currentTarget.style.setProperty('--mx', `${px * 100}%`);
    e.currentTarget.style.setProperty('--my', `${py * 100}%`);
  };

  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={`relative rounded-2xl ${className || ''}`}
      style={{
        transformStyle: 'preserve-3d',
        rotateX: springX,
        rotateY: springY,
        perspective: 900,
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: '0 18px 50px rgba(16,185,129,0.18)',
      }}
      transition={{ type: 'spring', stiffness: 230, damping: 18 }}
    >
      <div
        className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${
          glowClassName || ''
        }`}
        style={{
          background:
            'radial-gradient(650px circle at var(--mx, 50%) var(--my, 50%), rgba(16,185,129,0.22), transparent 55%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl"
      >
        <div
          className="absolute -inset-y-10 -left-1/2 w-[55%] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            transform: 'translateX(-40%) rotate(18deg)',
          }}
        >
          <div
            className="h-full w-full translate-x-[-120%] group-hover:translate-x-[220%] transition-transform duration-700 ease-out"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,255,255,0), rgba(16,185,129,0.22), rgba(255,255,255,0))',
            }}
          />
        </div>
      </div>
      {children}
    </motion.div>
  );
}
