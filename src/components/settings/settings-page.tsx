"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Users, Palette, Plug, CreditCard, Settings, Shield, Zap } from "lucide-react"
import { TeamTab } from "./team-tab"
import { BrandTab } from "./brand-tab"
import { IntegrationsTab } from "./integrations-tab"
import { BillingTab } from "./billing-tab"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function SettingsPage() {
  return (
    <Suspense fallback={<div>Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  )
}

function SettingsContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("team")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["team", "brand", "integrations", "billing"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const tabs = [
    { id: "team", label: "Core Team", icon: Users },
    { id: "brand", label: "Visual Identity", icon: Palette },
    { id: "integrations", label: "Neural Links", icon: Plug },
    { id: "billing", label: "Subscription", icon: CreditCard },
  ]

  return (
    <div className="relative min-h-screen">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="max-w-6xl mx-auto px-4 py-12 relative z-10">
        <motion.div 
          initial="initial"
          animate="animate"
          variants={fadeInUp}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
             <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
             </div>
             <h1 className="text-4xl font-black tracking-tighter text-white">
               Protocol <span className="bg-gradient-premium bg-clip-text text-transparent">Settings</span>
             </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Configure your Nexus Node parameters and intelligent sync protocols.
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <TabsList className="bg-white/5 border border-white/10 p-1.5 h-auto rounded-2xl backdrop-blur-xl">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="px-6 py-3 rounded-xl data-[state=active]:bg-gradient-premium data-[state=active]:text-white text-gray-400 transition-all font-bold text-sm flex items-center gap-2"
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-1"
            >
              <div className="bg-black/40 rounded-[calc(1rem-4px)] p-8">
                <TabsContent value="team" className="mt-0 focus-visible:outline-none">
                  <TeamTab />
                </TabsContent>

                <TabsContent value="brand" className="mt-0 focus-visible:outline-none">
                  <BrandTab />
                </TabsContent>

                <TabsContent value="integrations" className="mt-0 focus-visible:outline-none">
                  <IntegrationsTab />
                </TabsContent>

                <TabsContent value="billing" className="mt-0 focus-visible:outline-none">
                  <BillingTab />
                </TabsContent>
              </div>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>
    </div>
  )
}
