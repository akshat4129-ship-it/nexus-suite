'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutGrid, Settings, Box, Menu, Activity } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Show, SignInButton, UserButton, OrganizationSwitcher } from "@clerk/nextjs";

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
  { name: 'Clients', href: '/dashboard/clients', icon: Box },
  { name: 'Onboarding', href: '/onboarding', icon: Box },
  { name: 'Settings', href: '/settings', icon: Settings },
  { name: 'Queues', href: '/queues', icon: Activity },
];


export const Navigation = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 rounded-lg bg-gradient-premium flex items-center justify-center p-1.5"
            >
              <Box className="text-white w-full h-full" />
            </motion.div>
            <span className="text-xl font-bold tracking-tighter text-white">
              NEXUS<span className="text-indigo-400">SUITE</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 group"
                  >
                    <item.icon className="w-4 h-4 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="md:hidden">
              {mounted && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="bg-background border-border">
                    <SheetHeader>
                      <SheetTitle className="text-white flex items-center gap-2">
                         <Box className="w-6 h-6 text-indigo-400" />
                         NEXUS<span className="text-indigo-400">SUITE</span>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-4 mt-8">
                      {navItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="text-gray-300 hover:text-white px-4 py-3 rounded-md text-lg font-medium transition-colors flex items-center gap-3 bg-secondary/50"
                        >
                          <item.icon className="w-5 h-5 text-indigo-400" />
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Show when="signed-in">
              <OrganizationSwitcher 
                appearance={{
                  elements: {
                    organizationSwitcherTrigger: "text-white hover:bg-white/10 transition-colors",
                    organizationPreviewTextContainer: "text-white",
                    organizationPreviewMainIdentifier: "text-white"
                  }
                }}
              />
              <UserButton />
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="btn-premium text-sm text-white">
                  Get Started
                </button>
              </SignInButton>
            </Show>
          </div>
        </div>
      </div>
    </nav>
  );
};
