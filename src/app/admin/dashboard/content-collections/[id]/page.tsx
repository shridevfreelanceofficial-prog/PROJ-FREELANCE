'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getSignedUrl } from '@/lib/blob';

interface Submission {
  id: string;
  business_logo_url: string;
  about_business: string;
  business_images: string[];
  website_requirements: string;
  target_audience: string;
  preferred_style: string;
  reference_websites: string;
  color_preferences: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  social_media: { instagram?: string; facebook?: string; linkedin?: string; twitter?: string };
  additional_notes: string;
  submitted_at: string;
}

interface Collection {
  id: string;
  business_name: string;
  created_at: string;
}

export default function CollectionDetailPage() {
  const params = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => { if (params.id) fetchData(); }, [params.id]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/content-collections/${params.id}`);
      const data = await res.json();
      if (data.collection) {
        setCollection(data.collection);
        const subs = (data.submissions || []).map((s: any) => ({
          ...s,
          business_images: typeof s.business_images === 'string' ? JSON.parse(s.business_images) : (s.business_images || []),
          social_media: typeof s.social_media === 'string' ? JSON.parse(s.social_media) : (s.social_media || {}),
        }));
        setSubmissions(subs);
        if (subs.length > 0) setSelectedSubmission(subs[0]);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const downloadAllImages = async (submission: Submission) => {
    if (!submission.business_images?.length && !submission.business_logo_url) return;
    setDownloading(true);
    try {
      const allUrls: { url: string; name: string }[] = [];
      if (submission.business_logo_url) {
        allUrls.push({ url: getSignedUrl(submission.business_logo_url), name: 'logo.png' });
      }
      (submission.business_images || []).forEach((url, i) => {
        const ext = url.split('.').pop()?.split('?')[0] || 'jpg';
        allUrls.push({ url: getSignedUrl(url), name: `image-${i + 1}.${ext}` });
      });

      for (const { url, name } of allUrls) {
        const res = await fetch(url);
        const blob = await res.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${collection?.business_name.replace(/\s+/g, '-')}-${name}`;
        a.click();
        URL.revokeObjectURL(a.href);
        await new Promise(r => setTimeout(r, 300));
      }
    } finally { setDownloading(false); }
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    setConfirmDeleteId(null);
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/content-collections/submissions/${submissionId}`, {
        method: 'DELETE',
      });
      const body = await res.json().catch(() => ({}));
      console.log('[Delete Submission] status:', res.status, 'body:', body);
      if (res.ok) {
        const updatedSubs = submissions.filter(s => s.id !== submissionId);
        setSubmissions(updatedSubs);
        if (selectedSubmission?.id === submissionId) {
          setSelectedSubmission(updatedSubs.length > 0 ? updatedSubs[0] : null);
        }
        setDeleteSuccess(true);
        setTimeout(() => setDeleteSuccess(false), 3000);
      } else {
        const msg = body?.error || `HTTP ${res.status}`;
        alert(`Failed to delete: ${msg}`);
      }
    } catch (e) {
      console.error('[Delete Submission] error:', e);
      alert('An error occurred. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/content-collection/${params.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10B981]" />
    </div>
  );

  if (!collection) return (
    <div className="text-center py-20 text-gray-500">Collection not found.</div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Link href="/admin/dashboard/content-collections" className="p-2 hover:bg-gray-100 dark:hover:bg-[#1F2937] rounded-lg transition-colors">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{collection.business_name}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {submissions.length} {submissions.length === 1 ? 'Response' : 'Responses'} · Created {new Date(collection.created_at).toLocaleDateString()}
          </p>
        </div>
        <button
          onClick={copyLink}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${copied ? 'bg-green-50 border-green-300 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400' : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#1F2937]'}`}
        >
          {copied ? (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Copied!</>
          ) : (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>Copy Link</>
          )}
        </button>
      </div>

      {/* Success toast */}
      {deleteSuccess && (
        <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 px-5 py-3 rounded-xl text-sm font-medium shadow-sm animate-fade-in">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Submission deleted successfully.
        </div>
      )}

      {submissions.length === 0 ? (
        <div className="bg-white dark:bg-[#1F2937] rounded-2xl border border-gray-100 dark:border-gray-800 p-16 text-center">
          <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Awaiting Response</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Share the public link with the business to collect their content.</p>
          <button onClick={copyLink} className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
            Copy Public Link
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submissions list sidebar */}
          {submissions.length > 1 && (
            <div className="lg:col-span-1 space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submissions</h3>
              <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                {submissions.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSubmission(s)}
                    className={`w-full text-left p-4 rounded-xl border transition-all ${
                      selectedSubmission?.id === s.id
                        ? 'border-[#10B981] bg-[#D1FAE5]/30 dark:bg-[#10B981]/10'
                        : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1F2937] hover:border-[#10B981]/40'
                    }`}
                  >
                    <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                      {s.contact_name || `Submission ${i + 1}`}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(s.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submission detail */}
          {selectedSubmission && (
            <div className={`${submissions.length > 1 ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-6`}>
              
              {/* Summary / Hero Details Card */}
              <div className="bg-white dark:bg-[#1F2937] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedSubmission.contact_name || 'Anonymous Response'}
                    </h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {selectedSubmission.contact_email && (
                      <a href={`mailto:${selectedSubmission.contact_email}`} className="inline-flex items-center gap-1.5 hover:text-[#10B981] transition-colors">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {selectedSubmission.contact_email}
                      </a>
                    )}
                    {selectedSubmission.contact_phone && (
                      <span className="inline-flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {selectedSubmission.contact_phone}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(selectedSubmission.submitted_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button
                    onClick={() => downloadAllImages(selectedSubmission)}
                    disabled={downloading || (!selectedSubmission.business_images?.length && !selectedSubmission.business_logo_url)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#D1FAE5] hover:bg-[#A7F3D0] text-[#0F766E] disabled:opacity-50 disabled:hover:bg-[#D1FAE5] rounded-xl text-sm font-semibold transition-colors flex-1 md:flex-initial"
                  >
                    {downloading ? (
                      <div className="w-4 h-4 border-2 border-[#0F766E]/30 border-t-[#0F766E] rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    )}
                    Download Assets
                  </button>
                  {confirmDeleteId === selectedSubmission.id ? (
                    <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 rounded-xl">
                      <span className="text-xs font-semibold text-rose-600 whitespace-nowrap">Delete?</span>
                      <button
                        onClick={() => handleDeleteSubmission(selectedSubmission.id)}
                        disabled={deleting}
                        className="px-3 py-1 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                      >
                        {deleting ? 'Deleting...' : 'Yes, Delete'}
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-3 py-1 bg-white border border-gray-200 text-gray-600 hover:text-gray-800 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(selectedSubmission.id)}
                      disabled={deleting}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 disabled:opacity-50 rounded-xl text-sm font-semibold border border-rose-100 transition-colors flex-1 md:flex-initial"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  )}
                </div>

              </div>

              {/* Sub-grid of business branding & text content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Brand & Social Column */}
                <div className="md:col-span-1 space-y-6">
                  {/* Logo Card */}
                  <div className="bg-white dark:bg-[#1F2937] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col items-center text-center">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 self-start">Business Brand</h4>
                    {selectedSubmission.business_logo_url ? (
                      <div className="space-y-4 w-full">
                        <div className="relative group w-32 h-32 mx-auto rounded-2xl border border-gray-100 dark:border-gray-750 bg-gray-50 dark:bg-gray-800 flex items-center justify-center p-3 shadow-inner">
                          <img src={getSignedUrl(selectedSubmission.business_logo_url)} alt="logo" className="max-w-full max-h-full object-contain" />
                        </div>
                        <a
                          href={getSignedUrl(selectedSubmission.business_logo_url)}
                          download
                          className="inline-flex items-center gap-1 text-xs text-[#10B981] hover:text-[#059669] font-medium transition-colors hover:underline"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download Logo
                        </a>
                      </div>
                    ) : (
                      <div className="py-6 flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-2">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-400 font-medium">No Logo Provided</span>
                      </div>
                    )}
                  </div>

                  {/* Social Media Card */}
                  {selectedSubmission.social_media && Object.values(selectedSubmission.social_media).some(Boolean) && (
                    <div className="bg-white dark:bg-[#1F2937] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Social Media</h4>
                      <div className="space-y-2.5">
                        {Object.entries(selectedSubmission.social_media).map(([platform, handle]) => handle ? (
                          <div key={platform} className="flex items-center justify-between p-2.5 bg-gray-50 dark:bg-[#111827] rounded-xl border border-gray-100/50 dark:border-gray-800/50">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">{platform}</span>
                            {typeof handle === 'string' && handle.startsWith('http') ? (
                              <a href={handle} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#10B981] hover:text-[#059669] hover:underline truncate max-w-[150px]">
                                Visit Link →
                              </a>
                            ) : (
                              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[120px]">{handle as string}</span>
                            )}
                          </div>
                        ) : null)}
                      </div>
                    </div>
                  )}
                </div>

                {/* About & Requirements Column */}
                <div className="md:col-span-2 space-y-6">
                  {/* About Business Card */}
                  <div className="bg-white dark:bg-[#1F2937] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">About Business</h4>
                    <p className="text-sm text-gray-750 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {selectedSubmission.about_business || 'No description provided.'}
                    </p>
                  </div>

                  {/* Requirements & Style Grid Card */}
                  <div className="bg-white dark:bg-[#1F2937] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm space-y-5">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Website Preferences</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {/* Target Audience */}
                      {selectedSubmission.target_audience && (
                        <div className="p-4 bg-gray-50 dark:bg-[#111827] rounded-xl border border-gray-100/50 dark:border-gray-800/50">
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Target Audience</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{selectedSubmission.target_audience}</p>
                        </div>
                      )}

                      {/* Preferred Style */}
                      {selectedSubmission.preferred_style && (
                        <div className="p-4 bg-gray-50 dark:bg-[#111827] rounded-xl border border-gray-100/50 dark:border-gray-800/50">
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Preferred Style</p>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-[#D1FAE5] text-[#0F766E] dark:bg-[#10B981]/10 dark:text-[#10B981]">
                            {selectedSubmission.preferred_style}
                          </span>
                        </div>
                      )}

                      {/* Color Preferences */}
                      {selectedSubmission.color_preferences && (
                        <div className="p-4 bg-gray-50 dark:bg-[#111827] rounded-xl border border-gray-100/50 dark:border-gray-800/50">
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Color Preferences</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{selectedSubmission.color_preferences}</p>
                        </div>
                      )}

                      {/* Reference Websites */}
                      {selectedSubmission.reference_websites && (
                        <div className="p-4 bg-gray-50 dark:bg-[#111827] rounded-xl border border-gray-100/50 dark:border-gray-800/50">
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Reference Websites</p>
                          <div className="space-y-1 truncate">
                            {selectedSubmission.reference_websites.split(',').map((url, i) => {
                              const trimmedUrl = url.trim();
                              if (!trimmedUrl) return null;
                              const hasProtocol = /^https?:\/\//i.test(trimmedUrl);
                              const href = hasProtocol ? trimmedUrl : `https://${trimmedUrl}`;
                              return (
                                <a
                                  key={i}
                                  href={href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="block text-xs sm:text-sm text-[#10B981] hover:text-[#059669] hover:underline truncate transition-colors"
                                >
                                  {trimmedUrl}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {/* Website Requirements (Full Width) */}
                      {selectedSubmission.website_requirements && (
                        <div className="p-4 bg-gray-50 dark:bg-[#111827] rounded-xl border border-gray-100/50 dark:border-gray-800/50 sm:col-span-2">
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Specific Requirements</p>
                          <p className="text-sm text-gray-750 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedSubmission.website_requirements}</p>
                        </div>
                      )}

                      {/* Additional Notes (Full Width) */}
                      {selectedSubmission.additional_notes && (
                        <div className="p-4 bg-gray-50 dark:bg-[#111827] rounded-xl border border-gray-100/50 dark:border-gray-800/50 sm:col-span-2">
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1.5">Additional Notes</p>
                          <p className="text-sm text-gray-750 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">{selectedSubmission.additional_notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Business Images Gallery (Full Width Card) */}
                  {selectedSubmission.business_images?.length > 0 && (
                    <div className="bg-white dark:bg-[#1F2937] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                        Business Images ({selectedSubmission.business_images.length})
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {selectedSubmission.business_images.map((url, i) => (
                          <a
                            key={i}
                            href={getSignedUrl(url)}
                            target="_blank"
                            rel="noreferrer"
                            className="group relative aspect-square rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-[#10B981] transition-all hover:shadow-md"
                          >
                            <img src={getSignedUrl(url)} alt={`img-${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                              <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
