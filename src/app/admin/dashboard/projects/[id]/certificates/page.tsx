'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardHeader, CardBody } from '@/components/ui';

interface Project {
  id: string;
  title: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
}

interface TeamMember {
  id: string;
  member_id: string;
  full_name: string;
  email: string;
  role: string | null;
  participation_confirmed: boolean;
  has_certificate: boolean;
  certificate_code?: string;
  certificate_url?: string;
}

export default function CertificatesPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generatedCertificates, setGeneratedCertificates] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const [projectRes, membersRes, certificatesRes] = await Promise.all([
        fetch(`/api/admin/projects/${params.id}`),
        fetch(`/api/admin/projects/${params.id}/members`),
        fetch(`/api/admin/projects/${params.id}/certificates`),
      ]);

      if (projectRes.ok) {
        const data = await projectRes.json();
        setProject(data.project);
      }

      if (membersRes.ok) {
        const membersData = await membersRes.json();
        
        // Get existing certificates
        let existingCertificates: any[] = [];
        if (certificatesRes.ok) {
          const certData = await certificatesRes.json();
          existingCertificates = certData.certificates || [];
        }

        // Map members with certificate info
        const membersWithCerts = membersData.members.map((member: any) => {
          const cert = existingCertificates.find((c: any) => c.member_id === member.member_id);
          return {
            ...member,
            has_certificate: !!cert,
            certificate_code: cert?.certificate_code,
            certificate_url: cert?.certificate_url,
          };
        });

        setMembers(membersWithCerts);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMember = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSelectAll = () => {
    const membersWithoutCert = members
      .filter(m => !m.has_certificate)
      .map(m => m.member_id);
    
    if (selectedMembers.length === membersWithoutCert.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(membersWithoutCert);
    }
  };

  const handleGenerateCertificates = async () => {
    if (selectedMembers.length === 0) {
      alert('Please select at least one member');
      return;
    }

    if (!confirm(`Generate certificates for ${selectedMembers.length} member(s)?`)) {
      return;
    }

    setGenerating(true);

    try {
      const response = await fetch(`/api/admin/projects/${params.id}/certificates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_ids: selectedMembers }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedCertificates(data.certificates || []);
        setSelectedMembers([]);
        fetchData(); // Refresh data
        
        // Show result with any errors
        const errorCount = data.errors?.length || 0;
        const successCount = data.certificates?.length || 0;
        
        if (errorCount > 0) {
          console.error('Certificate generation errors:', data.errors);
          alert(`Generated ${successCount} certificate(s).\n\nErrors:\n${data.errors.join('\n')}`);
        } else {
          alert(`Successfully generated ${successCount} certificate(s)!`);
        }
      } else {
        const error = await response.json();
        alert(error.error || error.details || 'Failed to generate certificates');
      }
    } catch (error) {
      console.error('Error generating certificates:', error);
      alert('An error occurred while generating certificates');
    } finally {
      setGenerating(false);
    }
  };

  const handleDeleteCertificate = async (certificateCode: string, memberName: string) => {
    if (!confirm(`Are you sure you want to delete the certificate for ${memberName}?\n\nThis action cannot be undone. You can regenerate the certificate after deletion.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/projects/${params.id}/certificates`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateCode }),
      });

      if (response.ok) {
        alert('Certificate deleted successfully');
        fetchData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete certificate');
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
      alert('An error occurred while deleting the certificate');
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
        <h2 className="text-xl font-medium text-[#111827]">Project not found</h2>
        <Link href="/admin/dashboard/projects" className="text-[#10B981] mt-2 inline-block">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const membersWithoutCert = members.filter(m => !m.has_certificate);
  const membersWithCert = members.filter(m => m.has_certificate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Link 
            href={`/admin/dashboard/projects/${params.id}`} 
            className="text-[#10B981] text-sm mb-2 inline-block"
          >
            ← Back to Project
          </Link>
          <h2 className="text-2xl font-bold text-[#111827]">Generate Certificates</h2>
          <p className="text-[#6B7280] mt-1">{project.title}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/dashboard/projects/${params.id}`}>
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </div>

      {/* Project Info */}
      <Card>
        <CardBody className="p-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-sm text-[#6B7280]">Status</span>
              <p className="font-medium text-green-600">COMPLETED</p>
            </div>
            {project.start_date && (
              <div>
                <span className="text-sm text-[#6B7280]">Start Date</span>
                <p className="font-medium text-[#111827]">
                  {new Date(project.start_date).toLocaleDateString()}
                </p>
              </div>
            )}
            {project.end_date && (
              <div>
                <span className="text-sm text-[#6B7280]">End Date</span>
                <p className="font-medium text-[#111827]">
                  {new Date(project.end_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Members without certificates */}
      {membersWithoutCert.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#111827]">
                Team Members Without Certificates ({membersWithoutCert.length})
              </h3>
              <p className="text-sm text-[#6B7280] mt-1">
                Select members to generate certificates for
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedMembers.length === membersWithoutCert.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Button 
                size="sm" 
                onClick={handleGenerateCertificates}
                disabled={selectedMembers.length === 0 || generating}
                isLoading={generating}
              >
                Generate Selected ({selectedMembers.length})
              </Button>
            </div>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-[#D1FAE5]">
              {membersWithoutCert.map((member) => (
                <div 
                  key={member.member_id} 
                  className={`p-4 flex items-center justify-between cursor-pointer hover:bg-[#F8FAFC] transition-colors ${
                    selectedMembers.includes(member.member_id) ? 'bg-[#D1FAE5]/30' : ''
                  }`}
                  onClick={() => handleSelectMember(member.member_id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                      selectedMembers.includes(member.member_id)
                        ? 'bg-[#10B981] border-[#10B981]'
                        : 'border-gray-300'
                    }`}>
                      {selectedMembers.includes(member.member_id) && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="w-10 h-10 bg-[#D1FAE5] rounded-full flex items-center justify-center">
                      <span className="text-[#10B981] font-medium">{member.full_name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-[#111827]">{member.full_name}</p>
                      <p className="text-sm text-[#6B7280]">{member.role || 'Team Member'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#6B7280]">{member.email}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      member.participation_confirmed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {member.participation_confirmed ? 'Confirmed' : 'Pending Confirmation'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Members with certificates */}
      {membersWithCert.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#111827]">
              Certificates Generated ({membersWithCert.length})
            </h3>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y divide-[#D1FAE5]">
              {membersWithCert.map((member) => (
                <div key={member.member_id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-[#111827]">{member.full_name}</p>
                      <p className="text-sm text-[#6B7280]">{member.role || 'Team Member'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-[#6B7280]">Certificate ID</p>
                      <p className="text-sm font-mono font-medium text-[#10B981]">{member.certificate_code}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {member.certificate_code && (
                        <a
                          href={`/api/certificates/${member.certificate_code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#10B981] hover:underline text-sm font-medium"
                        >
                          View →
                        </a>
                      )}
                      <button
                        onClick={() => handleDeleteCertificate(member.certificate_code!, member.full_name)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Empty state */}
      {members.length === 0 && (
        <Card>
          <CardBody className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-[#D1FAE5] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium text-[#111827] mb-2">No Team Members</h3>
            <p className="text-[#6B7280]">Add team members to this project before generating certificates.</p>
          </CardBody>
        </Card>
      )}

      {/* Certificate Preview */}
      {null}
    </div>
  );
}
