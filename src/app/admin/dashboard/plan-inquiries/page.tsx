'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardBody, CardHeader } from '@/components/ui';

type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  plan_type: string;
  plan_name: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function PlanInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/admin/plan-inquiries', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.inquiries || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Plan Inquiries</h2>
          <p className="text-[#6B7280]">Requests submitted from Plans selection form</p>
        </div>
        <Button onClick={fetchItems}>Refresh</Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <p className="font-medium text-[#111827]">Inquiries</p>
            <p className="text-sm text-[#6B7280]">Unread: {items.filter((i) => !i.is_read).length}</p>
          </div>
        </CardHeader>
        <CardBody className="p-0">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-[#111827] mb-2">No inquiries yet</h3>
              <p className="text-[#6B7280]">New plan requests will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#D1FAE5]">
              {items.map((s) => (
                <div key={s.id} className={s.is_read ? 'p-5' : 'p-5 bg-[#D1FAE5]/20'}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#111827]">
                        {s.name}{' '}
                        <span className="font-normal text-[#6B7280]">({s.email})</span>
                      </p>
                      <p className="text-sm text-[#6B7280] mt-1">
                        {new Date(s.created_at).toLocaleString()}
                        {s.phone ? ` • ${s.phone}` : ''}
                        {s.plan_type ? ` • ${s.plan_type}` : ''}
                        {s.plan_name ? ` • ${s.plan_name}` : ''}
                        {s.subject ? ` • ${s.subject}` : ''}
                      </p>
                      <p className="text-sm text-[#111827] mt-3 whitespace-pre-wrap">{s.message}</p>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!s.is_read ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            await fetch(`/api/admin/plan-inquiries/${s.id}/read`, { method: 'PATCH' });
                            setItems((prev) => prev.map((x) => (x.id === s.id ? { ...x, is_read: true } : x)));
                          }}
                        >
                          Mark read
                        </Button>
                      ) : null}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={async () => {
                          const ok = window.confirm('Delete this inquiry?');
                          if (!ok) return;
                          const res = await fetch(`/api/admin/plan-inquiries/${s.id}`, { method: 'DELETE' });
                          if (res.ok) setItems((prev) => prev.filter((x) => x.id !== s.id));
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
