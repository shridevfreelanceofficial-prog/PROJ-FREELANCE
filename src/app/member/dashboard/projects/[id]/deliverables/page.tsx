'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';

interface Deliverable {
  id: string;
  title: string;
  description: string | null;
  file_url: string | null;
  drive_link: string | null;
  uploaded_at: string;
}

export default function DeliverablesPage() {
  const params = useParams();
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null as File | null,
    drive_link: '',
  });

  useEffect(() => {
    fetchDeliverables();
  }, [params.id]);

  const fetchDeliverables = async () => {
    try {
      const response = await fetch(`/api/member/projects/${params.id}/deliverables`);
      if (response.ok) {
        const data = await response.json();
        setDeliverables(data.deliverables);
      }
    } catch (error) {
      console.error('Error fetching deliverables:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError('File size must be less than 100MB');
        return;
      }
      setFormData({ ...formData, file });
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title) {
      setError('Title is required');
      return;
    }

    if (!formData.file && !formData.drive_link) {
      setError('Please upload a file or provide a drive link');
      return;
    }

    setUploading(true);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('drive_link', formData.drive_link);
      if (formData.file) {
        submitData.append('file', formData.file);
      }

      const response = await fetch(`/api/member/projects/${params.id}/deliverables`, {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to upload deliverable');
        return;
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        file: null,
        drive_link: '',
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchDeliverables();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setUploading(false);
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
    <div className="space-y-6">
      {/* Upload Form */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">Upload Deliverable</h3>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter deliverable title"
              required
            />

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the deliverable"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Upload File (ZIP, PDF, etc.)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#D1FAE5] rounded-lg p-6 text-center cursor-pointer hover:border-[#10B981] transition-colors"
              >
                {formData.file ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-8 h-8 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[#111827]">{formData.file.name}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg className="w-12 h-12 mx-auto text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-[#6B7280]">Click to upload file (up to 100MB)</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#D1FAE5]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-[#6B7280]">OR</span>
              </div>
            </div>

            <Input
              label="Google Drive / Dropbox Link"
              value={formData.drive_link}
              onChange={(e) => setFormData({ ...formData, drive_link: e.target.value })}
              placeholder="https://drive.google.com/..."
              helperText="Provide a shareable link to your files"
            />

            <Button type="submit" className="w-full" isLoading={uploading}>
              Upload Deliverable
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Previous Deliverables */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">Uploaded Deliverables</h3>
        </CardHeader>
        <CardBody className="p-0">
          {deliverables.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B7280]">No deliverables uploaded yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[#D1FAE5]">
              {deliverables.map((deliverable) => (
                <div key={deliverable.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#111827]">{deliverable.title}</p>
                    <p className="text-sm text-[#6B7280]">
                      {new Date(deliverable.uploaded_at).toLocaleDateString()}
                    </p>
                    {deliverable.description && (
                      <p className="text-sm text-[#6B7280] mt-1 line-clamp-1">{deliverable.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {deliverable.file_url && (
                      <a
                        href={deliverable.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#10B981] hover:underline text-sm"
                      >
                        View File →
                      </a>
                    )}
                    {deliverable.drive_link && (
                      <a
                        href={deliverable.drive_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#10B981] hover:underline text-sm"
                      >
                        Open Drive →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
