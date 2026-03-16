'use client';

import { useState } from 'react';
import { TopNav } from './top-nav';
import { StatCard } from './stat-card';
import { RecapFeed } from './recap-feed';
import { Sidebar } from './sidebar';
import { EmptyState } from './empty-state';

export function Dashboard() {
  const [showEmpty, setShowEmpty] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <TopNav />

      <main className="px-6 py-8">
        {/* Hero Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard 
            label="Recaps Sent This Month"
            value="24"
            trend={{ points: [0.3, 0.5, 0.4, 0.7, 0.6, 0.8, 0.9], color: '#4f6ef7' }}
          />
          <StatCard 
            label="Time Saved This Week"
            value="11.4 hrs"
            subtitle="≈ $855 at $75/hr"
          />
          <StatCard 
            label="Client Confirmation Rate"
            value="94%"
            trend={{ points: [0.7, 0.75, 0.8, 0.85, 0.88, 0.9, 0.94], color: '#22c55e' }}
          />
          <StatCard 
            label="Pending Recaps"
            value="3"
            subtitle="2 await confirmation"
          />
        </div>

        {/* Main Content: 2-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: 65% - Recent Recaps */}
          <div className="lg:col-span-2">
            {showEmpty ? <EmptyState /> : <RecapFeed />}
          </div>

          {/* Right: 35% - Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
