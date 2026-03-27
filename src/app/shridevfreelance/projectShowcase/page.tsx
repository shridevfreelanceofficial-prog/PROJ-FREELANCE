import { query } from '@/lib/db';
import { Card, CardBody } from '@/components/ui';
import HomeHeader from '@/components/HomeHeader';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ShowcaseProject {
  id: string;
  title: string;
  client_name: string | null;
  description: string | null;
  requirements: string | null;
  cover_image_url: string | null;
  live_website_url: string | null;
  start_date: string | null;
  end_date: string | null;
  team_members: Array<{ name: string; role: string }> | null;
}

export default async function ProjectShowcasePage() {
  let projects: ShowcaseProject[] = [];

  const formatDate = (date: string | null) => {
    if (!date) return '';
    const d = new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-GB');
  };

  try {
    projects = await query<ShowcaseProject>(
      `SELECT id, title, client_name, description, requirements, cover_image_url, live_website_url, start_date, end_date, team_members
       FROM project_showcase
       WHERE is_visible = true
       ORDER BY end_date DESC`
    );
  } catch (error) {
    console.error('Error fetching showcase projects:', error);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <HomeHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#10B981] to-[#0F766E] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Project Showcase
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Explore our completed projects and see the quality of work delivered by our team
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-20 h-20 mx-auto text-[#D1FAE5] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-2xl font-bold text-[#111827] mb-2">No Projects Yet</h2>
            <p className="text-[#6B7280]">Completed projects will be showcased here</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.id} variant="elevated" className="overflow-hidden hover:shadow-xl transition-shadow">
                {/* Cover Image */}
                <div className="h-48 bg-gradient-to-br from-[#10B981] to-[#0F766E] relative">
                  {project.cover_image_url ? (
                    project.live_website_url ? (
                      <a
                        href={project.live_website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full h-full"
                      >
                        <img
                          src={`/api/public/showcase-cover?url=${encodeURIComponent(project.cover_image_url)}`}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </a>
                    ) : (
                      <img
                        src={`/api/public/showcase-cover?url=${encodeURIComponent(project.cover_image_url)}`}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    )
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-white text-6xl font-bold opacity-20">
                        {project.title[0]}
                      </span>
                    </div>
                  )}
                </div>
                <CardBody className="p-6">
                  <h3 className="text-xl font-bold text-[#111827] mb-2">{project.title}</h3>
                  {project.client_name ? (
                    <p className="text-sm text-[#374151] mb-3">
                      <span className="text-[#6B7280]">Client:</span> {project.client_name}
                    </p>
                  ) : null}
                  <p className="text-[#6B7280] text-sm mb-4 line-clamp-3">
                    {project.description || 'No description available'}
                  </p>

                  {/* Timeline */}
                  {(project.start_date || project.end_date) && (
                    <div className="flex flex-wrap items-center gap-2 text-sm text-[#6B7280] mb-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {project.start_date && formatDate(project.start_date)}
                      {project.start_date && project.end_date && ' - '}
                      {project.end_date && formatDate(project.end_date)}
                    </div>
                  )}

                  {/* Team Members */}
                  {project.team_members && Array.isArray(project.team_members) && project.team_members.length > 0 && (
                    <div>
                      <p className="text-xs text-[#6B7280] mb-2">Team Members:</p>
                      <div className="flex flex-wrap gap-2">
                        {project.team_members.map((member, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-[#D1FAE5] text-[#0F766E] rounded-full text-xs font-medium"
                          >
                            {member.name} ({member.role})
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-7 flex flex-wrap items-center gap-3">
                    <Link
                      href={`/shridevfreelance/projectShowcase/${project.id}`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-lg border-2 border-[#10B981] text-[#10B981] text-sm font-medium hover:bg-[#D1FAE5] transition-colors"
                    >
                      View Details
                    </Link>

                    {project.live_website_url ? (
                      <a
                        href={project.live_website_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#10B981] text-white text-sm font-medium hover:bg-[#0F766E] transition-colors"
                      >
                        Visit Project
                      </a>
                    ) : null}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#0F766E] text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm opacity-80">
            © 2026 ShriDev Freelance. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
