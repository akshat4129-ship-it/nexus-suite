'use client';

import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import Link from 'next/link';

export function EmptyState() {
  return (
    <div className="bg-card rounded-xl border border-border p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No recaps yet — schedule a meeting</h3>
        <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
          AgencyRecap captures meeting insights and syncs them to your CRM. 
          Connect your calendar to get started.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button className="gap-2 bg-primary text-white hover:bg-primary/90 h-11 px-6">
            <Calendar className="h-4 w-4" />
            Schedule Meeting
          </Button>
          <Link href="/dashboard/clients">
            <Button variant="outline" className="gap-2 h-11 px-6">
              <Plus className="h-4 w-4" />
              Add Your First Client
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
