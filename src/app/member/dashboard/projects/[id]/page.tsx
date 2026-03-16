'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardHeader, CardBody } from '@/components/ui';

interface Project {
  id: string;
  name: string;
  description: string | null;
  requirements: string | null;
  start_date: string | null;
  end_date: string | null;
  status: string;
  client_name: string;
  github_link?: string | null;
}

interface ProjectMember {
  id: string;
  participation_confirmed: boolean;
  daily_working_hours: number;
}

export default function MemberProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [projectMember, setProjectMember] = useState<ProjectMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  const normalizeExternalUrl = (url: string): string => {
    const trimmed = url.trim();
    if (!trimmed) return trimmed;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  useEffect(() => {
    fetchProjectData();
  }, [params.id]);

  const fetchProjectData = async () => {
    try {
      const response = await fetch(`/api/member/projects/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data.project);
        setProjectMember(data.projectMember);
      } else {
        router.push('/member/dashboard/projects');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmParticipation = async () => {
    setConfirming(true);
    try {
      const response = await fetch(`/api/member/projects/${params.id}/confirm`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchProjectData();
        alert('Participation confirmed successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to confirm participation');
      }
    } catch (error) {
      console.error('Error confirming participation:', error);
      alert('Failed to confirm participation');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[#111827]">Project not found</h2>
        <Link href="/member/dashboard/projects" className="text-[#10B981] mt-4 inline-block">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link href="/member/dashboard/projects" className="text-[#10B981] text-sm mb-2 inline-block">
          ← Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-[#111827]">{project.name}</h1>
        <p className="text-[#6B7280]">Client: {project.client_name}</p>
      </div>

      {/* Confirmation Banner */}
      {projectMember && !projectMember.participation_confirmed && (
        <Card className="border-2 border-[#F59E0B] bg-[#FFFBEB]">
          <CardBody className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#F59E0B] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#111827] mb-2">Confirm Your Participation</h3>
                <p className="text-[#6B7280] mb-4">
                  You have been assigned to this project. Please confirm your participation to start receiving project notifications and updates.
                </p>
                <Button onClick={handleConfirmParticipation} isLoading={confirming}>
                  Confirm Participation
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {projectMember?.participation_confirmed && (
        <Card className="border-2 border-[#10B981] bg-[#D1FAE5]">
          <CardBody className="p-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-medium text-[#0F766E]">You are confirmed for this project</p>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Project Details */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#111827]">Project Details</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <p className="text-sm text-[#6B7280]">Description</p>
              <p className="font-medium text-[#111827]">{project.description || 'No description'}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'active' ? 'bg-green-100 text-green-800' :
                project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                project.status === 'on_hold' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            {project.start_date && (
              <div>
                <p className="text-sm text-[#6B7280]">Start Date</p>
                <p className="font-medium text-[#111827]">
                  {new Date(project.start_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {project.end_date && (
              <div>
                <p className="text-sm text-[#6B7280]">End Date</p>
                <p className="font-medium text-[#111827]">
                  {new Date(project.end_date).toLocaleDateString()}
                </p>
              </div>
            )}

            {projectMember?.participation_confirmed && project.github_link && project.github_link.trim() && (
              <div>
                <p className="text-sm text-[#6B7280]">GitHub Link</p>
                <a
                  href={normalizeExternalUrl(project.github_link)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#10B981] hover:underline"
                >
                  Open Repository →
                </a>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#111827]">Quick Actions</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            {projectMember?.participation_confirmed && (
              <>
                <Link href={`/member/dashboard/reports?project_id=${encodeURIComponent(project.id)}`}>
                  <Button variant="outline" className="w-full">Upload Daily Report</Button>
                </Link>
                <Link href="/member/dashboard/work-timer">
                  <Button variant="outline" className="w-full">Work Timer</Button>
                </Link>
              </>
            )}
            <Link href={`/member/dashboard/projects/${project.id}/deliverables`}>
              <Button variant="outline" className="w-full">View Deliverables</Button>
            </Link>
          </CardBody>
        </Card>
      </div>

      {/* Requirements */}
      {project.requirements && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#111827]">Project Requirements</h3>
          </CardHeader>
          <CardBody>
            <p className="text-[#6B7280] whitespace-pre-wrap">{project.requirements}</p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
