'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export type NotificationItem = {
  id: string;
  title: string;
  message: string | null;
  type: string | null;
  is_read: boolean;
  created_at: string;
  action_url: string | null;
  action_data: any | null;
};

type Props = {
  userType: 'admin' | 'member';
  pollMs?: number;
};

export default function NotificationsBell({ userType, pollMs = 10000 }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [paymentStatusById, setPaymentStatusById] = useState<Record<string, { confirmed_by_member: boolean }>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  const apiBase = userType === 'admin' ? '/api/admin/notifications' : '/api/member/notifications';

  const fetchNotifications = async (): Promise<NotificationItem[]> => {
    try {
      const res = await fetch(apiBase, { cache: 'no-store' });
      if (!res.ok) return [];
      const data = await res.json();
      const nextItems = (data.notifications || []) as NotificationItem[];
      setItems(nextItems);
      setUnreadCount(Number(data.unread_count || 0));
      return nextItems;
    } catch {
      // ignore
      return [];
    }
  };

  const refreshActionStatuses = async (currentItems: NotificationItem[]) => {
    if (userType !== 'member') return;

    const paymentIds = Array.from(
      new Set(
        currentItems
          .filter((n) => n.type === 'payment' && n.action_data?.payment_id)
          .map((n) => String(n.action_data.payment_id))
      )
    );

    if (paymentIds.length === 0) return;

    try {
      const res = await fetch('/api/member/payments', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      const map: Record<string, { confirmed_by_member: boolean }> = {};
      for (const p of (data.payments || []) as Array<{ id: string; confirmed_by_member: boolean }>) {
        if (paymentIds.includes(p.id)) {
          map[p.id] = { confirmed_by_member: Boolean(p.confirmed_by_member) };
        }
      }
      setPaymentStatusById(map);
    } catch {
      // ignore
    }
  };

  const markAllRead = async () => {
    try {
      setMarkingAll(true);
      const res = await fetch(`${apiBase}/mark-all-read`, { method: 'PATCH' });
      if (!res.ok) return;
      setUnreadCount(0);
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } finally {
      setMarkingAll(false);
    }
  };

  const markOneRead = async (id: string) => {
    try {
      if (userType !== 'member') return;
      await fetch(`${apiBase}/${id}/read`, { method: 'PATCH' });
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    void fetchNotifications();
    const t = setInterval(() => {
      void fetchNotifications();
    }, pollMs);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, pollMs]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    (async () => {
      const nextItems = await fetchNotifications();
      await refreshActionStatuses(nextItems);
      if (unreadCount > 0) {
        await markAllRead();
      }
    })().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="relative p-2 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-[#0B1220]"
        onClick={() => setOpen((v) => !v)}
        aria-label="Notifications"
      >
        <svg className="w-6 h-6 text-[#111827] dark:text-[#F9FAFB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[11px] font-bold flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[360px] max-w-[90vw] bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1F2937] rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[#E5E7EB] dark:border-[#1F2937] flex items-center justify-between">
            <p className="font-semibold text-[#111827] dark:text-[#F9FAFB]">Notifications</p>
            <button
              type="button"
              className="text-xs text-[#6B7280] dark:text-[#9CA3AF] hover:text-[#111827]"
              onClick={markAllRead}
              disabled={markingAll}
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading ? (
              <div className="p-6 text-sm text-[#6B7280]">Loading...</div>
            ) : items.length === 0 ? (
              <div className="p-6 text-sm text-[#6B7280]">No notifications</div>
            ) : (
              <div className="divide-y divide-[#F3F4F6] dark:divide-[#1F2937]">
                {items.map((n) => {
                  const Wrapper: any = n.action_url ? Link : 'div';
                  const wrapperProps = n.action_url
                    ? { href: n.action_url, onClick: () => setOpen(false) }
                    : {};

                  const paymentId =
                    userType === 'member' && n.type === 'payment' && n.action_data?.payment_id
                      ? String(n.action_data.payment_id)
                      : null;
                  const paymentStatus = paymentId ? paymentStatusById[paymentId] : null;

                  return (
                    <div key={n.id} className={n.is_read ? '' : 'bg-[#D1FAE5]/20'}>
                      <Wrapper
                        {...wrapperProps}
                        className="block px-4 py-3 hover:bg-[#F8FAFC] dark:hover:bg-[#0B1220]"
                      >
                        <div className="flex items-start gap-3">
                          {!n.is_read && <div className="w-2 h-2 bg-[#10B981] rounded-full mt-2 flex-shrink-0" />}
                          <div className={n.is_read ? 'ml-5' : ''}>
                            <p className="text-sm font-medium text-[#111827] dark:text-[#F9FAFB]">{n.title}</p>
                            {n.message ? (
                              <p className="text-sm text-[#6B7280] dark:text-[#9CA3AF] mt-1 line-clamp-2">{n.message}</p>
                            ) : null}
                            <p className="text-xs text-[#6B7280] dark:text-[#9CA3AF] mt-2">
                              {new Date(n.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </Wrapper>

                      <div className="px-4 pb-3 flex items-center justify-between">
                        {userType === 'member' && !n.is_read ? (
                          <button
                            type="button"
                            className="text-xs text-[#10B981] hover:underline"
                            onClick={() => markOneRead(n.id)}
                          >
                            Mark as read
                          </button>
                        ) : (
                          <span />
                        )}

                        {paymentId ? (
                          paymentStatus?.confirmed_by_member ? (
                            <span className="text-xs text-[#6B7280] dark:text-[#9CA3AF]">Already confirmed</span>
                          ) : (
                            <button
                              type="button"
                              className="text-xs bg-[#10B981] text-white px-2 py-1 rounded-md"
                              onClick={async () => {
                                try {
                                  const ok = window.confirm('Confirm payment receipt?');
                                  if (!ok) return;
                                  const res = await fetch(`/api/member/payments/${paymentId}/confirm`, {
                                    method: 'POST',
                                  });
                                  if (res.ok) {
                                    setPaymentStatusById((prev) => ({
                                      ...prev,
                                      [paymentId]: { confirmed_by_member: true },
                                    }));
                                    await markOneRead(n.id);
                                    await fetchNotifications();
                                  }
                                } catch {
                                  // ignore
                                }
                              }}
                            >
                              Confirm
                            </button>
                          )
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
