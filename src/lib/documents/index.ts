import { v4 as uuidv4 } from 'uuid';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import path from 'path';
import fs from 'fs/promises';

function normalizeBaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, '');
  if (!trimmed) return 'https://www.shridevfreelance.online';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function getAppBaseUrl(): string {
  const configured =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    'https://www.shridevfreelance.online';

  const normalized = normalizeBaseUrl(configured);

  // Always use production domain if localhost is detected (for certificates/emails)
  if (/localhost/i.test(normalized)) {
    return 'https://www.shridevfreelance.online';
  }

  return normalized;
}

interface CertificateData {
  memberName: string;
  projectName: string;
  startDate: string;
  endDate: string;
  role: string;
  certificateCode: string;
  adminName: string;
  adminSignatureUrl: string;
  memberSignatureUrl: string;
}

interface ConfirmationReportData {
  memberName: string;
  projectName: string;
  projectDescription: string;
  startDate: string;
  endDate: string;
  role: string;
  dailyWorkingHours: string;
  adminName: string;
  adminSignatureUrl: string;
  memberSignatureUrl: string;
}

// Generate unique certificate code
export function generateCertificateCode(): string {
  const prefix = 'SHR';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = uuidv4().split('-')[0].toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Helper to fetch blob bytes for signatures
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
    throw new Error(`Failed to fetch blob (${res.status})`);
  }

  const contentType = res.headers.get('content-type');
  const ab = await res.arrayBuffer();
  return { bytes: new Uint8Array(ab), contentType };
}

