import ProjectsShowcaseGrid from '@/components/ProjectsShowcaseGrid';
import { query } from '@/lib/db';
import Reveal from '@/components/animations/Reveal';

export const revalidate = 300;

type ShowcaseProject = {
  id: string;
  title: string;
  client_name: string | null;
  description: string | null;
  cover_image_url: string | null;
  live_website_url: string | null;
};

export default async function ProjectsPage() {
  const projects = await query<ShowcaseProject>(
    `SELECT id, title, client_name, description, cover_image_url, live_website_url
     FROM project_showcase
     WHERE is_visible = true
     ORDER BY end_date DESC`
  );

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#F4FFFA]">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00C896]/10 via-transparent to-transparent opacity-80" />
      <div className="fixed top-20 right-0 -z-10 w-[500px] h-[500px] bg-[#00E6A8]/10 rounded-full blur-[120px]" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-[#0F766E]/5 rounded-full blur-[150px]" />

      <main className="flex-1 pt-32 pb-16 relative z-10 w-full">
        <section className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          
          <Reveal className="max-w-4xl mx-auto text-center mb-16" delay={0.1}>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[#0F172A] mb-6 drop-shadow-sm">
              Our Projects
            </h1>
            <p className="text-xl md:text-2xl font-medium text-[#475569]">
              Explore our featured digital experiences, modern web applications, and premium platforms.
            </p>
          </Reveal>

          <Reveal delay={0.2} y={30} className="w-full">
            {projects.length === 0 ? (
              <div className="rounded-3xl bg-white/50 backdrop-blur-xl border border-white p-12 text-center max-w-2xl mx-auto shadow-xl shadow-[#00C896]/5 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                <svg className="w-16 h-16 mx-auto text-[#0F172A]/20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h2 className="text-2xl font-bold text-[#0F172A]">Innovation in Progress</h2>
                <p className="mt-3 text-lg text-[#475569]">Our showcase is currently being crafted. Check back soon for our latest work.</p>
              </div>
            ) : (
              <div className="bg-white/30 p-4 md:p-8 rounded-[2rem] border border-white/50 backdrop-blur-md shadow-2xl shadow-[#00C896]/10">
                <ProjectsShowcaseGrid projects={projects} />
              </div>
            )}
          </Reveal>
        </section>
      </main>
    </div>
  );
}
