import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import path from 'path';
import fs from 'fs/promises';
import { getCurrentUser } from '@/lib/auth';
import { queryOne, query } from '@/lib/db';
import { uploadConfirmationReport } from '@/lib/blob';

async function fetchBlobBytes(url: string): Promise<{ bytes: Uint8Array; contentType: string | null }> {
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
    throw new Error(`Failed to fetch blob (${res.status}): ${text || res.statusText}`);
  }

  const contentType = res.headers.get('content-type');
  const ab = await res.arrayBuffer();
  return { bytes: new Uint8Array(ab), contentType };
}

function formatDate(value: string | null): string {
  if (!value) return 'N/A';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString();
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

    if (!memberId) {
      return NextResponse.json({ error: 'member_id is required' }, { status: 400 });
    }

    const project = await queryOne<{
      title: string;
      description: string | null;
      start_date: string | null;
      end_date: string | null;
    }>('SELECT title, description, start_date, end_date FROM projects WHERE id = $1', [projectId]);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const member = await queryOne<{
      full_name: string;
      role: string | null;
      signature_url: string | null;
    }>('SELECT full_name, role, signature_url FROM members WHERE id = $1', [memberId]);

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const admin = await queryOne<{
      name: string | null;
      signature_url: string | null;
    }>('SELECT name, signature_url FROM administrators WHERE id = $1', [result.user.id]);

    const payment = await queryOne<{
      amount: string | null;
    }>('SELECT amount FROM payments WHERE project_id = $1 AND member_id = $2', [projectId, memberId]);

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const marginX = 50;
    let y = height - 60;

    const primary = rgb(0.06, 0.73, 0.51);
    const dark = rgb(0.07, 0.09, 0.15);
    const muted = rgb(0.42, 0.45, 0.50);

    // Header
    const headerTopY = y;
    const logoSize = 34;
    let headerTextX = marginX;

    try {
      const logoPath = path.join(process.cwd(), 'public', 'images', 'logo', 'ShriDev_Freelance_logo.png');
      const logoBytes = await fs.readFile(logoPath);
      const logoImage = await pdfDoc.embedPng(logoBytes);

      const dims = logoImage.scale(1);
      const scale = Math.min(logoSize / dims.width, logoSize / dims.height);
      const drawW = dims.width * scale;
      const drawH = dims.height * scale;

      // Place logo near the top-left
      page.drawImage(logoImage, {
        x: marginX,
        y: headerTopY - drawH + 26,
        width: drawW,
        height: drawH,
      });

      headerTextX = marginX + logoSize + 10;
    } catch {
      // ignore if logo can't be read
    }

    page.drawText('ShriDev Freelance', {
      x: headerTextX,
      y: headerTopY,
      size: 20,
      font: fontBold,
      color: primary,
    });

    y -= 28;
    page.drawText('Project Confirmation Report', {
      x: marginX,
      y,
      size: 16,
      font: fontBold,
      color: dark,
    });

    // Divider
    y -= 18;
    page.drawLine({
      start: { x: marginX, y },
      end: { x: width - marginX, y },
      thickness: 2,
      color: primary,
    });

    // Project details
    y -= 30;
    page.drawText('Project Details', {
      x: marginX,
      y,
      size: 13,
      font: fontBold,
      color: dark,
    });

    y -= 18;
    page.drawText(`Project: ${project.title}`, {
      x: marginX,
      y,
      size: 11,
      font,
      color: dark,
    });

    y -= 16;
    page.drawText(`Project Start Date: ${formatDate(project.start_date)}`, {
      x: marginX,
      y,
      size: 11,
      font,
      color: dark,
    });

    y -= 16;
    page.drawText(`Project End Date: ${formatDate(project.end_date)}`, {
      x: marginX,
      y,
      size: 11,
      font,
      color: dark,
    });

    // Body
    y -= 30;
    page.drawText(`Hello ${member.full_name},`, {
      x: marginX,
      y,
      size: 12,
      font,
      color: dark,
    });

    y -= 22;
    page.drawText('Project Description:', {
      x: marginX,
      y,
      size: 11,
      font: fontBold,
      color: dark,
    });

    y -= 16;
    const projectDescription = project.description?.trim() || 'N/A';
    {
      const maxWidth = width - marginX * 2;
      const words = projectDescription.split(' ');
      let line = '';
      const lines: string[] = [];
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        const testWidth = font.widthOfTextAtSize(test, 10);
        if (testWidth > maxWidth) {
          lines.push(line);
          line = w;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);

      for (const l of lines.slice(0, 6)) {
        page.drawText(l, {
          x: marginX,
          y,
          size: 10,
          font,
          color: muted,
        });
        y -= 14;
      }
    }

    y -= 24;
    page.drawText(`Role: ${member.role || 'N/A'}`, {
      x: marginX,
      y,
      size: 11,
      font,
      color: dark,
    });

    y -= 16;
    page.drawText(`Payment Amount: ${payment?.amount ?? 'N/A'}`, {
      x: marginX,
      y,
      size: 11,
      font,
      color: dark,
    });

    y -= 24;
    page.drawText('Note:', {
      x: marginX,
      y,
      size: 11,
      font: fontBold,
      color: dark,
    });

    y -= 16;
    const note =
      'Admin can remove member if they did not perform well, any misbehaviour, inactivity, or data breaching.';

    const maxWidth = width - marginX * 2;
    const words = note.split(' ');
    let line = '';
    const lines: string[] = [];
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      const testWidth = font.widthOfTextAtSize(test, 10);
      if (testWidth > maxWidth) {
        lines.push(line);
        line = w;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);

    for (const l of lines) {
      page.drawText(l, {
        x: marginX,
        y,
        size: 10,
        font,
        color: muted,
      });
      y -= 14;
    }

    // Signatures
    const sigBoxTop = 160;
    const sigY = sigBoxTop;
    const sigWidth = 180;
    const sigHeight = 70;

    const leftX = marginX;
    const rightX = width - marginX - sigWidth;

    // Labels
    page.drawText('Member Signature', {
      x: leftX,
      y: sigY + sigHeight + 20,
      size: 10,
      font: fontBold,
      color: dark,
    });

    page.drawText('Admin Signature', {
      x: rightX,
      y: sigY + sigHeight + 20,
      size: 10,
      font: fontBold,
      color: dark,
    });

    async function drawSignature(signatureUrl: string | null, x: number) {
      if (!signatureUrl) {
        page.drawRectangle({
          x,
          y: sigY,
          width: sigWidth,
          height: sigHeight,
          borderColor: muted,
          borderWidth: 1,
          color: rgb(1, 1, 1),
        });
        return;
      }

      const { bytes, contentType } = await fetchBlobBytes(signatureUrl);

      let image;
      if (contentType?.includes('png')) {
        image = await pdfDoc.embedPng(bytes);
      } else if (contentType?.includes('jpeg') || contentType?.includes('jpg') || !contentType) {
        image = await pdfDoc.embedJpg(bytes);
      } else {
        throw new Error(`Unsupported signature content-type: ${contentType}`);
      }

      const dims = image.scale(1);
      const scale = Math.min(sigWidth / dims.width, sigHeight / dims.height);
      const drawW = dims.width * scale;
      const drawH = dims.height * scale;

      const drawX = x + (sigWidth - drawW) / 2;
      const drawY = sigY + (sigHeight - drawH) / 2;

      page.drawRectangle({
        x,
        y: sigY,
        width: sigWidth,
        height: sigHeight,
        borderColor: muted,
        borderWidth: 1,
        color: rgb(1, 1, 1),
      });

      page.drawImage(image, {
        x: drawX,
        y: drawY,
        width: drawW,
        height: drawH,
      });
    }

    await drawSignature(member.signature_url, leftX);
    await drawSignature(admin?.signature_url || null, rightX);

    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);

    const blobResult = await uploadConfirmationReport(buffer, projectId, memberId);

    // confirmation_reports doesn't have a UNIQUE(project_id, member_id) constraint in schema,
    // so we do a safe delete+insert instead of ON CONFLICT upsert.
    await query('DELETE FROM confirmation_reports WHERE project_id = $1 AND member_id = $2', [
      projectId,
      memberId,
    ]);
    await query(
      `INSERT INTO confirmation_reports (project_id, member_id, report_url)
       VALUES ($1, $2, $3)`,
      [projectId, memberId, blobResult.url]
    );

    const filenameSafe = `confirmation-${project.title.replace(/[^a-z0-9\-_. ]/gi, '').trim() || projectId}-${member.full_name.replace(/[^a-z0-9\-_. ]/gi, '').trim() || memberId}.pdf`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filenameSafe}"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Generate confirmation report error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
