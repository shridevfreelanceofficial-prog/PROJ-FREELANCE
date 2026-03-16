import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { generateCertificateCode, createCertificatePDF } from '@/lib/documents';
import { uploadCertificate, deleteFile } from '@/lib/blob';

// GET - Fetch existing certificates for a project
export async function GET(
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

    // Get all certificates for this project (using issued_at column)
    const certificates = await query<{
      id: string;
      member_id: string;
      certificate_code: string;
      certificate_url: string;
      issued_at: string;
    }>(
      `SELECT id, member_id, certificate_code, certificate_url, issued_at 
       FROM certificates 
       WHERE project_id = $1 
       ORDER BY issued_at DESC`,
      [id]
    );

    return NextResponse.json({ certificates });
  } catch (error) {
    console.error('Fetch certificates error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST - Generate new certificates
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
    const errors: string[] = [];

    for (const memberId of member_ids) {
      try {
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

        if (!member) {
          errors.push(`Member not found: ${memberId}`);
          continue;
        }

        // Generate certificate code
        const certificateCode = generateCertificateCode();

        // Create certificate PDF
        const certificatePdfBytes = await createCertificatePDF({
          memberName: member.full_name,
          projectName: project.title,
          startDate: project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A',
          endDate: project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A',
          role: member.role || 'Team Member',
          certificateCode,
          adminName: admin?.name || 'Shrikesh Uday Shetty',
          adminSignatureUrl: admin?.signature_url || '',
          memberSignatureUrl: member.signature_url || '',
        });

        // Upload certificate to blob storage
        const certificateBuffer = Buffer.from(certificatePdfBytes);
        let blobResult;
        try {
          blobResult = await uploadCertificate(certificateBuffer, certificateCode);
        } catch (blobError) {
          console.error('Blob upload error:', blobError);
          throw new Error(`Failed to upload certificate: ${blobError instanceof Error ? blobError.message : String(blobError)}`);
        }

        // Save certificate record
        try {
          await query(
            `INSERT INTO certificates (project_id, member_id, certificate_code, certificate_url)
             VALUES ($1, $2, $3, $4)`,
            [id, memberId, certificateCode, blobResult.url]
          );
        } catch (dbError) {
          console.error('Database insert error:', dbError);
          throw new Error(`Failed to save certificate record: ${dbError instanceof Error ? dbError.message : String(dbError)}`);
        }

        // Add to project showcase (non-critical, don't throw on error)
        try {
          await query(
            `INSERT INTO project_showcase (
               project_id,
               title,
               description,
               requirements,
               media_drive_link,
               start_date,
               end_date,
               is_visible
             )
             VALUES ($1, $2, $3, $4, $5, $6, $7, false)
             ON CONFLICT (project_id)
             DO UPDATE SET
               title = EXCLUDED.title,
               description = EXCLUDED.description,
               requirements = EXCLUDED.requirements,
               media_drive_link = EXCLUDED.media_drive_link,
               start_date = EXCLUDED.start_date,
               end_date = EXCLUDED.end_date`,
            [
              id,
              project.title,
              project.description,
              project.description,
              null,
              project.start_date,
              project.end_date,
            ]
          );
        } catch (showcaseError) {
          console.error('Showcase insert error (non-critical):', showcaseError);
        }

        certificates.push({
          memberId: member.id,
          memberName: member.full_name,
          certificateCode,
          certificateUrl: blobResult.url,
        });
      } catch (memberError) {
        console.error(`Error processing member ${memberId}:`, memberError);
        errors.push(`Member ${memberId}: ${memberError instanceof Error ? memberError.message : String(memberError)}`);
      }
    }

    return NextResponse.json({ success: true, certificates, errors });
  } catch (error) {
    console.error('Generate certificates error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE - Remove a certificate
export async function DELETE(
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
    const { certificateCode } = await request.json();

    if (!certificateCode) {
      return NextResponse.json(
        { error: 'Certificate code is required' },
        { status: 400 }
      );
    }

    // Get certificate details
    const certificate = await queryOne<{
      id: string;
      certificate_url: string;
      member_id: string;
    }>(
      'SELECT id, certificate_url, member_id FROM certificates WHERE certificate_code = $1 AND project_id = $2',
      [certificateCode, id]
    );

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      );
    }

    // Delete from blob storage
    try {
      await deleteFile(certificate.certificate_url);
    } catch (blobError) {
      console.error('Failed to delete from blob storage:', blobError);
      // Continue to delete from database even if blob deletion fails
    }

    // Delete from database
    await query(
      'DELETE FROM certificates WHERE id = $1',
      [certificate.id]
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Certificate deleted successfully',
      memberId: certificate.member_id 
    });
  } catch (error) {
    console.error('Delete certificate error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
