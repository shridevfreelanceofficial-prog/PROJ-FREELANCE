import { Suspense } from 'react';
import CertificateVerificationClient from './CertificateVerificationClient';

export default function CertificateVerificationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0F766E]" />}>
      <CertificateVerificationClient />
    </Suspense>
  );
}
