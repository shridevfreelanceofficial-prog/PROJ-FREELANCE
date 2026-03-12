import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { generateCertificateCode, createCertificateHTML } from '@/lib/documents';
import { uploadCertificate } from '@/lib/blob';
import { sendCertificateEmail } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await getCurrentUser();
    
    if (!result || result.userType !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const { member_ids } = await request.json();

    // Get project details
    const project = await queryOne<{
      title: string;
      description: string | null;
      start_date: string | null;
      end_date: string | null;
    }>(
      'SELECT title, description, start_date, end_date FROM projects WHERE id = $1',
      [id]
    );

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Get admin details
    const admin = await queryOne<{
      name: string | null;
      signature_url: string | null;
    }>(
      'SELECT name, signature_url FROM administrators WHERE id = $1',
      [result.user.id]
    );

    const certificates = [];

    for (const memberId of member_ids) {
      // Get member details
      const member = await queryOne<{
        id: string;
        full_name: string;
        email: string;
        role: string | null;
        signature_url: string | null;
      }>(
        'SELECT id, full_name, email, role, signature_url FROM members WHERE id = $1',
        [memberId]
      );

      if (!member) continue;

      // Generate certificate code
      const certificateCode = generateCertificateCode();

      // Create certificate HTML
      const certificateHTML = createCertificateHTML({
        memberName: member.full_name,
        projectName: project.title,
        startDate: project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A',
        endDate: project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A',
        role: member.role || 'Team Member',
        certificateCode,
        adminName: admin?.name || 'Project Lead',
        adminSignatureUrl: admin?.signature_url || '',
        memberSignatureUrl: member.signature_url || '',
      });

      // Upload certificate to blob storage
      const certificateBuffer = Buffer.from(certificateHTML, 'utf-8');
      const blobResult = await uploadCertificate(certificateBuffer, certificateCode);

      // Save certificate record
      await query(
        `INSERT INTO certificates (project_id, member_id, certificate_code, certificate_url)
         VALUES ($1, $2, $3, $4)`,
        [id, memberId, certificateCode, blobResult.url]
      );

      // Add to project showcase
      await query(
        `INSERT INTO project_showcase (project_id, title, description, start_date, end_date, is_visible)
         VALUES ($1, $2, $3, $4, $5, false)
         ON CONFLICT (project_id) DO NOTHING`,
        [id, project.title, project.description, project.start_date, project.end_date]
      );

      // Send certificate email
      await sendCertificateEmail(
        member.email,
        member.full_name,
        project.title,
        blobResult.url,
        certificateBuffer
      );

      certificates.push({
        memberId: member.id,
        memberName: member.full_name,
        certificateCode,
        certificateUrl: blobResult.url,
      });
    }

    return NextResponse.json({ success: true, certificates });
  } catch (error) {
    console.error('Generate certificates error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
