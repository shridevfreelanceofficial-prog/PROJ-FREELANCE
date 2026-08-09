/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardHeader, CardBody, Input } from '@/components/ui';
import { getSignedUrl } from '@/lib/blob';

interface ToolItem {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  description: string | null;
  status: string;
  created_by_name: string | null;
  created_at: string;
  updated_at: string;
}

export default function AdminToolsPage() {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Modal States
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createSubmitting, setCreateSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [description, setDescription] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Edit Modal States
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('active');
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  const [editLogoUrlInput, setEditLogoUrlInput] = useState('');
  const [editLogoPreview, setEditLogoPreview] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Deleting State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    void fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      setError(null);
      const res = await fetch('/api/admin/tools', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to load tools');
      }
      const data = await res.json();
      setTools(data.tools || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error fetching tools');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoFileChange = (file: File | null, isEdit = false) => {
    if (file) {
      const preview = URL.createObjectURL(file);
      if (isEdit) {
        setEditLogoFile(file);
        setEditLogoPreview(preview);
      } else {
        setLogoFile(file);
        setLogoPreview(preview);
      }
    } else {
      if (isEdit) {
        setEditLogoFile(null);
        setEditLogoPreview(editLogoUrlInput || null);
      } else {
        setLogoFile(null);
        setLogoPreview(logoUrlInput || null);
      }
    }
  };

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const computedSlug = customSlug.trim() ? slugify(customSlug) : slugify(name);

  const handleCreateTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Tool name is required');
      return;
    }

    try {
      setCreateSubmitting(true);
      setError(null);

      const fd = new FormData();
      fd.append('name', name.trim());
      if (customSlug.trim()) fd.append('slug', customSlug.trim());
      if (description.trim()) fd.append('description', description.trim());
      if (logoFile) {
        fd.append('logo', logoFile);
      } else if (logoUrlInput.trim()) {
        fd.append('logo_url', logoUrlInput.trim());
      }

      const res = await fetch('/api/admin/tools', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create tool');
      }

      // Reset form
      setName('');
      setCustomSlug('');
      setDescription('');
      setLogoFile(null);
      setLogoUrlInput('');
      setLogoPreview(null);
      setIsCreateOpen(false);

      await fetchTools();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create tool');
    } finally {
      setCreateSubmitting(false);
    }
  };

  const openEditModal = (tool: ToolItem) => {
    setEditId(tool.id);
    setEditName(tool.name);
    setEditSlug(tool.slug);
    setEditDescription(tool.description || '');
    setEditStatus(tool.status || 'active');
    setEditLogoFile(null);
    setEditLogoUrlInput(tool.logo_url || '');
    setEditLogoPreview(tool.logo_url || null);
    setIsEditOpen(true);
  };

  const handleEditTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId || !editName.trim()) return;

    try {
      setEditSubmitting(true);
      setError(null);

      const fd = new FormData();
      fd.append('name', editName.trim());
      if (editSlug.trim()) fd.append('slug', editSlug.trim());
      fd.append('description', editDescription.trim());
      fd.append('status', editStatus);
      if (editLogoFile) {
        fd.append('logo', editLogoFile);
      } else {
        fd.append('logo_url', editLogoUrlInput.trim());
      }

      const res = await fetch(`/api/admin/tools/${editId}`, {
        method: 'PATCH',
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update tool');
      }

      setIsEditOpen(false);
      await fetchTools();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to update tool');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteTool = async (id: string, toolName: string) => {
    if (!window.confirm(`Are you sure you want to delete tool "${toolName}"?`)) return;

    try {
      setDeletingId(id);
      setError(null);

      const res = await fetch(`/api/admin/tools/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete tool');
      }

      await fetchTools();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to delete tool');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (tool: ToolItem) => {
    const nextStatus = tool.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/admin/tools/${tool.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        await fetchTools();
      }
    } catch (err) {
      console.error('Error toggling tool status:', err);
    }
  };

  const copyToClipboard = (url: string, slug: string) => {
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  const activeCount = tools.filter((t) => t.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Top Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">Tools Management</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF]">
            Create independent tools with custom subdomains like <span className="font-semibold text-[#10B981]">toolname.shridevfreelance.online</span>
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New Tool
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-[#111827]">
          <CardBody className="p-4 flex items-center gap-4">
            <div className="p-3 bg-[#D1FAE5] dark:bg-[#064E3B] text-[#0F766E] dark:text-[#34D399] rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">Total Tools</p>
              <p className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">{tools.length}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white dark:bg-[#111827]">
          <CardBody className="p-4 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">Active Tools</p>
              <p className="text-2xl font-bold text-[#111827] dark:text-[#F9FAFB]">{activeCount}</p>
            </div>
          </CardBody>
        </Card>

        <Card className="bg-white dark:bg-[#111827]">
          <CardBody className="p-4 flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider">Main Domain</p>
              <p className="text-sm font-semibold text-[#10B981] truncate">shridevfreelance.online</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Tools List */}
      <Card className="bg-white dark:bg-[#111827]">
        <CardHeader className="border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[#111827] dark:text-[#F9FAFB]">All Created Tools</h3>
          <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">
            {tools.length} {tools.length === 1 ? 'tool' : 'tools'} total
          </span>
        </CardHeader>
        <CardBody className="p-6">
          {tools.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#D1FAE5] dark:bg-[#064E3B] text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-[#111827] dark:text-[#F9FAFB]">No Tools Created Yet</h4>
              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] max-w-md mx-auto mt-1 mb-6">
                Click on the "Create New Tool" button to create your first standalone tool with its custom subdomain website!
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>Create First Tool</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => {
                const generatedSubdomainUrl = `https://${tool.slug}.shridevfreelance.online`;
                const directRouteUrl = `/tools/${tool.slug}`;

                return (
                  <div
                    key={tool.id}
                    className="group relative flex flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#151D2A] p-5 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      {/* Logo and Status header */}
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="w-14 h-14 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                          {tool.logo_url ? (
                            <img
                              src={getSignedUrl(tool.logo_url)}
                              alt={tool.name}
                              className="w-full h-full object-contain p-1.5"
                            />
                          ) : (
                            <span className="text-xl font-bold text-[#10B981]">
                              {tool.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleStatus(tool)}
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors ${
                              tool.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                          >
                            {tool.status === 'active' ? 'Active' : 'Inactive'}
                          </button>
                        </div>
                      </div>

                      {/* Tool Title & Description */}
                      <h4 className="text-lg font-bold text-[#111827] dark:text-[#F9FAFB] line-clamp-1 group-hover:text-[#10B981] transition-colors">
                        {tool.name}
                      </h4>
                      <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1 line-clamp-2 min-h-[32px]">
                        {tool.description || 'No description provided.'}
                      </p>

                      {/* Subdomain URL Display Box */}
                      <div className="mt-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800">
                        <p className="text-[11px] font-medium text-[#6B7280] dark:text-[#9CA3AF] uppercase tracking-wider mb-1">
                          Generated Subdomain URL
                        </p>
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={generatedSubdomainUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono font-semibold text-[#10B981] hover:underline truncate"
                            title={generatedSubdomainUrl}
                          >
                            {tool.slug}.shridevfreelance.online
                          </a>
                          <button
                            onClick={() => copyToClipboard(generatedSubdomainUrl, tool.slug)}
                            className="p-1 rounded text-gray-500 hover:text-[#10B981] dark:hover:text-[#10B981] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors shrink-0"
                            title="Copy URL"
                          >
                            {copiedSlug === tool.slug ? (
                              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="mt-5 pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-2">
                      <a
                        href={directRouteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#10B981] hover:underline"
                      >
                        Visit Website
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>

                      <div className="flex items-center gap-2 text-[11px]">
                        {tool.slug === 'profilemitraa' && (
                          <Link
                            href="/admin/dashboard/tools/profilemitraa"
                            className="px-2.5 py-1 text-xs font-bold text-[#10B981] dark:text-[#34D399] hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg border border-[#10B981]/20 transition-all shrink-0"
                          >
                            🎨 Templates
                          </Link>
                        )}
                        <button
                          onClick={() => openEditModal(tool)}
                          className="px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTool(tool.id, tool.name)}
                          disabled={deletingId === tool.id}
                          className="px-2.5 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletingId === tool.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      {/* CREATE TOOL MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#111827] shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#D1FAE5] dark:bg-[#064E3B] text-[#10B981] rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#111827] dark:text-[#F9FAFB]">Create New Tool</h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateTool} className="p-6 space-y-4">
              <Input
                label="Tool Name *"
                placeholder="e.g. Invoice Builder, SEO Analyzer, Resume Generator"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-[#111827] dark:text-[#F9FAFB] mb-1">
                  Custom Subdomain Slug (Optional)
                </label>
                <input
                  type="text"
                  placeholder={slugify(name) || 'e.g. invoice-builder'}
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none bg-white dark:bg-[#151D2A] text-[#111827] dark:text-[#F9FAFB] text-sm"
                />
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                  URL Preview:{' '}
                  <span className="font-mono text-[#10B981] font-semibold">
                    https://{computedSlug || 'toolname'}.shridevfreelance.online
                  </span>
                </p>
              </div>

              {/* Logo Selection */}
              <div>
                <label className="block text-sm font-medium text-[#111827] dark:text-[#F9FAFB] mb-1">
                  Tool Logo (Upload Image or Image URL)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoFileChange(e.target.files?.[0] || null)}
                      className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#D1FAE5] file:text-[#0F766E] hover:file:bg-emerald-200"
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      placeholder="Or paste Logo Image URL (https://...)"
                      value={logoUrlInput}
                      onChange={(e) => {
                        setLogoUrlInput(e.target.value);
                        if (!logoFile) setLogoPreview(e.target.value || null);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs bg-white dark:bg-[#151D2A] text-[#111827] dark:text-[#F9FAFB]"
                    />
                  </div>
                </div>

                {logoPreview && (
                  <div className="mt-3 flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <img src={logoPreview} alt="Logo preview" className="w-10 h-10 object-contain rounded" />
                    <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Logo preview</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] dark:text-[#F9FAFB] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe what this tool does..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none bg-white dark:bg-[#151D2A] text-[#111827] dark:text-[#F9FAFB] text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button variant="outline" type="button" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button isLoading={createSubmitting} type="submit">
                  Create Tool & Generate URL
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TOOL MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-[#111827] shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4 bg-gray-50/50 dark:bg-gray-900/50">
              <h3 className="text-lg font-bold text-[#111827] dark:text-[#F9FAFB]">Edit Tool</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditTool} className="p-6 space-y-4">
              <Input
                label="Tool Name *"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />

              <div>
                <label className="block text-sm font-medium text-[#111827] dark:text-[#F9FAFB] mb-1">
                  Subdomain Slug
                </label>
                <input
                  type="text"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none bg-white dark:bg-[#151D2A] text-[#111827] dark:text-[#F9FAFB] text-sm"
                />
                <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-1">
                  URL:{' '}
                  <span className="font-mono text-[#10B981] font-semibold">
                    https://{slugify(editSlug) || 'toolname'}.shridevfreelance.online
                  </span>
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] dark:text-[#F9FAFB] mb-1">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#151D2A] text-[#111827] dark:text-[#F9FAFB] text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Logo Selection */}
              <div>
                <label className="block text-sm font-medium text-[#111827] dark:text-[#F9FAFB] mb-1">
                  Replace Tool Logo (Upload File or URL)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleLogoFileChange(e.target.files?.[0] || null, true)}
                      className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#D1FAE5] file:text-[#0F766E] hover:file:bg-emerald-200"
                    />
                  </div>
                  <div>
                    <input
                      type="url"
                      placeholder="Logo Image URL"
                      value={editLogoUrlInput}
                      onChange={(e) => {
                        setEditLogoUrlInput(e.target.value);
                        if (!editLogoFile) setEditLogoPreview(e.target.value || null);
                      }}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-xs bg-white dark:bg-[#151D2A] text-[#111827] dark:text-[#F9FAFB]"
                    />
                  </div>
                </div>

                {editLogoPreview && (
                  <div className="mt-3 flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <img src={editLogoPreview} alt="Logo preview" className="w-10 h-10 object-contain rounded" />
                    <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Current Logo</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] dark:text-[#F9FAFB] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none bg-white dark:bg-[#151D2A] text-[#111827] dark:text-[#F9FAFB] text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <Button variant="outline" type="button" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button isLoading={editSubmitting} type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
