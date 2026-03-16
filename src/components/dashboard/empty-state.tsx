'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="bg-card rounded-xl border border-border p-8 shadow-sm flex flex-col items-center justify-center min-h-96">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Your first recap appears here</h3>
        <p className="text-sm text-muted-foreground mb-6">Schedule a test meeting to see how AgencyRecap captures meeting insights.</p>
        <Button className="gap-2 bg-primary text-white hover:bg-primary/90">
          <Calendar className="h-4 w-4" />
          Schedule a Test Meeting
        </Button>
      </div>
    </div>
  );
}
