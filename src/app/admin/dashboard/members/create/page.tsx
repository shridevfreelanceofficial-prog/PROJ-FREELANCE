'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';

const ROLES = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'Graphic Designer',
  'QA Engineer',
  'DevOps Engineer',
  'Project Manager',
  'Content Writer',
  'Other',
];

export default function CreateMemberPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    github_username: '',
    password: '',
    residential_location: '',
    role: '',
    signature: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, signature: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignaturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append('full_name', formData.full_name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('github_username', formData.github_username);
      submitData.append('password', formData.password);
      submitData.append('residential_location', formData.residential_location);
      submitData.append('role', formData.role);
      if (formData.signature) {
        submitData.append('signature', formData.signature);
      }

      const response = await fetch('/api/admin/members', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create member');
        return;
      }

      router.push('/admin/dashboard/members');
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-[#111827]">Add New Member</h2>
          <p className="text-[#6B7280] mt-1">
            Create a new team member account
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
              label="Full Name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Enter full name"
              required
              helperText="This name will appear on certificates"
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter email address"
              required
              helperText="Used for login and notifications"
            />

            <Input
              label="Phone Number"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
            />

            <Input
              label="GitHub Username"
              value={formData.github_username}
              onChange={(e) => setFormData({ ...formData, github_username: e.target.value })}
              placeholder="e.g., octocat"
              required
            />

            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Create a password"
              required
              helperText="Minimum 6 characters"
            />

            <Input
              label="Residential Location"
              value={formData.residential_location}
              onChange={(e) => setFormData({ ...formData, residential_location: e.target.value })}
              placeholder="City, State, Country"
            />

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none"
              >
                <option value="">Select a role</option>
                {ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Signature Upload */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Signature (Optional)
              </label>
              <div className="mt-2">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#D1FAE5] rounded-lg p-6 text-center cursor-pointer hover:border-[#10B981] transition-colors"
                >
                  {signaturePreview ? (
                    <div className="space-y-2">
                      <img
                        src={signaturePreview}
                        alt="Signature preview"
                        className="max-h-32 mx-auto object-contain"
                      />
                      <p className="text-sm text-[#6B7280]">Click to change</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg
                        className="w-12 h-12 mx-auto text-[#10B981]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-[#6B7280]">
                        Click to upload signature
                      </p>
                      <p className="text-xs text-[#6B7280]">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <p className="mt-1.5 text-sm text-[#6B7280]">
                Member's signature will appear on certificates
              </p>
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
                Create Member
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
