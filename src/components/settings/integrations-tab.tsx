"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, ExternalLink } from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  logo: React.ReactNode
  connected: boolean
  category: "crm" | "meeting" | "automation"
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

const ZapierLogo = () => (
  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="#ff4a00">
    <path d="M12 0L8.59 8.59 0 12l8.59 3.41L12 24l3.41-8.59L24 12l-8.59-3.41L12 0zm0 14.4a2.4 2.4 0 110-4.8 2.4 2.4 0 010 4.8z" />
  </svg>
)

const initialIntegrations: Integration[] = [
  { id: "hubspot", name: "HubSpot", description: "Sync clients and log meetings", logo: <HubSpotLogo />, connected: true, category: "crm" },
  { id: "salesforce", name: "Salesforce", description: "CRM integration for contacts", logo: <SalesforceLogo />, connected: false, category: "crm" },
  { id: "zoom", name: "Zoom", description: "Auto-record and transcribe meetings", logo: <ZoomLogo />, connected: true, category: "meeting" },
  { id: "google-meet", name: "Google Meet", description: "Connect your Google Workspace", logo: <GoogleMeetLogo />, connected: false, category: "meeting" },
  { id: "ms-teams", name: "Microsoft Teams", description: "Sync with Teams meetings", logo: <TeamsLogo />, connected: false, category: "meeting" },
  { id: "zapier", name: "Zapier", description: "Automate workflows with 5000+ apps", logo: <ZapierLogo />, connected: false, category: "automation" },
]

export function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations)

  const toggleConnection = (id: string) => {
    setIntegrations(integrations.map((i) =>
      i.id === id ? { ...i, connected: !i.connected } : i
    ))
  }

  const categories = [
    { key: "crm", label: "CRM" },
    { key: "meeting", label: "Meeting Platforms" },
    { key: "automation", label: "Automation" },
  ]

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
                    integration.connected ? "ring-2 ring-primary/20" : ""
                  }`}
                >
                  {integration.connected && (
                    <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                  <CardContent className="flex flex-col items-center gap-4 p-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted/50">
                      {integration.logo}
                    </div>
                    <div>
                      <h5 className="font-semibold text-foreground">{integration.name}</h5>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {integration.description}
                      </p>
                    </div>
                    <Button
                      variant={integration.connected ? "outline" : "default"}
                      size="sm"
                      className="w-full"
                      onClick={() => toggleConnection(integration.id)}
                    >
                      {integration.connected ? (
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
    </div>
  )
}
