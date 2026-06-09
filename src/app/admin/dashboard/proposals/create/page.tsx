'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CreateProposalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const PALETTE = [
    { label: 'Emerald', value: '#10B981' },
    { label: 'Violet', value: '#7C3AED' },
    { label: 'Blue', value: '#2563EB' },
    { label: 'Rose', value: '#E11D48' },
    { label: 'Amber', value: '#D97706' },
    { label: 'Cyan', value: '#0891B2' },
    { label: 'Fuchsia', value: '#C026D3' },
    { label: 'Slate', value: '#475569' },
  ];
  const [formData, setFormData] = useState({
    business_name: '',
    title: '',
    body: '',
    theme_color: '#10B981'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/proposals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/admin/dashboard/proposals/${data.proposal.id}`);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('An error occurred while creating the proposal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/dashboard/proposals"
          className="p-2 hover:bg-gray-100 dark:hover:bg-[#1F2937] rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Proposal</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Draft a new proposal for a business</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Name
              </label>
              <input
                type="text"
                required
                value={formData.business_name}
                onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#10B981] outline-none transition-all dark:text-white"
                placeholder="e.g. Acme Corp"
              />
              {/* Color Picker */}
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Brand Accent Color</label>
                <div className="flex flex-wrap gap-2">
                  {PALETTE.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      title={c.label}
                      onClick={() => setFormData({ ...formData, theme_color: c.value })}
                      className="w-7 h-7 rounded-full border-2 transition-all"
                      style={{
                        backgroundColor: c.value,
                        borderColor: formData.theme_color === c.value ? '#fff' : 'transparent',
                        boxShadow: formData.theme_color === c.value ? `0 0 0 2px ${c.value}` : 'none',
                        transform: formData.theme_color === c.value ? 'scale(1.2)' : 'scale(1)',
                      }}
                    />
                  ))}
                  {/* Custom color */}
                  <label title="Custom color" className="w-7 h-7 rounded-full border-2 border-dashed border-gray-400 dark:border-gray-600 flex items-center justify-center cursor-pointer overflow-hidden">
                    <input type="color" value={formData.theme_color} onChange={(e) => setFormData({ ...formData, theme_color: e.target.value })} className="opacity-0 absolute w-0 h-0" />
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  </label>
                </div>
                <p className="mt-1.5 text-xs text-gray-400">Preview: <span className="font-bold" style={{ color: formData.theme_color }}>{formData.business_name || 'Business Name'}</span></p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Proposal Title
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#10B981] outline-none transition-all dark:text-white"
                placeholder="e.g. Website Revamp Proposal"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Proposal Body (Drafted Message)
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Write a formal and engaging message to the business. You can use Markdown or plain text.
            </p>
            <textarea
              required
              rows={12}
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-[#111827] border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-[#10B981] outline-none transition-all dark:text-white resize-y"
              placeholder="Dear [Name],&#10;&#10;We are excited to propose..."
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Proposal'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
