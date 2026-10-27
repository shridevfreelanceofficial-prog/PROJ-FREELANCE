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

const DEFAULT_WEBSITE_PLANS: ServicePackage[] = [
  {
    id: 'default-starter',
    service_type: 'website',
    name: "Starter",
    slug: 'starter',
    price: "15,000",
    price_period: "/ project",
    description: "Perfect for small businesses or portfolios looking to establish a professional online presence.",
    icon_type: "sparkles",
    features: [
      "1 to 5 Pages (Home, About, Services, Contact)",
      "Mobile Responsive Design",
      "Basic SEO Setup",
      "Contact Form Integration",
      "Free SSL Certificate",
      "1 Month Free Support"
    ],
    popular: false,
    popular_badge_text: null,
    sort_order: 1
  },
  {
    id: 'default-professional',
    service_type: 'website',
    name: "Professional",
    slug: 'professional',
    price: "35,000",
    price_period: "/ project",
    description: "Ideal for growing businesses needing a dynamic, custom designed, and feature-rich website.",
    icon_type: "rocket",
    features: [
      "Up to 15 Pages",
      "Custom UI/UX Design",
      "Advanced SEO & Analytics",
      "CMS Integration (Blog/Portfolio)",
      "Social Media Integrations",
      "Speed Optimization",
      "3 Months Free Support"
    ],
    popular: true,
    popular_badge_text: "Most Popular",
    sort_order: 2
  },
  {
    id: 'default-ecommerce',
    service_type: 'website',
    name: "E-Commerce",
    slug: 'e-commerce',
    price: "60,000+",
    price_period: "/ project",
    description: "Comprehensive online store setup with payment gateways, product management, and robust security.",
    icon_type: "shopping-bag",
    features: [
      "Unlimited Product Listings",
      "Secure Payment Gateway",
      "User Accounts & Dashboards",
      "Inventory Management",
      "Order Tracking System",
      "Premium Theme & Customization",
      "6 Months Priority Support"
    ],
    popular: false,
    popular_badge_text: null,
    sort_order: 3
  }
];

export default async function WebsitePlansPage() {
  let plans: ServicePackage[] = [];

  try {
    const dbPlans = await query<ServicePackage>(
      `SELECT * FROM service_packages 
       WHERE service_type = 'website' AND is_active = true 
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
    console.error('Error loading website service packages from DB:', error);
  }

  if (plans.length === 0) {
    plans = DEFAULT_WEBSITE_PLANS;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#F4FFFA]">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00C896]/10 via-transparent to-transparent opacity-80" />
      <div className="fixed top-[-10%] right-[-5%] -z-10 w-[600px] h-[600px] bg-[#00E6A8]/5 rounded-full blur-[120px]" />
      
      <main className="flex-1 pt-32 pb-24 relative z-10 w-full">
        <section className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <Reveal className="max-w-4xl mx-auto text-center mb-16" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00C896]/10 border border-[#00C896]/20 text-[#00C896] font-semibold text-sm mb-6">
              Web Development Packages
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#0F172A] mb-6 drop-shadow-sm">
              Website Plans
            </h1>
            <p className="text-xl md:text-2xl font-medium text-[#475569]">
              High performance websites tailored to scale with your business logic.
            </p>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => {
              const featureList: string[] = Array.isArray(plan.features) ? plan.features : [];

              return (
                <Reveal key={plan.id || plan.name} delay={0.15 + index * 0.1} y={40} className="h-full">
                  <TiltCard className="h-full w-full">
                    <div className={`h-full rounded-3xl backdrop-blur-xl border p-8 transition-all duration-500 flex flex-col relative overflow-hidden group ${plan.popular ? 'bg-[#0F172A] border-white/10 hover:border-[#00E6A8]/50 hover:shadow-2xl hover:shadow-[#00E6A8]/20' : 'bg-white/60 border-white hover:border-[#00C896]/50 hover:shadow-2xl hover:shadow-[#00C896]/20'}`}>
                      
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#00C896] to-[#00E6A8] text-[#0F172A] text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-lg">
                          {plan.popular_badge_text || 'Most Popular'}
                        </div>
                      )}
                      
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-[#00C896]/20 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className={`w-16 h-16 rounded-2xl p-4 shadow-lg mb-6 flex items-center justify-center ${plan.popular ? 'bg-white/10 border border-white/10 text-white' : 'bg-gradient-to-br from-[#00C896]/10 to-[#00E6A8]/10 text-[#00C896]'}`}>
                        <PackageIcon type={plan.icon_type} className="w-8 h-8" />
                      </div>
                      
                      <h2 className={`text-2xl font-extrabold mb-2 ${plan.popular ? 'text-white' : 'text-[#0F172A]'}`}>{plan.name}</h2>
                      <div className={`text-4xl font-extrabold mb-4 ${plan.popular ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#00C896] to-[#00E6A8]' : 'text-[#00C896]'}`}>
                        ₹{plan.price}
                        <span className={`text-sm font-medium ${plan.popular ? 'text-white/50' : 'text-[#475569]/60'}`}> {plan.price_period || '/ project'}</span>
                      </div>
                      
                      <p className={`text-base mb-8 leading-relaxed ${plan.popular ? 'text-white/70' : 'text-[#475569]'}`}>
                        {plan.description}
                      </p>
                      
                      <div className="mb-10 flex-1">
                        <div className={`text-sm font-bold uppercase tracking-wider mb-4 ${plan.popular ? 'text-white/50' : 'text-[#475569]/50'}`}>What&apos;s included</div>
                        <ul className="space-y-4">
                          {featureList.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <svg className={`w-5 h-5 shrink-0 mt-0.5 ${plan.popular ? 'text-[#00E6A8]' : 'text-[#00C896]'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className={`font-medium ${plan.popular ? 'text-white/90' : 'text-[#0F172A]/80'}`}>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-auto relative z-10 w-full">
                        <Link
                          href={`/plans/request?type=website&plan=${encodeURIComponent((plan.slug || plan.name).toLowerCase())}`}
                          className={`w-full inline-flex items-center justify-center px-6 py-4 rounded-full font-bold shadow-lg transition-all duration-300 active:scale-95 ${plan.popular ? 'bg-gradient-to-r from-[#00C896] to-[#00E6A8] text-[#0F172A] hover:shadow-[#00C896]/30 hover:scale-105' : 'bg-[#0F172A] text-white hover:bg-[#00C896] hover:shadow-[#00C896]/30 hover:-translate-y-1'}`}
                        >
                          Choose {plan.name}
                        </Link>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
          
          <Reveal delay={0.5} y={40} className="mt-20">
            <div className="bg-[#0F172A] rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00C896]/10 via-transparent to-transparent opacity-50" />
              <div className="relative z-10 max-w-2xl">
                <h3 className="text-3xl font-extrabold text-white mb-3">Looking for something custom?</h3>
                <p className="text-lg text-white/70">
                  Have a massive project in mind or need complex SaaS architectures? Let&apos;s build it from the ground up.
                </p>
              </div>
              <Link
                href="/contact"
                className="relative z-10 whitespace-nowrap inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/20 text-white font-bold hover:border-[#00C896] hover:text-[#00C896] hover:bg-[#00C896]/10 active:scale-95 transition-all duration-300"
              >
                Get Custom Quote
              </Link>
            </div>
          </Reveal>
        </section>
      </main>
    </div>
  );
}
