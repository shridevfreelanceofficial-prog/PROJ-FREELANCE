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
  github_username: string | null;
  residential_location: string | null;
  role: string | null;
  signature_url: string | null;
  profile_image_url: string | null;
  is_active: boolean;
}

export default function EditMemberPage() {
  const params = useParams();
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState('');
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchMember();
  }, [params.id]);

  const fetchMember = async () => {
    try {
      const response = await fetch(`/api/admin/members/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setMember(data.member);
        setFullName(data.member.full_name);
        setEmail(data.member.email);
        setPhone(data.member.phone || '');
        setGithubUsername(data.member.github_username || '');
        setLocation(data.member.residential_location || '');
        setRole(data.member.role || '');
      }
    } catch (error) {
      console.error('Error fetching member:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('full_name', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('github_username', githubUsername);
      formData.append('residential_location', location);
      formData.append('role', role);
      if (profileImageFile) {
        formData.append('profile_image', profileImageFile);
      }
      if (signatureFile) {
        formData.append('signature', signatureFile);
      }

      const response = await fetch(`/api/admin/members/${params.id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        router.push(`/admin/dashboard/members/${params.id}`);
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update member');
      }
    } catch (error) {
      console.error('Error updating member:', error);
      alert('Failed to update member');
    } finally {
      setSaving(false);
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
      <div>
        <Link href={`/admin/dashboard/members/${params.id}`} className="text-[#10B981] text-sm mb-2 inline-block">
          ← Back to Member
        </Link>
        <h1 className="text-2xl font-bold text-[#111827]">Edit Member</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#111827]">Personal Information</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              label="GitHub Username"
              value={githubUsername}
              onChange={(e) => setGithubUsername(e.target.value)}
              placeholder="e.g., octocat"
            />
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#111827]">Work Information</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <Input
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Developer, Designer"
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#111827]">Signature</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {member.profile_image_url && !profilePreview && (
              <div>
                <p className="text-sm text-[#6B7280] mb-2">Current Profile Picture:</p>
                <img
                  src={getSignedUrl(member.profile_image_url)}
                  alt="Profile"
                  className="w-20 h-20 rounded-full border object-cover"
                />
              </div>
            )}

            {profilePreview && (
              <div>
                <p className="text-sm text-[#6B7280] mb-2">Profile Picture Preview:</p>
                <img
                  src={profilePreview}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full border object-cover"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Upload Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setProfileImageFile(file);
                  if (!file) {
                    setProfilePreview(null);
                    return;
                  }
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setProfilePreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }}
                className="block w-full text-sm text-[#6B7280]
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-[#D1FAE5] file:text-[#10B981]
                  hover:file:bg-[#A7F3D0]"
              />
            </div>

            {member.signature_url && (
              <div>
                <p className="text-sm text-[#6B7280] mb-2">Current Signature:</p>
                <img src={getSignedUrl(member.signature_url)} alt="Signature" className="max-w-xs border rounded" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Upload New Signature
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSignatureFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-[#6B7280]
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-medium
                  file:bg-[#D1FAE5] file:text-[#10B981]
                  hover:file:bg-[#A7F3D0]"
              />
            </div>
          </CardBody>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" isLoading={saving}>
            Save Changes
          </Button>
          <Link href={`/admin/dashboard/members/${params.id}`}>
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
