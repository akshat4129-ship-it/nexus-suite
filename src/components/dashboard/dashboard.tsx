'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { toast } from 'sonner';
import { Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TopNav } from './top-nav';
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNav />

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

        {/* Pipeline Controls */}
        <div className="flex justify-end mb-8" aria-label="Pipeline Controls">
          <Button 
            onClick={() => {
              toast.promise(new Promise(r => setTimeout(r, 4000)), {
                loading: 'Running pipeline: Processing meeting -> Generating recap -> Syncing CRM...',
                success: 'Pipeline complete! Recap sent to HubSpot and NovaTech.',
                error: 'Pipeline failed',
              });
            }}
            className="btn-premium flex items-center gap-2 px-6 py-6 text-lg shadow-xl hover:scale-105 transition-transform"
            aria-label="Run Full Pipeline Test"
            aria-busy={isLoading}
          >
            <Activity className="h-5 w-5" aria-hidden="true" />
            Test Full Pipeline
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
