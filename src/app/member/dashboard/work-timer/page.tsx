'use client';

import { useEffect, useState, useRef } from 'react';
import { Button, Card, CardHeader, CardBody } from '@/components/ui';

interface Project {
  id: string;
  title: string;
}

interface WorkSession {
  id: string;
  project_id: string;
  project_title: string;
  status: string;
  start_time: string | null;
  pause_time: string | null;
  total_duration_seconds: number;
}

export default function WorkTimerPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeSession, setActiveSession] = useState<WorkSession | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeSessionFetchIdRef = useRef(0);

  useEffect(() => {
    fetchProjects();
    fetchActiveSession();
  }, []);

  useEffect(() => {
    if (activeSession && activeSession.status === 'running') {
      // Set immediately so the UI changes without waiting for the first interval tick
      const startTime = new Date(activeSession.start_time!).getTime();
      const now = Date.now();
      const initialElapsed = Math.floor((now - startTime) / 1000) + activeSession.total_duration_seconds;
      setElapsedSeconds(initialElapsed);

      intervalRef.current = setInterval(() => {
        const st = new Date(activeSession.start_time!).getTime();
        const n = Date.now();
        const e = Math.floor((n - st) / 1000) + activeSession.total_duration_seconds;
        setElapsedSeconds(e);
      }, 1000);
    } else if (activeSession) {
      setElapsedSeconds(activeSession.total_duration_seconds);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeSession]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/member/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects.filter((p: Project & { status: string }) => p.status === 'active'));
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const fetchActiveSession = async () => {
    const fetchId = ++activeSessionFetchIdRef.current;
    try {
      const response = await fetch('/api/member/work-session/active');
      if (response.ok) {
        const data = await response.json();
        // Avoid overwriting a newer UI state (e.g. user pressed Start) with an older response
        if (fetchId !== activeSessionFetchIdRef.current) return;

        setActiveSession(data.session);
        if (data.session) {
          setSelectedProject(data.session.project_id);
        }
      }
    } catch (error) {
      console.error('Error fetching active session:', error);
    } finally {
      if (fetchId === activeSessionFetchIdRef.current) {
        setLoading(false);
      }
    }
  };

  const handleStartWork = async () => {
    if (!selectedProject) return;
    setActionLoading(true);

    try {
      const response = await fetch('/api/member/work-session/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: selectedProject }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.session) {
          setActiveSession(data.session);
          setSelectedProject(data.session.project_id);
        } else {
          await fetchActiveSession();
        }
      }
    } catch (error) {
      console.error('Error starting work:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePause = async () => {
    if (!activeSession) return;
    setActionLoading(true);

    try {
      const response = await fetch('/api/member/work-session/pause', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: activeSession.id }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.session) {
          setActiveSession(data.session);
        } else {
          await fetchActiveSession();
        }
      }
    } catch (error) {
      console.error('Error pausing work:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async () => {
    if (!activeSession) return;
    setActionLoading(true);

    try {
      const response = await fetch('/api/member/work-session/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: activeSession.id }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.session) {
          setActiveSession(data.session);
        } else {
          await fetchActiveSession();
        }
      }
    } catch (error) {
      console.error('Error resuming work:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleStop = async () => {
    if (!activeSession) return;
    if (!confirm('Are you sure you want to stop this work session?')) return;
    setActionLoading(true);

    try {
      const response = await fetch('/api/member/work-session/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: activeSession.id }),
      });

      if (response.ok) {
        setActiveSession(null);
        setElapsedSeconds(0);
        setSelectedProject('');
        await fetchActiveSession();
      }
    } catch (error) {
      console.error('Error stopping work:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#10B981]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Timer Display */}
      <Card>
        <CardBody className="p-8 text-center">
          <div className="mb-6">
            <p className="text-sm text-[#6B7280] mb-2">
              {activeSession ? activeSession.project_title : 'Select a project to start'}
            </p>
            <div className="text-6xl font-mono font-bold text-[#111827]">
              {formatTime(elapsedSeconds)}
            </div>
            {activeSession && (
              <div className="mt-2">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  activeSession.status === 'running' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {activeSession.status === 'running' && (
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  )}
                  {activeSession.status === 'running' ? 'Working' : 'Paused'}
                </span>
              </div>
            )}
          </div>

          {!activeSession ? (
            <div className="space-y-4">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#10B981] focus:border-[#10B981] focus:outline-none text-center"
              >
                <option value="">Select a project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleStartWork}
                disabled={!selectedProject}
                size="lg"
                className="w-full"
                isLoading={actionLoading}
              >
                Start Working
              </Button>
            </div>
          ) : (
            <div className="flex gap-3 justify-center">
              {activeSession.status === 'running' ? (
                <Button
                  variant="outline"
                  onClick={handlePause}
                  size="lg"
                  isLoading={actionLoading}
                >
                  Pause
                </Button>
              ) : (
                <Button
                  onClick={handleResume}
                  size="lg"
                  isLoading={actionLoading}
                >
                  Continue
                </Button>
              )}
              <Button
                variant="danger"
                onClick={handleStop}
                size="lg"
                isLoading={actionLoading}
              >
                Stop
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-[#111827]">How to Use</h3>
        </CardHeader>
        <CardBody>
          <ul className="space-y-2 text-[#6B7280]">
            <li className="flex items-start gap-2">
              <span className="text-[#10B981] mt-1">•</span>
              Select a project from the dropdown and click "Start Working"
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#10B981] mt-1">•</span>
              Pause the timer when taking breaks
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#10B981] mt-1">•</span>
              Stop the timer when you finish your work session
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#10B981] mt-1">•</span>
              The admin will be notified of your work progress
            </li>
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}
