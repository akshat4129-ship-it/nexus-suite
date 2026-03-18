"use client"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, ExternalLink, Loader2 } from "lucide-react"
import { toast } from "sonner"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Integration {
  id: string
  name: string
  description: string
  logo: React.ReactNode
  connected: boolean
  category: "crm" | "meeting" | "automation" | "email"
}

const HubSpotLogo = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#ff7a59">
    <path d="M18.16 7.63v3.64a2.29 2.29 0 00-.93-.2 2.36 2.36 0 00-2.36 2.36v.03a2.36 2.36 0 002.36 2.36c.33 0 .65-.07.93-.2v3.64a6 6 0 10-6-6 6 6 0 006 6z" />
    <circle cx="18.16" cy="5.27" r="1.64" />
  </svg>
)

const SalesforceLogo = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#00a1e0">
    <path d="M10.006 5.415a4.195 4.195 0 013.045-1.306c1.56 0 2.954.9 3.69 2.205a4.69 4.69 0 011.985-.44c2.58 0 4.674 2.123 4.674 4.738 0 2.616-2.094 4.738-4.674 4.738-.325 0-.643-.034-.95-.097a3.778 3.778 0 01-3.463 2.272c-.633 0-1.228-.157-1.752-.433a4.524 4.524 0 01-4.09 2.601c-2.253 0-4.148-1.66-4.51-3.852a4.028 4.028 0 01-.661.055C1.72 15.896 0 14.157 0 12c0-2.156 1.72-3.896 3.84-3.896.199 0 .394.015.586.044a4.63 4.63 0 014.094-3.97c.523-.055 1.06.048 1.486.237z" />
  </svg>
)

const ZoomLogo = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#2d8cff">
    <path d="M4.585 7.588h9.168a2.58 2.58 0 012.576 2.576v5.66l4.368 3.003a.689.689 0 001.103-.55V5.723a.689.689 0 00-1.103-.55l-4.368 3.003v-.012a2.58 2.58 0 00-2.576-2.576H4.585A2.58 2.58 0 002.01 8.164v7.672a2.58 2.58 0 002.575 2.576h9.168a2.58 2.58 0 002.576-2.576v-.012l4.368 3.003a.689.689 0 001.103-.55v-1.52" />
  </svg>
)

const GoogleMeetLogo = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8">
    <path fill="#00832d" d="M12 12v6.5l5.5-3.25z" />
    <path fill="#0066da" d="M22 12l-4.5 2.5-5.5-2.5 5.5-2.5z" />
    <path fill="#e94235" d="M12 5.5v6.5l5.5-3.25z" />
    <path fill="#2684fc" d="M12 12L6.5 9.5 2 12l4.5 2.5z" />
    <path fill="#00ac47" d="M6.5 14.5L2 12v5.5l4.5 2.5z" />
    <path fill="#ffba00" d="M6.5 9.5L2 12V6.5L6.5 4z" />
    <path fill="#0066da" d="M12 5.5L6.5 9.5V4L12 1.5z" />
    <path fill="#00832d" d="M12 18.5l-5.5-4v5.5l5.5 2.5z" />
  </svg>
)

const TeamsLogo = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#5059c9">
    <path d="M16.5 10.5h4a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 01-1.5 1.5h-4V10.5z" />
    <circle cx="18" cy="6" r="2.5" fill="#7b83eb" />
    <path d="M13.5 7h-9A1.5 1.5 0 003 8.5v9A1.5 1.5 0 004.5 19h9a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0013.5 7z" />
    <circle cx="14" cy="4" r="3" />
  </svg>
)

const OutlookLogo = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#0078d4">
    <path d="M22.5 5.5h-21c-.825 0-1.5.675-1.5 1.5v10c0 .825.675 1.5 1.5 1.5h21c.825 0 1.5-.675 1.5-1.5v-10c0-.825-.675-1.5-1.5-1.5zm-21 1.5h21v10h-21v-10zm10.5 4l-7.5-4h15l-7.5 4z" />
  </svg>
)

