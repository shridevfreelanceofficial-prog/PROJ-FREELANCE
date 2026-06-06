'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface Proposal {
  id: string;
  business_name: string;
  title: string;
  body: string;
  status: string;
  created_at: string;
  created_by_name: string;
  created_by_email: string;
  profile_image_url: string;
  theme_color: string;
}

export default function ProposalViewPage() {
  const params = useParams();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchProposal();
    }
  }, [params.id]);

  const fetchProposal = async () => {
    try {
      const res = await fetch(`/api/proposals/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setProposal(data.proposal);
      } else {
        setError('Proposal not found or access denied.');
      }
    } catch (err) {
      setError('An error occurred while loading the proposal.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: 'accepted' | 'rejected') => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/proposals/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      });
      if (res.ok) {
        const data = await res.json();
        setProposal(data.proposal);
      } else {
        alert('Could not update the status. Please try again.');
      }
    } catch (err) {
      alert('An error occurred. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#10B981]/20 border-t-[#10B981] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-[#10B981] rounded-full blur-xl opacity-50 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="w-16 h-16 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Unavailable</h2>
          <p className="text-gray-400">{error || 'This proposal is no longer available.'}</p>
        </div>
      </div>
    );
  }

  const color = proposal.theme_color || '#10B981';

  // Convert hex to RGB for opacity usage
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r}, ${g}, ${b}`;
  };
  const colorRgb = hexToRgb(color.startsWith('#') ? color : '#10B981');

  return (
    <div className="min-h-screen text-gray-100 font-sans selection:bg-[#10B981]/30 selection:text-white pb-20 relative overflow-hidden"
      style={{ backgroundColor: '#0B1220' }}
    >
      {/* Background Effects — vivid conic rays */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Tinted dark base */}
        <div className="absolute inset-0" style={{ backgroundColor: `rgba(${colorRgb}, 0.12)` }} />
        {/* Bold conic ray burst from top-center */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[220%] h-[120%] opacity-[0.22]"
          style={{
            background: `conic-gradient(from 270deg at 50% 0%, rgba(${colorRgb},1) 0deg, transparent 25deg, rgba(${colorRgb},0.7) 50deg, transparent 75deg, rgba(${colorRgb},0.9) 100deg, transparent 125deg, rgba(${colorRgb},0.6) 150deg, transparent 175deg, rgba(${colorRgb},0.8) 200deg, transparent 225deg, rgba(${colorRgb},0.5) 250deg, transparent 275deg, rgba(${colorRgb},1) 360deg)`,
          }}
        />
        {/* Large bright top-left glow */}
        <div className="absolute top-[-15%] left-[-15%] w-[60%] h-[60%] rounded-full blur-[120px]"
          style={{ backgroundColor: `rgba(${colorRgb}, 0.55)` }}
        />
        {/* Bright bottom-right glow */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px]"
          style={{ backgroundColor: `rgba(${colorRgb}, 0.45)` }}
        />
        {/* Center glow pulse */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[40%] h-[40%] rounded-full blur-[80px]"
          style={{ backgroundColor: `rgba(${colorRgb}, 0.3)` }}
        />
        {/* White light shimmer overlay to create "rays" look */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,1) 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 pt-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative w-16 h-16 mb-3">
              <Image 
                src="/images/logo/ShriDev_Freelance_logo.png" 
                alt="ShriDev Freelance Logo" 
                fill
                className="object-contain"
              />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">ShriDev Freelance</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm font-medium mb-6"
            style={{ color }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: color }}></span>
            Official Proposal
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            {proposal.title}
          </h1>
          <p className="text-xl text-gray-400">
            Prepared exclusively for <span className="font-bold text-2xl" style={{ color }}>{proposal.business_name}</span>
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative bg-[#111827]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
            style={{ background: `linear-gradient(to right, transparent, ${color}80, transparent)` }}
          />

          <div className="relative mb-16">
            <div className="absolute top-0 left-0 w-1 sm:w-1.5 h-full rounded-full opacity-70"
              style={{ background: `linear-gradient(to bottom, ${color}, ${color}80)` }}
            />
            <div className="pl-6 sm:pl-10 space-y-8 py-2">
              {proposal.body.split('\n').map((paragraph, index) => {
                if (!paragraph.trim()) return null;
                const isHeading = paragraph.length < 60 && !paragraph.includes('.') && index === 0;
                return (
                  <p key={index} className={`text-gray-200 leading-[1.8] tracking-wide ${isHeading ? 'text-2xl sm:text-3xl font-extrabold text-white mb-6' : 'text-[17px] sm:text-xl'}`}>
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Action Area */}
          <div className="border-t border-white/10 pt-10">
            <AnimatePresence mode="wait">
              {proposal.status === 'accepted' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-8 bg-green-500/10 border border-green-500/20 rounded-2xl"
                >
                  <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-green-400 mb-2">Proposal Accepted</h3>
                  <p className="text-green-200/70">Thank you! We will be in touch shortly to proceed with the next steps.</p>
                </motion.div>
              ) : proposal.status === 'rejected' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-2xl"
                >
                  <div className="w-16 h-16 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-red-400 mb-2">Proposal Declined</h3>
                  <p className="text-red-200/70">We appreciate your time. Please reach out if you reconsider in the future.</p>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <h3 className="text-xl font-medium text-white mb-6">How would you like to proceed?</h3>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => handleAction('rejected')}
                      disabled={updating}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-medium transition-all disabled:opacity-50"
                    >
                      Decline Proposal
                    </button>
                    <button
                      onClick={() => handleAction('accepted')}
                      disabled={updating}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-medium shadow-lg shadow-[#10B981]/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      {updating ? 'Processing...' : 'Accept Proposal'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Founder Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-[#10B981] font-medium mb-4">
              Founder
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Meet the founder</h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              The human behind the builds — focused on clean code, clean UX, and real outcomes.
            </p>
          </div>

          <div className="rounded-3xl bg-[#111827]/80 backdrop-blur-2xl border border-white/10 shadow-2xl p-8 sm:p-12 relative overflow-hidden text-center">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[520px] h-[520px] bg-gradient-to-b from-[#10B981]/10 to-transparent rounded-full blur-3xl" />
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-[#0F172A] ring-4 ring-white/10 shadow-xl mb-6">
                <Image
                  src="/images/developer-img/Shrikesh.png"
                  alt="Shrikesh Uday Shetty"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Shrikesh Uday Shetty
              </h3>
              <p className="mt-4 text-gray-300 leading-relaxed max-w-2xl">
                I'm a passionate Computer Science Graduate with a strong foundation in full-stack development. I love building web applications and solving complex problems through code. My journey in tech has equipped me with diverse skills in both frontend and backend technologies.
              </p>
              
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-left">
                  <p className="text-[11px] font-black tracking-[0.25em] uppercase text-gray-500">Phone</p>
                  <p className="mt-1.5 text-base font-extrabold text-white">+91 7045332855</p>
                </div>
                <div className="rounded-2xl bg-white/5 border border-white/10 p-4 text-left">
                  <p className="text-[11px] font-black tracking-[0.25em] uppercase text-gray-500">Degree</p>
                  <p className="mt-1.5 text-base font-extrabold text-white">B.Sc Computer Science</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* What We Do Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 mb-12"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-[#10B981] font-medium mb-4">
              Services
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">What We Do</h2>
            <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
              Clean UX, modern UI, and performance-first builds — crafted end-to-end.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Service 1 */}
            <div className="rounded-3xl bg-[#111827]/80 backdrop-blur-2xl border border-white/10 p-8 shadow-xl relative overflow-hidden group hover:border-[#10B981]/50 transition-colors">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-[#10B981]/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-white mb-6 shadow-lg shadow-[#10B981]/20">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">Web Development</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Websites and web apps with a modern UI, clean UX, and performance-first approach.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-[#10B981]">
                Performance tuned <span className="w-1 h-1 rounded-full bg-[#10B981]" /> SEO ready
              </div>
            </div>

            {/* Service 2 */}
            <div className="rounded-3xl bg-[#111827]/80 backdrop-blur-2xl border border-white/10 p-8 shadow-xl relative overflow-hidden group hover:border-[#00E6A8]/50 transition-colors">
              <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-[#00E6A8]/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-[#00E6A8] mb-6">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">Mobile App Development</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Mobile apps with clean UI, stable performance, and scalable architecture.
              </p>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
                Smooth UX <span className="w-1 h-1 rounded-full bg-[#00E6A8]" /> Strong architecture
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 mb-16 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-6">You can contact us on:</h3>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:shridevfreelanceofficial@gmail.com" className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white font-medium">
              <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              shridevfreelanceofficial@gmail.com
            </a>
            <a href="tel:+917045332855" className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white font-medium">
              <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +91 7045332855
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
