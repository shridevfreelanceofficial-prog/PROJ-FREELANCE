'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220] via-[#0F766E] to-[#10B981]"></div>
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      ></div>

      <div className="absolute top-24 left-10 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-[28rem] h-[28rem] bg-teal-300/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 pt-32 pb-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 ring-1 ring-white/15 backdrop-blur-xl rounded-2xl mb-5 shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight drop-shadow">Certificate Verification</h1>
            <p className="text-white/75 text-base sm:text-lg">Verify the authenticity of your ShriDev Freelance certificate</p>
          </div>

          <Card className="backdrop-blur-2xl bg-white/95 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.65)] border border-white/40">
            <CardBody className="p-7 sm:p-8">
              <form onSubmit={handleVerify} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#111827] mb-2">Certificate Code</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={certificateCode}
                      onChange={(e) => setCertificateCode(e.target.value.toUpperCase())}
                      placeholder="Enter certificate code (e.g., SHR-XXXX-XXXX)"
                      required
                      className="w-full px-5 py-4 text-lg rounded-2xl border border-[#D1FAE5] focus:border-[#10B981] focus:ring-4 focus:ring-[#10B981]/20 focus:outline-none transition-all bg-white/80 tracking-wider"
                    />
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                      <div className="h-9 w-9 rounded-xl bg-emerald-50 ring-1 ring-emerald-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 1.657-1.343 3-3 3S6 12.657 6 11s1.343-3 3-3 3 1.343 3 3z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.4 15a7.97 7.97 0 00.6-3 8 8 0 10-16 0 7.97 7.97 0 00.6 3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#0F766E] to-[#10B981] hover:from-[#0B5F59] hover:to-[#059669] text-white py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                  isLoading={loading}
                >
                  Verify Certificate
                </Button>
              </form>
            </CardBody>
          </Card>

          {error && (
            <Card className="mt-6 backdrop-blur-2xl bg-white/95 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.65)] border border-red-200">
              <CardBody className="p-7 sm:p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-full ring-1 ring-red-200 flex items-center justify-center mx-auto mb-5 shadow-inner">
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
            <Card className="mt-6 backdrop-blur-2xl bg-white/95 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.65)] overflow-hidden border border-white/40">
              <div className="bg-gradient-to-r from-[#0F766E] via-[#10B981] to-[#34D399] px-8 py-7 text-center">
                <div className="w-20 h-20 bg-white/15 ring-1 ring-white/25 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">✓ Verified Certificate</h3>
                <p className="text-white/90">This certificate is authentic and verified</p>
              </div>

              <CardBody className="p-7 sm:p-8">
                <div className="relative overflow-hidden bg-gradient-to-br from-[#F0FDF4] to-[#D1FAE5] rounded-3xl p-6 sm:p-7 ring-1 ring-emerald-200/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] opacity-[0.07]">
                      <Image
                        src="/images/logo/ShriDev_Freelance_logo.png"
                        alt="ShriDev Freelance"
                        fill
                        className="object-contain"
                        priority={false}
                      />
                    </div>
                  </div>

                  <div className="relative z-10 space-y-4">
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
            <Link href="/" className="text-white/80 hover:text-white text-sm font-medium transition-colors">
              ← Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
