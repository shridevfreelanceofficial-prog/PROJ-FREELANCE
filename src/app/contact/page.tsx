'use client';

import Image from 'next/image';
import Link from 'next/link';
import HomeHeader from '@/components/HomeHeader';
import { Card, CardBody, CardHeader } from '@/components/ui';
import ContactForm from '@/components/ContactForm';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <HomeHeader />

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
            <ContactForm />
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
