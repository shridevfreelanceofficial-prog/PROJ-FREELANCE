'use client';

import { useEffect, useState } from 'react';
import { Card, CardBody } from '@/components/ui';

interface Meeting {
  id: string;
  title: string;
  project_id: string;
  project_name: string;
  meeting_date: string;
  meeting_time: string;
  meeting_link: string | null;
  reminder_sent: boolean;
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await fetch('/api/member/meetings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setMeetings(data.meetings || []);
        }
      } catch (error) {
        console.error('Failed to fetch meetings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const parseMeetingParts = (date: string, time: string) => {
    const datePart = typeof date === 'string' ? date.split('T')[0] : '';
    let timePart = typeof time === 'string' ? time : '';

    if (timePart.includes('T')) {
      timePart = timePart.split('T')[1] || '';
    }

    timePart = timePart.trim();

    if (timePart.length >= 5) {
      timePart = timePart.slice(0, 5);
    }

    const [hhRaw, mmRaw] = timePart.split(':');
    const hh = Number(hhRaw);
    const mm = Number(mmRaw);

    if (!datePart || Number.isNaN(hh) || Number.isNaN(mm)) {
      return { datePart: '', hh: 0, mm: 0, ok: false };
    }

    return { datePart, hh, mm, ok: true };
  };

  const toMeetingDateTime = (date: string, time: string): Date | null => {
    const { datePart, hh, mm, ok } = parseMeetingParts(date, time);
    if (!ok) return null;

    const d = new Date(`${datePart}T00:00:00`);
    if (Number.isNaN(d.getTime())) return null;

    d.setHours(hh, mm, 0, 0);
    return d;
  };

  const normalizeMeetingLink = (link: string): string => {
    const trimmed = link.trim();
    if (!trimmed) return trimmed;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const formatDateTime = (date: string, time: string) => {
    const dt = toMeetingDateTime(date, time);
    if (!dt) return 'Invalid Date';
    return dt.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUpcoming = (date: string, time: string) => {
    const dt = toMeetingDateTime(date, time);
    if (!dt) return false;
    return dt.getTime() > Date.now();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading meetings...</div>
      </div>
    );
  }

  const upcomingMeetings = meetings.filter(m => isUpcoming(m.meeting_date, m.meeting_time));
  const pastMeetings = meetings.filter(m => !isUpcoming(m.meeting_date, m.meeting_time));

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meetings</h1>
          <p className="mt-2 text-gray-600">View and join meetings for your assigned projects</p>
        </div>

        {/* Upcoming Meetings */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Meetings</h2>
          {upcomingMeetings.length === 0 ? (
            <Card>
              <CardBody className="p-6 text-center">
                <div className="text-gray-500">No upcoming meetings scheduled</div>
              </CardBody>
            </Card>
          ) : (
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <Card key={meeting.id} className="border-l-4 border-l-green-500">
                  <CardBody className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">Project: {meeting.project_name}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          📅 {formatDateTime(meeting.meeting_date, meeting.meeting_time)}
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-4">
                        {meeting.meeting_link ? (
                          <a
                            href={normalizeMeetingLink(meeting.meeting_link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto"
                          >
                            Join Meeting
                          </a>
                        ) : (
                          <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-md">
                            No meeting link
                          </div>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Past Meetings */}
        {pastMeetings.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Past Meetings</h2>
            <div className="space-y-4">
              {pastMeetings.map((meeting) => (
                <Card key={meeting.id} className="opacity-75">
                  <CardBody className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-700">{meeting.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">Project: {meeting.project_name}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          📅 {formatDateTime(meeting.meeting_date, meeting.meeting_time)}
                        </p>
                      </div>
                      <div className="mt-4 sm:mt-0 sm:ml-4">
                        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-md">
                          {meeting.meeting_link ? 'Meeting Ended' : 'No Link'}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
