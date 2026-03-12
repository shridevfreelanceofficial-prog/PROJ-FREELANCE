'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardHeader, CardBody } from '@/components/ui';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalMembers: number;
  pendingPayments: number;
  upcomingMeetings: number;
}

interface AdminUser {
  id: string;
  name: string | null;
  email: string | null;
  username: string;
  is_profile_complete: boolean;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalMembers: 0,
    pendingPayments: 0,
    upcomingMeetings: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
    fetchStats();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/admin/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        
        // Redirect to profile setup if not complete
        if (!data.user.is_profile_complete) {
          router.push('/admin/dashboard/profile-setup');
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
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

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, color: 'bg-[#10B981]', href: '/admin/dashboard/projects' },
    { label: 'Active Projects', value: stats.activeProjects, color: 'bg-[#0F766E]', href: '/admin/dashboard/projects' },
    { label: 'Team Members', value: stats.totalMembers, color: 'bg-[#F59E0B]', href: '/admin/dashboard/members' },
    { label: 'Pending Payments', value: stats.pendingPayments, color: 'bg-[#DC2626]', href: '/admin/dashboard/payments' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#10B981] to-[#0F766E] rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name || user?.username}!
        </h2>
        <p className="opacity-90">
          Here's an overview of your freelancing projects and team activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Link key={index} href={stat.href}>
            <Card variant="elevated" className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardBody className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-[#6B7280] mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-[#111827]">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <span className="text-white text-xl font-bold">{stat.value}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#111827]">Quick Actions</h3>
          </CardHeader>
          <CardBody className="space-y-3">
            <Link
              href="/admin/dashboard/members/create"
              className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg hover:bg-[#D1FAE5] transition-colors"
            >
              <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#111827]">Add New Member</p>
                <p className="text-sm text-[#6B7280]">Create a new team member account</p>
              </div>
            </Link>
            <Link
              href="/admin/dashboard/projects/create"
              className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg hover:bg-[#D1FAE5] transition-colors"
            >
              <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#111827]">Create New Project</p>
                <p className="text-sm text-[#6B7280]">Start a new freelancing project</p>
              </div>
            </Link>
            <Link
              href="/admin/dashboard/meetings/schedule"
              className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-lg hover:bg-[#D1FAE5] transition-colors"
            >
              <div className="w-10 h-10 bg-[#D1FAE5] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[#111827]">Schedule Meeting</p>
                <p className="text-sm text-[#6B7280]">Set up a team meeting</p>
              </div>
            </Link>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-[#111827]">Recent Activity</h3>
          </CardHeader>
          <CardBody>
            <div className="space-y-4">
              <p className="text-[#6B7280] text-center py-8">
                No recent activity to display.
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
