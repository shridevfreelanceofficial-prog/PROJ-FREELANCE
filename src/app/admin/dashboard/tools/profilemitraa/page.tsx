/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSignedUrl } from '@/lib/blob';

interface TemplateItem {
  id: string;
  name: string;
  key: string;
  banner_url: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminProfileMitraaTemplatesPage() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Editing state for each template
  const [editStates, setEditStates] = useState<{
    [key: string]: {
      name: string;
      bannerUrl: string;
      bannerFile: File | null;
      previewUrl: string | null;
      isSubmitting: boolean;
    };
  }>({});

  useEffect(() => {
    void fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/admin/profilemitraa/templates', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to load templates metadata');
      }
      const data = await res.json();
      const list: TemplateItem[] = data.templates || [];
      setTemplates(list);

      // Initialize edit form states
      const stateObj: typeof editStates = {};
      list.forEach((t) => {
        stateObj[t.id] = {
          name: t.name,
          bannerUrl: t.banner_url || '',
          bannerFile: null,
          previewUrl: t.banner_url || null,
          isSubmitting: false,
        };
      });
      setEditStates(stateObj);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error fetching templates');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (id: string, field: 'name' | 'bannerUrl', value: string) => {
    setEditStates((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (id: string, file: File | null) => {
    if (file) {
      const preview = URL.createObjectURL(file);
      setEditStates((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          bannerFile: file,
          previewUrl: preview,
        },
      }));
    } else {
      setEditStates((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          bannerFile: null,
          previewUrl: prev[id].bannerUrl || null,
        },
      }));
    }
  };

  const handleSaveTemplate = async (template: TemplateItem) => {
    const id = template.id;
    const formState = editStates[id];
    if (!formState) return;

    if (!formState.name.trim()) {
      alert('Template Name is required');
      return;
    }

    try {
      setError(null);
      setSuccessMsg(null);
      setEditStates((prev) => ({
        ...prev,
        [id]: { ...prev[id], isSubmitting: true },
      }));

      const fd = new FormData();
      fd.append('id', id);
      fd.append('name', formState.name.trim());
      if (formState.bannerFile) {
        fd.append('banner', formState.bannerFile);
      } else {
        fd.append('banner_url', formState.bannerUrl.trim());
      }

      const res = await fetch('/api/admin/profilemitraa/templates', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const bodyObj = await res.json();
        throw new Error(bodyObj.error || 'Failed to update template banner');
      }

      setSuccessMsg(`Successfully saved template: ${formState.name}`);
      
      // Refresh templates
      await fetchTemplates();

      setTimeout(() => {
        setSuccessMsg(null);
      }, 4000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save template banner');
    } finally {
      setEditStates((prev) => {
        if (!prev[id]) return prev;
        return {
          ...prev,
          [id]: { ...prev[id], isSubmitting: false },
        };
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
        <p className="text-sm font-semibold text-slate-500 mt-4">Loading portfolio templates...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[#6B7280]">
        <Link href="/admin/dashboard" className="hover:text-[#10B981] transition-colors">Dashboard</Link>
        <span>/</span>
        <Link href="/admin/dashboard/tools" className="hover:text-[#10B981] transition-colors">Tools</Link>
        <span>/</span>
        <span className="text-[#111827] dark:text-[#F9FAFB] font-bold">ProfileMitraa Templates</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">ProfileMitraa Templates</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            Modify visual mock banners and public names of the three premium user templates.
          </p>
        </div>
        <Link
          href="/admin/dashboard/tools"
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151D2A] text-xs font-bold text-gray-700 dark:text-gray-350 hover:bg-gray-50 rounded-xl transition-all"
        >
          ← Back to Tools
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-300">
          ✓ {successMsg}
        </div>
      )}

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => {
          const formState = editStates[template.id] || {
            name: template.name,
            bannerUrl: template.banner_url || '',
            bannerFile: null,
            previewUrl: template.banner_url || null,
            isSubmitting: false,
          };

          return (
            <div
              key={template.id}
              className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151D2A] shadow-sm overflow-hidden flex flex-col justify-between"
            >
              {/* Banner Area */}
              <div className="relative h-44 bg-gray-150 border-b border-gray-200 dark:border-gray-800 overflow-hidden flex items-center justify-center">
                {formState.previewUrl ? (
                  <img
                    src={getSignedUrl(formState.previewUrl)}
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform duration-200"
                  />
                ) : (
                  <div className="text-center p-6 space-y-1">
                    <span className="text-3xl text-gray-400">🖼️</span>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">No mock banner uploaded</p>
                  </div>
                )}
                {/* Key Overlay Badge */}
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[9px] font-mono font-bold text-white tracking-widest uppercase border border-white/10">
                  {template.key}
                </span>
              </div>

              {/* Form Input fields */}
              <div className="p-5 space-y-4 flex-1">
                {/* Template Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Public Template Name
                  </label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => handleFieldChange(template.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                    placeholder="e.g. Minimalist Dark Mode"
                  />
                </div>

                {/* Banner File Upload */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Mock Banner Link or File
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(template.id, e.target.files?.[0] || null)}
                      className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-50 file:text-[#0F766E] hover:file:bg-emerald-100 cursor-pointer"
                    />
                    <input
                      type="url"
                      value={formState.bannerUrl}
                      onChange={(e) => handleFieldChange(template.id, 'bannerUrl', e.target.value)}
                      placeholder="Or paste banner image URL"
                      className="w-full px-3 py-2 text-[10px] rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#111827] text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Button Footer */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 flex justify-end">
                <button
                  onClick={() => handleSaveTemplate(template)}
                  disabled={formState.isSubmitting}
                  className="px-4 py-2 bg-[#10B981] hover:bg-emerald-600 active:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-500/10 flex items-center gap-1.5 disabled:opacity-55"
                >
                  {formState.isSubmitting ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Setup ✓'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
