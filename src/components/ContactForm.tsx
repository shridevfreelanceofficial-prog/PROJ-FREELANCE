'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardBody, CardHeader } from '@/components/ui';

export default function ContactForm({
  showBackLink = true,
  onSubmitted,
  title,
  description,
}: {
  showBackLink?: boolean;
  onSubmitted?: () => void;
  title?: string;
  description?: string;
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    try {
      setLoading(true);
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error || 'Failed to submit');
        return;
      }

      setSuccess('Thank you! Your message has been sent successfully.');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      onSubmitted?.();
    } catch {
      setError('Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-bold text-[#111827]">{title ?? 'Send a message'}</h2>
        <p className="text-[#6B7280]">
          {description ?? 'We’ll get back to you as soon as possible.'}
        </p>
      </CardHeader>
      <CardBody>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">Name *</label>
              <input
                className="w-full px-4 py-2 border border-[#D1FAE5] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">Email *</label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-[#D1FAE5] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">Phone *</label>
              <input
                className="w-full px-4 py-2 border border-[#D1FAE5] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111827] mb-1">Subject *</label>
              <input
                className="w-full px-4 py-2 border border-[#D1FAE5] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Message *</label>
            <textarea
              className="w-full px-4 py-2 border border-[#D1FAE5] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#10B981] min-h-[160px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          {success ? (
            <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
              {success}
            </div>
          ) : null}
          {error ? (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <Button type="submit" isLoading={loading}>
              Submit
            </Button>
            {showBackLink ? (
              <Link href="/" className="text-sm text-[#6B7280] hover:text-[#111827]">
                Back to home
              </Link>
            ) : null}
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
