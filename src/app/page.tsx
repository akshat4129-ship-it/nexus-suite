'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Globe, Cpu, BarChart3, Layers } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const features = [
  { icon: Zap, title: "Ultra Performance", desc: "Edge-optimized infrastructure for lightning fast response times." },
  { icon: Shield, title: "Quantum Security", desc: "Advanced encryption and threat detection powered by AI." },
  { icon: Globe, title: "Global Mesh", desc: "Unified assets and analytics across all regions effortlessly." },
  { icon: Cpu, title: "Nexus Core", desc: "Centralized processing for complex enterprise workflows." },
  { icon: BarChart3, title: "Predictive Insights", desc: "Real-time data visualization with future trend forecasting." },
  { icon: Layers, title: "Modular Fabric", desc: "Highly scalable architecture that grows with your vision." },
];

export default function Home() {
  return (
    <div className="relative">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }} />

      <section className="py-20 text-center">
        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.5 }}
        >
          <span className="px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-6 inline-block tracking-wide">
            v1.0.0 Now Available
          </span>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
            Architect the <br />
            <span className="bg-gradient-premium bg-clip-text text-transparent text-glow">
              Nexus Future
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            The intelligent infrastructure suite designed for scale. Orchestrate your enterprise with precision, speed, and absolute security.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard">
              <button className="btn-premium px-8 py-3 text-lg text-white flex items-center gap-2">
                Launch Deployment <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/recap">
              <button className="px-8 py-3 text-lg font-semibold text-gray-300 hover:text-white transition-colors glass-card border-gray-800">
                Read Protocol
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              variants={fadeInUp}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
              className="glass-card p-8 group hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:bg-gradient-premium transition-all duration-300">
                <feature.icon className="w-6 h-6 text-indigo-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Hero Analytics Card Preview */}
      <section className="py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="glass-card p-1 overflow-hidden"
        >
          <div className="bg-black/50 rounded-[calc(1rem-4px)] p-12">
             <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Live Nexus Pulse</h2>
                  <p className="text-gray-400">Real-time throughput analysis</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 glass-card bg-green-500/10 border-green-500/30 text-green-400 text-sm">
                    System Optimal
                  </div>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { label: "Active Nodes", val: "1,284", change: "+12%" },
                  { label: "Throughput", val: "84.2 GB/s", change: "+5%" },
                  { label: "Latency", val: "1.2ms", change: "-0.4ms" },
                  { label: "Safety Index", val: "99.99%", change: "Stable" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold mb-1">{stat.val}</p>
                    <p className={`text-xs ${stat.change.includes('+') ? 'text-green-400' : stat.change.includes('-') ? 'text-green-400' : 'text-gray-400'}`}>
                      {stat.change}
                    </p>
                  </div>
                ))}
             </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
