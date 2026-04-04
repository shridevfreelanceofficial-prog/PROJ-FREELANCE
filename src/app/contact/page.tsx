'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import ContactForm from '@/components/ContactForm';
import TiltCard from '@/components/animations/TiltCard';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#F4FFFA]">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#00C896]/15 via-transparent to-transparent opacity-80" />
      <div className="fixed top-0 right-0 -z-10 w-[700px] h-[700px] bg-[#00E6A8]/10 rounded-full blur-[150px]" />

      <main className="flex-1 w-full pt-32 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#0F172A] mb-6 drop-shadow-sm">
              Let&apos;s Build Together.
            </h1>
            <p className="text-xl md:text-2xl font-medium text-[#475569]">
              Have a simple idea or a scalable enterprise project? Reach out, we’ll craft the perfect solution.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Contact Info Side */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 w-full flex flex-col gap-6"
            >
              <TiltCard>
                <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white p-8 shadow-2xl shadow-[#00C896]/5 hover:shadow-[#00C896]/20 hover:border-[#00C896]/30 transition-all duration-300">
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-[#0F172A]">
                      <Image
                        src="/images/developer-img/Shrikesh.png"
                        alt="Shrikesh Shetty"
                        width={80}
                        height={80}
                        className="w-full h-full object-cover transition-all duration-500"
                      />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-[#0F172A]">Shrikesh Shetty</h3>
                      <p className="text-[#00C896] font-bold">Brand Experience Director</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <a href="mailto:shridevfreelanceofficial@gmail.com" className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-white transition-colors border border-transparent hover:border-[#00C896]/20">
                      <div className="w-10 h-10 rounded-full bg-[#00C896]/10 text-[#00C896] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#475569] font-medium">Email Directly</p>
                        <p className="text-[#0F172A] font-bold truncate">shridevfreelanceofficial@gmail.com</p>
                      </div>
                    </a>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <a href="https://www.linkedin.com/in/shrikesh-shetty-3a6695295/" target="_blank" rel="noopener noreferrer" className="flex-1 py-3 text-center rounded-xl bg-[#0F172A] text-white font-bold hover:bg-[#00C896] hover:-translate-y-1 transition-all">
                      LinkedIn
                    </a>
                    <a href="https://github.com/ShrikeshShetty" target="_blank" rel="noopener noreferrer" className="flex-1 py-3 text-center rounded-xl border border-[#0F172A]/20 text-[#0F172A] font-bold hover:border-[#00C896] hover:text-[#00C896] hover:-translate-y-1 transition-all bg-white/50">
                      GitHub
                    </a>
                  </div>
                </div>
              </TiltCard>

              <TiltCard>
                <div className="rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-white/10 p-8 shadow-2xl text-white">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#00E6A8] animate-pulse" /> What we do
                  </h3>
                  <p className="text-white/60 leading-relaxed text-sm font-medium">
                    Web & mobile app development, cinematic landing pages, sophisticated dash panels, automation loops, and Awwwards-level front-end UX.
                  </p>
                </div>
              </TiltCard>
            </motion.div>

            {/* Contact Form Side */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-7 w-full"
            >
              <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white p-8 md:p-10 shadow-2xl shadow-[#0F172A]/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00C896]/10 rounded-full blur-3xl" />
                <h2 className="text-3xl font-extrabold text-[#0F172A] mb-8">Send a Request</h2>
                <div className="relative z-10 w-full contact-wrapper-custom">
                  {/* Reuse their existing ContactForm logic but it renders natively inside this beautiful wrapper */}
                  <ContactForm />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="bg-[#0F172A] text-white py-12 relative z-10 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-6 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00C896] to-[#00E6A8]" />
          </div>
          <p className="text-sm font-medium text-white/50">© {new Date().getFullYear()} ShriDev Freelance. Crafted for the modern web.</p>
        </div>
      </footer>
    </div>
  );
}
