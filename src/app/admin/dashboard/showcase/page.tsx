'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardHeader, CardBody, Input } from '@/components/ui';

type ShowcaseTeamMember = { name: string; role: string | null };

interface ShowcaseEntry {
  id: string;
  project_id: string | null;
  title: string;
  client_name: string | null;
  description: string | null;
  requirements: string | null;
  media_drive_link: string | null;
  live_website_url: string | null;
  daily_working_hours: string | null;
  cover_image_url: string | null;
  start_date: string | null;
  end_date: string | null;
  team_members: ShowcaseTeamMember[] | null;
  is_visible: boolean;
  created_at: string;
}

interface CompletedProject {
  id: string;
  title: string;
  client_name: string | null;
  description: string | null;
  requirements: string | null;
  media_drive_link: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  has_showcase: boolean;
}

interface Member {
  id: string;
  full_name: string;
  role: string | null;
}

export default function ShowcasePage() {
  const [showcase, setShowcase] = useState<ShowcaseEntry[]>([]);
  const [completedProjects, setCompletedProjects] = useState<CompletedProject[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  const [submittingImport, setSubmittingImport] = useState(false);
  const [submittingManual, setSubmittingManual] = useState(false);

  const [importProjectId, setImportProjectId] = useState<string>('');
  const [importCover, setImportCover] = useState<File | null>(null);

  const [manualTitle, setManualTitle] = useState('');
  const [manualClientName, setManualClientName] = useState('');
  const [manualDescription, setManualDescription] = useState('');
  const [manualRequirements, setManualRequirements] = useState('');
  const [manualMediaDriveLink, setManualMediaDriveLink] = useState('');
  const [manualLiveWebsiteUrl, setManualLiveWebsiteUrl] = useState('');
  const [manualStartDate, setManualStartDate] = useState('');
  const [manualEndDate, setManualEndDate] = useState('');
  const [manualDailyHours, setManualDailyHours] = useState('');
  const [manualCover, setManualCover] = useState<File | null>(null);
  const [manualSelectedMembers, setManualSelectedMembers] = useState<Record<string, boolean>>({});
  const [manualMemberName, setManualMemberName] = useState('');
  const [manualMemberRole, setManualMemberRole] = useState('');
  const [manualCustomMembers, setManualCustomMembers] = useState<ShowcaseTeamMember[]>([]);

  const [error, setError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editClientName, setEditClientName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editRequirements, setEditRequirements] = useState('');
  const [editMediaDriveLink, setEditMediaDriveLink] = useState('');
  const [editLiveWebsiteUrl, setEditLiveWebsiteUrl] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editDailyHours, setEditDailyHours] = useState('');
  const [editCover, setEditCover] = useState<File | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [deleteSubmittingId, setDeleteSubmittingId] = useState<string | null>(null);

  useEffect(() => {
    void loadAll();
  }, []);

  const loadAll = async () => {
    try {
      setError(null);
      const [showcaseRes, completedRes, membersRes] = await Promise.all([
        fetch('/api/admin/showcase', { cache: 'no-store' }),
        fetch('/api/admin/showcase/completed-projects', { cache: 'no-store' }),
        fetch('/api/admin/members', { cache: 'no-store' }),
      ]);

      if (showcaseRes.ok) {
        const data = await showcaseRes.json();
        setShowcase(data.showcase || []);
      }

      if (completedRes.ok) {
        const data = await completedRes.json();
        setCompletedProjects(data.projects || []);
      }

      if (membersRes.ok) {
        const data = await membersRes.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error('Error fetching showcase data:', error);
      setError('Failed to load showcase data');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (entry: ShowcaseEntry) => {
    setError(null);
    setEditId(entry.id);
    setEditTitle(entry.title || '');
    setEditClientName(entry.client_name || '');
    setEditDescription(entry.description || '');
    setEditRequirements(entry.requirements || '');
    setEditMediaDriveLink(entry.media_drive_link || '');
    setEditLiveWebsiteUrl(entry.live_website_url || '');
    setEditStartDate(entry.start_date || '');
    setEditEndDate(entry.end_date || '');
    setEditDailyHours(entry.daily_working_hours || '');
    setEditCover(null);
    setEditOpen(true);
  };

  const closeEdit = () => {
    setEditOpen(false);
    setEditId(null);
  };

  const submitEdit = async () => {
    if (!editId) return;
    if (!editTitle.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setError(null);
      setEditSubmitting(true);

      const fd = new FormData();
      fd.append('title', editTitle.trim());
      fd.append('client_name', editClientName);
      fd.append('description', editDescription);
      fd.append('requirements', editRequirements);
      fd.append('media_drive_link', editMediaDriveLink);
      fd.append('live_website_url', editLiveWebsiteUrl);
      fd.append('start_date', editStartDate);
      fd.append('end_date', editEndDate);
      fd.append('daily_working_hours', editDailyHours);
      if (editCover) fd.append('cover_image', editCover);

      const res = await fetch(`/api/admin/showcase/${editId}`, {
        method: 'PATCH',
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Failed to update showcase entry');
        return;
      }

      closeEdit();
      await loadAll();
    } catch (e) {
      console.error('Edit showcase error:', e);
      setError('Failed to update showcase entry');
    } finally {
      setEditSubmitting(false);
    }
  };

  const removeEntry = async (id: string) => {
    const ok = window.confirm('Remove this showcase entry? This cannot be undone.');
    if (!ok) return;

    try {
      setError(null);
      setDeleteSubmittingId(id);
      const res = await fetch(`/api/admin/showcase/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Failed to remove showcase entry');
        return;
      }
      await loadAll();
    } catch (e) {
      console.error('Remove showcase error:', e);
      setError('Failed to remove showcase entry');
    } finally {
      setDeleteSubmittingId(null);
    }
  };

  const handleToggleVisibility = async (id: string, isVisible: boolean) => {
    try {
      const response = await fetch(`/api/admin/showcase/${id}/visibility`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_visible: !isVisible }),
      });

      if (response.ok) {
        await loadAll();
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data?.error || 'Failed to update visibility');
      }
    } catch (error) {
      console.error('Error toggling visibility:', error);
      setError('Failed to update visibility');
    }
  };

  const handleImport = async () => {
    if (!importProjectId) {
      setError('Please select a completed project');
      return;
    }
    if (!importCover) {
      setError('Please select a cover image');
      return;
    }

    try {
      setError(null);
      setSubmittingImport(true);

      const fd = new FormData();
      fd.append('mode', 'import');
      fd.append('project_id', importProjectId);
      fd.append('cover_image', importCover);

      const res = await fetch('/api/admin/showcase', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Failed to import project');
        return;
      }

      setImportProjectId('');
      setImportCover(null);
      await loadAll();
    } catch (e) {
      console.error('Import showcase error:', e);
      setError('Failed to import project');
    } finally {
      setSubmittingImport(false);
    }
  };

  const handleManualCreate = async () => {
    if (!manualTitle.trim()) {
      setError('Title is required');
      return;
    }
    if (!manualCover) {
      setError('Cover image is required');
      return;
    }

    try {
      setError(null);
      setSubmittingManual(true);

      const selectedIds = Object.entries(manualSelectedMembers)
        .filter(([, v]) => v)
        .map(([k]) => k);

      const fd = new FormData();
      fd.append('mode', 'manual');
      fd.append('title', manualTitle.trim());
      fd.append('client_name', manualClientName);
      fd.append('description', manualDescription);
      fd.append('requirements', manualRequirements);
      fd.append('media_drive_link', manualMediaDriveLink);
      fd.append('live_website_url', manualLiveWebsiteUrl);
      fd.append('start_date', manualStartDate);
      fd.append('end_date', manualEndDate);
      fd.append('daily_working_hours', manualDailyHours);
      if (manualCustomMembers.length > 0) {
        fd.append('team_members_json', JSON.stringify(manualCustomMembers));
      } else {
        fd.append('assigned_members', selectedIds.join(','));
      }
      fd.append('cover_image', manualCover);

      const res = await fetch('/api/admin/showcase', {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Failed to create showcase entry');
        return;
      }

      setManualTitle('');
      setManualClientName('');
      setManualDescription('');
      setManualRequirements('');
      setManualMediaDriveLink('');
      setManualLiveWebsiteUrl('');
      setManualStartDate('');
      setManualEndDate('');
      setManualDailyHours('');
      setManualCover(null);
      setManualSelectedMembers({});
      setManualMemberName('');
      setManualMemberRole('');
      setManualCustomMembers([]);

      await loadAll();
    } catch (error) {
      console.error('Error creating manual showcase entry:', error);
      setError('Failed to create showcase entry');
    } finally {
      setSubmittingManual(false);
    }
  };

  const addManualCustomMember = () => {
    const name = manualMemberName.trim();
    const role = manualMemberRole.trim();
    if (!name) return;

    setManualCustomMembers((prev) => [...prev, { name, role: role || null }]);
    setManualMemberName('');
    setManualMemberRole('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  const visibleShowcase = showcase.filter((s) => s.is_visible);
  const hiddenShowcase = showcase.filter((s) => !s.is_visible);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Project Showcase</h1>
        <a
          href="/shridevfreelance/projectShowcase"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-[#10B981] hover:underline"
        >
          View Public Showcase →
        </a>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Import from completed projects */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">Import Completed Project</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">Completed Project</label>
              <select
                value={importProjectId}
                onChange={(e) => setImportProjectId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white text-[#111827]"
              >
                <option value="">Select a completed project</option>
                {completedProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}{p.client_name ? ` — ${p.client_name}` : ''}{p.has_showcase ? ' (already in showcase)' : ''}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImportCover(e.target.files?.[0] || null)}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-4">
            <Button isLoading={submittingImport} onClick={handleImport}>
              Import to Showcase
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Showcase Projects */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">Currently Showcased</h3>
        </CardHeader>
        <CardBody className="p-0">
          {visibleShowcase.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B7280]">No projects in showcase</p>
            </div>
          ) : (
            <div className="divide-y divide-[#D1FAE5]">
              {visibleShowcase.map((s) => (
                <div key={s.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-[#111827] truncate">{s.title}</p>
                    <p className="text-sm text-[#6B7280] line-clamp-1">{s.description || 'No description'}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleToggleVisibility(s.id, s.is_visible)}>
                    Unpublish
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Draft / Hidden */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">Hidden / Draft</h3>
        </CardHeader>
        <CardBody className="p-0">
          {hiddenShowcase.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B7280]">No hidden projects</p>
            </div>
          ) : (
            <div className="divide-y divide-[#D1FAE5]">
              {hiddenShowcase.map((s) => (
                <div key={s.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-[#111827] truncate">{s.title}</p>
                    <p className="text-sm text-[#6B7280] line-clamp-1">{s.description || 'No description'}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => openEdit(s)}>
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      isLoading={deleteSubmittingId === s.id}
                      onClick={() => removeEntry(s.id)}
                    >
                      Remove
                    </Button>
                    <Button size="sm" onClick={() => handleToggleVisibility(s.id, s.is_visible)}>
                      Publish
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-[#111827]">Edit Draft Showcase Entry</h3>
              <button onClick={closeEdit} className="text-sm text-[#6B7280] hover:text-[#111827]">
                Close
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                <Input label="Client Name" value={editClientName} onChange={(e) => setEditClientName(e.target.value)} />
                <Input
                  label="Media Drive Link"
                  value={editMediaDriveLink}
                  onChange={(e) => setEditMediaDriveLink(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Live Website URL"
                  value={editLiveWebsiteUrl}
                  onChange={(e) => setEditLiveWebsiteUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white text-[#111827]"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">Requirements</label>
                <textarea
                  value={editRequirements}
                  onChange={(e) => setEditRequirements(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white text-[#111827]"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Start Date" type="date" value={editStartDate} onChange={(e) => setEditStartDate(e.target.value)} />
                <Input label="End Date" type="date" value={editEndDate} onChange={(e) => setEditEndDate(e.target.value)} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Daily Working Hours"
                  type="number"
                  value={editDailyHours}
                  onChange={(e) => setEditDailyHours(e.target.value)}
                  step="0.25"
                  min="0"
                />
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-1.5">Replace Cover Image (optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditCover(e.target.files?.[0] || null)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 border-t px-6 py-4">
              <Button variant="outline" onClick={closeEdit}>
                Cancel
              </Button>
              <Button isLoading={editSubmitting} onClick={submitEdit}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">Manual Project Entry</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Title" value={manualTitle} onChange={(e) => setManualTitle(e.target.value)} />

            <Input
              label="Client Name"
              value={manualClientName}
              onChange={(e) => setManualClientName(e.target.value)}
              placeholder="Enter client name"
            />

            <Input
              label="Media Drive Link"
              value={manualMediaDriveLink}
              onChange={(e) => setManualMediaDriveLink(e.target.value)}
              placeholder="https://..."
            />

            <Input
              label="Live Website URL"
              value={manualLiveWebsiteUrl}
              onChange={(e) => setManualLiveWebsiteUrl(e.target.value)}
              placeholder="https://..."
            />

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#111827] mb-1.5">Description</label>
              <textarea
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white text-[#111827]"
                rows={4}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#111827] mb-1.5">Requirements</label>
              <textarea
                value={manualRequirements}
                onChange={(e) => setManualRequirements(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none focus:ring-2 focus:ring-opacity-50 bg-white text-[#111827]"
                rows={4}
              />
            </div>

            <Input
              label="Start Date"
              type="date"
              value={manualStartDate}
              onChange={(e) => setManualStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={manualEndDate}
              onChange={(e) => setManualEndDate(e.target.value)}
            />

            <Input
              label="Daily Working Hours"
              type="number"
              value={manualDailyHours}
              onChange={(e) => setManualDailyHours(e.target.value)}
              step="0.25"
              min="0"
            />

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setManualCover(e.target.files?.[0] || null)}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-medium text-[#111827] mb-2">Assigned Members</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Member Name"
                value={manualMemberName}
                onChange={(e) => setManualMemberName(e.target.value)}
                placeholder="Type name and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addManualCustomMember();
                  }
                }}
              />
              <Input
                label="Role"
                value={manualMemberRole}
                onChange={(e) => setManualMemberRole(e.target.value)}
                placeholder="(optional)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addManualCustomMember();
                  }
                }}
              />
            </div>

            {manualCustomMembers.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {manualCustomMembers.map((m, idx) => (
                  <div
                    key={`${m.name}-${idx}`}
                    className="flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm text-[#111827]"
                  >
                    <span className="max-w-[240px] truncate">{m.name}{m.role ? ` (${m.role})` : ''}</span>
                    <button
                      type="button"
                      className="text-[#6B7280] hover:text-[#111827]"
                      onClick={() => setManualCustomMembers((prev) => prev.filter((_, i) => i !== idx))}
                      aria-label="Remove member"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {manualCustomMembers.length === 0 ? (
              <div className="mt-4">
                {members.length === 0 ? (
                  <p className="text-sm text-[#6B7280]">No members found</p>
                ) : (
                  <div>
                    <p className="text-xs text-[#6B7280] mb-2">Or select from existing members</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {members.map((m) => (
                        <label key={m.id} className="flex items-center gap-2 text-sm text-[#111827]">
                          <input
                            type="checkbox"
                            checked={Boolean(manualSelectedMembers[m.id])}
                            onChange={(e) =>
                              setManualSelectedMembers((prev) => ({ ...prev, [m.id]: e.target.checked }))
                            }
                          />
                          <span className="truncate">{m.full_name}{m.role ? ` (${m.role})` : ''}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          <div className="mt-6">
            <Button isLoading={submittingManual} onClick={handleManualCreate}>
              Create Showcase Entry
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
