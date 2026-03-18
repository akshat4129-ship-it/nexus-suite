'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from './stat-card';
import { RecapFeed } from './recap-feed';
import { Sidebar } from './sidebar';
import { EmptyState } from './empty-state';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Dashboard() {
  const [showEmpty, setShowEmpty] = useState(false);

  const { data: stats, error, isLoading } = useSWR('/api/stats', fetcher, {
    refreshInterval: 30000,
    onError: (err) => {
      toast.error('Failed to load dashboard stats');
      console.error(err);
    }
  });

  const [isRunningPipeline, setIsRunningPipeline] = useState(false);

  const runPipeline = async () => {
    setIsRunningPipeline(true);
    try {
      // Get all meetings and find one to test with
      const meetingsRes = await fetch('/api/meetings');
      const meetingsData = await meetingsRes.json();
      const testMeeting = meetingsData.data.find((m: any) => m.status === 'COMPLETED' || m.status === 'SCHEDULED');
      
      if (!testMeeting) {
        toast.error('No compatible meeting nodes found in cluster');
        return;
      }

      toast.promise(
        fetch('/api/queues/meeting-ended', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meetingId: testMeeting.id })
        }).then(res => {
          if (!res.ok) throw new Error();
          return res.json();
        }),
        {
          loading: `Initializing pipeline for Node: ${testMeeting.title}...`,
          success: 'Pipeline job queued. Processing in background.',
          error: 'Pipeline injection failed',
        }
      );
    } catch (e) {
      toast.error('Terminal error: Cloud sync failed');
    } finally {
      setIsRunningPipeline(false);
    }
  };

  return (
    <div className="min-h-screen">
      <main className="px-6 py-8" role="main" aria-label="Dashboard Overview">
        {/* Hero Metrics */}
        <section aria-label="Key Performance Indicators" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            label="Recaps Sent This Month"
            value={isLoading ? "..." : (stats?.recaps_sent_this_month ?? "0")}
            trend={{ points: [0.3, 0.5, 0.4, 0.7, 0.6, 0.8, 0.9], color: '#4f6ef7' }}
          />
          <StatCard 
            label="Time Saved This Week"
            value={isLoading ? "..." : `${stats?.time_saved_this_week_hours ?? 0} hrs`}
            subtitle={`≈ $${Math.round((stats?.time_saved_this_week_hours ?? 0) * 75)} at $75/hr`}
          />
          <StatCard 
            label="Client Confirmation Rate"
            value={isLoading ? "..." : `${stats?.confirmation_rate_percent ?? 0}%`}
            trend={{ points: [0.7, 0.75, 0.8, 0.85, 0.88, 0.9, 0.94], color: '#22c55e' }}
          />
          <StatCard 
            label="Pending Recaps"
            value={isLoading ? "..." : (stats?.pending_recaps_count ?? "0")}
            subtitle="Require review"
          />
        </section>

        <div className="flex justify-end mb-8" aria-label="Pipeline Controls">
          <Button 
            onClick={runPipeline}
            disabled={isRunningPipeline}
            className="btn-premium flex items-center gap-2 px-6 py-6 text-lg shadow-xl hover:scale-105 transition-transform"
            aria-label="Run Full Pipeline Test"
            aria-busy={isRunningPipeline}
          >
            <Activity className={`h-5 w-5 ${isRunningPipeline ? 'animate-spin' : ''}`} aria-hidden="true" />
            {isRunningPipeline ? 'Initializing...' : 'Test Full Pipeline'}
          </Button>
        </div>

        {/* Main Content: 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: 65% - Recent Recaps */}
          <section className="lg:col-span-2" aria-label="Recent Recaps Feed">
            {showEmpty ? <EmptyState /> : <RecapFeed />}
          </section>

          {/* Right: 35% - Sidebar */}
          <aside className="lg:col-span-1" aria-label="Upcoming Meetings Sidebar">
            <Sidebar />
          </aside>
        </div>
      </main>
    </div>
  );
}
