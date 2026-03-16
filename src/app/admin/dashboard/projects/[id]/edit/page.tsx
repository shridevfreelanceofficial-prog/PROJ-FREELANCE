'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';

interface Project {
  id: string;
  title: string;
  client_name: string | null;
  description: string | null;
  requirements: string | null;
  media_drive_link: string | null;
  start_date: string | null;
  end_date: string | null;
  final_website_url: string | null;
}

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    description: '',
    requirements: '',
    media_drive_link: '',
    start_date: '',
    end_date: '',
    final_website_url: '',
  });

  useEffect(() => {
    void load();
  }, [params.id]);

  const load = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch(`/api/admin/projects/${params.id}`, { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Failed to load project');
        return;
      }

      const data = (await res.json()) as { project: Project };
      const p = data.project;

      setFormData({
        title: p.title || '',
        client_name: p.client_name || '',
        description: p.description || '',
        requirements: p.requirements || '',
        media_drive_link: p.media_drive_link || '',
        start_date: p.start_date || '',
        end_date: p.end_date || '',
        final_website_url: p.final_website_url || '',
      });
    } catch (e) {
      console.error('Load project error:', e);
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Project title is required');
      return;
    }

    try {
      setError(null);
      setSaving(true);

      const res = await fetch(`/api/admin/projects/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          client_name: formData.client_name || null,
          description: formData.description || null,
          requirements: formData.requirements || null,
          media_drive_link: formData.media_drive_link || null,
          start_date: formData.start_date || null,
          end_date: formData.end_date || null,
          final_website_url: formData.final_website_url || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Failed to update project');
        return;
      }

      router.push(`/admin/dashboard/projects/${params.id}`);
    } catch (e) {
      console.error('Update project error:', e);
      setError('Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-[#111827]">Edit Project</h2>
          <p className="text-[#6B7280] mt-1">Update project information</p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error ? (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            ) : null}

            <Input
              label="Project Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Input
              label="Client Name"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              placeholder="Enter client name"
            />

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">Requirements</label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none"
              />
            </div>

            <Input
              label="Media Drive Link"
              value={formData.media_drive_link}
              onChange={(e) => setFormData({ ...formData, media_drive_link: e.target.value })}
              placeholder="https://..."
            />

            <Input
              label="Final Website URL"
              value={formData.final_website_url}
              onChange={(e) => setFormData({ ...formData, final_website_url: e.target.value })}
              placeholder="https://..."
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
              <Input
                label="End Date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1" isLoading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
