'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardBody } from '@/components/ui';

interface Project {
  id: string;
  title: string;
  description: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  participation_confirmed: boolean;
}

interface WorkSession {
  id: string;
  project_id: string;
  project_title: string;
  status: string;
  start_time: string | null;
  total_duration_seconds: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export default function MemberDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeSession, setActiveSession] = useState<WorkSession | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, sessionRes, notificationsRes] = await Promise.all([
        fetch('/api/member/projects'),
        fetch('/api/member/work-session/active'),
        fetch('/api/member/notifications'),
      ]);

      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data.projects);
      }
      if (sessionRes.ok) {
        const data = await sessionRes.json();
        setActiveSession(data.session);
      }
      if (notificationsRes.ok) {
        const data = await notificationsRes.json();
        setNotifications(data.notifications.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  const activeProjects = projects.filter(p => p.status === 'active');
  const pendingConfirmations = projects.filter(p => !p.participation_confirmed);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#10B981] to-[#0F766E] rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h2>
        <p className="opacity-90">
          Track your projects, manage work hours, and collaborate with your team.
        </p>
      </div>

      {/* Pending Confirmations Alert */}
      {pendingConfirmations.length > 0 && (
        <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-[#F59E0B] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-1.964-1.333-2.732 0L3.732 16.5c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-medium text-[#92400E]">Action Required</h3>
              <p className="text-sm text-[#92400E] mt-1">
                You have {pendingConfirmations.length} project(s) awaiting your confirmation.
              </p>
              <Link href="/member/dashboard/projects" className="text-sm text-[#F59E0B] font-medium hover:underline mt-2 inline-block">
                View Projects →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Active Work Session */}
      {activeSession && (
        <Card variant="bordered" className="border-[#10B981]">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#10B981] rounded-full animate-pulse"></div>
                <div>
                  <p className="font-medium text-[#111827]">Currently Working</p>
                  <p className="text-sm text-[#6B7280]">{activeSession.project_title}</p>
                </div>
              </div>
              <Link href="/member/dashboard/work-timer">
                <button className="px-4 py-2 bg-[#DC2626] text-white rounded-lg text-sm font-medium hover:bg-red-700">
                  Stop Timer
                </button>
              </Link>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-3xl font-bold text-[#10B981]">{activeProjects.length}</p>
            <p className="text-sm text-[#6B7280] mt-1">Active Projects</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-3xl font-bold text-[#0F766E]">{projects.length}</p>
            <p className="text-sm text-[#6B7280] mt-1">Total Projects</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-3xl font-bold text-[#F59E0B]">{notifications.filter(n => !n.is_read).length}</p>
            <p className="text-sm text-[#6B7280] mt-1">New Notifications</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="p-4 text-center">
            <p className="text-3xl font-bold text-[#111827]">{pendingConfirmations.length}</p>
            <p className="text-sm text-[#6B7280] mt-1">Pending Actions</p>
          </CardBody>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* My Projects */}
        <Card>
          <CardBody className="p-0">
            <div className="px-6 py-4 border-b border-[#D1FAE5] flex justify-between items-center">
              <h3 className="text-lg font-semibold text-[#111827]">My Projects</h3>
              <Link href="/member/dashboard/projects" className="text-sm text-[#10B981] hover:underline">
                View All
              </Link>
            </div>
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#6B7280]">No projects assigned yet</p>
              </div>
            ) : (
              <div className="divide-y divide-[#D1FAE5]">
                {projects.slice(0, 4).map((project) => (
                  <Link
                    key={project.id}
                    href={`/member/dashboard/projects/${project.id}`}
                    className="block p-4 hover:bg-[#F8FAFC] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-[#111827]">{project.title}</p>
                        <p className="text-sm text-[#6B7280] mt-1 line-clamp-1">
                          {project.description || 'No description'}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        project.status === 'active' ? 'bg-green-100 text-green-800' :
                        project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    {!project.participation_confirmed && (
                      <span className="inline-block mt-2 text-xs text-[#F59E0B] font-medium">
                        ⚠️ Confirmation Required
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardBody className="p-0">
            <div className="px-6 py-4 border-b border-[#D1FAE5]">
              <h3 className="text-lg font-semibold text-[#111827]">Recent Notifications</h3>
            </div>
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#6B7280]">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-[#D1FAE5]">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 ${!notification.is_read ? 'bg-[#D1FAE5]/30' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-[#10B981] rounded-full mt-2 flex-shrink-0"></div>
                      )}
                      <div className={notification.is_read ? 'ml-5' : ''}>
                        <p className="font-medium text-[#111827] text-sm">{notification.title}</p>
                        <p className="text-sm text-[#6B7280] mt-1">{notification.message}</p>
                        <p className="text-xs text-[#6B7280] mt-2">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardBody className="p-6">
          <h3 className="text-lg font-semibold text-[#111827] mb-4">Quick Actions</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href="/member/dashboard/work-timer"
              className="flex items-center gap-3 p-4 bg-[#F8FAFC] rounded-lg hover:bg-[#D1FAE5] transition-colors"
            >
              <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#111827]">Work Timer</p>
                <p className="text-sm text-[#6B7280]">Track your work hours</p>
              </div>
            </Link>
            <Link
              href="/member/dashboard/reports"
              className="flex items-center gap-3 p-4 bg-[#F8FAFC] rounded-lg hover:bg-[#D1FAE5] transition-colors"
            >
              <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#111827]">Daily Reports</p>
                <p className="text-sm text-[#6B7280]">Submit your work reports</p>
              </div>
            </Link>
            <Link
              href="/member/dashboard/certificates"
              className="flex items-center gap-3 p-4 bg-[#F8FAFC] rounded-lg hover:bg-[#D1FAE5] transition-colors"
            >
              <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 00-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 00-4.438 0 3.42 3.42 0 00-1.946.806 3.42 3.42 0 00-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 003.138-3.138z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#111827]">Certificates</p>
                <p className="text-sm text-[#6B7280]">View your certificates</p>
              </div>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