const GmailLogo = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8">
    <path fill="#4285f4" d="M3 3v18h18V3H3zm16 16H5V7l7 4.5L19 7v12z" />
  </svg>
)

const staticIntegrations: Omit<Integration, "connected">[] = [
  { id: "hubspot", name: "HubSpot", description: "Sync clients and log meetings", logo: <HubSpotLogo />, category: "crm" },
  { id: "salesforce", name: "Salesforce", description: "CRM integration for contacts", logo: <SalesforceLogo />, category: "crm" },
  { id: "zoom", name: "Zoom", description: "Auto-record and transcribe meetings", logo: <ZoomLogo />, category: "meeting" },
  { id: "google-meet", name: "Google Meet", description: "Connect your Google Workspace", logo: <GoogleMeetLogo />, category: "meeting" },
  { id: "ms-teams", name: "Microsoft Teams", description: "Sync with Teams meetings", logo: <TeamsLogo />, category: "meeting" },
  { id: "outlook", name: "Outlook", description: "Sync your Outlook calendar", logo: <OutlookLogo />, category: "email" },
  { id: "gmail", name: "Gmail / G-Suite", description: "Send recaps via your G-Suite", logo: <GmailLogo />, category: "email" },
]

export function IntegrationsTab() {
  const { data: connectedIntegrations, error, mutate } = useSWR("/api/integrations", fetcher)
  const [loading, setLoading] = useState<string | null>(null)

  const integrations: Integration[] = staticIntegrations.map((si) => ({
    ...si,
    connected: Array.isArray(connectedIntegrations)
      ? connectedIntegrations.some((ci: any) => ci.type.toLowerCase().replace('_', '-') === si.id)
      : false,
  }))

  const handleToggle = async (id: string, currentlyConnected: boolean) => {
    setLoading(id)
    try {
      if (currentlyConnected) {
        // In a real app, this would hit /api/integrations/${id}/disconnect
        
        // Optimistic local update
        mutate(
          connectedIntegrations?.filter((ci: any) => ci.type.toLowerCase() !== id.replace('-', '_')),
          false
        )
      } else {
        // Redirect immediately without artificial delays
        const authPath = `/api/integrations/${id}/connect`
        window.location.href = authPath
      }
    } catch (e) {
      // SILENT CATCH
    } finally {
      setLoading(null)
    }
  }

  const categories = [
    { key: "crm", label: "CRM" },
    { key: "meeting", label: "Meeting Platforms" },
    { key: "automation", label: "Automation" },
    { key: "email", label: "Email Providers" },
  ]

  if (!connectedIntegrations && !error) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Connect your tools to automatically sync data and transcribe meetings
        </p>
      </div>

      {categories.map((category) => (
        <div key={category.key} className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {category.label}
          </h4>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {integrations
              .filter((i) => i.category === category.key)
              .map((integration) => (
                <Card
                  key={integration.id}
                  className={`relative transition-all ${
                    integration.connected ? "ring-2 ring-primary/20 border-primary/30 bg-primary/5" : ""
                  }`}
                >
                  {integration.connected && (
                    <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 shadow-sm border-2 border-background">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted/50 transition-colors group-hover:bg-muted">
                      {integration.logo}
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">{integration.name}</h5>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {integration.description}
                      </p>
                    </div>
                    <Button
                      variant={integration.connected ? "outline" : "default"}
                      size="sm"
                      className="w-full"
                      disabled={loading === integration.id}
                      onClick={() => handleToggle(integration.id, integration.connected)}
                    >
                      {loading === integration.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : integration.connected ? (
                        "Disconnect"
                      ) : (
                        <>
                          Connect
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}

      {integrations.every(i => !i.connected) && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800 text-sm">
          <strong>Tip:</strong> Connect HubSpot to sync action items automatically.
        </div>
      )}
    </div>
  )
}
