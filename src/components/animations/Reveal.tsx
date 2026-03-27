'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Reveal({
  children,
  delay,
  y,
  once,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  once?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: y ?? 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: once ?? true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay: delay ?? 0 }}
    >
      {children}
    </motion.div>
  );
}
