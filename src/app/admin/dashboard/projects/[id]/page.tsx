'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, CardHeader, CardBody } from '@/components/ui';

interface Project {
  id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  media_drive_link: string | null;
  start_date: string | null;
  end_date: string | null;
  final_website_url: string | null;
  status: string;
}

interface ProjectMember {
  id: string;
  member_id: string;
  full_name: string;
  email: string;
  role: string | null;
  daily_working_hours: string;
  participation_confirmed: boolean;
}

interface Meeting {
  id: string;
  title: string;
  meeting_link: string | null;
  meeting_date: string;
  meeting_time: string;
  reminder_sent: boolean;
}

interface DailyReport {
  id: string;
  member_name: string;
  report_date: string;
  report_url: string;
  work_hours: string;
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProjectData();
  }, [params.id]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, membersRes, meetingsRes, reportsRes] = await Promise.all([
        fetch(`/api/admin/projects/${params.id}`),
        fetch(`/api/admin/projects/${params.id}/members`),
        fetch(`/api/admin/projects/${params.id}/meetings`),
        fetch(`/api/admin/projects/${params.id}/reports`),
      ]);

      if (projectRes.ok) {
        const data = await projectRes.json();
        setProject(data.project);
      }
      if (membersRes.ok) {
        const data = await membersRes.json();
        setMembers(data.members);
      }
      if (meetingsRes.ok) {
        const data = await meetingsRes.json();
        setMeetings(data.meetings);
      }
      if (reportsRes.ok) {
        const data = await reportsRes.json();
        setReports(data.reports);
      }
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!project) return;
    
    try {
      const response = await fetch(`/api/admin/projects/${project.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchProjectData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleCompleteProject = async () => {
    const finalUrl = prompt('Enter the final website URL:');
    if (!finalUrl || !project) return;

    try {
      const response = await fetch(`/api/admin/projects/${project.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ final_website_url: finalUrl }),
      });

      if (response.ok) {
        fetchProjectData();
      }
    } catch (error) {
      console.error('Error completing project:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium text-[#111827]">Project not found</h2>
        <Link href="/admin/dashboard/projects" className="text-[#10B981] mt-2 inline-block">
          ← Back to Projects
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'members', label: 'Team Members' },
    { id: 'meetings', label: 'Meetings' },
    { id: 'reports', label: 'Daily Reports' },
    { id: 'documents', label: 'Documents' },
    { id: 'payments', label: 'Payments' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <Link href="/admin/dashboard/projects" className="text-[#10B981] text-sm mb-2 inline-block">
            ← Back to Projects
          </Link>
          <h2 className="text-2xl font-bold text-[#111827]">{project.title}</h2>
          <p className="text-[#6B7280] mt-1">{project.description || 'No description'}</p>
        </div>
        <div className="flex gap-2">
          {project.status === 'active' && (
            <>
              <Button variant="outline" onClick={() => handleStatusChange('on_hold')}>
                Put on Hold
              </Button>
              <Button onClick={handleCompleteProject}>Complete Project</Button>
            </>
          )}
          {project.status === 'on_hold' && (
            <Button onClick={() => handleStatusChange('active')}>Resume Project</Button>
          )}
          {project.status === 'completed' && (
            <Link href={`/admin/dashboard/projects/${project.id}/certificates`}>
              <Button>Generate Certificates</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4 flex items-center gap-6">
        <div>
          <span className="text-sm text-[#6B7280]">Status</span>
          <p className={`font-medium ${
            project.status === 'completed' ? 'text-green-600' :
            project.status === 'active' ? 'text-blue-600' :
            project.status === 'on_hold' ? 'text-yellow-600' : 'text-gray-600'
          }`}>
            {project.status.replace('_', ' ').toUpperCase()}
          </p>
        </div>
        {project.start_date && (
          <div>
            <span className="text-sm text-[#6B7280]">Start Date</span>
            <p className="font-medium text-[#111827]">
              {new Date(project.start_date).toLocaleDateString()}
            </p>
          </div>
        )}
        {project.end_date && (
          <div>
            <span className="text-sm text-[#6B7280]">End Date</span>
            <p className="font-medium text-[#111827]">
              {new Date(project.end_date).toLocaleDateString()}
            </p>
          </div>
        )}
        {project.final_website_url && (
          <div>
            <span className="text-sm text-[#6B7280]">Live URL</span>
            <a href={project.final_website_url} target="_blank" rel="noopener noreferrer" 
               className="font-medium text-[#10B981] hover:underline">
              Visit Site →
            </a>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-[#D1FAE5]">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#10B981] text-[#10B981]'
                  : 'border-transparent text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Project Requirements</h3>
              </CardHeader>
              <CardBody>
                <p className="text-[#6B7280] whitespace-pre-wrap">
                  {project.requirements || 'No requirements specified'}
                </p>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Project Resources</h3>
              </CardHeader>
              <CardBody>
                {project.media_drive_link ? (
                  <a
                    href={project.media_drive_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#10B981] hover:underline"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Open Drive Link
                  </a>
                ) : (
                  <p className="text-[#6B7280]">No resources linked</p>
                )}
              </CardBody>
            </Card>
          </div>
        )}

        {activeTab === 'members' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold">Team Members ({members.length})</h3>
              <Link href={`/admin/dashboard/projects/${project.id}/assign-members`}>
                <Button variant="outline" size="sm">Manage Members</Button>
              </Link>
            </CardHeader>
            <CardBody className="p-0">
              {members.length === 0 ? (
                <p className="text-center text-[#6B7280] py-8">No members assigned</p>
              ) : (
                <div className="divide-y divide-[#D1FAE5]">
                  {members.map((member) => (
                    <div key={member.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#D1FAE5] rounded-full flex items-center justify-center">
                          <span className="text-[#10B981] font-medium">{member.full_name[0]}</span>
                        </div>
                        <div>
                          <p className="font-medium text-[#111827]">{member.full_name}</p>
                          <p className="text-sm text-[#6B7280]">{member.role || 'No role'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#6B7280]">{member.daily_working_hours} hrs/day</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          member.participation_confirmed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {member.participation_confirmed ? 'Confirmed' : 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {activeTab === 'meetings' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold">Scheduled Meetings</h3>
              <Link href={`/admin/dashboard/meetings/schedule?projectId=${project.id}`}>
                <Button size="sm">Schedule Meeting</Button>
              </Link>
            </CardHeader>
            <CardBody className="p-0">
              {meetings.length === 0 ? (
                <p className="text-center text-[#6B7280] py-8">No meetings scheduled</p>
              ) : (
                <div className="divide-y divide-[#D1FAE5]">
                  {meetings.map((meeting) => (
                    <div key={meeting.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#111827]">{meeting.title}</p>
                        <p className="text-sm text-[#6B7280]">
                          {new Date(meeting.meeting_date).toLocaleDateString()} at {meeting.meeting_time}
                        </p>
                      </div>
                      {meeting.meeting_link && (
                        <a
                          href={meeting.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#10B981] hover:underline text-sm"
                        >
                          Join Meeting →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {activeTab === 'reports' && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Daily Work Reports</h3>
            </CardHeader>
            <CardBody className="p-0">
              {reports.length === 0 ? (
                <p className="text-center text-[#6B7280] py-8">No reports submitted yet</p>
              ) : (
                <div className="divide-y divide-[#D1FAE5]">
                  {reports.map((report) => (
                    <div key={report.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-[#111827]">{report.member_name}</p>
                        <p className="text-sm text-[#6B7280]">
                          {new Date(report.report_date).toLocaleDateString()} • {report.work_hours} hours
                        </p>
                      </div>
                      <a
                        href={report.report_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#10B981] hover:underline text-sm"
                      >
                        View Report →
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        )}

        {activeTab === 'documents' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Confirmation Reports</h3>
              </CardHeader>
              <CardBody>
                <Link href={`/admin/dashboard/projects/${project.id}/generate-confirmation`}>
                  <Button variant="outline" className="w-full">
                    Generate Confirmation Reports
                  </Button>
                </Link>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Deliverables</h3>
              </CardHeader>
              <CardBody>
                <p className="text-[#6B7280] text-center py-4">
                  Deliverables will appear here once uploaded by team members.
                </p>
              </CardBody>
            </Card>
          </div>
        )}

        {activeTab === 'payments' && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-semibold">Payment Tracking</h3>
              <Link href={`/admin/dashboard/projects/${project.id}/payments`}>
                <Button variant="outline" size="sm">Manage Payments</Button>
              </Link>
            </CardHeader>
            <CardBody>
              <p className="text-[#6B7280] text-center py-4">
                Set up and track payments for team members.
              </p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
