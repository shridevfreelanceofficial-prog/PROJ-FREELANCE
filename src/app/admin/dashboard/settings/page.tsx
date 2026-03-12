'use client';

import { useEffect, useState } from 'react';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';
import { getSignedUrl } from '@/lib/blob';

interface AdminProfile {
  id: string;
  username: string;
  name: string | null;
  email: string | null;
  signature_url: string | null;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [signatureFile, setSignatureFile] = useState<File | null>(null);
  
  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  
  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    fetchProfile();
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/admin/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data.admin);
        setName(data.admin.name || '');
        setEmail(data.admin.email || '');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (signatureFile) {
        formData.append('signature', signatureFile);
      }

      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        fetchProfile();
        alert('Settings updated successfully');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters');
      return;
    }
    
    setPasswordSaving(true);
    
    try {
      const response = await fetch('/api/admin/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (response.ok) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        alert('Password updated successfully');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    // Apply theme to document
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
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
      <h1 className="text-2xl font-bold text-[#111827]">Settings</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Information */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#111827]">Profile Information</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">Username</label>
              <input
                type="text"
                value={profile?.username || ''}
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-[#D1FAE5] bg-[#F8FAFC] text-[#6B7280] cursor-not-allowed"
              />
              <p className="text-xs text-[#6B7280] mt-1">Username cannot be changed</p>
            </div>
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </CardBody>
        </Card>

        {/* Signature */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#111827]">Signature</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            {profile?.signature_url && (
              <div>
                <p className="text-sm text-[#6B7280] mb-2">Current Signature:</p>
                <img src={getSignedUrl(profile.signature_url)} alt="Signature" className="max-w-xs border rounded" />
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

        <Button type="submit" isLoading={saving}>
          Save Changes
        </Button>
      </form>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">Change Password</h3>
        </CardHeader>
        <CardBody>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
            <Button type="submit" variant="outline" isLoading={passwordSaving}>
              Update Password
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">Appearance</h3>
        </CardHeader>
        <CardBody>
          <div className="flex gap-4">
            <button
              onClick={() => handleThemeChange('light')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                theme === 'light'
                  ? 'border-[#10B981] bg-[#D1FAE5]'
                  : 'border-[#D1FAE5] hover:border-[#10B981]'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span className="font-medium text-[#111827]">Light</span>
              </div>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                theme === 'dark'
                  ? 'border-[#10B981] bg-[#D1FAE5]'
                  : 'border-[#D1FAE5] hover:border-[#10B981]'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span className="font-medium text-[#111827]">Dark</span>
              </div>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
