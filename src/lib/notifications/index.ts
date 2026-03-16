import { query, queryOne } from '@/lib/db';
import { sendNotificationEmail } from '@/lib/email';

type NotificationInput = {
  title: string;
  message: string;
  type: string;
  action_url?: string | null;
  action_data?: any;
};

function toAbsoluteUrl(actionUrl?: string | null): string | undefined {
  if (!actionUrl) return undefined;
  const trimmed = actionUrl.trim();
  if (!trimmed) return undefined;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    'http://localhost:3000';

  return `${base}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
}

export async function notifyAdmins(input: NotificationInput): Promise<void> {
  const { title, message, type, action_url, action_data } = input;

  await query(
    `INSERT INTO notifications (user_type, user_id, title, message, type, action_url, action_data)
     SELECT 'admin', a.id, $1, $2, $3, $4, $5
     FROM administrators a`,
    [
      title,
      message,
      type,
      action_url || null,
      action_data ? JSON.stringify(action_data) : null,
    ]
  );

  const admins = await query<{ email: string | null; name: string }>(
    `SELECT email, COALESCE(name, username, 'Admin') as name
     FROM administrators`
  );

  const absoluteActionUrl = toAbsoluteUrl(action_url);

  for (const admin of admins) {
    if (!admin.email) continue;
    await sendNotificationEmail(
      admin.email,
      admin.name,
      title,
      message,
      absoluteActionUrl
    );
  }
}

export async function notifyMember(memberId: string, input: NotificationInput): Promise<void> {
  const { title, message, type, action_url, action_data } = input;

  await query(
    `INSERT INTO notifications (user_type, user_id, title, message, type, action_url, action_data)
     VALUES ('member', $1, $2, $3, $4, $5, $6)`,
    [
      memberId,
      title,
      message,
      type,
      action_url || null,
      action_data ? JSON.stringify(action_data) : null,
    ]
  );

  const member = await queryOne<{ email: string | null; full_name: string }>(
    'SELECT email, full_name FROM members WHERE id = $1',
    [memberId]
  );

  if (!member?.email) return;

  await sendNotificationEmail(
    member.email,
    member.full_name,
    title,
    message,
    toAbsoluteUrl(action_url)
  );
}
