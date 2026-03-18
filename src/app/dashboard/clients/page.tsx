"use client"

import useSWR from "swr"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle2, XCircle, Search, MoreHorizontal, Globe, Shield, Zap } from "lucide-react"
import { toast } from "sonner"
import { AddClientDialog } from "@/components/dashboard/add-client-dialog"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export default function ClientsPage() {
  const { data: response, error, isLoading } = useSWR("/api/clients", fetcher)
  const clients = response?.data || []

  if (error) {
    toast.error("Failed to load clients")
  }

  return (
    <div className="relative min-h-screen">
      {/* Background Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float pointer-events-none" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12"
        >
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
              Nexus <span className="bg-gradient-premium bg-clip-text text-transparent">Clients</span>
            </h1>
            <p className="text-gray-400 max-w-xl">
              Manage your global client mesh and their intelligent configurations.
            </p>
          </div>
          <AddClientDialog />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card overflow-hidden"
        >
          <div className="p-6 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search Nexus nodes..." 
                className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-4 text-xs font-medium text-gray-400">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                {clients.length} Active Nodes
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/5">
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Company Node</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Primary Liaison</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Geo Zone</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Sync Protocol</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-6"><Skeleton className="h-12 w-48 bg-white/5 rounded-lg" /></td>
                      <td className="px-6 py-6"><Skeleton className="h-10 w-40 bg-white/5 rounded-lg" /></td>
                      <td className="px-6 py-6"><Skeleton className="h-6 w-24 bg-white/5 rounded-lg" /></td>
                      <td className="px-6 py-6"><Skeleton className="h-6 w-20 bg-white/5 rounded-lg" /></td>
                      <td className="px-6 py-6 text-right"><Skeleton className="h-10 w-10 rounded-full bg-white/5 ml-auto" /></td>
                    </tr>
                  ))
                ) : clients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                           <Globe className="w-8 h-8 text-indigo-400 opacity-50" />
                        </div>
                        <p className="text-gray-400">No active client nodes detected in the Nexus.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  clients.map((client: any, idx: number) => (
                    <motion.tr 
                      key={client.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 * idx }}
                      className="hover:bg-white/5 transition-all group"
                    >
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="h-12 w-12 border-2 border-white/10 group-hover:border-indigo-500/50 transition-colors shadow-lg">
                              <AvatarImage src={client.avatar_url} />
                              <AvatarFallback className="bg-gradient-premium text-white">{client.company.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-black" />
                          </div>
                          <span className="font-bold text-white tracking-tight text-lg">{client.company}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-white">{client.name}</span>
                          <span className="text-xs text-gray-500 group-hover:text-indigo-400 transition-colors">{client.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-[10px] font-black uppercase tracking-tighter text-indigo-400 px-2 py-1 bg-indigo-500/10 rounded-md border border-indigo-500/20">
                          {client.timezone}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        {client.confirmation_required ? (
                          <div className="flex items-center gap-2 text-pink-400 text-xs font-bold uppercase tracking-widest">
                            <Shield className="h-3 w-3" />
                            Secure Manual
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest">
                            <Zap className="h-3 w-3" />
                            Neural Auto
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-6 text-right">
                        <Button variant="ghost" size="sm" className="h-10 w-10 p-0 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
