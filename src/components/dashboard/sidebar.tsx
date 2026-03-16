'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UPCOMING = [
  { id: 1, title: 'Strategy Sync with Acme', time: 'Today, 2:00 PM', autoRecap: true },
  { id: 2, title: 'Product Demo Prep', time: 'Tomorrow, 10:00 AM', autoRecap: false },
  { id: 3, title: 'Client Review Q1', time: 'Wed, Mar 19', autoRecap: true },
  { id: 4, title: 'Team Standdown', time: 'Thu, Mar 20', autoRecap: false },
  { id: 5, title: 'Board Updates', time: 'Fri, Mar 21', autoRecap: true },
];

export function Sidebar() {
  return (
    <div className="space-y-6">
      {/* Upcoming Meetings */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Meetings</h3>
        <div className="space-y-3">
          {UPCOMING.map((meeting) => (
            <div key={meeting.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition-colors">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{meeting.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{meeting.time}</p>
              </div>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={meeting.autoRecap} className="w-4 h-4 accent-primary rounded" />
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <Button className="w-full justify-start gap-2 bg-primary text-white hover:bg-primary/90 h-10">
            <Plus className="h-4 w-4" />
            Add Client
          </Button>
          <Button className="w-full justify-start gap-2 bg-primary text-white hover:bg-primary/90 h-10">
            <Plus className="h-4 w-4" />
            New Template
          </Button>
          <Button className="w-full justify-start gap-2 bg-primary text-white hover:bg-primary/90 h-10">
            <Plus className="h-4 w-4" />
            Connect CRM
          </Button>
        </div>
      </div>
    </div>
  );
}
