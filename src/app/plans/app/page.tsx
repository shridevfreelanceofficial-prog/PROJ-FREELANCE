import HomeHeader from '@/components/HomeHeader';
import Link from 'next/link';
import Reveal from '@/components/animations/Reveal';
import TiltCard from '@/components/animations/TiltCard';

function Price({ oldPrice, newPrice }: { oldPrice: string; newPrice: string }) {
  return (
    <div className="mt-4">
      <p className="text-sm text-[#6B7280]">
        <span className="line-through">₹{oldPrice}</span>
        <span className="ml-2 inline-flex items-center px-2 py-1 rounded-md bg-[#D1FAE5] text-[#0F766E] text-xs font-bold">
          Special Offer
        </span>
      </p>
      <p className="mt-1 text-3xl font-extrabold text-[#111827]">₹{newPrice}</p>
    </div>
  );
}

function PackageCard({
  title,
  oldPrice,
  newPrice,
  subtitle,
  included,
  excluded,
}: {
  title: string;
  oldPrice: string;
  newPrice: string;
  subtitle: string;
  included: string[];
  excluded: string[];
}) {
  return (
    <TiltCard className="group rounded-2xl bg-white/80 backdrop-blur-sm border border-[#D1FAE5] p-8 hover:border-[#10B981] transition-all duration-300">
      <h3 className="text-2xl font-bold text-[#111827]">{title}</h3>
      <p className="mt-2 text-[#6B7280]">{subtitle}</p>

      <Price oldPrice={oldPrice} newPrice={newPrice} />

      <div className="mt-6">
        <p className="text-sm font-bold text-[#111827]">What’s included</p>
        <ul className="mt-3 space-y-2 text-sm text-[#374151]">
          {included.map((x) => (
            <li key={x} className="flex gap-2">
              <span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-[#10B981]" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <p className="text-sm font-bold text-[#111827]">Not included</p>
        <ul className="mt-3 space-y-2 text-sm text-[#374151]">
          {excluded.map((x) => (
            <li key={x} className="flex gap-2">
              <span className="mt-0.5 inline-block w-2 h-2 rounded-full bg-[#EF4444]" />
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#10B981] text-white font-semibold hover:bg-[#0F766E] transition-colors"
        >
          Get This Package
        </Link>
        <Link
          href="/plans"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg border-2 border-[#10B981] text-[#10B981] font-semibold hover:bg-[#D1FAE5] transition-colors"
        >
          Back to Plans
        </Link>
      </div>
    </TiltCard>
  );
}

export default function AppPlansPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#F8FAFC] via-[#D1FAE5]/25 to-[#10B981]/10" />
      <div className="fixed top-0 right-0 -z-10 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl" />
      <div className="fixed bottom-0 left-0 -z-10 w-96 h-96 bg-[#0F766E]/5 rounded-full blur-3xl" />

      <HomeHeader />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-sm font-bold text-[#10B981]">Plans</p>
              <h1 className="mt-2 text-4xl md:text-5xl font-bold text-[#111827]">App Development</h1>
              <p className="mt-3 text-[#374151]">
                Strong foundations, clean UI, and scalable code. For exact pricing, we finalize scope first.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid lg:grid-cols-3 gap-8">
            <Reveal delay={0.05}>
              <PackageCard
                title="Starter App"
                subtitle="For MVP apps with essential screens and basic backend integration."
                oldPrice="79,999"
                newPrice="69,000"
                included={[
                  'Up to 6 screens',
                  'Clean modern UI',
                  'Basic auth (login/register)',
                  'API integration (basic)',
                  'Play Store submission support',
                  '1 month post-launch support',
                ]}
                excluded={[
                  'Complex animations or 3D',
                  'Multiple user roles (advanced)',
                  'Payments unless quoted',
                ]}
              />
            </Reveal>

            <Reveal delay={0.1}>
              <PackageCard
                title="Business App"
                subtitle="For customer-facing apps with more screens and better automation."
                oldPrice="1,49,999"
                newPrice="1,25,000"
                included={[
                  'Up to 12 screens',
                  'Push notifications setup (basic)',
                  'Analytics integration',
                  'Better performance optimization',
                  'Admin panel (basic) if needed',
                  '2 months post-launch support',
                ]}
                excluded={[
                  'Offline-first architecture unless quoted',
                  'Complex third-party integrations',
                  'Unlimited revisions',
                ]}
              />
            </Reveal>

            <Reveal delay={0.15}>
              <PackageCard
                title="Advanced App"
                subtitle="For apps with multiple modules, roles, and scalability requirements."
                oldPrice="2,49,999"
                newPrice="2,10,000"
                included={[
                  'Role-based access (admin/staff/user)',
                  'Database + scalable API architecture',
                  'CI/CD guidance',
                  'Security best practices',
                  'Deployment + monitoring setup',
                  '3 months post-launch support',
                ]}
                excluded={[
                  'Paid service costs (SMS, email credits, maps billing, etc.)',
                  'Very complex custom workflows without final scope',
                  'Hardware integrations unless quoted',
                  'Native mobile app (separate plan)',
                ]}
              />
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="bg-[#0F766E] text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm opacity-80">© 2026 ShriDev Freelance. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
