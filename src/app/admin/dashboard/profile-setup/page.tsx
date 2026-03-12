'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardBody } from '@/components/ui';

export default function ProfileSetupPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
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
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('username', formData.username);
      if (formData.signature) {
        submitData.append('signature', formData.signature);
      }

      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to update profile');
        return;
      }

      router.push('/admin/dashboard');
      router.refresh();
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
          <h2 className="text-2xl font-bold text-[#111827]">Complete Your Profile</h2>
          <p className="text-[#6B7280] mt-1">
            Please provide your details to complete your administrator profile
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
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter your full name"
              required
            />

            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Enter your email"
              required
            />

            <Input
              label="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="Choose a username"
              required
              helperText="This will be used for login"
            />

            {/* Signature Upload */}
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1.5">
                Signature
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
                        Click to upload your signature
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
                Your signature will appear on official documents
              </p>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={loading}
            >
              Complete Profile
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
