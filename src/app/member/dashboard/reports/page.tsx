'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';

interface Project {
  id: string;
  title: string;
}

interface Report {
  id: string;
  project_id: string;
  project_title: string;
  report_date: string;
  report_url: string;
  work_hours: string;
  summary: string | null;
}

export default function DailyReportsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    project_id: '',
    report_date: new Date().toISOString().split('T')[0],
    work_hours: '8',
    summary: '',
    report_file: null as File | null,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, reportsRes] = await Promise.all([
        fetch('/api/member/projects'),
        fetch('/api/member/reports'),
      ]);

      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data.projects.filter((p: Project & { status: string }) => p.status === 'active'));
      }
      if (reportsRes.ok) {
        const data = await reportsRes.json();
        setReports(data.reports);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Only PDF files are allowed');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFormData({ ...formData, report_file: file });
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.report_file) {
      setError('Please select a PDF file');
      return;
    }

    setUploading(true);

    try {
      const submitData = new FormData();
      submitData.append('project_id', formData.project_id);
      submitData.append('report_date', formData.report_date);
      submitData.append('work_hours', formData.work_hours);
      submitData.append('summary', formData.summary);
      submitData.append('report_file', formData.report_file);

      const response = await fetch('/api/member/reports', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to upload report');
        return;
      }

      // Reset form
      setFormData({
        project_id: '',
        report_date: new Date().toISOString().split('T')[0],
        work_hours: '8',
        summary: '',
        report_file: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchData();
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
          <h3 className="text-lg font-semibold text-[#111827]">Upload Daily Report</h3>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">
                  Project
                </label>
                <select
                  value={formData.project_id}
                  onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none"
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Report Date"
                type="date"
                value={formData.report_date}
                onChange={(e) => setFormData({ ...formData, report_date: e.target.value })}
                required
              />
            </div>

            <Input
              label="Work Hours"
              type="number"
              value={formData.work_hours}
              onChange={(e) => setFormData({ ...formData, work_hours: e.target.value })}
              placeholder="Hours worked"
              required
              min="0"
              max="24"
            />

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Summary (Optional)
              </label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Brief summary of tasks completed"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Report File (PDF)
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#D1FAE5] rounded-lg p-6 text-center cursor-pointer hover:border-[#10B981] transition-colors"
              >
                {formData.report_file ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-8 h-8 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[#111827]">{formData.report_file.name}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <svg className="w-12 h-12 mx-auto text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-[#6B7280]">Click to upload PDF report</p>
                    <p className="text-xs text-[#6B7280]">PDF up to 10MB</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <Button type="submit" className="w-full" isLoading={uploading}>
              Upload Report
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Previous Reports */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">Previous Reports</h3>
        </CardHeader>
        <CardBody className="p-0">
          {reports.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B7280]">No reports uploaded yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[#D1FAE5]">
              {reports.map((report) => (
                <div key={report.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#111827]">{report.project_title}</p>
                    <p className="text-sm text-[#6B7280]">
                      {new Date(report.report_date).toLocaleDateString()} • {report.work_hours} hours
                    </p>
                    {report.summary && (
                      <p className="text-sm text-[#6B7280] mt-1 line-clamp-1">{report.summary}</p>
                    )}
                  </div>
                  <a
                    href={report.report_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#10B981] hover:underline text-sm"
                  >
                    View →
                  </a>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
