import { v4 as uuidv4 } from 'uuid';

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

// Create certificate PDF content (HTML template for PDF generation)
export function createCertificateHTML(data: CertificateData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Certificate of Completion</title>
  <style>
    @page { size: A4 landscape; margin: 0; }
    body { 
      font-family: 'Georgia', serif; 
      margin: 0; 
      padding: 60px;
      background: linear-gradient(135deg, #f8fafc 0%, #d1fae5 100%);
      min-height: 100vh;
    }
    .certificate {
      background: white;
      border: 3px solid #10B981;
      border-radius: 20px;
      padding: 60px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(16, 185, 129, 0.2);
      position: relative;
    }
    .certificate::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 2px solid #D1FAE5;
      border-radius: 15px;
      pointer-events: none;
    }
    .logo {
      font-size: 36px;
      font-weight: bold;
      color: #10B981;
      margin-bottom: 20px;
    }
    .title {
      font-size: 42px;
      font-weight: bold;
      color: #0F766E;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: 4px;
    }
    .subtitle {
      font-size: 18px;
      color: #6B7280;
      margin-bottom: 40px;
    }
    .recipient {
      font-size: 32px;
      font-weight: bold;
      color: #111827;
      margin-bottom: 10px;
    }
    .project-name {
      font-size: 24px;
      color: #10B981;
      margin-bottom: 30px;
    }
    .details {
      font-size: 16px;
      color: #6B7280;
      margin-bottom: 40px;
      line-height: 1.8;
    }
    .signatures {
      display: flex;
      justify-content: space-around;
      margin-top: 60px;
      padding-top: 40px;
      border-top: 1px solid #D1FAE5;
    }
    .signature-box {
      text-align: center;
      width: 200px;
    }
    .signature-img {
      width: 150px;
      height: 60px;
      object-fit: contain;
      margin-bottom: 10px;
      border-bottom: 1px solid #111827;
    }
    .signature-name {
      font-size: 14px;
      font-weight: bold;
      color: #111827;
    }
    .signature-title {
      font-size: 12px;
      color: #6B7280;
    }
    .certificate-code {
      position: absolute;
      bottom: 30px;
      right: 40px;
      font-size: 12px;
      color: #6B7280;
    }
    .badge {
      width: 80px;
      height: 80px;
      margin: 0 auto 20px;
      background: linear-gradient(135deg, #10B981, #0F766E);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .badge-text {
      color: white;
      font-size: 40px;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="badge"><span class="badge-text">✓</span></div>
    <div class="logo">ShriDev Freelance</div>
    <div class="title">Certificate of Completion</div>
    <div class="subtitle">This is to certify that</div>
    <div class="recipient">${data.memberName}</div>
    <div class="project-name">${data.projectName}</div>
    <div class="details">
      Has successfully completed the project from ${data.startDate} to ${data.endDate}<br>
      Role: ${data.role}
    </div>
    
    <div class="signatures">
      <div class="signature-box">
        ${data.adminSignatureUrl ? `<img src="${data.adminSignatureUrl}" class="signature-img" alt="Admin Signature">` : '<div class="signature-img"></div>'}
        <div class="signature-name">${data.adminName}</div>
        <div class="signature-title">Project Lead</div>
      </div>
      <div class="signature-box">
        ${data.memberSignatureUrl ? `<img src="${data.memberSignatureUrl}" class="signature-img" alt="Member Signature">` : '<div class="signature-img"></div>'}
        <div class="signature-name">${data.memberName}</div>
        <div class="signature-title">Team Member</div>
      </div>
    </div>
    
    <div class="certificate-code">Certificate ID: ${data.certificateCode}</div>
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
