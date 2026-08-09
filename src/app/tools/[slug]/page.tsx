/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { getSignedUrl } from '@/lib/blob';
import ProfileMitraaPage from '../profilemitraa/page';

interface ToolData {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  status: string;
  created_at: string;
}

export default function ToolWebsitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  console.log('[DEBUG tools/[slug]] slug:', slug);

  if (slug.toLowerCase() === 'profilemitraa' || slug.toLowerCase() === 'profile-mitraa') {
    return <ProfileMitraaPage />;
  }

  return <DefaultToolWebsitePage slug={slug} />;
}

function DefaultToolWebsitePage({ slug }: { slug: string }) {
  const [tool, setTool] = useState<ToolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadTool() {
      try {
        const res = await fetch(`/api/public/tools/${slug}`);
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setTool(data.tool);
      } catch (err) {
        console.error('Error fetching tool:', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    void loadTool();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
          <p className="text-sm text-gray-400 font-mono">Loading tool website...</p>
        </div>
      </div>
    );
  }

  if (notFound || !tool) {
    return (
      <div className="min-h-screen bg-[#0B1220] flex flex-col items-center justify-center p-6 text-center text-white">
        <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mb-4 border border-red-500/20">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold mb-2">Tool Not Found</h1>
        <p className="text-gray-400 max-w-md mb-6">
          No tool exists for slug <span className="font-mono text-[#10B981]">&quot;{slug}&quot;</span> or it may have been removed.
        </p>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] font-medium text-white transition-all shadow-lg shadow-[#10B981]/20"
        >
          Return to ShriDev Freelance Home
        </Link>
      </div>
    );
  }

  const generatedUrl = `https://${tool.slug}.shridevfreelance.online`;

  const copyUrl = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-gray-100 flex flex-col selection:bg-[#10B981] selection:text-white">
      {/* Top Navbar */}
      <header className="border-b border-gray-800 bg-[#0F172A]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              {tool.logo_url ? (
                <img src={getSignedUrl(tool.logo_url)} alt={tool.name} className="w-full h-full object-contain p-1" />
              ) : (
                <span className="font-bold text-[#10B981] text-lg">
                  {tool.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1 className="font-bold text-lg text-white leading-tight flex items-center gap-2">
                {tool.name}
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {tool.status}
                </span>
              </h1>
              <p className="text-xs font-mono text-gray-400 truncate max-w-xs sm:max-w-md">
                {generatedUrl}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyUrl}
              className="px-3.5 py-1.5 rounded-lg border border-gray-700 hover:border-[#10B981] bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-200 transition-all flex items-center gap-2"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy URL
                </>
              )}
            </button>

            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 text-xs font-medium text-gray-300 transition-all"
            >
              ShriDev Freelance
            </Link>
          </div>
        </div>
      </header>

      {/* Main Website Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12 flex flex-col items-center justify-center">
        {/* Banner Card */}
        <div className="w-full rounded-3xl bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-gray-800 p-8 sm:p-12 shadow-2xl relative overflow-hidden text-center">
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Logo Badge */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gray-900 border border-gray-700/80 p-2 shadow-2xl flex items-center justify-center overflow-hidden group hover:scale-105 transition-transform duration-300">
            {tool.logo_url ? (
              <img src={getSignedUrl(tool.logo_url)} alt={tool.name} className="w-full h-full object-contain p-2" />
            ) : (
              <span className="text-4xl font-extrabold text-[#10B981]">
                {tool.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            {tool.name}
          </h2>

          <p className="text-gray-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            {tool.description || 'Welcome to ' + tool.name + '! This tool site has been created and is active.'}
          </p>

          {/* Generated URL Pill */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gray-900/90 border border-[#10B981]/30 text-emerald-400 font-mono text-sm sm:text-base shadow-lg mb-8">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
            {generatedUrl}
          </div>

          {/* Placeholder Workspace Area */}
          <div className="rounded-2xl bg-[#090D16] border border-gray-800/80 p-8 text-left max-w-3xl mx-auto shadow-inner">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
                <span className="text-xs font-mono text-gray-400 ml-2">{tool.slug}.app.workspace</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                Ready For Prompt
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-900/80 border border-gray-800 text-sm text-gray-300 leading-relaxed">
                <p className="font-semibold text-white mb-1 flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Subdomain Website Live!
                </p>
                <p>
                  This separate website for <strong className="text-white">{tool.name}</strong> has been initialized successfully. Provide your prompt anytime to build its exact features and custom functionality!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-800 text-center">
                  <p className="text-xs text-gray-400">Created Status</p>
                  <p className="text-sm font-semibold text-emerald-400 mt-0.5">Online & Active</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-800 text-center">
                  <p className="text-xs text-gray-400">Tool Slug</p>
                  <p className="text-sm font-mono font-semibold text-white truncate mt-0.5">{tool.slug}</p>
                </div>
                <div className="p-3 rounded-lg bg-gray-900/50 border border-gray-800 text-center">
                  <p className="text-xs text-gray-400">Domain Host</p>
                  <p className="text-sm font-semibold text-white truncate mt-0.5">shridevfreelance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/80 py-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} {tool.name} — Powered by ShriDev Freelance Platform</p>
      </footer>
    </div>
  );
}
