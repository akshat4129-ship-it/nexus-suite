'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { LayoutGrid, Users, Settings, Activity, ShieldCheck, Box } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutGrid },
  { name: 'Assets', href: '/assets', icon: Box },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: Activity },
  { name: 'Security', href: '/security', icon: ShieldCheck },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Navigation = () => {
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

          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </button>
            <button className="btn-premium text-sm text-white">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
