import Link from 'next/link';
import Reveal from '@/components/animations/Reveal';
import TiltCard from '@/components/animations/TiltCard';
import { query } from '@/lib/db';
import PackageIcon from '@/components/PackageIcon';

export const revalidate = 0; // ensure changes from admin reflect immediately

interface ServicePackage {
  id: string;
  service_type: string;
  name: string;
  slug: string;
  price: string;
  price_period: string;
  description: string;
  features: string[] | string;
  popular: boolean;
  popular_badge_text: string | null;
  icon_type: string;
  sort_order: number;
}

const DEFAULT_APP_PLANS: ServicePackage[] = [
  {
    id: 'default-mvp-starter',
    service_type: 'app',
    name: "MVP Starter",
    slug: 'mvp-starter',
    price: "45,000",
    price_period: "/ project",
    description: "Minimum Viable Product to test your idea in the market quickly with essential features.",
    icon_type: "smartphone",
    features: [
      "Single Platform (Android or iOS)",
      "Core Feature Implementation",
      "Basic User Authentication",
      "Standard UI Components",
      "Firebase Backend Integration",
      "1 Month Maintenance"
    ],
    popular: false,
    popular_badge_text: null,
    sort_order: 1
  },
  {
    id: 'default-cross-platform',
    service_type: 'app',
    name: "Cross Platform",
    slug: 'cross-platform',
    price: "85,000",
    price_period: "/ project",
    description: "High-performance React Native application simultaneously built for both iOS and Android.",
    icon_type: "layers",
    features: [
      "Both Android & iOS Platforms",
      "Custom UI/UX Animations",
      "Advanced API Integrations",
      "Push Notifications",
      "Offline Support",
      "App Store & Play Store Setup",
      "3 Months Maintenance"
    ],
    popular: true,
    popular_badge_text: "Ultimate Value",
    sort_order: 2
  },
  {
    id: 'default-enterprise-level',
    service_type: 'app',
    name: "Enterprise Level",
    slug: 'enterprise-level',
    price: "1,50,000+",
    price_period: "/ project",
    description: "Highly scalable, secure, and robust application ecosystem with a custom backend panel.",
    icon_type: "shield",
    features: [
      "Everything in Cross Platform",
      "Dedicated Custom Backend",
      "Complex State Management",
      "Third-party Hardware Integration",
      "High-grade Security Protocols",
      "Dedicated Admin Dashboard",
      "6 Months Priority Support"
    ],
    popular: false,
    popular_badge_text: null,
    sort_order: 3
  }
];

export default async function AppPlansPage() {
  let plans: ServicePackage[] = [];

  try {
    const dbPlans = await query<ServicePackage>(
      `SELECT * FROM service_packages 
       WHERE service_type = 'app' AND is_active = true 
       ORDER BY sort_order ASC, created_at ASC`
    );

    if (dbPlans && dbPlans.length > 0) {
      plans = dbPlans.map(p => ({
        ...p,
        features: Array.isArray(p.features)
          ? p.features
          : typeof p.features === 'string'
          ? JSON.parse(p.features || '[]')
          : []
      }));
    }
  } catch (error) {
    console.error('Error loading app service packages from DB:', error);
  }

  if (plans.length === 0) {
    plans = DEFAULT_APP_PLANS;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#0F172A]">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#00E6A8]/10 via-transparent to-transparent opacity-80" />
      <div className="fixed top-[-10%] left-[-5%] -z-10 w-[600px] h-[600px] bg-[#00C896]/5 rounded-full blur-[120px]" />
      
      <main className="flex-1 pt-32 pb-24 relative z-10 w-full">
        <section className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <Reveal className="max-w-4xl mx-auto text-center mb-16" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#00E6A8] font-semibold text-sm mb-6 shadow-lg">
              App Development Packages
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 drop-shadow-lg">
              Application Plans
            </h1>
            <p className="text-xl md:text-2xl font-medium text-white/60">
              Native-feeling cross-platform apps built for incredible performance.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const featureList: string[] = Array.isArray(plan.features) ? plan.features : [];

              return (
                <Reveal key={plan.id || plan.name} delay={0.15 + index * 0.1} y={40} className="h-full">
                  <TiltCard className="h-full w-full">
                    <div className={`h-full rounded-3xl backdrop-blur-xl border p-8 transition-all duration-500 flex flex-col relative overflow-hidden group ${plan.popular ? 'bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-[#00E6A8]/30 hover:border-[#00E6A8] hover:shadow-2xl hover:shadow-[#00E6A8]/20' : 'bg-[#1E293B]/50 border-white/10 hover:border-[#00C896]/50 hover:shadow-2xl hover:shadow-[#00C896]/10'}`}>
                      
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#00C896] to-[#00E6A8] text-[#0F172A] text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-lg">
                          {plan.popular_badge_text || 'Ultimate Value'}
                        </div>
                      )}
                      
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-tl from-[#00E6A8]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className={`w-16 h-16 rounded-2xl p-4 shadow-lg mb-6 flex items-center justify-center ${plan.popular ? 'bg-gradient-to-br from-[#00C896] to-[#00E6A8] border border-white/20 text-[#0F172A]' : 'bg-white/5 border border-white/10 text-[#00E6A8]'}`}>
                        <PackageIcon type={plan.icon_type} className="w-8 h-8" />
                      </div>
                      
                      <h2 className="text-2xl font-extrabold mb-2 text-white">{plan.name}</h2>
                      <div className={`text-4xl font-extrabold mb-4 ${plan.popular ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#00C896] to-[#00E6A8]' : 'text-[#00E6A8]'}`}>
                        ₹{plan.price}
                        <span className="text-sm font-medium text-white/40"> {plan.price_period || '/ project'}</span>
                      </div>
                      
                      <p className="text-base mb-8 leading-relaxed text-white/60">
                        {plan.description}
                      </p>
                      
                      <div className="mb-10 flex-1">
                        <div className="text-sm font-bold uppercase tracking-wider mb-4 text-white/40">Included Features</div>
                        <ul className="space-y-4">
                          {featureList.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <svg className={`w-5 h-5 shrink-0 mt-0.5 ${plan.popular ? 'text-[#00C896]' : 'text-[#00E6A8]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="font-medium text-white/80">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-auto relative z-10 w-full">
                        <Link
                          href={`/plans/request?type=app&plan=${encodeURIComponent((plan.slug || plan.name).toLowerCase())}`}
                          className={`w-full inline-flex items-center justify-center px-6 py-4 rounded-full font-bold shadow-lg transition-all duration-300 active:scale-95 ${plan.popular ? 'bg-gradient-to-r from-[#00C896] to-[#00E6A8] text-[#0F172A] hover:shadow-[#00C896]/40 hover:scale-105' : 'bg-white/10 text-white hover:bg-[#00E6A8] hover:text-[#0F172A] hover:shadow-[#00E6A8]/30 hover:-translate-y-1'}`}
                        >
                          Select {plan.name}
                        </Link>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
