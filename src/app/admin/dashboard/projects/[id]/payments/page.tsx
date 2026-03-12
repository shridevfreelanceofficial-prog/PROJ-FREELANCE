'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';

interface Payment {
  id: string;
  member_id: string;
  member_name: string;
  amount: string;
  status: string;
  due_date: string;
  paid_date: string | null;
}

interface ProjectMember {
  member_id: string;
  full_name: string;
  email: string;
}

export default function ProjectPaymentsPage() {
  const params = useParams();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [projectName, setProjectName] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const [projectRes, paymentsRes, membersRes] = await Promise.all([
        fetch(`/api/admin/projects/${params.id}`),
        fetch(`/api/admin/projects/${params.id}/payments`),
        fetch(`/api/admin/projects/${params.id}/members`),
      ]);

      if (projectRes.ok) {
        const data = await projectRes.json();
        setProjectName(data.project.title || data.project.name);
      }
      if (paymentsRes.ok) {
        const data = await paymentsRes.json();
        setPayments(data.payments || []);
      }
      if (membersRes.ok) {
        const data = await membersRes.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/projects/${params.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: memberId, amount, due_date: dueDate }),
      });

      if (response.ok) {
        setShowAddForm(false);
        setMemberId('');
        setAmount('');
        setDueDate('');
        fetchData();
      } else {
        const data = await response.json().catch(() => null);
        alert(data?.error || 'Failed to add payment');
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      alert('Failed to add payment');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkPaid = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/mark-paid`, {
        method: 'PATCH',
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Error marking payment as paid:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/admin/dashboard/projects/${params.id}`} className="text-[#10B981] text-sm mb-2 inline-block">
            ← Back to Project
          </Link>
          <h1 className="text-2xl font-bold text-[#111827]">Project Payments</h1>
          <p className="text-[#6B7280]">Project: {projectName}</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>Add Payment</Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#111827]">Add New Payment</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleAddPayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">Member</label>
                <select
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none"
                  required
                >
                  <option value="">Select a member</option>
                  {members.map((m) => (
                    <option key={m.member_id} value={m.member_id}>
                      {m.full_name} ({m.email})
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Amount (₹)"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                required
              />
              <Input
                label="Due Date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
              <div className="flex gap-3">
                <Button type="submit" isLoading={saving}>Add Payment</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">Payment Records</h3>
        </CardHeader>
        <CardBody className="p-0">
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B7280]">No payments recorded yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#D1FAE5]">
              {payments.map((payment) => (
                <div key={payment.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#111827]">{payment.member_name}</p>
                    <p className="text-sm text-[#6B7280]">₹{payment.amount}</p>
                    <p className="text-sm text-[#6B7280]">
                      Due: {payment.due_date ? new Date(payment.due_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                    {payment.status !== 'paid' && (
                      <Button size="sm" onClick={() => handleMarkPaid(payment.id)}>
                        Mark Paid
                      </Button>
                    )}
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
