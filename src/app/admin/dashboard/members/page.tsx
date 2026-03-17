'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardHeader, CardBody } from '@/components/ui';
import { getSignedUrl } from '@/lib/blob';

interface Member {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  role: string | null;
  profile_image_url?: string | null;
  is_active: boolean;
  created_at: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/members');
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (memberId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/members/${memberId}/toggle-status`, {
        method: 'PATCH',
      });
      if (response.ok) {
        fetchMembers();
      }
    } catch (error) {
      console.error('Error toggling member status:', error);
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#111827]">Team Members</h2>
          <p className="text-[#6B7280]">Manage your project team members</p>
        </div>
        <Link href="/admin/dashboard/members/create">
          <Button>Add Member</Button>
        </Link>
      </div>

      {/* Members Table */}
      <Card>
        <CardBody className="p-0">
          {members.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto text-[#D1FAE5] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-medium text-[#111827] mb-2">No members yet</h3>
              <p className="text-[#6B7280] mb-4">Get started by adding your first team member</p>
              <Link href="/admin/dashboard/members/create">
                <Button>Add First Member</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F8FAFC] border-b border-[#D1FAE5]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-[#6B7280] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D1FAE5]">
                  {members.map((member) => (
                    <tr key={member.id} className="hover:bg-[#F8FAFC]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-[#D1FAE5] rounded-full flex items-center justify-center mr-3 overflow-hidden">
                            {member.profile_image_url ? (
                              <img
                                src={getSignedUrl(member.profile_image_url)}
                                alt={member.full_name}
                                className="w-10 h-10 object-cover"
                              />
                            ) : (
                              <span className="text-[#10B981] font-medium">
                                {member.full_name[0].toUpperCase()}
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[#111827]">
                              {member.full_name}
                            </div>
                            {member.phone && (
                              <div className="text-sm text-[#6B7280]">
                                {member.phone}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#6B7280]">
                        {member.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-[#D1FAE5] text-[#0F766E] rounded-full">
                          {member.role || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            member.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {member.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/dashboard/members/${member.id}`}
                          className="text-[#10B981] hover:text-[#0F766E] mr-3"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/dashboard/members/${member.id}/edit`}
                          className="text-[#10B981] hover:text-[#0F766E] mr-3"
                        >
                          Edit
                        </Link>
                        <Button
                          variant={member.is_active ? 'danger' : 'primary'}
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleToggleActive(member.id, member.is_active);
                          }}
                        >
                          {member.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
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
