import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo/ShriDev_Freelance_logo.png"
              alt="ShriDev Freelance"
              width={40}
              height={40}
              className="w-10 h-10 rounded-lg"
            />
            <span className="text-xl font-bold text-[#111827]">ShriDev Freelance</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin/login"
              className="px-4 py-2 text-[#10B981] hover:text-[#0F766E] font-medium transition-colors"
            >
              Admin Login
            </Link>
            <Link
              href="/member/login"
              className="px-4 py-2 bg-[#10B981] text-white rounded-lg hover:bg-[#0F766E] font-medium transition-colors shadow-md"
            >
              Member Login
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-[#111827] mb-6">
            Professional Freelance
            <span className="block text-[#10B981]">Project Management</span>
          </h1>
          <p className="text-xl text-[#6B7280] mb-8 max-w-2xl mx-auto">
            Streamline your freelancing workflow with our comprehensive project management system. 
            Track progress, manage teams, and showcase your work professionally.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shridevfreelance/projectShowcase"
              className="px-8 py-3 bg-[#10B981] text-white rounded-lg hover:bg-[#0F766E] font-medium transition-colors shadow-lg"
            >
              View Project Showcase
            </Link>
            <Link
              href="/certificate-verification"
              className="px-8 py-3 border-2 border-[#10B981] text-[#10B981] rounded-lg hover:bg-[#D1FAE5] font-medium transition-colors"
            >
              Verify Certificate
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#111827] mb-12">
            Platform Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-[#D1FAE5]">
              <div className="w-12 h-12 bg-[#D1FAE5] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#111827] mb-2">Project Management</h3>
              <p className="text-[#6B7280]">Track project progress, assign team members, and manage deadlines efficiently.</p>
            </div>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-[#D1FAE5]">
              <div className="w-12 h-12 bg-[#D1FAE5] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#111827] mb-2">Team Collaboration</h3>
              <p className="text-[#6B7280]">Seamless collaboration with team members through meetings and shared resources.</p>
            </div>
            <div className="bg-[#F8FAFC] rounded-xl p-6 border border-[#D1FAE5]">
              <div className="w-12 h-12 bg-[#D1FAE5] rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#111827] mb-2">Document Generation</h3>
              <p className="text-[#6B7280]">Automated certificates and reports with professional templates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F766E] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm opacity-80">
            © 2024 ShriDev Freelance. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
