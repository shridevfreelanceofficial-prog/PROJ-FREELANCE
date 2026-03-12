'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardHeader, CardBody } from '@/components/ui';
import { getSignedUrl } from '@/lib/blob';

interface MemberDocs {
  member_id: string;
  full_name: string;
  email: string;
  certificate_url: string | null;
  report_url: string | null;
}

type DocumentType = 'confirmation' | 'certificate';

export default function MailDocumentsPage() {
  const params = useParams();
  const [members, setMembers] = useState<MemberDocs[]>([]);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingKey, setSendingKey] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const [projectRes, docsRes] = await Promise.all([
        fetch(`/api/admin/projects/${params.id}`),
        fetch(`/api/admin/projects/${params.id}/mail-documents`),
      ]);

      if (projectRes.ok) {
        const data = await projectRes.json();
        setProjectName(data.project.title || data.project.name);
      }

      if (docsRes.ok) {
        const data = await docsRes.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error('Error fetching mail documents data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (memberId: string, documentType: DocumentType) => {
    const key = `${memberId}:${documentType}`;
    setSendingKey(key);

    try {
      const response = await fetch(`/api/admin/projects/${params.id}/mail-documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: memberId, document_type: documentType }),
      });

      if (response.ok) {
        alert('Email sent successfully');
      } else {
        const data = await response.json().catch(() => null);
        alert(data?.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    } finally {
      setSendingKey(null);
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
        <h1 className="text-2xl font-bold text-[#111827]">Mail Documents</h1>
        <p className="text-[#6B7280]">Project: {projectName}</p>
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">Member Documents</h3>
        </CardHeader>
        <CardBody className="p-0">
          {members.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B7280]">No members found for this project.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#D1FAE5]">
              {members.map((m) => (
                <div key={m.member_id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-[#111827]">{m.full_name}</p>
                      <p className="text-sm text-[#6B7280]">{m.email}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="rounded-lg border border-[#D1FAE5] p-4">
                      <p className="font-medium text-[#111827]">Confirmation Report</p>
                      <p className="text-sm text-[#6B7280] mt-1">
                        {m.report_url ? 'Generated' : 'Not generated yet'}
                      </p>
                      <div className="flex gap-3 mt-3">
                        {m.report_url && (
                          <a
                            href={getSignedUrl(m.report_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#10B981] hover:underline text-sm"
                          >
                            View →
                          </a>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          isLoading={sendingKey === `${m.member_id}:confirmation`}
                          onClick={() => handleSend(m.member_id, 'confirmation')}
                        >
                          Send Email
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#D1FAE5] p-4">
                      <p className="font-medium text-[#111827]">Certificate</p>
                      <p className="text-sm text-[#6B7280] mt-1">
                        {m.certificate_url ? 'Generated' : 'Not generated yet'}
                      </p>
                      <div className="flex gap-3 mt-3">
                        {m.certificate_url && (
                          <a
                            href={getSignedUrl(m.certificate_url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#10B981] hover:underline text-sm"
                          >
                            View →
                          </a>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          isLoading={sendingKey === `${m.member_id}:certificate`}
                          onClick={() => handleSend(m.member_id, 'certificate')}
                        >
                          Send Email
                        </Button>
                      </div>
                    </div>
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
