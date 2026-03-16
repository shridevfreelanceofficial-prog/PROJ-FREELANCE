'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardBody } from '@/components/ui';

interface Project {
  id: string;
  title: string;
  client_name: string | null;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  created_at: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/admin/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on_hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Projects</h2>
          <p className="text-[#6B7280]">Manage your freelancing projects</p>
        </div>
        <Link href="/admin/dashboard/projects/create">
          <Button>Create Project</Button>
        </Link>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-[#D1FAE5] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-medium text-[#111827] mb-2">No projects yet</h3>
            <p className="text-[#6B7280] mb-4">Get started by creating your first project</p>
            <Link href="/admin/dashboard/projects/create">
              <Button>Create First Project</Button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} variant="elevated" className="hover:shadow-lg transition-shadow h-full">
              <CardBody className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-[#111827] line-clamp-1">
                    {project.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>

                {project.client_name ? (
                  <p className="text-sm text-[#374151] mb-3">
                    <span className="text-[#6B7280]">Client:</span> {project.client_name}
                  </p>
                ) : null}

                <p className="text-sm text-[#6B7280] line-clamp-2 mb-4">
                  {project.description || 'No description provided'}
                </p>

                <div className="flex items-center gap-4 text-xs text-[#6B7280] mb-5">
                  {project.start_date && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(project.start_date).toLocaleDateString()}
                    </div>
                  )}
                  {project.end_date && (
                    <div className="flex items-center gap-1">
                      <span>→</span>
                      {new Date(project.end_date).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="mt-auto flex items-center gap-2">
                  <Link className="flex-1" href={`/admin/dashboard/projects/${project.id}`}>
                    <Button variant="outline" className="w-full">View</Button>
                  </Link>
                  <Link className="flex-1" href={`/admin/dashboard/projects/${project.id}/edit`}>
                    <Button className="w-full">Edit</Button>
                  </Link>
                  <Button
                    className="flex-1 w-full"
                    variant="danger"
                    isLoading={deletingId === project.id}
                    onClick={async () => {
                      const ok = window.confirm('Remove this project? This cannot be undone.');
                      if (!ok) return;
                      try {
                        setDeletingId(project.id);
                        const res = await fetch(`/api/admin/projects/${project.id}`, { method: 'DELETE' });
                        if (res.ok) await fetchProjects();
                      } finally {
                        setDeletingId(null);
                      }
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
