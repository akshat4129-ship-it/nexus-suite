'use client';

import { MoreVertical, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RECAPS = [
  { id: 1, client: 'Acme Corp', date: 'Mar 14, 2025', status: 'Confirmed', statusColor: 'bg-green-500' },
  { id: 2, client: 'Tech Startup Inc', date: 'Mar 13, 2025', status: 'Sent', statusColor: 'bg-blue-500' },
  { id: 3, client: 'Global Solutions', date: 'Mar 12, 2025', status: 'Pending', statusColor: 'bg-amber-500' },
  { id: 4, client: 'Enterprise Ltd', date: 'Mar 11, 2025', status: 'Draft', statusColor: 'bg-slate-400' },
  { id: 5, client: 'Startup Hub', date: 'Mar 10, 2025', status: 'Confirmed', statusColor: 'bg-green-500' },
];

export function RecapFeed() {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-6">Recent Recaps</h2>
      <div className="space-y-3">
        {RECAPS.map((recap) => (
          <div key={recap.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary transition-colors group">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-foreground">{recap.client}</p>
                  <span className="text-xs text-muted-foreground">·</span>
                  <p className="text-sm text-muted-foreground">{recap.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`${recap.statusColor} h-2 w-2 rounded-full`}></span>
                <span className="text-xs font-medium text-muted-foreground">{recap.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
