"use client";

import { useState } from 'react';
import Link from 'next/link';
import Reveal from '@/components/animations/Reveal';

export default function CertificateVerificationPage() {
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    setStatus('loading');
    
    // Simulate API verification call
    setTimeout(() => {
      if (code.length > 5) { // Dummy validation logic
        setStatus('success');
      } else {
        setStatus('error');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0F172A]">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00C896]/15 via-transparent to-transparent opacity-80" />
      
      <main className="flex-1 flex items-center justify-center pt-24 pb-12 px-6 relative z-10 w-full">
        <Reveal delay={0.1} className="w-full max-w-lg">
          <div className="bg-[#1E293B]/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E6A8]/20 rounded-full blur-3xl" />
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-inner">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8 text-[#00E6A8]">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Verify Certificate</h1>
              <p className="text-white/60">Enter the unique code to verify authenticity.</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">Certificate Code</label>
                <div className="relative">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SD-9X42A-2026"
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00E6A8]/50 focus:border-[#00C896] uppercase tracking-widest font-mono transition-all"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                    <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z"></path></svg>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center px-6 py-4 rounded-xl bg-gradient-to-r from-[#00C896] to-[#00E6A8] text-[#0F172A] font-bold shadow-lg shadow-[#00C896]/20 hover:shadow-[#00C896]/40 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {status === 'loading' ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#0F172A]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Verify Authenticity
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                )}
              </button>
            </form>

            {/* Results Section */}
            {status === 'success' && (
              <Reveal delay={0.2} y={10} className="mt-8">
                <div className="bg-[#00C896]/10 border border-[#00C896]/30 rounded-xl p-6 relative overflow-hidden">
                  <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-32 bg-[#00C896] blur-2xl opacity-50" />
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#00C896]/20 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 text-[#00E6A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[#00E6A8] mb-1">Valid Certificate</h3>
                      <p className="text-sm text-white/80 leading-relaxed mb-4">This certificate was officially issued by ShriDev Freelance to John Doe.</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/50">Issued To</span>
                          <span className="font-medium text-white">John Doe</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/50">Project</span>
                          <span className="font-medium text-white">E-Commerce Platform</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-1">
                          <span className="text-white/50">Date Issued</span>
                          <span className="font-medium text-white">August 12, 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}

            {status === 'error' && (
              <Reveal delay={0.2} y={10} className="mt-8">
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-red-500 mb-1">Verification Failed</h3>
                    <p className="text-sm text-white/70">The certificate code &quot;{code}&quot; could not be found in our database. Please check the code and try again.</p>
                  </div>
                </div>
              </Reveal>
            )}
            
          </div>
        </Reveal>
      </main>
    </div>
  );
}
