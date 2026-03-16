'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Button, Card, CardBody } from '@/components/ui';

interface CertificateData {
  member_name: string;
  project_name: string;
  start_date: string;
  end_date: string;
  is_valid: boolean;
  issued_at: string;
}

export default function CertificateVerificationClient() {
  const searchParams = useSearchParams();
  const [certificateCode, setCertificateCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CertificateData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const code = searchParams.get('code');
    if (code && !certificateCode) {
      setCertificateCode(code.toUpperCase());
    }
  }, [searchParams, certificateCode]);

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
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F766E] via-[#10B981] to-[#34D399]"></div>
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      ></div>

      <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">Certificate Verification</h1>
            <p className="text-white/80 text-lg">Verify the authenticity of your ShriDev Freelance certificate</p>
          </div>

          <Card className="backdrop-blur-xl bg-white/95 shadow-2xl border-0">
            <CardBody className="p-8">
              <form onSubmit={handleVerify} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">Certificate Code</label>
                  <input
                    type="text"
                    value={certificateCode}
                    onChange={(e) => setCertificateCode(e.target.value.toUpperCase())}
                    placeholder="Enter certificate code (e.g., SHR-XXXX-XXXX)"
                    required
                    className="w-full px-5 py-4 text-lg rounded-xl border-2 border-[#D1FAE5] focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/20 focus:outline-none transition-all bg-[#F8FAFC]"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#0F766E] to-[#10B981] hover:from-[#0F766E] hover:to-[#059669] text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                  isLoading={loading}
                >
                  Verify Certificate
                </Button>
              </form>
            </CardBody>
          </Card>

          {error && (
            <Card className="mt-6 backdrop-blur-xl bg-white/95 shadow-2xl border-2 border-red-300">
              <CardBody className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-5 shadow-inner">
                  <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-red-600 mb-3">Invalid Certificate</h3>
                <p className="text-[#6B7280] text-lg">{error}</p>
              </CardBody>
            </Card>
          )}

          {result && (
            <Card className="mt-6 backdrop-blur-xl bg-white/95 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-[#0F766E] via-[#10B981] to-[#34D399] px-8 py-6 text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">✓ Verified Certificate</h3>
                <p className="text-white/90">This certificate is authentic and verified</p>
              </div>

              <CardBody className="p-8">
                <div className="bg-gradient-to-br from-[#F0FDF4] to-[#D1FAE5] rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-[#10B981]/20">
                    <span className="text-[#6B7280] font-medium">Certificate Holder</span>
                    <span className="font-bold text-[#111827] text-lg">{result.member_name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#10B981]/20">
                    <span className="text-[#6B7280] font-medium">Project Name</span>
                    <span className="font-bold text-[#111827] text-lg">{result.project_name}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#10B981]/20">
                    <span className="text-[#6B7280] font-medium">Project Duration</span>
                    <span className="font-semibold text-[#111827]">
                      {result.start_date &&
                        new Date(result.start_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}{' '}
                      -{' '}
                      {result.end_date &&
                        new Date(result.end_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[#10B981]/20">
                    <span className="text-[#6B7280] font-medium">Issued On</span>
                    <span className="font-semibold text-[#111827]">
                      {new Date(result.issued_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-[#6B7280] font-medium">Status</span>
                    <span className="px-4 py-2 bg-gradient-to-r from-[#10B981] to-[#34D399] text-white rounded-full text-sm font-bold shadow-md">
                      ✓ Authentic
                    </span>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#111827] rounded-full">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-white flex items-center justify-center">
                      <Image
                        src="/images/logo/ShriDev_Freelance_logo.png"
                        alt="ShriDev Freelance"
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <span className="text-white text-sm font-medium">ShriDev Freelance</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          )}

          <p className="text-center mt-8">
            <a href="/" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              ← Back to Home
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
