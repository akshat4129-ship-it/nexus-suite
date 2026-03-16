'use client';

import { ChevronDown, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TopNav() {
  return (
    <header className="border-b border-border bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left: Logo + Org Dropdown */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary"></div>
            <span className="font-semibold text-foreground">AgencyRecap</span>
          </div>
          <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <span>Acme Inc.</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-8">
          {['Dashboard', 'Meetings', 'Clients', 'Templates', 'Settings'].map((item) => (
            <a
              key={item}
              href="#"
              className={`text-sm transition-colors ${
                item === 'Dashboard' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Right: Notifications + Avatar */}
        <div className="flex items-center gap-4">
          <button className="relative text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="h-9 w-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
