'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { format } from 'date-fns';
import { Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AddClientDialog } from './add-client-dialog';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function Sidebar() {
  const { data: response, isLoading } = useSWR('/api/meetings?status=SCHEDULED', fetcher, {
    refreshInterval: 30000,
  });

  const meetings = response?.data || [];
  return (
    <div className="space-y-6">
      {/* Upcoming Meetings */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Upcoming Meetings</h3>
        <div className="space-y-3">
          {isLoading ? (
            [1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)
          ) : meetings.length === 0 ? (
            <div className="text-center py-6 border border-dashed border-border rounded-lg">
              <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-xs text-muted-foreground">No upcoming meetings</p>
            </div>
          ) : (
            meetings.map((meeting: any) => (
              <div key={meeting.id} className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-secondary transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{meeting.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {meeting.scheduled_at ? format(new Date(meeting.scheduled_at), 'EEE, MMM d · p') : 'TBD'}
                  </p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={meeting.bot_joined} className="w-4 h-4 accent-primary rounded" />
                </label>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <AddClientDialog 
            triggerClassName="w-full justify-start gap-2 h-11 bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400 transition-all group"
            label={<span className="font-bold uppercase tracking-widest text-[10px]">Add Client Node</span>}
          />
          <Link href="/settings?tab=brand" className="block w-full">
            <Button variant="ghost" className="w-full justify-start gap-2 h-11 bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-purple-400 transition-all group">
              <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-bold uppercase tracking-widest text-[10px]">New Recap Pattern</span>
            </Button>
          </Link>
          <Link href="/settings?tab=integrations" className="block w-full">
            <Button variant="ghost" className="w-full justify-start gap-2 h-11 bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 text-cyan-400 transition-all group">
              <Plus className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-bold uppercase tracking-widest text-[10px]">Bridge CRM</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
