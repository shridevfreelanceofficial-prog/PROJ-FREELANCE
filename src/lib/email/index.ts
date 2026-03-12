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

// Send certificate email
export async function sendCertificateEmail(
  to: string,
  memberName: string,
  projectName: string,
  certificateUrl: string,
  certificateBuffer: Buffer
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
        .btn { display: inline-block; background: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .congrats { font-size: 24px; margin-bottom: 10px; }
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
          <p>We are delighted to inform you that you have successfully completed the project <strong>${projectName}</strong> with ShriDev Freelance.</p>
          <p>Your dedication and hard work have been instrumental in the success of this project. Please find your official completion certificate attached to this email.</p>
          <p>You can also download your certificate anytime from your dashboard.</p>
          <a href="${certificateUrl}" class="btn">View Certificate</a>
        </div>
        <div class="footer">
          <p>Best regards,<br><strong>ShriDev Freelance Team</strong></p>
          <p style="color: #6B7280; font-size: 12px;">This is an automated email. Please do not reply directly.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `Certificate of Completion - ${projectName}`,
    html,
    attachments: [
      {
        filename: `certificate-${projectName.replace(/\s+/g, '-')}.pdf`,
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
          <h1>📅 Meeting Scheduled</h1>
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
          <a href="${meetingLink}" class="btn">Join Meeting</a>
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
