import nodemailer from 'nodemailer';

// Brevo SMTP configuration
const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
});

function getFromAddress(): string {
  const fromEmail = process.env.BREVO_FROM_EMAIL || process.env.BREVO_SMTP_USER;
  const fromName = process.env.BREVO_FROM_NAME || 'ShriDev Freelance';

  if (!fromEmail) {
    throw new Error('BREVO_FROM_EMAIL (or BREVO_SMTP_USER) is not configured');
  }

  return `"${fromName}" <${fromEmail}>`;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    path: string;
    content: Buffer;
  }>;
}

// Send email
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
      throw new Error('Brevo SMTP is not configured (BREVO_SMTP_USER / BREVO_SMTP_PASS)');
    }

    await transporter.sendMail({
      from: getFromAddress(),
      to: options.to,
      subject: options.subject,
      html: options.html,
      attachments: options.attachments,
    });
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

export async function sendNotificationEmail(
  to: string,
  recipientName: string,
  title: string,
  message: string,
  actionUrl?: string
): Promise<boolean> {
  const safeTitle = title || 'Notification';
  const safeMessage = message || '';
  const safeRecipient = recipientName || 'User';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981, #0F766E); color: white; padding: 24px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #FFFFFF; padding: 24px; border: 1px solid #D1FAE5; }
        .footer { background: #F8FAFC; padding: 18px; text-align: center; border-radius: 0 0 10px 10px; }
        .btn { display: inline-block; background: #10B981; color: white; padding: 12px 18px; text-decoration: none; border-radius: 6px; margin-top: 18px; font-weight: bold; }
        .box { background: #F0FDF4; border: 1px solid #D1FAE5; padding: 14px; border-radius: 8px; margin-top: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0; font-size: 20px;">${safeTitle}</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${safeRecipient}</strong>,</p>
          <div class="box">
            <p style="margin:0; color:#111827;">${safeMessage}</p>
          </div>
          ${actionUrl ? `<a href="${actionUrl}" class="btn">Open</a>` : ''}
        </div>
        <div class="footer">
          <p style="margin:0; color:#6B7280;">Best regards,<br><strong>ShriDev Freelance Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: safeTitle,
    html,
  });
}

// Send certificate email
export async function sendCertificateEmail(
  to: string,
  memberName: string,
  projectName: string,
  certificateUrl: string,
  certificateBuffer: Buffer,
  certificateCode?: string
): Promise<boolean> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    'https://www.shridevfreelance.online';

  const verifyUrl = certificateCode
    ? `${baseUrl}/certificate-verification?code=${encodeURIComponent(certificateCode)}`
    : `${baseUrl}/certificate-verification`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981, #0F766E); color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #FFFFFF; padding: 30px; border: 1px solid #D1FAE5; }
        .footer { background: #F8FAFC; padding: 25px; text-align: center; border-radius: 0 0 10px 10px; }
        .btn { display: inline-block; background: #10B981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 10px 5px; font-weight: bold; }
        .btn-secondary { background: #0F766E; }
        .congrats { font-size: 32px; margin-bottom: 10px; }
        .highlight-box { background: #D1FAE5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10B981; }
        .certificate-id { font-family: monospace; font-size: 14px; color: #0F766E; background: #F0FDF4; padding: 8px 12px; border-radius: 4px; display: inline-block; }
        .divider { height: 1px; background: #D1FAE5; margin: 25px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="congrats">🎉 Congratulations!</div>
          <h1>Project Completion Certificate</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${memberName}</strong>,</p>
          
          <p>Congratulations on successfully completing <strong>${projectName}</strong> with <strong>ShriDev Freelance</strong>.</p>
          
          <div class="highlight-box">
            <h3 style="margin: 0 0 10px 0; color: #0F766E;">📁 Project: ${projectName}</h3>
            <p style="margin: 0; color: #111827;">We sincerely appreciate your commitment, professionalism, and contribution throughout the project. As a recognition of your efforts, your <strong>Project Completion Certificate</strong> is attached to this email.</p>
          </div>
          
          <p>Please download and keep the attached certificate for your records. You can verify the authenticity of the certificate anytime using the button below.</p>
          
          ${certificateCode ? `
          <div style="text-align: center; margin: 25px 0;">
            <p style="margin-bottom: 8px; color: #6B7280; font-size: 14px;">Certificate ID:</p>
            <span class="certificate-id">${certificateCode}</span>
          </div>
          ` : ''}
          
          <div class="divider"></div>
          
          <h3 style="color: #0F766E;">Next Steps</h3>
          <ul style="color: #374151; margin-top: 8px;">
            <li>Save the attached PDF for future reference</li>
            <li>Use the verification link below whenever required (portfolio / client verification)</li>
          </ul>
          
          <div style="text-align: center; margin-top: 25px;">
            <a href="${verifyUrl}" class="btn btn-secondary">✓ Verify Certificate</a>
          </div>
        </div>
        <div class="footer">
          <p style="margin-bottom: 10px;">Best regards,<br><strong>Shrikesh Uday Shetty</strong><br><span style="color: #6B7280;">Founder, ShriDev Freelance</span></p>
          <p style="color: #9CA3AF; font-size: 12px; margin-top: 15px;">This is an automated email from ShriDev Freelance Project Management System.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `🎉 Congratulations! Your Certificate for ${projectName}`,
    html,
    attachments: [
      {
        filename: `Certificate-${projectName.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`,
        path: '',
        content: certificateBuffer,
      },
    ],
  });
}

// Send meeting notification email
export async function sendMeetingNotificationEmail(
  to: string,
  memberName: string,
  meetingTitle: string,
  meetingLink: string,
  meetingDate: string,
  meetingTime: string,
  projectName: string
): Promise<boolean> {
  const normalizedMeetingLink = meetingLink?.trim()
    ? /^https?:\/\//i.test(meetingLink.trim())
      ? meetingLink.trim()
      : `https://${meetingLink.trim()}`
    : '';

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981, #0F766E); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #FFFFFF; padding: 30px; border: 1px solid #D1FAE5; }
        .footer { background: #F8FAFC; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .btn { display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .meeting-details { background: #D1FAE5; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Meeting Scheduled</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${memberName}</strong>,</p>
          <p>A new meeting has been scheduled for the project <strong>${projectName}</strong>.</p>
          <div class="meeting-details">
            <p><strong>Meeting Title:</strong> ${meetingTitle}</p>
            <p><strong>Date:</strong> ${meetingDate}</p>
            <p><strong>Time:</strong> ${meetingTime}</p>
          </div>
          <p>Please join the meeting on time using the link below:</p>
          <a href="${normalizedMeetingLink}" class="btn">Join Meeting</a>
        </div>
        <div class="footer">
          <p>Best regards,<br><strong>ShriDev Freelance Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Meeting Scheduled: ${meetingTitle} - ${projectName}`,
    html,
  });
}

// Send meeting cancellation email
export async function sendMeetingCancellationEmail(
  to: string,
  memberName: string,
  meetingTitle: string,
  meetingDate: string,
  meetingTime: string,
  projectName: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #DC2626; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #FFFFFF; padding: 30px; border: 1px solid #FECACA; }
        .footer { background: #F8FAFC; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .meeting-details { background: #FEE2E2; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Meeting Cancelled</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${memberName}</strong>,</p>
          <p>The following meeting for the project <strong>${projectName}</strong> has been cancelled.</p>
          <div class="meeting-details">
            <p><strong>Meeting Title:</strong> ${meetingTitle}</p>
            <p><strong>Date:</strong> ${meetingDate}</p>
            <p><strong>Time:</strong> ${meetingTime}</p>
          </div>
          <p>Please wait for an updated schedule from the admin.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br><strong>ShriDev Freelance Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Meeting Cancelled: ${meetingTitle} - ${projectName}`,
    html,
  });
}

// Send meeting reminder email
export async function sendMeetingReminderEmail(
  to: string,
  memberName: string,
  meetingTitle: string,
  meetingLink: string,
  projectName: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #F59E0B; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #FFFFFF; padding: 30px; border: 1px solid #D1FAE5; }
        .footer { background: #F8FAFC; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .btn { display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .alert { font-size: 18px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <p class="alert">⏰ Meeting Starting in 5 Minutes!</p>
          <h1>${meetingTitle}</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${memberName}</strong>,</p>
          <p>This is a reminder that the meeting for <strong>${projectName}</strong> will start in 5 minutes.</p>
          <p>Please join now to avoid missing the start.</p>
          <a href="${meetingLink}" class="btn">Join Meeting Now</a>
        </div>
        <div class="footer">
          <p>Best regards,<br><strong>ShriDev Freelance Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `⏰ Meeting Reminder: ${meetingTitle} starting in 5 minutes`,
    html,
  });
}

// Send project assignment notification
export async function sendProjectAssignmentEmail(
  to: string,
  memberName: string,
  projectName: string,
  projectDescription: string,
  startDate: string,
  endDate: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10B981, #0F766E); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #FFFFFF; padding: 30px; border: 1px solid #D1FAE5; }
        .footer { background: #F8FAFC; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .project-details { background: #D1FAE5; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚀 New Project Assigned</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${memberName}</strong>,</p>
          <p>You have been assigned to a new project. Please confirm your participation from your dashboard.</p>
          <div class="project-details">
            <p><strong>Project:</strong> ${projectName}</p>
            <p><strong>Description:</strong> ${projectDescription}</p>
            <p><strong>Start Date:</strong> ${startDate}</p>
            <p><strong>End Date:</strong> ${endDate}</p>
          </div>
          <p>Please log in to your dashboard to confirm your participation.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br><strong>ShriDev Freelance Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `New Project Assignment: ${projectName}`,
    html,
  });
}

// Send payment notification email
export async function sendPaymentNotificationEmail(
  to: string,
  memberName: string,
  projectName: string,
  amount: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #FFFFFF; padding: 30px; border: 1px solid #D1FAE5; }
        .footer { background: #F8FAFC; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
        .amount { font-size: 24px; color: #10B981; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 Payment Notification</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${memberName}</strong>,</p>
          <p>Your payment for the project <strong>${projectName}</strong> has been processed.</p>
          <p class="amount">Amount: ₹${amount}</p>
          <p>Please confirm receipt of payment from your dashboard.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br><strong>ShriDev Freelance Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Payment Processed - ${projectName}`,
    html,
  });
}

// Send daily report reminder email
export async function sendDailyReportReminderEmail(
  to: string,
  memberName: string,
  projectName: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #111827; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #F59E0B; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #FFFFFF; padding: 30px; border: 1px solid #D1FAE5; }
        .footer { background: #F8FAFC; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📝 Daily Report Reminder</h1>
        </div>
        <div class="content">
          <p>Dear <strong>${memberName}</strong>,</p>
          <p>This is a reminder that you have not uploaded your daily report for the project <strong>${projectName}</strong>.</p>
          <p>Please upload your daily work report from your dashboard as soon as possible.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br><strong>ShriDev Freelance Team</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Daily Report Reminder - ${projectName}`,
    html,
  });
}
