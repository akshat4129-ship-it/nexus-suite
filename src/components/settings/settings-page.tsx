"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Users, Palette, Plug, CreditCard } from "lucide-react"
import { TeamTab } from "./team-tab"
import { BrandTab } from "./brand-tab"
import { IntegrationsTab } from "./integrations-tab"
import { BillingTab } from "./billing-tab"

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("team")

  const tabs = [
    { id: "team", label: "Team", icon: Users },
    { id: "brand", label: "Brand", icon: Palette },
    { id: "integrations", label: "Integrations", icon: Plug },
    { id: "billing", label: "Billing", icon: CreditCard },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">A</span>
              </div>
              <span className="text-lg font-semibold text-foreground">Settings</span>
            </div>
          </div>
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary text-sm">SC</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex items-center gap-2"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="team" className="mt-8">
            <TeamTab />
          </TabsContent>

          <TabsContent value="brand" className="mt-8">
            <BrandTab />
          </TabsContent>

          <TabsContent value="integrations" className="mt-8">
            <IntegrationsTab />
          </TabsContent>

          <TabsContent value="billing" className="mt-8">
            <BillingTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
