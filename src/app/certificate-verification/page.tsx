'use client';

import { useState } from 'react';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';

interface CertificateData {
  member_name: string;
  project_name: string;
  start_date: string;
  end_date: string;
  is_valid: boolean;
  issued_at: string;
}

export default function CertificateVerificationPage() {
  const [certificateCode, setCertificateCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CertificateData | null>(null);
  const [error, setError] = useState('');

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await fetch('/api/certificates/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificate_code: certificateCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Verification failed');
        return;
      }

      setResult(data.certificate);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#111827] mb-2">Certificate Verification</h1>
          <p className="text-[#6B7280]">
            Enter your certificate code to verify its authenticity
          </p>
        </div>

        {/* Verification Form */}
        <Card>
          <CardBody className="p-6">
            <form onSubmit={handleVerify} className="space-y-4">
              <Input
                label="Certificate Code"
                value={certificateCode}
                onChange={(e) => setCertificateCode(e.target.value.toUpperCase())}
                placeholder="Enter certificate code (e.g., SHR-XXXX-XXXX)"
                required
              />
              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={loading}
              >
                Verify Certificate
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Result */}
        {error && (
          <Card className="mt-6 border-2 border-red-200">
            <CardBody className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-red-600 mb-2">Not a Valid Code</h3>
              <p className="text-[#6B7280]">{error}</p>
            </CardBody>
          </Card>
        )}

        {result && (
          <Card className="mt-6 border-2 border-[#10B981]">
            <CardBody className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#10B981] mb-2">Valid Certificate</h3>
                <p className="text-[#6B7280]">This certificate is authentic and verified</p>
              </div>

              <div className="bg-[#F8FAFC] rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-[#D1FAE5]">
                  <span className="text-[#6B7280]">Certificate Holder</span>
                  <span className="font-medium text-[#111827]">{result.member_name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#D1FAE5]">
                  <span className="text-[#6B7280]">Project Name</span>
                  <span className="font-medium text-[#111827]">{result.project_name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#D1FAE5]">
                  <span className="text-[#6B7280]">Project Duration</span>
                  <span className="font-medium text-[#111827]">
                    {result.start_date && new Date(result.start_date).toLocaleDateString()} - 
                    {result.end_date && new Date(result.end_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#D1FAE5]">
                  <span className="text-[#6B7280]">Issued On</span>
                  <span className="font-medium text-[#111827]">
                    {new Date(result.issued_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#6B7280]">Status</span>
                  <span className="px-3 py-1 bg-[#D1FAE5] text-[#0F766E] rounded-full text-sm font-medium">
                    Valid
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Back to home */}
        <p className="text-center mt-6">
          <a href="/" className="text-[#6B7280] hover:text-[#10B981] text-sm">
            ← Back to Home
          </a>
        </p>
      </div>
    </div>
  );
}