// Create certificate PDF
export async function createCertificatePDF(data: CertificateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([841.89, 595.28]); // A4 landscape
  const { width, height } = page.getSize();

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const marginX = 60;
  let y = height - 50;

  const primary = rgb(0.06, 0.73, 0.51); // #10B981
  const teal = rgb(0.06, 0.46, 0.43); // #0F766E
  const dark = rgb(0.07, 0.09, 0.15); // #111827
  const muted = rgb(0.42, 0.45, 0.50); // #6B7280
  const lightGreen = rgb(0.82, 0.98, 0.9); // #D1FAE5

  const innerMargin = 36;

  // Border
  page.drawRectangle({
    x: 20,
    y: 20,
    width: width - 40,
    height: height - 40,
    borderColor: primary,
    borderWidth: 4,
    color: rgb(1, 1, 1),
  });

  // Inner border
  page.drawRectangle({
    x: innerMargin,
    y: innerMargin,
    width: width - innerMargin * 2,
    height: height - innerMargin * 2,
    borderColor: lightGreen,
    borderWidth: 2,
    color: rgb(1, 1, 1),
  });

  const innerTopY = height - innerMargin;

  // Header - Centered logo + brand inside the inner border
  const brandLeft = 'ShriDev';
  const brandRight = 'Freelance';
  const brandSize = 28;
  const brandGap = 8;
  const logoSize = 42;
  const logoGap = 10;

  const brandLeftWidth = fontBold.widthOfTextAtSize(brandLeft, brandSize);
  const brandRightWidth = font.widthOfTextAtSize(brandRight, brandSize);
  const brandBlockWidth = logoSize + logoGap + brandLeftWidth + brandGap + brandRightWidth;
  const brandStartX = (width - brandBlockWidth) / 2;
  const brandY = innerTopY - 48;

  // Official logo
  try {
    const logoPath = path.join(process.cwd(), 'public', 'images', 'logo', 'ShriDev_Freelance_logo.png');
    const logoBytes = await fs.readFile(logoPath);
    const logoImage = await pdfDoc.embedPng(logoBytes);
    const dims = logoImage.scale(1);
    const scale = Math.min(logoSize / dims.width, logoSize / dims.height);
    const drawW = dims.width * scale;
    const drawH = dims.height * scale;
    page.drawImage(logoImage, {
      x: brandStartX + (logoSize - drawW) / 2,
      y: (brandY - 8) + (logoSize - drawH) / 2,
      width: drawW,
      height: drawH,
    });
  } catch {
    page.drawRectangle({
      x: brandStartX,
      y: brandY - 8,
      width: logoSize,
      height: logoSize,
      borderColor: primary,
      borderWidth: 2,
      color: rgb(1, 1, 1),
    });
  }

  const textX = brandStartX + logoSize + logoGap;
  page.drawText(brandLeft, {
    x: textX,
    y: brandY,
    size: brandSize,
    font: fontBold,
    color: primary,
  });
  page.drawText(brandRight, {
    x: textX + brandLeftWidth + brandGap,
    y: brandY,
    size: brandSize,
    font: font,
    color: teal,
  });

  // Start the rest of the content inside the inner border
  y = brandY - 55;

  // Certificate Title
  y -= 35;
  const titleText = 'CERTIFICATE OF COMPLETION';
  const titleWidth = fontBold.widthOfTextAtSize(titleText, 24);
  page.drawText(titleText, {
    x: (width - titleWidth) / 2,
    y,
    size: 24,
    font: fontBold,
    color: teal,
  });

  // Decorative line
  y -= 12;
  page.drawLine({
    start: { x: width / 2 - 100, y },
    end: { x: width / 2 + 100, y },
    thickness: 2,
    color: primary,
  });

  // Presented to
  y -= 26;
  const presentedText = 'This certificate is proudly presented to';
  const presentedWidth = font.widthOfTextAtSize(presentedText, 12);
  page.drawText(presentedText, {
    x: (width - presentedWidth) / 2,
    y,
    size: 12,
    font: font,
    color: muted,
  });

  // Member Name
  y -= 34;
  const nameWidth = fontBold.widthOfTextAtSize(data.memberName, 28);
  page.drawText(data.memberName, {
    x: (width - nameWidth) / 2,
    y,
    size: 28,
    font: fontBold,
    color: dark,
  });

  // For their outstanding contribution
  y -= 32;
  const contributionText = 'for their outstanding contribution to the project';
  const contributionWidth = font.widthOfTextAtSize(contributionText, 12);
  page.drawText(contributionText, {
    x: (width - contributionWidth) / 2,
    y,
    size: 12,
    font: font,
    color: muted,
  });

  // Project Name
  y -= 30;
  const projectWidth = fontBold.widthOfTextAtSize(data.projectName, 22);
  page.drawText(data.projectName, {
    x: (width - projectWidth) / 2,
    y,
    size: 22,
    font: fontBold,
    color: primary,
  });

  // Completion text (paragraph should be above the details)
  y -= 38;
  const completionText = 'Throughout the project, the individual demonstrated exceptional dedication, technical expertise, and professional conduct. This certificate recognizes their valuable contribution to the successful completion of the project.';
  const words = completionText.split(' ');
  let line = '';
  const lines: string[] = [];
  const maxWidth = width - marginX * 2 - 40;
  
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
    const lineWidth = font.widthOfTextAtSize(l, 10);
    page.drawText(l, {
      x: (width - lineWidth) / 2,
      y,
      size: 10,
      font: font,
      color: muted,
    });
    y -= 14;
  }

  // Details section (below paragraph)
  y -= 18;
  const detailsY = y;
  const leftColX = marginX + 40;
  const rightColX = width - marginX - 265;
  const valueOffsetX = 85;

  // Left column
  page.drawText('Role:', {
    x: leftColX,
    y: detailsY,
    size: 10,
    font: fontBold,
    color: muted,
  });
  page.drawText(data.role, {
    x: leftColX + valueOffsetX,
    y: detailsY,
    size: 10,
    font: font,
    color: dark,
  });

  page.drawText('Start Date:', {
    x: leftColX,
    y: detailsY - 18,
    size: 10,
    font: fontBold,
    color: muted,
  });
  page.drawText(data.startDate, {
    x: leftColX + valueOffsetX,
    y: detailsY - 18,
    size: 10,
    font: font,
    color: dark,
  });

  // Right column (aligned to the right)
  page.drawText('End Date:', {
    x: rightColX,
    y: detailsY,
    size: 10,
    font: fontBold,
    color: muted,
  });
  page.drawText(data.endDate, {
    x: rightColX + valueOffsetX,
    y: detailsY,
    size: 10,
    font: font,
    color: dark,
  });

  page.drawText('Project Type:', {
    x: rightColX,
    y: detailsY - 18,
    size: 10,
    font: fontBold,
    color: muted,
  });
  page.drawText('Paid', {
    x: rightColX + valueOffsetX,
    y: detailsY - 18,
    size: 10,
    font: font,
    color: dark,
  });

  // Bottom layout

  // Admin signature (bottom center, no label) - define first for reference
  const sigY = innerMargin + 82;
  const sigWidth = 220;
  const sigHeight = 70;
  const sigX = (width - sigWidth) / 2;

  // Certificate ID + Verify URL (bottom-left)
  // Anchor this block just above the bottom inner border of the light green box.
  const verifyY = innerMargin + 12;
  const certIdValueY = verifyY + 12;
  const certIdLabelY = certIdValueY + 12;
  const certBlockX = innerMargin + 10;

  page.drawText('Certificate ID', {
    x: certBlockX,
    y: certIdLabelY,
    size: 9,
    font: fontBold,
    color: muted,
  });

  page.drawText(data.certificateCode, {
    x: certBlockX,
    y: certIdValueY,
    size: 9,
    font: fontBold,
    color: primary,
  });

  // Verify URL - positioned just above the green signature line
  const verifyUrl = `${getAppBaseUrl()}/certificate-verification?code=${encodeURIComponent(data.certificateCode)}`;
  page.drawText('Verify at: ' + verifyUrl, {
    x: certBlockX,
    y: verifyY,
    size: 8,
    font: font,
    color: muted,
  });

  page.drawLine({
    start: { x: sigX, y: sigY - 6 },
    end: { x: sigX + sigWidth, y: sigY - 6 },
    thickness: 1,
    color: muted,
  });

  const adminName = data.adminName || 'Shrikesh Uday Shetty';
  const adminNameW = font.widthOfTextAtSize(adminName, 9);
  page.drawText(adminName, {
    x: sigX + (sigWidth - adminNameW) / 2,
    y: sigY - 22,
    size: 9,
    font: font,
    color: dark,
  });

  const adminTitle = 'Project Lead & Founder';
  const adminTitleW = font.widthOfTextAtSize(adminTitle, 8);
  page.drawText(adminTitle, {
    x: sigX + (sigWidth - adminTitleW) / 2,
    y: sigY - 34,
    size: 8,
    font: font,
    color: muted,
  });

  // Embed signatures if available
  async function embedSignature(url: string | null, x: number) {
    if (!url) return;
    
    try {
      const { bytes, contentType } = await fetchBlobBytes(url);
      let image;
      
      if (contentType?.includes('png')) {
        image = await pdfDoc.embedPng(bytes);
      } else if (contentType?.includes('jpeg') || contentType?.includes('jpg') || !contentType) {
        image = await pdfDoc.embedJpg(bytes);
      } else {
        return;
      }

      const dims = image.scale(1);
      const scale = Math.min(sigWidth / dims.width, sigHeight / dims.height) * 0.85;
      const drawW = dims.width * scale;
      const drawH = dims.height * scale;

      page.drawImage(image, {
        x: x + (sigWidth - drawW) / 2,
        y: sigY + (sigHeight - drawH) / 2 - 10,
        width: drawW,
        height: drawH,
      });
    } catch (err) {
      console.error('Failed to embed signature:', err);
    }
  }

  await embedSignature(data.adminSignatureUrl, sigX);

  // Verified badge (image)
  try {
    const badgePath = path.join(
      process.cwd(),
      'public',
      'images',
      'Completion-Verified-Batch',
      'ShriDev_Freelance_Verified_Batch.png'
    );
    const badgeBytes = await fs.readFile(badgePath);
    const badgeImage = await pdfDoc.embedPng(badgeBytes);

    const badgeSize = 140;
    const badgeX = width - innerMargin - badgeSize - 50;
    const badgeY = innerMargin;

    const dims = badgeImage.scale(1);
    const scale = Math.min(badgeSize / dims.width, badgeSize / dims.height);
    const drawW = dims.width * scale;
    const drawH = dims.height * scale;

    page.drawImage(badgeImage, {
      x: badgeX + (badgeSize - drawW) / 2,
      y: badgeY + (badgeSize - drawH) / 2 - 10,
      width: drawW,
      height: drawH,
    });
  } catch {
    // If badge can't be loaded, don't render it.
  }

  return pdfDoc.save();
}

