"use client"

import useSWR from "swr"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, CheckCircle2, AlertCircle, Clock, Loader2, Play, Cpu, Zap, Radio } from "lucide-react"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function QueuesPage() {
  const { data: board, error, isLoading } = useSWR("/api/queues/board", fetcher, {
    refreshInterval: 5000
  })

  if (error) {
    toast.error("Failed to load queue stats")
  }

  const queues = [
    { name: "meeting-processing", status: "active", jobs: 0, completed: 15, failed: 2, throughput: "1.2/s" },
    { name: "recap-generation", status: "active", jobs: 0, completed: 12, failed: 0, throughput: "0.8/s" },
    { name: "crm-sync", status: "active", jobs: 0, completed: 8, failed: 1, throughput: "2.4/s" },
    { name: "webhook-delivery", status: "active", jobs: 0, completed: 42, failed: 0, throughput: "12.0/s" },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Background Glow */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[128px] opacity-10 animate-pulse" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
        >
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-white mb-2">
              Neural <span className="text-glow bg-gradient-premium bg-clip-text text-transparent">Queues</span>
            </h1>
            <p className="text-gray-400 max-w-xl text-lg">
              Real-time telemetry and throughput analysis of the Nexus processing fabric.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-3 backdrop-blur-xl">
             <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Status</span>
                <span className="text-green-400 font-bold flex items-center gap-2">
                  <Radio className="w-4 h-4 animate-pulse" />
                  Fabric Operational
                </span>
             </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Active Cycles", val: "0", icon: Activity, color: "text-indigo-400", bg: "bg-indigo-400/10" },
            { label: "Successful Syncs", val: "77", icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-400/10" },
            { label: "Logic Faults", val: "3", icon: AlertCircle, color: "text-rose-400", bg: "bg-rose-400/10" },
            { label: "Fabric Latency", val: "12ms", icon: Clock, color: "text-amber-400", bg: "bg-amber-400/10" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * idx }}
              className="glass-card p-6 flex flex-col gap-4 border-white/5 hover:border-white/10 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-white">{stat.val}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Protocol Engine</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">Execution State</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Throughput</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">Completed</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center text-rose-400">Faults</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {queues.map((queue, idx) => (
                  <motion.tr 
                    key={queue.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + (0.1 * idx) }}
                    className="group hover:bg-white/5 transition-all"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-indigo-400 opacity-50" />
                        <span className="font-bold text-white tracking-tight">{queue.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                         <span className="text-xs font-bold text-emerald-400 uppercase tracking-tighter">Live</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center text-indigo-300 font-mono text-xs">{queue.throughput}</td>
                    <td className="px-8 py-6 text-center font-bold text-white">{queue.completed}</td>
                    <td className="px-8 py-6 text-center font-bold text-rose-500">{queue.failed}</td>
                    <td className="px-8 py-6 text-right">
                      <button className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-500/20 transition-all border border-transparent hover:border-indigo-500/30">
                        <Play className="h-4 w-4 fill-current" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
