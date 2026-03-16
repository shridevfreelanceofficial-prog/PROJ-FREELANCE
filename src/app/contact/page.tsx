'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Card, CardBody, CardHeader } from '@/components/ui';

export default function ContactPage() {
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
    } catch {
      setError('Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo/ShriDev_Freelance_logo.png"
              alt="ShriDev Freelance"
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg"
            />
            <span className="text-xl font-bold text-[#111827]">ShriDev Freelance</span>
          </Link>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/"
              className="px-4 py-2 text-[#10B981] hover:text-[#0F766E] font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/shridevfreelance/projectShowcase"
              className="px-4 py-2 text-[#10B981] hover:text-[#0F766E] font-medium transition-colors"
            >
              Showcase
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <h1 className="text-2xl font-bold text-[#111827]">Contact Us</h1>
                <p className="text-[#6B7280]">Let’s discuss your next project.</p>
              </CardHeader>
              <CardBody className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/developer-img/Shrikesh.png"
                    alt="Shrikesh Shetty"
                    width={72}
                    height={72}
                    className="w-[72px] h-[72px] rounded-xl object-cover border border-[#D1FAE5]"
                  />
                  <div>
                    <p className="font-semibold text-[#111827]">Shrikesh Shetty</p>
                    <p className="text-sm text-[#6B7280]">Freelance Developer</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <a className="text-[#10B981] hover:text-[#0F766E]" href="mailto:shridevfreelanceofficial@gmail.com">
                    shridevfreelanceofficial@gmail.com
                  </a>
                  <div className="flex flex-col gap-1">
                    <a
                      className="text-[#10B981] hover:text-[#0F766E]"
                      href="https://www.linkedin.com/in/shrikesh-shetty-3a6695295/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      LinkedIn Profile
                    </a>
                    <a
                      className="text-[#10B981] hover:text-[#0F766E]"
                      href="https://github.com/ShrikeshShetty"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub Profile
                    </a>
                    <a
                      className="text-[#10B981] hover:text-[#0F766E]"
                      href="https://shrikeshshetty.github.io/_Portfolio/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Portfolio
                    </a>
                  </div>
                </div>

                <div className="rounded-xl bg-[#D1FAE5]/40 border border-[#D1FAE5] p-4">
                  <p className="text-sm text-[#111827] font-medium">What we can help with</p>
                  <p className="text-sm text-[#6B7280] mt-1">
                    Web & mobile app development, dashboards, admin panels, automation, performance improvements, and modern UI.
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold text-[#111827]">Send a message</h2>
                <p className="text-[#6B7280]">We’ll get back to you as soon as possible.</p>
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
                    <Link
                      href="/"
                      className="text-sm text-[#6B7280] hover:text-[#111827]"
                    >
                      Back to home
                    </Link>
                  </div>
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-[#0F766E] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm opacity-80">© {new Date().getFullYear()} ShriDev Freelance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
