'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardHeader, CardBody } from '@/components/ui';

interface ProjectMember {
  id: string;
  member_id: string;
  full_name: string;
  email: string;
  signature_url: string | null;
  participation_confirmed: boolean;
}

export default function GenerateConfirmationPage() {
  const params = useParams();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const [projectRes, membersRes] = await Promise.all([
        fetch(`/api/admin/projects/${params.id}`),
        fetch(`/api/admin/projects/${params.id}/members`),
      ]);

      if (projectRes.ok) {
        const data = await projectRes.json();
        setProjectName(data.project.title || data.project.name);
      }
      if (membersRes.ok) {
        const data = await membersRes.json();
        setMembers(data.members.filter((m: ProjectMember) => m.participation_confirmed));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateConfirmation = async (memberId: string) => {
    setGenerating(memberId);
    try {
      const response = await fetch(`/api/admin/projects/${params.id}/confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: memberId }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `confirmation-${params.id}-${memberId}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const data = await response.json().catch(() => null);
        alert(data?.error || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating confirmation:', error);
      alert('Failed to generate confirmation report');
    } finally {
      setGenerating(null);
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
      <div>
        <Link href={`/admin/dashboard/projects/${params.id}`} className="text-[#10B981] text-sm mb-2 inline-block">
          ← Back to Project
        </Link>
        <h1 className="text-2xl font-bold text-[#111827]">Generate Confirmation Reports</h1>
        <p className="text-[#6B7280]">Project: {projectName}</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">Confirmed Team Members</h3>
        </CardHeader>
        <CardBody className="p-0">
          {members.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B7280]">No confirmed members to generate reports for.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#D1FAE5]">
              {members.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#111827]">{member.full_name}</p>
                    <p className="text-sm text-[#6B7280]">{member.email}</p>
                  </div>
                  <Button
                    onClick={() => handleGenerateConfirmation(member.member_id)}
                    isLoading={generating === member.member_id}
                  >
                    Generate Report
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
