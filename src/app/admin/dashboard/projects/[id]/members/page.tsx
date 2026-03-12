'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';

interface ProjectMember {
  id: string;
  member_id: string;
  full_name: string;
  email: string;
  role: string | null;
  daily_working_hours: string;
  participation_confirmed: boolean;
}

export default function ProjectMembersPage() {
  const params = useParams();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [availableMembers, setAvailableMembers] = useState<{ id: string; full_name: string; email: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemberId, setNewMemberId] = useState('');
  const [newWorkingHours, setNewWorkingHours] = useState('8');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const fetchData = async () => {
    try {
      const [membersRes, availableRes] = await Promise.all([
        fetch(`/api/admin/projects/${params.id}/members`),
        fetch('/api/admin/members'),
      ]);

      if (membersRes.ok) {
        const data = await membersRes.json();
        setMembers(data.members);
      }
      if (availableRes.ok) {
        const data = await availableRes.json();
        setAvailableMembers(data.members.filter((m: { is_active: boolean }) => m.is_active));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/projects/${params.id}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_id: newMemberId,
          daily_working_hours: parseFloat(newWorkingHours),
        }),
      });

      if (response.ok) {
        setShowAddForm(false);
        setNewMemberId('');
        setNewWorkingHours('8');
        fetchData();
      }
    } catch (error) {
      console.error('Error adding member:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member from the project?')) return;
    
    try {
      const response = await fetch(`/api/admin/projects/${params.id}/members?member_id=${memberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMembers((prev) => prev.filter((m) => m.member_id !== memberId));
        fetchData();
      } else {
        const data = await response.json().catch(() => null);
        alert(data?.error || 'Failed to remove member');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Failed to remove member');
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
      <div className="flex items-center justify-between">
        <div>
          <Link href={`/admin/dashboard/projects/${params.id}`} className="text-[#10B981] text-sm mb-2 inline-block">
            ← Back to Project
          </Link>
          <h1 className="text-2xl font-bold text-[#111827]">Team Members</h1>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          Add Member
        </Button>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#111827]">Add Team Member</h3>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111827] mb-1.5">
                  Select Member
                </label>
                <select
                  value={newMemberId}
                  onChange={(e) => setNewMemberId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none"
                  required
                >
                  <option value="">Select a member</option>
                  {availableMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.full_name} ({member.email})
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Daily Working Hours"
                type="number"
                value={newWorkingHours}
                onChange={(e) => setNewWorkingHours(e.target.value)}
                min="1"
                max="24"
                required
              />
              <div className="flex gap-3">
                <Button type="submit" isLoading={saving}>Add Member</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      {/* Members List */}
      <Card>
        <CardBody className="p-0">
          {members.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[#6B7280]">No team members assigned yet</p>
            </div>
          ) : (
            <div className="divide-y divide-[#D1FAE5]">
              {members.map((member) => (
                <div key={member.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#111827]">{member.full_name}</p>
                    <p className="text-sm text-[#6B7280]">{member.email}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-[#6B7280]">{member.role || 'No role'}</span>
                      <span className="text-sm text-[#6B7280]">{member.daily_working_hours}h/day</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        member.participation_confirmed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {member.participation_confirmed ? 'Confirmed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveMember(member.member_id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
