'use client';

import React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';

type Project = {
  id: string;
  title: string;
  client_name: string | null;
  description: string | null;
  cover_image_url: string | null;
  live_website_url: string | null;
};

function ProjectCard({ project }: { project: Project }) {
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springX = useSpring(rotateX, { stiffness: 160, damping: 18, mass: 0.6 });
  const springY = useSpring(rotateY, { stiffness: 160, damping: 18, mass: 0.6 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;
    rotateY.set((px - 0.5) * 14);
    rotateX.set(-(py - 0.5) * 14);
  };

  const onMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className="group relative rounded-2xl p-[1px]"
      style={{
        background:
          'linear-gradient(120deg, rgba(16,185,129,0.55), rgba(15,118,110,0.35), rgba(209,250,229,0.55))',
      }}
      animate={{
        filter: ['brightness(1)', 'brightness(1.12)', 'brightness(1)'],
      }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.div
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="relative h-full rounded-2xl bg-white/80 backdrop-blur-sm overflow-hidden border border-[#D1FAE5] shadow-sm"
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
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      >
        <div className="h-48 bg-gradient-to-br from-[#10B981]/30 to-[#0F766E]/30 relative">
          {project.cover_image_url ? (
            <img
              src={`/api/public/showcase-cover?url=${encodeURIComponent(project.cover_image_url)}`}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[#0F766E] text-6xl font-bold opacity-20">{project.title[0]}</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-[#111827]">{project.title}</h3>
              {project.client_name ? (
                <p className="mt-1 text-sm text-[#6B7280]">{project.client_name}</p>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              {project.live_website_url ? (
                <a
                  href={project.live_website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="hidden sm:inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-[#10B981] text-white text-xs font-semibold hover:bg-[#0F766E] transition-colors"
                >
                  Visit
                </a>
              ) : null}
            </div>
          </div>

          <p className="mt-3 text-sm text-[#374151] line-clamp-3">
            {project.description || 'No description available.'}
          </p>

          <div className="mt-5 flex items-center gap-3">
            <Link
              href={`/shridevfreelance/projectShowcase/${project.id}`}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border-2 border-[#10B981] text-[#10B981] text-sm font-semibold hover:bg-[#D1FAE5] transition-colors"
            >
              View Details
            </Link>
            {project.live_website_url ? (
              <a
                href={project.live_website_url}
                target="_blank"
                rel="noreferrer"
                className="sm:hidden inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#10B981] text-white text-sm font-semibold hover:bg-[#0F766E] transition-colors"
              >
                Visit
              </a>
            ) : null}
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background:
              'radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(16,185,129,0.22), transparent 50%)',
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsShowcaseGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
