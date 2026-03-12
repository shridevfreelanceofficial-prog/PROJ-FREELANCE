'use client';

import { useEffect, useState } from 'react';
import { Button, Card, CardHeader, CardBody } from '@/components/ui';

interface Payment {
  id: string;
  project_id: string;
  project_title: string;
  amount: string;
  status: string;
  payment_date: string | null;
  confirmed_by_member: boolean;
  created_at: string;
}

export default function MemberPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/member/payments');
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

  const handleConfirmPayment = async (paymentId: string) => {
    setConfirmingId(paymentId);
    try {
      const response = await fetch(`/api/member/payments/${paymentId}/confirm`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchPayments();
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
    } finally {
      setConfirmingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  const totalPaid = payments
    .filter(p => p.status === 'paid' && p.confirmed_by_member)
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  const totalPending = payments
    .filter(p => p.status === 'paid' && !p.confirmed_by_member)
    .reduce((sum, p) => sum + parseFloat(p.amount), 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardBody className="p-6">
            <p className="text-sm text-[#6B7280] mb-1">Total Received</p>
            <p className="text-3xl font-bold text-[#10B981]">₹{totalPaid.toLocaleString()}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-6">
            <p className="text-sm text-[#6B7280] mb-1">Pending Confirmation</p>
            <p className="text-3xl font-bold text-[#F59E0B]">₹{totalPending.toLocaleString()}</p>
          </CardBody>
        </Card>
      </div>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">Payment History</h3>
        </CardHeader>
        <CardBody className="p-0">
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B7280]">No payment records yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[#D1FAE5]">
              {payments.map((payment) => (
                <div key={payment.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#111827]">{payment.project_title}</p>
                    <p className="text-sm text-[#6B7280]">
                      {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : 'Pending'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#111827]">₹{parseFloat(payment.amount).toLocaleString()}</p>
                    <div className="mt-1">
                      {payment.status === 'paid' && !payment.confirmed_by_member && (
                        <Button
                          size="sm"
                          onClick={() => handleConfirmPayment(payment.id)}
                          isLoading={confirmingId === payment.id}
                        >
                          Yes, Received
                        </Button>
                      )}
                      {payment.status === 'paid' && payment.confirmed_by_member && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Confirmed
                        </span>
                      )}
                      {payment.status === 'unpaid' && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                          Unpaid
                        </span>
                      )}
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
