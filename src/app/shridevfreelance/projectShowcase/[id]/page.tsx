import { queryOne } from '@/lib/db';
import Link from 'next/link';

interface ShowcaseProject {
  id: string;
  title: string;
  client_name: string | null;
  description: string | null;
  requirements: string | null;
  cover_image_url: string | null;
  live_website_url: string | null;
  daily_working_hours: string | null;
  start_date: string | null;
  end_date: string | null;
  team_members: Array<{ name: string; role: string | null }> | null;
}

function formatDate(date: string | null) {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString('en-GB');
}

export default async function ShowcaseProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = await queryOne<ShowcaseProject>(
    `SELECT id, title, client_name, description, requirements, cover_image_url, live_website_url,
            daily_working_hours, start_date, end_date, team_members
     FROM project_showcase
     WHERE id = $1 AND is_visible = true`,
    [id]
  );

  if (!project) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <header className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <Link href="/shridevfreelance/projectShowcase" className="text-sm font-medium text-[#10B981] hover:underline">
              ← Back to Showcase
            </Link>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="rounded-xl bg-white shadow-sm border p-8 text-center">
            <h1 className="text-2xl font-bold text-[#111827]">Project not found</h1>
            <p className="mt-2 text-[#6B7280]">This project is not available or not published.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/shridevfreelance/projectShowcase" className="text-sm font-medium text-[#10B981] hover:underline">
            ← Back to Showcase
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
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="rounded-2xl overflow-hidden bg-white shadow-sm border">
          <div className="h-72 bg-gradient-to-br from-[#10B981] to-[#0F766E] relative">
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
            ) : null}
          </div>

          <div className="p-8">
            <h1 className="text-3xl font-bold text-[#111827]">{project.title}</h1>

            {project.client_name ? (
              <p className="mt-2 text-sm text-[#374151]">
                <span className="text-[#6B7280]">Client:</span> {project.client_name}
              </p>
            ) : null}

            {project.description ? (
              <p className="mt-3 text-[#374151] leading-relaxed">{project.description}</p>
            ) : (
              <p className="mt-3 text-[#6B7280]">No description available.</p>
            )}

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border bg-[#F8FAFC] p-5">
                <p className="text-xs uppercase tracking-wide text-[#6B7280]">Duration</p>
                <p className="mt-1 text-sm font-medium text-[#111827]">
                  {formatDate(project.start_date)} - {formatDate(project.end_date)}
                </p>
              </div>

              <div className="rounded-xl border bg-[#F8FAFC] p-5">
                <p className="text-xs uppercase tracking-wide text-[#6B7280]">Client</p>
                <p className="mt-1 text-sm font-medium text-[#111827]">{project.client_name || 'N/A'}</p>
              </div>

              <div className="rounded-xl border bg-[#F8FAFC] p-5">
                <p className="text-xs uppercase tracking-wide text-[#6B7280]">Daily Working Hours</p>
                <p className="mt-1 text-sm font-medium text-[#111827]">{project.daily_working_hours || 'N/A'}</p>
              </div>

              <div className="rounded-xl border bg-[#F8FAFC] p-5">
                <p className="text-xs uppercase tracking-wide text-[#6B7280]">Live Website URL</p>
                {project.live_website_url ? (
                  <a
                    href={project.live_website_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-sm font-medium text-[#10B981] hover:underline break-all"
                  >
                    {project.live_website_url}
                  </a>
                ) : (
                  <p className="mt-1 text-sm font-medium text-[#111827]">N/A</p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-[#111827]">Requirements</h2>
              {project.requirements ? (
                <p className="mt-2 text-[#374151] leading-relaxed whitespace-pre-wrap">{project.requirements}</p>
              ) : (
                <p className="mt-2 text-[#6B7280]">No requirements provided.</p>
              )}
            </div>

            <div className="mt-8">
              <h2 className="text-lg font-semibold text-[#111827]">Team Members</h2>
              {project.team_members && Array.isArray(project.team_members) && project.team_members.length > 0 ? (
                <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.team_members.map((m, idx) => (
                    <div key={idx} className="rounded-xl border bg-white p-4">
                      <p className="font-medium text-[#111827]">{m.name}</p>
                      <p className="text-sm text-[#6B7280]">{m.role || 'Team Member'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-[#6B7280]">No team members listed.</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
