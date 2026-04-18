'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const PLANS = [
  'Website - Starter',
  'Website - Professional',
  'Website - E-Commerce',
  'App - MVP Starter',
  'App - Cross Platform',
  'App - Enterprise Level',
];

export default function StartProjectClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [plan, setPlan] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    // Split plan into planType and planName
    const [planType, planName] = plan.split(' - ');

    try {
      setLoading(true);
      const res = await fetch('/api/plan-inquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          planType: planType?.toLowerCase() || '',
          planName: planName || '',
          subject: plan ? `Project Inquiry: ${plan}` : 'Project Inquiry',
          message,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || 'Failed to submit the form. Please try again.');
        return;
      }

      setSuccess('Thank you! Your project inquiry has been sent successfully.');
      setName('');
      setEmail('');
      setPhone('');
      setPlan('');
      setMessage('');
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#F4FFFA]">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00C896]/10 via-transparent to-transparent opacity-80" />
      <div className="fixed top-[-10%] right-[-5%] -z-10 w-[600px] h-[600px] bg-[#00E6A8]/5 rounded-full blur-[120px]" />

      <main className="flex-1 pt-32 pb-24 relative z-10 w-full">
        <section className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-[#D1FAE5] text-[#0F766E] font-bold tracking-wide">
              Start a Project
            </div>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight text-[#0F172A]">
              Let's Build Something Amazing
            </h1>
            <p className="mt-4 text-lg md:text-xl text-[#6B7280]">
              Select a plan and share your project details. We'll get back to you with a timeline and next steps.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="w-full bg-[#1E293B]/90 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E6A8]/10 rounded-full blur-[80px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00C896]/10 rounded-full blur-[80px] pointer-events-none" />

              <div className="p-8 md:p-10 relative z-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00C896]/20 to-[#00E6A8]/20 border border-[#00C896]/30 mb-6 shadow-inner">
                    <svg className="w-8 h-8 text-[#00E6A8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight">Project Inquiry</h2>
                  <p className="text-white/60 text-lg max-w-sm mx-auto">Select a plan and share your requirements</p>
                </div>

                <form onSubmit={submit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-white/80 ml-1">Full Name</label>
                      <input
                        className="w-full px-5 py-3.5 border border-white/10 rounded-xl bg-black/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00E6A8]/50 focus:border-[#00C896] transition-all"
                        placeholder="Enter your Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-white/80 ml-1">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-5 py-3.5 border border-white/10 rounded-xl bg-black/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00E6A8]/50 focus:border-[#00C896] transition-all"
                        placeholder="Enter your Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-white/80 ml-1">Phone Number</label>
                      <input
                        type="tel"
                        className="w-full px-5 py-3.5 border border-white/10 rounded-xl bg-black/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00E6A8]/50 focus:border-[#00C896] transition-all"
                        placeholder="+91 ..."
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-white/80 ml-1">Select Plan</label>
                      <select
                        className="w-full px-5 py-3.5 border border-white/10 rounded-xl bg-black/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00E6A8]/50 focus:border-[#00C896] transition-all"
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                        required
                      >
                        <option value="" className="text-gray-900">Choose a plan</option>
                        {PLANS.map((p) => (
                          <option key={p} value={p} className="text-gray-900">
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-white/80 ml-1">Message</label>
                    <textarea
                      className="w-full px-5 py-3.5 border border-white/10 rounded-xl bg-black/20 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#00E6A8]/50 focus:border-[#00C896] transition-all min-h-[140px] resize-y"
                      placeholder="Tell us about your project requirements..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  <AnimatePresence>
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-xl border border-[#00C896]/30 bg-[#00C896]/10 px-5 py-4 flex items-center gap-3 shadow-lg shadow-[#00C896]/5"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#00C896]/20 flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#00E6A8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-white">{success}</p>
                      </motion.div>
                    )}

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 flex items-center gap-3 shadow-lg shadow-red-500/5"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-white">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                    <button
                      type="submit"
                      disabled={loading || !!success}
                      className="w-full sm:flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-[#00C896] to-[#00E6A8] text-[#0F172A] font-extrabold text-lg shadow-lg shadow-[#00C896]/20 hover:shadow-[#00E6A8]/40 hover:-translate-y-0.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex justify-center items-center gap-2"
                    >
                      {loading ? 'Sending...' : success ? 'Request Sent' : 'Send Request'}
                    </button>

                    <Link
                      href="/"
                      className="w-full sm:w-auto text-center px-6 py-4 text-white/50 hover:text-white font-medium transition-colors"
                    >
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
