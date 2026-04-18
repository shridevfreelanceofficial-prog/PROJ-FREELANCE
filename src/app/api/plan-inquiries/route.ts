import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim();
    const phone = String(body?.phone || '').trim();
    const planType = String(body?.planType || '').trim();
    const planName = String(body?.planName || '').trim();
    const subject = String(body?.subject || '').trim();
    const message = String(body?.message || '').trim();

    if (!name || !email || !phone || !planType || !planName || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, phone, planType, planName, subject, and message are required' },
        { status: 400 }
      );
    }

    if (!email.includes('@') || email.length > 255) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const inserted = await query<{ id: string }>(
      `INSERT INTO plan_inquiries (name, email, phone, plan_type, plan_name, subject, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [name, email, phone, planType, planName, subject, message]
    );

    try {
      const transporter = nodemailer.createTransport({
        host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
        port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
        auth: {
          user: process.env.BREVO_SMTP_USER,
          pass: process.env.BREVO_SMTP_PASS,
        },
      });

      const mailOptions = {
        from: `"${process.env.BREVO_FROM_NAME || 'ShriDev Freelance'}" <${process.env.BREVO_FROM_EMAIL || 'noreply@shridev.com'}>`,
        to: 'shridevfreelanceofficial@gmail.com',
        replyTo: email,
        subject: `New Plan Inquiry: ${planType} - ${planName}`,
        html: `
          <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #E2E8F0; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #0F766E; margin: 0; font-size: 24px;">New Plan Inquiry</h2>
              <p style="color: #64748B; margin-top: 5px; font-size: 14px;">A user selected a plan and submitted a request.</p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9;"><strong style="color: #334155;">Name:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; color: #0F172A; text-align: right;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9;"><strong style="color: #334155;">Email:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; color: #0F172A; text-align: right;">
                  <a href="mailto:${email}" style="color: #00C896; text-decoration: none;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9;"><strong style="color: #334155;">Phone:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; color: #0F172A; text-align: right;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9;"><strong style="color: #334155;">Plan:</strong></td>
                <td style="padding: 12px 0; border-bottom: 1px solid #F1F5F9; color: #0F172A; text-align: right;">${planType} / ${planName}</td>
              </tr>
            </table>

            <div style="background: #F8FAFC; padding: 20px; border-radius: 8px; border-left: 4px solid #00C896;">
              <strong style="color: #334155; display: block; margin-bottom: 10px;">Message details:</strong>
              <p style="color: #475569; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
              <p style="color: #94A3B8; font-size: 12px; margin: 0;">Automated notification from ShriDev Freelance platform.</p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Failed to send plan inquiry email notification:', emailError);
    }

    return NextResponse.json(
      { success: true, id: inserted[0]?.id },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Create plan inquiry error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
