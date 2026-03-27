'use client';

import React, { useEffect, useRef, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

export default function ParticlesHeroBackground() {
  const [ready, setReady] = useState(false);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        setCursor(null);
        return;
      }

      setCursor({ x, y });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10"
    >
      {ready ? (
        <Particles
          id="hero-particles"
          options={{
            fullScreen: { enable: false },
            background: { color: { value: 'transparent' } },
            fpsLimit: 60,
            detectRetina: true,
            interactivity: {
              events: {
                onHover: { enable: true, mode: ['bubble'] },
                onClick: { enable: true, mode: ['push', 'repulse'] },
                resize: { enable: true },
              },
              modes: {
                repulse: { distance: 120, duration: 0.4 },
                bubble: {
                  distance: 180,
                  size: 16,
                  duration: 0.4,
                  opacity: 1,
                },
                push: { quantity: 2 },
              },
            },
            particles: {
              number: { value: 28, density: { enable: true } },
              color: { value: '#10B981' },
              links: {
                enable: true,
                color: '#10B981',
                distance: 200,
                opacity: 0.22,
                width: 1,
              },
              move: {
                enable: true,
                speed: 0.6,
                direction: 'none',
                outModes: { default: 'out' },
              },
              opacity: { value: { min: 0.35, max: 0.8 } },
              size: { value: { min: 4, max: 11 } },
            },
          }}
          className="w-full h-full"
        />
      ) : null}

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(16,185,129,0.16), rgba(16,185,129,0.00) 18%),' +
            'linear-gradient(270deg, rgba(16,185,129,0.16), rgba(16,185,129,0.00) 18%),' +
            'linear-gradient(180deg, rgba(16,185,129,0.14), rgba(16,185,129,0.00) 22%),' +
            'radial-gradient(900px 420px at 50% 0%, rgba(16,185,129,0.18), transparent 70%)',
          mixBlendMode: 'multiply',
          opacity: 1,
        }}
      />

      {cursor ? (
        <div
          className="pointer-events-none absolute"
          style={{
            left: cursor.x,
            top: cursor.y,
            width: 260,
            height: 260,
            transform: 'translate(-50%, -50%)',
            mixBlendMode: 'screen',
            opacity: 1,
          }}
        >
          <svg
            width="260"
            height="260"
            viewBox="0 0 260 260"
            className="absolute inset-0"
            style={{ filter: 'blur(4px)' }}
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="cursorGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(16,185,129,0.55)" />
                <stop offset="35%" stopColor="rgba(16,185,129,0.22)" />
                <stop offset="70%" stopColor="rgba(16,185,129,0.08)" />
                <stop offset="100%" stopColor="rgba(16,185,129,0)" />
              </radialGradient>

              <filter id="waterTurbulence" x="-40%" y="-40%" width="180%" height="180%">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.012"
                  numOctaves="2"
                  seed="2"
                  result="noise"
                >
                  <animate
                    attributeName="baseFrequency"
                    dur="2.8s"
                    values="0.010;0.016;0.010"
                    repeatCount="indefinite"
                  />
                </feTurbulence>
                <feDisplacementMap in="SourceGraphic" in2="noise" scale="26" xChannelSelector="R" yChannelSelector="G" />
                <feGaussianBlur stdDeviation="1.2" />
              </filter>
            </defs>

            <circle cx="130" cy="130" r="118" fill="url(#cursorGlow)" filter="url(#waterTurbulence)" />
          </svg>
        </div>
      ) : null}
    </div>
  );
}
