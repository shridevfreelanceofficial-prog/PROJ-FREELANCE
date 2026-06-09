'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import * as htmlToImage from 'html-to-image';

interface Proposal {
  id: string;
  business_name: string;
  title: string;
  body: string;
  theme_color: string;
  created_at: string;
  created_by_name: string;
  created_by_email: string;
  profile_image_url: string;
}

export default function AdminProposalBrochurePage() {
  const params = useParams();
  const router = useRouter();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const brochureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (params?.id) fetchProposal();
  }, [params?.id]);

  const fetchProposal = async () => {
    try {
      const res = await fetch(`/api/admin/proposals/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setProposal(data.proposal);
      } else {
        setError('Proposal not found.');
      }
    } catch (err) {
      setError('An error occurred while loading the proposal.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!brochureRef.current || !proposal) return;
    setDownloading(true);

    try {
      const image = await htmlToImage.toJpeg(brochureRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement('a');
      link.href = image;
      link.download = `Proposal-${proposal.business_name.replace(/\s+/g, '-')}.jpg`;
      link.click();
    } catch (err) {
      console.error('Error generating image:', err);
      alert('Failed to generate image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Oops!</h2>
        <p className="text-gray-500">{error || 'Proposal not found.'}</p>
        <button onClick={() => router.push('/admin/dashboard/proposals')} className="mt-4 text-[#10B981] hover:underline">
          Return to Proposals
        </button>
      </div>
    );
  }

  const color = proposal.theme_color || '#10B981';

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#1F2937] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard/proposals" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Proposal Brochure</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Preview and download as an image to send to your client.</p>
          </div>
        </div>
        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className="flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-lg font-bold transition-all disabled:opacity-50"
        >
          {downloading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          )}
          {downloading ? 'Generating...' : 'Download as Image'}
        </button>
      </div>

      {/* Brochure Preview Container (scrollable if needed) */}
      <div className="overflow-x-auto bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 rounded-xl flex justify-center">
        
        {/* The Actual Brochure Element to be captured */}
        <div 
          ref={brochureRef} 
          className="bg-white text-gray-900 relative overflow-hidden shadow-2xl"
          style={{ 
            width: '800px', // Fixed width for consistent image generation
            minHeight: '1131px', // A4 aspect ratio
            fontFamily: 'Inter, Arial, sans-serif'
          }}
        >
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none z-0" style={{ backgroundColor: color, transform: 'translate(30%, -30%)' }}></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[150px] opacity-10 pointer-events-none z-0" style={{ backgroundColor: color, transform: 'translate(-30%, 30%)' }}></div>

          {/* Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 z-0">
            <img src="/images/logo/ShriDev_Freelance_logo.png" crossOrigin="anonymous" alt="Watermark" className="w-[600px] h-[600px] object-contain filter grayscale" />
          </div>

          <div className="p-14 pb-56 relative z-10 flex flex-col min-h-full">
            {/* Header: ShriDev Branding */}
            <div className="flex justify-between items-start mb-20 border-b border-gray-100 pb-8">
              <div className="flex items-center gap-4">
                <img src="/images/logo/ShriDev_Freelance_logo.png" alt="ShriDev Logo" className="w-16 h-16 rounded-2xl shadow-sm object-contain" />
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">ShriDev Freelance</h1>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></span>
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Premium Web Solutions</p>
                  </div>
                </div>
              </div>
              <div className="text-right flex flex-col items-end justify-center">
                <div className="inline-block px-4 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-xs font-bold text-gray-400 tracking-widest uppercase mb-2">
                  Official Proposal
                </div>
                <p className="text-gray-800 font-bold text-lg pr-1">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Proposal Title & Recipient */}
            <div className="mb-14 relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-r-lg" style={{ backgroundColor: color }}></div>
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                Prepared Exclusively For
              </h2>
              <h3 className="text-6xl font-black mb-4 tracking-tight leading-tight py-2 text-transparent bg-clip-text bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(to right, ${color}, #111827)` }}>
                {proposal.business_name}
              </h3>
              <h4 className="text-3xl font-semibold text-gray-800 tracking-tight">{proposal.title}</h4>
            </div>

            {/* Body Content */}
            <div className="prose prose-xl max-w-none text-gray-600 leading-loose flex-grow relative pl-8">
              <div className="absolute top-1 left-0 w-6 h-6 opacity-20" style={{ color: color }}>
                <svg fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/></svg>
              </div>
              <div className="pl-10">
                {proposal.body.split('\\n').map((paragraph, index) => (
                  <p key={index} className="whitespace-pre-wrap font-medium m-0 mb-6">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Decor & Sender Info */}
          <div className="absolute bottom-0 left-0 right-0 backdrop-blur-xl bg-white/80 border-t border-gray-100/50 p-8 px-14 flex justify-between items-center z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-5">
              <div className="relative">
                {proposal.profile_image_url ? (
                  <img 
                    src={proposal.profile_image_url.includes('vercel-storage.com') ? `/api/blob/download?url=${encodeURIComponent(proposal.profile_image_url)}` : proposal.profile_image_url} 
                    crossOrigin="anonymous" 
                    alt={proposal.created_by_name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md relative z-10" 
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md border-2 border-white relative z-10" style={{ backgroundColor: color }}>
                    {proposal.created_by_name.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white" style={{ backgroundColor: color }}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-0.5">Prepared by</p>
                <p className="font-extrabold text-gray-900 text-lg">{proposal.created_by_name}</p>
                <p className="text-sm font-medium" style={{ color }}>{proposal.created_by_email}</p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">www.shridevfreelance.online</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
