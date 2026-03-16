import { redirect } from 'next/navigation';

export default async function CertificatesVerifyAliasPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) || {};
  const codeRaw = sp.code;
  const code = Array.isArray(codeRaw) ? codeRaw[0] : codeRaw;

  if (code) {
    redirect(`/certificate-verification?code=${encodeURIComponent(code)}`);
  }

  redirect('/certificate-verification');
}
