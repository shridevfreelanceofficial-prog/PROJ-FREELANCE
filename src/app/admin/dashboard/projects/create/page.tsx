'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';

interface Member {
  id: string;
  full_name: string;
  email: string;
  role: string | null;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    client_name: '',
    description: '',
    requirements: '',
    media_drive_link: '',
    github_link: '',
    start_date: '',
    end_date: '',
    assign_to_self: false,
    admin_working_hours: '8',
    assigned_members: [] as { member_id: string; daily_working_hours: string }[],
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/admin/members');
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members.filter((m: Member & { is_active: boolean }) => m.is_active));
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleMemberToggle = (memberId: string) => {
    const existing = formData.assigned_members.find(m => m.member_id === memberId);
    if (existing) {
      setFormData({
        ...formData,
        assigned_members: formData.assigned_members.filter(m => m.member_id !== memberId),
      });
    } else {
      setFormData({
        ...formData,
        assigned_members: [...formData.assigned_members, { member_id: memberId, daily_working_hours: '8' }],
      });
    }
  };

  const updateMemberHours = (memberId: string, hours: string) => {
    setFormData({
      ...formData,
      assigned_members: formData.assigned_members.map(m =>
        m.member_id === memberId ? { ...m, daily_working_hours: hours } : m
      ),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create project');
        return;
      }

      router.push('/admin/dashboard/projects');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-[#111827]">Create New Project</h2>
          <p className="text-[#6B7280] mt-1">
            Start a new freelancing project and assign team members
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Project Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter project title"
              required
            />

            <Input
              label="Client Name"
              value={formData.client_name}
              onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
              placeholder="Enter client name"
            />

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the project"
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Requirements
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="List project requirements"
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none"
              />
            </div>

            <Input
              label="Media Drive Link"
              value={formData.media_drive_link}
              onChange={(e) => setFormData({ ...formData, media_drive_link: e.target.value })}
              placeholder="Google Drive or other media link"
              helperText="Link to project assets, designs, etc."
            />

            <Input
              label="GitHub Link"
              value={formData.github_link}
              onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
              placeholder="https://github.com/..."
              helperText="Repository link for this project"
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Start Date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
              <Input
                label="End Date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>

            {/* Self Assignment */}
            <div className="bg-[#D1FAE5] rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.assign_to_self}
                  onChange={(e) => setFormData({ ...formData, assign_to_self: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-[#10B981] focus:ring-[#10B981]"
                />
                <div>
                  <span className="font-medium text-[#111827]">Assign this project to yourself</span>
                  <p className="text-sm text-[#6B7280]">You will be part of the project team</p>
                </div>
              </label>
              {formData.assign_to_self && (
                <div className="mt-3 ml-8">
                  <Input
                    label="Your Daily Working Hours"
                    type="number"
                    value={formData.admin_working_hours}
                    onChange={(e) => setFormData({ ...formData, admin_working_hours: e.target.value })}
                    placeholder="Hours per day"
                    className="w-40"
                  />
                </div>
              )}
            </div>

            {/* Member Assignment */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-3">
                Assign Team Members
              </label>
              {members.length === 0 ? (
                <p className="text-[#6B7280] text-sm">No active members available. Add members first.</p>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto border border-[#D1FAE5] rounded-lg p-4">
                  {members.map((member) => {
                    const isSelected = formData.assigned_members.some(m => m.member_id === member.id);
                    return (
                      <div
                        key={member.id}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          isSelected ? 'bg-[#D1FAE5]' : 'bg-[#F8FAFC] hover:bg-[#D1FAE5]/50'
                        }`}
                      >
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleMemberToggle(member.id)}
                            className="w-5 h-5 rounded border-gray-300 text-[#10B981] focus:ring-[#10B981]"
                          />
                          <div>
                            <p className="font-medium text-[#111827]">{member.full_name}</p>
                            <p className="text-sm text-[#6B7280]">{member.role || 'No role'}</p>
                          </div>
                        </label>
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#6B7280]">Hours/day:</span>
                            <input
                              type="number"
                              value={formData.assigned_members.find(m => m.member_id === member.id)?.daily_working_hours || '8'}
                              onChange={(e) => updateMemberHours(member.id, e.target.value)}
                              className="w-20 px-2 py-1 rounded border border-gray-300 text-sm"
                              min="1"
                              max="24"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                isLoading={loading}
              >
                Create Project
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
