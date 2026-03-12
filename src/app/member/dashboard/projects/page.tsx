'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui';

interface Project {
  id: string;
  name: string;
  client_name: string;
  description: string | null;
  status: string;
  start_date: string;
  end_date: string | null;
  daily_working_hours: string;
  participation_confirmed: boolean;
}

export default function MemberProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/member/projects');
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
      <h1 className="text-2xl font-bold text-[#111827]">My Projects</h1>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-[#6B7280]">You are not assigned to any projects yet.</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link key={project.id} href={`/member/dashboard/projects/${project.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-[#111827]">{project.name}</h3>
                      <p className="text-sm text-[#6B7280]">Client: {project.client_name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                </CardHeader>
                <CardBody className="space-y-3">
                  {project.description && (
                    <p className="text-sm text-[#6B7280] line-clamp-2">{project.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                    <span>Started: {new Date(project.start_date).toLocaleDateString()}</span>
                    {project.end_date && (
                      <span>End: {new Date(project.end_date).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-[#6B7280]">{project.daily_working_hours}h/day</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      project.participation_confirmed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {project.participation_confirmed ? 'Confirmed' : 'Pending Confirmation'}
                    </span>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
