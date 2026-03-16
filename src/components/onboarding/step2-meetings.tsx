"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Step2MeetingsProps {
  onNext: () => void
  onBack: () => void
}

type Platform = "zoom" | "meet" | "teams"

const PLATFORMS: { id: Platform; name: string; color: string; logo: React.ReactNode }[] = [
  {
    id: "zoom",
    name: "Zoom",
    color: "#2D8CFF",
    logo: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <rect width="48" height="48" rx="12" fill="#2D8CFF"/>
        <path d="M8 17.5C8 16.12 9.12 15 10.5 15h17C28.88 15 30 16.12 30 17.5v13C30 31.88 28.88 33 27.5 33h-17C9.12 33 8 31.88 8 30.5V17.5z" fill="white"/>
        <path d="M31.5 20.5l8.5-5.5v18l-8.5-5.5V20.5z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "meet",
    name: "Google Meet",
    color: "#00897B",
    logo: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <rect width="48" height="48" rx="12" fill="white" stroke="#e5e7eb" strokeWidth="1.5"/>
        <path d="M12 30.5V17.5C12 16.12 13.12 15 14.5 15H26v8.5l8 5.5v1.5C34 31.88 32.88 33 31.5 33H14.5C13.12 33 12 31.88 12 30.5z" fill="#00897B"/>
        <path d="M26 15l8 5.5v3L26 18V15z" fill="#00BFA5"/>
        <path d="M12 26l14 7v0l-14-4.5V26z" fill="#005F56" opacity="0.3"/>
      </svg>
    ),
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    color: "#5059C9",
    logo: (
      <svg viewBox="0 0 48 48" className="w-8 h-8" fill="none">
        <rect width="48" height="48" rx="12" fill="#5059C9"/>
        <circle cx="30" cy="16" r="4" fill="white" opacity="0.9"/>
        <path d="M36 22h-9.5v9C26.5 33.1 24.6 35 22.25 35S18 33.1 18 30.75V31H13.5C12.67 31 12 30.33 12 29.5v-8C12 19.67 12.67 19 13.5 19H25c.83 0 1.5.67 1.5 1.5V22H36z" fill="white" opacity="0.8"/>
        <circle cx="20" cy="14" r="5" fill="white"/>
      </svg>
    ),
  },
]

export function Step2Meetings({ onNext, onBack }: Step2MeetingsProps) {
  const [selected, setSelected] = useState<Set<Platform>>(new Set())
  const [connected, setConnected] = useState<Set<Platform>>(new Set())
  const [loading, setLoading] = useState<Platform | null>(null)

  const toggleSelect = (id: Platform) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleConnect = (id: Platform, e: React.MouseEvent) => {
    e.stopPropagation()
    if (connected.has(id)) return
    setLoading(id)
    setTimeout(() => {
      setConnected(prev => new Set([...prev, id]))
      setLoading(null)
    }, 1100)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground text-balance">Connect meeting platforms</h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Select all platforms your team uses. You can connect multiple.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PLATFORMS.map((platform) => {
          const isConnected = connected.has(platform.id)
          const isSelected = selected.has(platform.id)
          const isLoading = loading === platform.id

          return (
            <button
              key={platform.id}
              onClick={() => toggleSelect(platform.id)}
              className={cn(
                "relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all duration-200 text-left group",
                isConnected
                  ? "border-electric-blue bg-accent"
                  : isSelected
                  ? "border-electric-blue/50 bg-accent/50"
                  : "border-border bg-card hover:border-electric-blue/30 hover:shadow-sm"
              )}
            >
              {isConnected && (
                <span className="absolute top-2.5 right-2.5 flex items-center gap-1 text-xs font-semibold text-electric-blue bg-electric-blue/10 rounded-full px-2 py-0.5">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Connected
                </span>
              )}
              <div className="mt-1">{platform.logo}</div>
              <p className="font-semibold text-sm text-foreground">{platform.name}</p>
              <button
                onClick={(e) => handleConnect(platform.id, e)}
                disabled={isConnected || isLoading}
                className={cn(
                  "w-full text-xs font-medium py-1.5 px-3 rounded-lg transition-all duration-200",
                  isConnected
                    ? "bg-electric-blue/10 text-electric-blue cursor-default"
                    : "bg-electric-blue text-primary-foreground hover:bg-electric-blue/90"
                )}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Connecting...
                  </span>
                ) : isConnected ? (
                  "Connected ✓"
                ) : (
                  "Connect →"
                )}
              </button>
            </button>
          )
        })}
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1 rounded-xl py-3 h-auto font-semibold border-border"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={connected.size === 0}
          className="flex-[2] bg-electric-blue hover:bg-electric-blue/90 text-primary-foreground font-semibold py-3 h-auto text-base rounded-xl disabled:opacity-40"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
