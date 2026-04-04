import Link from 'next/link';
import { notFound } from 'next/navigation';
import { queryOne } from '@/lib/db';
import Reveal from '@/components/animations/Reveal';

interface ProjectShowcase {
  id: string;
  title: string;
  client_name: string | null;
  description: string | null;
  requirements: string | null;
  media_drive_link: string | null;
  live_website_url: string | null;
  daily_working_hours: number | null;
  cover_image_url: string | null;
  start_date: Date | null;
  end_date: Date | null;
  team_members: any | null; // usually an array of names or JSON
  is_visible: boolean;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const unwrappedParams = await params;
  const project = await queryOne<ProjectShowcase>(
    'SELECT * FROM project_showcase WHERE id = $1',
    [unwrappedParams.id]
  );

  if (!project) {
    notFound();
  }

  const timeline = project.start_date && project.end_date 
    ? `${new Date(project.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - ${new Date(project.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
    : "Ongoing or Completed";

  // Parse team members if it's a JSON array of objects or strings
  let parsedTeam: any[] = [];
  try {
    if (project.team_members) {
      if (typeof project.team_members === 'string') {
        parsedTeam = JSON.parse(project.team_members);
      } else if (Array.isArray(project.team_members)) {
        parsedTeam = project.team_members;
      }
    }
  } catch (error) {
    // ignore
  }

  return (
    <div className="min-h-screen bg-[#F4FFFA] text-[#0F172A] selection:bg-[#00E6A8]/30 selection:text-black pt-[100px] overflow-x-hidden w-full max-w-[100vw]">
      
      {/* 🚀 Header Actions */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full pt-4 pb-6 flex items-center justify-between">
        <Link href="/projects" className="inline-flex items-center gap-2 text-[#0F172A] hover:text-[#00C896] transition-colors font-bold text-sm tracking-wide uppercase">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back
        </Link>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full border border-[#00C896]/30 bg-[#00C896]/10 text-[#0F766E] font-bold text-xs tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C896] mr-2 animate-pulse"></span>
            Featured
          </div>
          {project.client_name && (
            <div className="hidden sm:inline-flex items-center px-4 py-1.5 rounded-full border border-[#0F172A]/10 bg-white text-[#0F172A] font-bold text-xs tracking-wider shadow-sm">
              Client: {project.client_name}
            </div>
          )}
        </div>
      </div>

      {/* 🚀 Uncropped Responsive Image Banner */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
        <section className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden bg-[#0F172A] shadow-xl border border-black/5">
          {project.cover_image_url ? (
            <img 
              src={`/api/public/showcase-cover?url=${encodeURIComponent(project.cover_image_url)}`}
              alt={project.title}
              className="w-full h-auto block object-contain"
            />
          ) : (
            <div className="w-full aspect-[21/9] bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-[#00C896]/20 via-[#0F172A] to-[#0F172A]" />
          )}
        </section>
      </div>

      {/* 🚀 Huge Title Block Below Image */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full mt-10 mb-4">
        <Reveal>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            {project.title}
          </h1>
        </Reveal>
      </div>

      {/* 📖 Deep Read Content Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-8 relative z-30">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Main Story & Text (Left) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-[#00C896]/5 border border-[#00E6A8]/20">
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00C896]/20 to-[#00E6A8]/20 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#00C896]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-[#0F172A] tracking-tight">Project Overview</h2>
              </div>
              
              <div className="prose prose-lg prose-slate max-w-none text-gray-600 leading-loose">
                {project.description ? (
                  project.description.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
                  ))
                ) : (
                  <p className="italic text-gray-400">No description provided for this project.</p>
                )}
              </div>
            </div>

            {project.requirements && (
              <div className="bg-[#0F172A] rounded-[2rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00E6A8]/10 rounded-full blur-[80px] pointer-events-none" />
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                  <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#00E6A8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Technical Requirements</h2>
                </div>
                
                <div className="text-white/70 text-lg leading-loose space-y-4">
                  {project.requirements.split('\n').filter(r => r.trim() !== '').map((req, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 w-full min-w-0">
                      <span className="text-[#00C896] font-black shrink-0 mt-1">→</span>
                      <span className="text-white/90 flex-1 min-w-0 break-words">{req.replace(/^[-•]\s*/, '')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Metrics (Right) */}
          <div className="lg:col-span-4 space-y-8">
            <Reveal delay={0.3} y={40}>
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-[#00C896]/5 border border-gray-100 sticky top-32">
                <h4 className="text-2xl font-bold text-[#0F172A] mb-8 pb-6 border-b border-gray-100">Project Data</h4>
                
                <div className="space-y-8">
                  {project.client_name && (
                    <div className="group">
                      <p className="text-sm text-gray-400 font-bold mb-2 uppercase tracking-widest">Client</p>
                      <p className="font-semibold text-lg text-[#0F172A] group-hover:text-[#00C896] transition-colors">{project.client_name}</p>
                    </div>
                  )}

                  <div className="group">
                    <p className="text-sm text-gray-400 font-bold mb-2 uppercase tracking-widest">Timeline</p>
                    <p className="font-semibold text-lg text-[#0F172A]">{timeline}</p>
                  </div>

                  {parsedTeam.length > 0 && (
                    <div className="group">
                      <p className="text-sm text-gray-400 font-bold mb-3 uppercase tracking-widest">Team Members</p>
                      <div className="flex flex-col gap-2">
                        {parsedTeam.map((member, i) => (
                          <div key={i} className="flex items-center gap-3 px-4 py-2 bg-[#F4FFFA] rounded-xl border border-[#00C896]/10">
                            <div className="w-8 h-8 rounded-full bg-[#00C896]/20 flex items-center justify-center text-[#00C896] font-bold text-xs">
                              {/* Grab first letter of name if object has name, else string itself */}
                              {typeof member === 'object' && member.name ? member.name[0] : (typeof member === 'string' ? member[0] : 'U')}
                            </div>
                            <p className="text-sm font-semibold text-gray-700">
                              {typeof member === 'object' && member.name ? member.name : (typeof member === 'string' ? member : 'Unknown')}
                              {typeof member === 'object' && member.role && <span className="text-gray-400 font-normal ml-2">({member.role})</span>}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {project.live_website_url && (
                  <div className="mt-10 pt-8 border-t border-gray-100">
                    <a 
                      href={project.live_website_url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full inline-flex items-center justify-between px-6 py-4 rounded-xl bg-gradient-to-r from-[#00C896] to-[#00E6A8] text-[#0F172A] font-black hover:shadow-lg hover:shadow-[#00C896]/30 active:scale-95 transition-all duration-300"
                    >
                      Visit Live Website
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </Reveal>
          </div>
          
        </div>
      </section>

      <footer className="bg-[#0F172A] text-white py-12 relative z-10 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-6 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00C896] to-[#00E6A8]" />
          </div>
          <p className="text-sm font-medium text-white/50">© {new Date().getFullYear()} ShriDev Freelance. Crafted for the modern web.</p>
        </div>
      </footer>
    </div>
  );
}
