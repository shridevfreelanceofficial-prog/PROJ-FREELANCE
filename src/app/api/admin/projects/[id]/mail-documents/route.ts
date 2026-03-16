import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query, queryOne } from '@/lib/db';
import { sendCertificateEmail, sendEmail } from '@/lib/email';

async function fetchBlobBuffer(url: string): Promise<Buffer> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured');
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-vercel-blob-token': token,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch document (${res.status}): ${text || res.statusText}`);
  }

  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

type DocumentType = 'confirmation' | 'certificate';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;

    const members = await query<{
      member_id: string;
      full_name: string;
      email: string;
      certificate_url: string | null;
      report_url: string | null;
    }>(
      `SELECT m.id as member_id,
              m.full_name,
              m.email,
              c.certificate_url,
              cr.report_url
       FROM project_members pm
       JOIN members m ON pm.member_id = m.id
       LEFT JOIN certificates c ON c.project_id = pm.project_id AND c.member_id = pm.member_id
       LEFT JOIN confirmation_reports cr ON cr.project_id = pm.project_id AND cr.member_id = pm.member_id
       WHERE pm.project_id = $1
       ORDER BY m.full_name`,
      [projectId]
    );

    return NextResponse.json(
      { members },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Get mail documents error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const result = await getCurrentUser();

    if (!result || result.userType !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = await params;
    const body = await request.json().catch(() => ({}));

    const memberId = body?.member_id as string | undefined;
    const docType = body?.document_type as DocumentType | undefined;

    if (!memberId || !docType) {
      return NextResponse.json(
        { error: 'member_id and document_type are required' },
        { status: 400 }
      );
    }

    const project = await queryOne<{ title: string }>(
      'SELECT title FROM projects WHERE id = $1',
      [projectId]
    );

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const member = await queryOne<{ full_name: string; email: string }>(
      'SELECT full_name, email FROM members WHERE id = $1',
      [memberId]
    );

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const docRow =
      docType === 'certificate'
        ? await queryOne<{ url: string | null; code: string | null }>(
            'SELECT certificate_url as url, certificate_code as code FROM certificates WHERE project_id = $1 AND member_id = $2 ORDER BY issued_at DESC LIMIT 1',
            [projectId, memberId]
          )
        : await queryOne<{ url: string | null }>(
            'SELECT report_url as url FROM confirmation_reports WHERE project_id = $1 AND member_id = $2 ORDER BY generated_at DESC LIMIT 1',
            [projectId, memberId]
          );

    const docUrl = docRow?.url || null;
    const certificateCode: string | undefined =
      docType === 'certificate'
        ? ((docRow as { code: string | null } | null)?.code ?? undefined)
        : undefined;

    // For confirmation reports, regenerate on-demand so the latest admin signature is always embedded.
    // For certificates, we attach the stored PDF from blob.
    const pdfBuffer =
      docType === 'confirmation'
        ? await (async () => {
            const origin = new URL(request.url).origin;
            const res = await fetch(`${origin}/api/admin/projects/${projectId}/confirmation`, {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                cookie: request.headers.get('cookie') || '',
              },
              body: JSON.stringify({ member_id: memberId }),
              cache: 'no-store',
            });

            if (!res.ok) {
              const text = await res.text().catch(() => '');
              throw new Error(`Failed to regenerate confirmation report (${res.status}): ${text || res.statusText}`);
            }

            const ab = await res.arrayBuffer();
            return Buffer.from(ab);
          })()
        : await (async () => {
            if (!docUrl) {
              return null;
            }
            return fetchBlobBuffer(docUrl);
          })();

    if (!pdfBuffer) {
      return NextResponse.json(
        { error: 'Certificate not generated yet' },
        { status: 404 }
      );
    }

    const prettyType = docType === 'certificate' ? 'Certificate' : 'Confirmation Report';
    const filename = `${prettyType.replace(/\s+/g, '-').toLowerCase()}-${project.title.replace(/\s+/g, '-').toLowerCase()}.pdf`;

    const ok =
      docType === 'certificate'
        ? await sendCertificateEmail(
            member.email,
            String(member.full_name),
            project.title,
            docUrl || '',
            pdfBuffer,
            certificateCode
          )
        : await sendEmail({
            to: member.email,
            subject: `${prettyType} - ${project.title}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #10B981, #0F766E); color: white; padding: 24px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #FFFFFF; padding: 24px; border: 1px solid #D1FAE5; }
                  .footer { background: #F8FAFC; padding: 16px; text-align: center; border-radius: 0 0 10px 10px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2>${prettyType}</h2>
                  </div>
                  <div class="content">
                    <p>Dear <strong>${member.full_name}</strong>,</p>
                    <p>Please find your <strong>${prettyType}</strong> for the project <strong>${project.title}</strong> attached.</p>
                  </div>
                  <div class="footer">
                    <p>Best regards,<br><strong>ShriDev Freelance Team</strong></p>
                    <p style="color: #6B7280; font-size: 12px;">This is an automated email. Please do not reply directly.</p>
                  </div>
                </div>
              </body>
              </html>
            `,
            attachments: [
              {
                filename,
                path: '',
                content: pdfBuffer,
              },
            ],
          });

    if (!ok) {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json(
      { success: true },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Send mail document error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
