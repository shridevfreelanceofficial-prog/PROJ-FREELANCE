'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardHeader, CardBody } from '@/components/ui';

interface Meeting {
  id: string;
  title: string;
  project_name: string;
  project_id: string;
  meeting_date: string;
  meeting_time: string;
  meeting_link: string | null;
  reminder_sent: boolean;
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await fetch('/api/admin/meetings');
      if (response.ok) {
        const data = await response.json();
        setMeetings(data.meetings);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">Meetings</h1>
          <p className="text-[#6B7280]">Manage all project meetings</p>
        </div>
        <Link href="/admin/dashboard/meetings/schedule">
          <Button>Schedule Meeting</Button>
        </Link>
      </div>

      <Card>
        <CardBody className="p-0">
          {meetings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#6B7280]">No meetings scheduled yet.</p>
              <Link href="/admin/dashboard/meetings/schedule">
                <Button className="mt-4">Schedule First Meeting</Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#D1FAE5]">
              {meetings.map((meeting) => (
                <div key={meeting.id} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-[#111827]">{meeting.title}</p>
                    <p className="text-sm text-[#6B7280]">Project: {meeting.project_name}</p>
                    <p className="text-sm text-[#6B7280]">
                      {new Date(meeting.meeting_date).toLocaleDateString()} at {meeting.meeting_time}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      meeting.reminder_sent ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {meeting.reminder_sent ? 'Reminder Sent' : 'Scheduled'}
                    </span>
                    {meeting.meeting_link && (
                      <a
                        href={meeting.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#10B981] hover:underline text-sm"
                      >
                        Join →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
