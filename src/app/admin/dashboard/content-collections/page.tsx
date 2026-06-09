'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Collection {
  id: string;
  business_name: string;
  created_at: string;
  submission_count: number;
}

export default function ContentCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchCollections(); }, []);

  const fetchCollections = async () => {
    try {
      const res = await fetch('/api/admin/content-collections');
      const data = await res.json();
      if (data.collections) setCollections(data.collections);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/admin/content-collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_name: newName.trim() }),
      });
      if (res.ok) {
        setNewName('');
        setShowForm(false);
        fetchCollections();
      }
    } finally { setCreating(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this collection and all its data?')) return;
    await fetch(`/api/admin/content-collections/${id}`, { method: 'DELETE' });
    fetchCollections();
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/content-collection/${id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied!');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10B981]" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Collections</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create shareable links for businesses to submit their content
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-[#10B981] hover:bg-[#059669] text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-[#10B981]/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Collection
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="bg-white dark:bg-[#1F2937] rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Collection</h3>
          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              type="text"
              autoFocus
              required
              value={newName}
              onChange={e => setNewName(e.target.value)}
              placeholder="Business name (e.g. Acme Corp)"
              className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-[#10B981] outline-none transition-all dark:text-white"
            />
            <button
              type="submit"
              disabled={creating}
              className="px-6 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {creating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
              {creating ? 'Creating...' : 'Create'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* List */}
      {collections.length === 0 ? (
        <div className="bg-white dark:bg-[#1F2937] rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
          <div className="w-20 h-20 bg-[#D1FAE5] dark:bg-[#10B981]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Collections Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first collection to generate a link for a business.</p>
          <button onClick={() => setShowForm(true)} className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
            Create First Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {collections.map(c => (
            <div key={c.id} className="group bg-white dark:bg-[#1F2937] rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md transition-all hover:border-[#10B981]/30">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-lg shadow-[#10B981]/20 flex-shrink-0">
                  <span className="text-white font-bold text-lg">{c.business_name[0].toUpperCase()}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => copyLink(c.id)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-[#10B981] transition-colors" title="Copy public link">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">{c.business_name}</h3>
              <p className="text-xs text-gray-400 mb-4">{new Date(c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${Number(c.submission_count) > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${Number(c.submission_count) > 0 ? 'bg-green-500' : 'bg-gray-400'}`} />
                  {c.submission_count} {Number(c.submission_count) === 1 ? 'Response' : 'Responses'}
                </span>
                <Link href={`/admin/dashboard/content-collections/${c.id}`} className="text-sm font-medium text-[#10B981] hover:text-[#059669] flex items-center gap-1 transition-colors">
                  View
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