// Create certificate HTML content
export function createCertificateHTML(data: CertificateData): string {
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Project Completion Certificate - ShriDev Freelance</title>
  <style>
    @page { size: A4 landscape; margin: 0; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Georgia', 'Times New Roman', serif;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #d1fae5 50%, #f0fdf4 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }
    .certificate {
      width: 100%;
      max-width: 1100px;
      background: #ffffff;
      border: 4px solid #10B981;
      border-radius: 16px;
      padding: 50px 60px;
      position: relative;
      box-shadow: 0 25px 50px -12px rgba(16, 185, 129, 0.25);
    }
    .certificate::before {
      content: '';
      position: absolute;
      top: 16px;
      left: 16px;
      right: 16px;
      bottom: 16px;
      border: 2px solid #D1FAE5;
      border-radius: 10px;
      pointer-events: none;
    }
    .corner-decoration {
      position: absolute;
      width: 60px;
      height: 60px;
      opacity: 0.3;
    }
    .corner-decoration.top-left { top: 24px; left: 24px; border-top: 3px solid #10B981; border-left: 3px solid #10B981; border-radius: 8px 0 0 0; }
    .corner-decoration.top-right { top: 24px; right: 24px; border-top: 3px solid #10B981; border-right: 3px solid #10B981; border-radius: 0 8px 0 0; }
    .corner-decoration.bottom-left { bottom: 24px; left: 24px; border-bottom: 3px solid #10B981; border-left: 3px solid #10B981; border-radius: 0 0 0 8px; }
    .corner-decoration.bottom-right { bottom: 24px; right: 24px; border-bottom: 3px solid #10B981; border-right: 3px solid #10B981; border-radius: 0 0 8px 0; }
    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 25px;
      border-bottom: 2px solid #D1FAE5;
    }
    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 16px;
      margin-bottom: 16px;
    }
    .logo-icon {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, #10B981 0%, #0F766E 100%);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    .logo-icon svg { width: 40px; height: 40px; }
    .brand-name {
      font-size: 38px;
      font-weight: bold;
      color: #0F766E;
      letter-spacing: 1px;
    }
    .brand-name span { color: #10B981; }
    .certificate-title {
      font-size: 36px;
      font-weight: bold;
      color: #10B981;
      text-transform: uppercase;
      letter-spacing: 6px;
      margin-top: 20px;
    }
    .certificate-subtitle {
      font-size: 16px;
      color: #6B7280;
      margin-top: 8px;
      letter-spacing: 2px;
    }
    .content {
      text-align: center;
      padding: 20px 40px;
    }
    .intro-text {
      font-size: 18px;
      color: #6B7280;
      margin-bottom: 20px;
      font-style: italic;
    }
    .recipient-name {
      font-size: 42px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 10px;
      padding: 10px 0;
      border-bottom: 3px solid #10B981;
      display: inline-block;
    }
    .project-section {
      margin: 30px 0;
      padding: 25px;
      background: linear-gradient(135deg, #F0FDF4 0%, #D1FAE5 100%);
      border-radius: 12px;
      border-left: 5px solid #10B981;
    }
    .project-label {
      font-size: 16px;
      color: #6B7280;
      margin-bottom: 8px;
    }
    .project-name {
      font-size: 28px;
      font-weight: bold;
      color: #0F766E;
    }
    .details-section {
      display: flex;
      justify-content: center;
      gap: 60px;
      margin: 35px 0;
      flex-wrap: wrap;
    }
    .detail-item { text-align: center; }
    .detail-label {
      font-size: 14px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 6px;
    }
    .detail-value {
      font-size: 20px;
      font-weight: bold;
      color: #111827;
    }
    .completion-text {
      font-size: 17px;
      color: #374151;
      line-height: 1.8;
      max-width: 700px;
      margin: 0 auto 30px;
    }
    .certificate-code-section {
      background: linear-gradient(135deg, #10B981 0%, #0F766E 100%);
      color: white;
      padding: 15px 30px;
      border-radius: 50px;
      display: inline-block;
      margin: 20px 0;
    }
    .code-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 2px;
      opacity: 0.9;
    }
    .code-value {
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 3px;
      font-family: 'Courier New', monospace;
    }
    .signature-section {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 2px solid #D1FAE5;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .signature-box {
      text-align: center;
      width: 280px;
    }
    .signature-image-container {
      height: 80px;
      margin-bottom: 10px;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      border-bottom: 2px solid #111827;
      padding-bottom: 5px;
    }
    .signature-image {
      max-width: 200px;
      max-height: 70px;
      object-fit: contain;
    }
    .signature-placeholder {
      font-family: 'Brush Script MT', cursive;
      font-size: 32px;
      color: #111827;
    }
    .signature-name {
      font-size: 16px;
      font-weight: bold;
      color: #111827;
      margin-top: 10px;
    }
    .signature-title {
      font-size: 14px;
      color: #10B981;
      font-weight: 600;
    }
    .signature-organization {
      font-size: 12px;
      color: #6B7280;
      margin-top: 4px;
    }
    .seal {
      position: absolute;
      bottom: 180px;
      right: 60px;
      width: 100px;
      height: 100px;
      opacity: 0.15;
    }
    .seal svg { width: 100%; height: 100%; }
    .footer {
      margin-top: 40px;
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #D1FAE5;
    }
    .footer-text {
      font-size: 12px;
      color: #9CA3AF;
      line-height: 1.6;
    }
    .verify-text {
      font-size: 13px;
      color: #6B7280;
      margin-top: 10px;
    }
    .verify-url {
      color: #10B981;
      font-weight: 600;
    }
    @media print {
      body { background: white; padding: 0; }
      .certificate { box-shadow: none; border: 3px solid #10B981; }
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="corner-decoration top-left"></div>
    <div class="corner-decoration top-right"></div>
    <div class="corner-decoration bottom-left"></div>
    <div class="corner-decoration bottom-right"></div>

    <div class="header">
      <div class="logo-container">
        <div class="logo-icon">
          <svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="8" y="36" font-size="28" font-weight="bold" fill="white" font-family="Arial, sans-serif">SD</text>
          </svg>
        </div>
        <div class="brand-name">
          <span>Shri</span>Dev <span style="font-weight: normal; font-size: 28px; color: #6B7280;">Freelance</span>
        </div>
      </div>
      <h1 class="certificate-title">Certificate of Completion</h1>
      <p class="certificate-subtitle">Project Completion Achievement</p>
    </div>

    <div class="content">
      <p class="intro-text">This is to certify that</p>
      <h2 class="recipient-name">${data.memberName}</h2>
      <p class="intro-text">has successfully completed the following project</p>

      <div class="project-section">
        <p class="project-label">Project Title</p>
        <p class="project-name">${data.projectName}</p>
      </div>

      <div class="details-section">
        <div class="detail-item">
          <p class="detail-label">Role</p>
          <p class="detail-value">${data.role}</p>
        </div>
        <div class="detail-item">
          <p class="detail-label">Start Date</p>
          <p class="detail-value">${data.startDate}</p>
        </div>
        <div class="detail-item">
          <p class="detail-label">End Date</p>
          <p class="detail-value">${data.endDate}</p>
        </div>
        <div class="detail-item">
          <p class="detail-label">Project Type</p>
          <p class="detail-value">Paid</p>
        </div>
      </div>

      <p class="completion-text">
        Throughout the project, the individual demonstrated exceptional dedication, technical expertise,
        and professional conduct. This certificate recognizes their valuable contribution to the successful
        completion of the project.
      </p>

      <div class="certificate-code-section">
        <p class="code-label">Certificate ID</p>
        <p class="code-value">${data.certificateCode}</p>
      </div>
    </div>

    <div class="signature-section">
      <div class="signature-box">
        <div class="signature-image-container">
          ${data.adminSignatureUrl 
            ? `<img src="${data.adminSignatureUrl}" alt="Admin Signature" class="signature-image">` 
            : '<span class="signature-placeholder">Shrikesh Uday Shetty</span>'}
        </div>
        <p class="signature-name">${data.adminName || 'Shrikesh Uday Shetty'}</p>
        <p class="signature-title">Project Lead & Founder</p>
        <p class="signature-organization">ShriDev Freelance</p>
      </div>
    </div>

    <div class="seal">
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#10B981" stroke-width="3"/>
        <circle cx="50" cy="50" r="38" fill="none" stroke="#10B981" stroke-width="1"/>
        <text x="50" y="45" text-anchor="middle" font-size="14" fill="#10B981" font-weight="bold">SHRIDEV</text>
        <text x="50" y="62" text-anchor="middle" font-size="10" fill="#10B981">FREELANCE</text>
        <text x="50" y="78" text-anchor="middle" font-size="8" fill="#10B981">✓ VERIFIED</text>
      </svg>
    </div>

    <div class="footer">
      <p class="footer-text">
        This certificate is digitally generated and can be verified online.<br>
        Issued by ShriDev Freelance Project Management System
      </p>
      <p class="verify-text">
        Verify at: <span class="verify-url">${getAppBaseUrl()}/certificate-verification?code=${data.certificateCode}</span>
      </p>
    </div>
  </div>
</body>
</html>
`;
}

// Create confirmation report HTML
export function createConfirmationReportHTML(data: ConfirmationReportData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Project Confirmation Report</title>
  <style>
    @page { size: A4 portrait; margin: 20mm; }
    body { 
      font-family: 'Arial', sans-serif; 
      margin: 0; 
      padding: 40px;
      background: white;
      color: #111827;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #10B981;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #10B981;
    }
    .title {
      font-size: 24px;
      color: #0F766E;
      margin-top: 10px;
    }
    .section {
      margin-bottom: 25px;
    }
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #0F766E;
      border-bottom: 1px solid #D1FAE5;
      padding-bottom: 5px;
      margin-bottom: 10px;
    }
    .info-row {
      display: flex;
      margin-bottom: 8px;
    }
    .info-label {
      width: 180px;
      font-weight: 600;
      color: #6B7280;
    }
    .info-value {
      flex: 1;
      color: #111827;
    }
    .description {
      background: #F8FAFC;
      padding: 15px;
      border-radius: 8px;
      border-left: 4px solid #10B981;
      line-height: 1.6;
    }
    .signatures {
      margin-top: 50px;
      display: flex;
      justify-content: space-between;
    }
    .signature-box {
      text-align: center;
      width: 200px;
    }
    .signature-line {
      border-bottom: 1px solid #111827;
      height: 60px;
      margin-bottom: 10px;
    }
    .signature-img {
      width: 150px;
      height: 60px;
      object-fit: contain;
    }
    .signature-name {
      font-weight: bold;
    }
    .signature-title {
      font-size: 12px;
      color: #6B7280;
    }
    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #6B7280;
      border-top: 1px solid #D1FAE5;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">ShriDev Freelance</div>
    <div class="title">Project Confirmation Report</div>
  </div>

  <div class="section">
    <div class="section-title">Team Member Information</div>
    <div class="info-row">
      <span class="info-label">Name:</span>
      <span class="info-value">${data.memberName}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Role:</span>
      <span class="info-value">${data.role}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Daily Working Hours:</span>
      <span class="info-value">${data.dailyWorkingHours} hours</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Project Details</div>
    <div class="info-row">
      <span class="info-label">Project Title:</span>
      <span class="info-value">${data.projectName}</span>
    </div>
    <div class="info-row">
      <span class="info-label">Start Date:</span>
      <span class="info-value">${data.startDate}</span>
    </div>
    <div class="info-row">
      <span class="info-label">End Date:</span>
      <span class="info-value">${data.endDate}</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Project Description</div>
    <div class="description">${data.projectDescription || 'No description provided'}</div>
  </div>

  <div class="signatures">
    <div class="signature-box">
      ${data.adminSignatureUrl ? `<img src="${data.adminSignatureUrl}" class="signature-img" alt="Admin Signature">` : '<div class="signature-line"></div>'}
      <div class="signature-name">${data.adminName}</div>
      <div class="signature-title">Project Lead</div>
    </div>
    <div class="signature-box">
      ${data.memberSignatureUrl ? `<img src="${data.memberSignatureUrl}" class="signature-img" alt="Member Signature">` : '<div class="signature-line"></div>'}
      <div class="signature-name">${data.memberName}</div>
      <div class="signature-title">Team Member</div>
    </div>
  </div>

  <div class="footer">
    This document confirms the assignment of the team member to the above-mentioned project.<br>
    Generated by ShriDev Freelance Project Management System
  </div>
</body>
</html>
`;
}
