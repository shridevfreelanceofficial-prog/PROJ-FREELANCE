import HomeHeader from '@/components/HomeHeader';
import ProjectsShowcaseGrid from '@/components/ProjectsShowcaseGrid';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#F8FAFC] via-[#D1FAE5]/25 to-[#10B981]/10" />
      <div className="fixed top-0 right-0 -z-10 w-96 h-96 bg-[#10B981]/5 rounded-full blur-3xl" />
      <div className="fixed bottom-0 left-0 -z-10 w-96 h-96 bg-[#0F766E]/5 rounded-full blur-3xl" />

      <HomeHeader />

      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-[#111827]">Projects</h1>
            <p className="mt-3 text-[#374151]">
              Explore our featured work.
            </p>
          </div>

          <div className="mt-10">
            {projects.length === 0 ? (
              <div className="rounded-2xl bg-white/70 backdrop-blur-sm border border-[#D1FAE5] p-10 text-center">
                <h2 className="text-xl font-bold text-[#111827]">No projects yet</h2>
                <p className="mt-2 text-[#6B7280]">Projects added by admin will appear here.</p>
              </div>
            ) : (
              <ProjectsShowcaseGrid projects={projects} />
            )}
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
