'use client';

import useSWR from 'swr';
import Link from 'next/link';
import { MoreVertical, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const getStatusColor = (status: string) => {
  switch (status) {
    case 'CONFIRMED': return 'bg-green-500';
    case 'SENT': return 'bg-blue-500';
    case 'DRAFT': return 'bg-slate-400';
    default: return 'bg-amber-500';
  }
};

export function RecapFeed() {
  const { data: response, error, isLoading } = useSWR('/api/recaps', fetcher, {
    refreshInterval: 30000,
  });

  const recaps = response?.data || [];

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-6">Recent Recaps</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (recaps.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Eye className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No recaps yet</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Schedule a meeting to start generating AI recaps for your clients.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-6">Recent Recaps</h2>
      <div className="space-y-3">
        {recaps.map((recap: any) => (
          <div key={recap.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-secondary transition-colors group">
            <div className="flex items-center gap-4 flex-1">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-foreground">{recap.client?.company || recap.client?.name || 'Unknown Client'}</p>
                  <span className="text-xs text-muted-foreground">·</span>
                  <p className="text-sm text-muted-foreground">
                    {recap.created_at ? format(new Date(recap.created_at), 'MMM d, yyyy') : 'Recently'}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground truncate max-w-md mt-0.5">{recap.subject_line}</p>
              </div>
              <div className="flex items-center gap-2 px-3">
                <span className={`${getStatusColor(recap.status)} h-2 w-2 rounded-full`}></span>
                <span className="text-xs font-medium text-muted-foreground">{recap.status}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              <Link href={`/recap/${recap.id}/edit`}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
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
