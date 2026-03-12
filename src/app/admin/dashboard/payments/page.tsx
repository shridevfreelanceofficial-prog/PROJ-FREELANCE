'use client';

import { useEffect, useState } from 'react';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';

interface Payment {
  id: string;
  project_id: string;
  project_title: string;
  member_id: string;
  member_name: string;
  amount: string;
  status: string;
  confirmed_by_member: boolean;
  payment_date: string | null;
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkPaid = async (paymentId: string) => {
    setProcessingId(paymentId);
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}/mark-paid`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchPayments();
      }
    } catch (error) {
      console.error('Error marking payment as paid:', error);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  const totalUnpaid = payments
    .filter(p => p.status === 'unpaid')
    .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);

  const totalPendingConfirmation = payments
    .filter(p => p.status === 'paid' && !p.confirmed_by_member)
    .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);

  const totalConfirmed = payments
    .filter(p => p.status === 'paid' && p.confirmed_by_member)
    .reduce((sum, p) => sum + parseFloat(p.amount || '0'), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardBody className="p-6">
            <p className="text-sm text-[#6B7280] mb-1">Unpaid</p>
            <p className="text-3xl font-bold text-[#DC2626]">₹{totalUnpaid.toLocaleString()}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6">
            <p className="text-sm text-[#6B7280] mb-1">Pending Confirmation</p>
            <p className="text-3xl font-bold text-[#F59E0B]">₹{totalPendingConfirmation.toLocaleString()}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6">
            <p className="text-sm text-[#6B7280] mb-1">Confirmed</p>
            <p className="text-3xl font-bold text-[#10B981]">₹{totalConfirmed.toLocaleString()}</p>
          </CardBody>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">All Payments</h3>
        </CardHeader>
        <CardBody className="p-0">
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B7280]">No payment records yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8FAFC] border-b border-[#D1FAE5]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Member</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D1FAE5]">
                  {payments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-[#F8FAFC]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="font-medium text-[#111827]">{payment.member_name}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                        {payment.project_title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-[#111827]">
                        ₹{parseFloat(payment.amount || '0').toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.status === 'unpaid' && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Unpaid
                          </span>
                        )}
                        {payment.status === 'paid' && !payment.confirmed_by_member && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            Awaiting Confirmation
                          </span>
                        )}
                        {payment.status === 'paid' && payment.confirmed_by_member && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            Confirmed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        {payment.status === 'unpaid' && (
                          <Button
                            size="sm"
                            onClick={() => handleMarkPaid(payment.id)}
                            isLoading={processingId === payment.id}
                          >
                            Mark Paid
                          </Button>
                        )}
                        {payment.status === 'paid' && !payment.confirmed_by_member && (
                          <span className="text-sm text-[#6B7280]">Waiting for member</span>
                        )}
                        {payment.status === 'paid' && payment.confirmed_by_member && (
                          <span className="text-sm text-[#10B981]">✓ Complete</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
