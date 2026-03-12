'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';
import { getSignedUrl } from '@/lib/blob';

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  residential_location: string | null;
  role: string | null;
  signature_url: string | null;
  is_active: boolean;
  created_at: string;
}

export default function MemberDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchMember();
  }, [params.id]);

  const fetchMember = async () => {
    try {
      const response = await fetch(`/api/admin/members/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setMember(data.member);
      }
    } catch (error) {
      console.error('Error fetching member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!member) return;
    setToggling(true);
    try {
      const response = await fetch(`/api/admin/members/${member.id}/toggle-status`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchMember();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    } finally {
      setToggling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-[#111827]">Member not found</h2>
        <Link href="/admin/dashboard/members" className="text-[#10B981] mt-4 inline-block">
          ← Back to Members
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/dashboard/members" className="text-[#10B981] text-sm mb-2 inline-block">
            ← Back to Members
          </Link>
          <h1 className="text-2xl font-bold text-[#111827]">{member.full_name}</h1>
          <p className="text-[#6B7280]">{member.email}</p>
        </div>
        <div className="flex gap-3">
          <Link href={`/admin/dashboard/members/${member.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <Button
            variant={member.is_active ? 'danger' : 'primary'}
            onClick={handleToggleStatus}
            isLoading={toggling}
          >
            {member.is_active ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      </div>

      {/* Member Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#111827]">Personal Information</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <p className="text-sm text-[#6B7280]">Full Name</p>
              <p className="font-medium text-[#111827]">{member.full_name}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Email</p>
              <p className="font-medium text-[#111827]">{member.email}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Phone</p>
              <p className="font-medium text-[#111827]">{member.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Location</p>
              <p className="font-medium text-[#111827]">{member.residential_location || 'Not provided'}</p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#111827]">Work Information</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <p className="text-sm text-[#6B7280]">Role</p>
              <p className="font-medium text-[#111827]">{member.role || 'Not assigned'}</p>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                member.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {member.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <p className="text-sm text-[#6B7280]">Joined</p>
              <p className="font-medium text-[#111827]">
                {new Date(member.created_at).toLocaleDateString()}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Signature */}
      {member.signature_url && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#111827]">Signature</h3>
          </CardHeader>
          <CardBody>
            <img src={getSignedUrl(member.signature_url)} alt="Signature" className="max-w-xs" />
          </CardBody>
        </Card>
      )}
    </div>
  );
}
