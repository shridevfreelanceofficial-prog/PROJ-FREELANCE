'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui';

interface Certificate {
  id: string;
  certificate_code: string;
  project_name: string;
  client_name: string;
  issue_date: string;
  certificate_url: string;
}

export default function MemberCertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/member/certificates');
      if (response.ok) {
        const data = await response.json();
        setCertificates(data.certificates);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
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
      <h1 className="text-2xl font-bold text-[#111827]">My Certificates</h1>

      {/* Certificates Grid */}
      {certificates.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <p className="text-[#6B7280]">You don't have any certificates yet.</p>
            <p className="text-sm text-[#6B7280] mt-2">Certificates are issued upon successful project completion.</p>
          </CardBody>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#111827]">{cert.project_name}</h3>
                    <p className="text-sm text-[#6B7280]">Client: {cert.client_name}</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center gap-4 text-sm text-[#6B7280]">
                  <span>Issued: {new Date(cert.issue_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/api/certificates/${cert.certificate_code}`}
                    target="_blank"
                    className="text-[#10B981] hover:underline text-sm font-medium"
                  >
                    View Certificate
                  </Link>
                  <Link
                    href={`/certificates/verify?code=${cert.certificate_code}`}
                    className="text-[#6B7280] hover:underline text-sm"
                  >
                    Verify
                  </Link>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
