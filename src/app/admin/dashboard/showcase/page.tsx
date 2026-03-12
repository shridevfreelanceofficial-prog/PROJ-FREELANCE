'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardHeader, CardBody } from '@/components/ui';

interface Project {
  id: string;
  name: string;
  client_name: string;
  status: string;
  start_date: string;
  end_date: string | null;
  showcase_enabled: boolean;
}

export default function ShowcasePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleToggleShowcase = async (projectId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}/showcase`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showcase_enabled: !currentStatus }),
      });

      if (response.ok) {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error toggling showcase:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  const showcaseProjects = projects.filter(p => p.showcase_enabled);
  const completedProjects = projects.filter(p => p.status === 'completed' && !p.showcase_enabled);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#111827]">Project Showcase</h1>
      </div>

      {/* Showcase Projects */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">Currently Showcased</h3>
        </CardHeader>
        <CardBody className="p-0">
          {showcaseProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B7280]">No projects in showcase</p>
            </div>
          ) : (
            <div className="divide-y divide-[#D1FAE5]">
              {showcaseProjects.map((project) => (
                <div key={project.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#111827]">{project.name}</p>
                    <p className="text-sm text-[#6B7280]">Client: {project.client_name}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleShowcase(project.id, project.showcase_enabled)}
                  >
                    Remove from Showcase
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Available for Showcase */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">Completed Projects</h3>
        </CardHeader>
        <CardBody className="p-0">
          {completedProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B7280]">No completed projects available for showcase</p>
            </div>
          ) : (
            <div className="divide-y divide-[#D1FAE5]">
              {completedProjects.map((project) => (
                <div key={project.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#111827]">{project.name}</p>
                    <p className="text-sm text-[#6B7280]">Client: {project.client_name}</p>
                    <p className="text-sm text-[#6B7280]">
                      Completed: {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleToggleShowcase(project.id, project.showcase_enabled)}
                  >
                    Add to Showcase
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
