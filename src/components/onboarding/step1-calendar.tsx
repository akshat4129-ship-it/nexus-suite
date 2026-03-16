"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface Step1CalendarProps {
  onNext: () => void
}

type CalendarProvider = "google" | "outlook" | null

export function Step1Calendar({ onNext }: Step1CalendarProps) {
  const [connected, setConnected] = useState<CalendarProvider>(null)
  const [loading, setLoading] = useState<CalendarProvider>(null)

  const handleConnect = (provider: CalendarProvider) => {
    setLoading(provider)
    setTimeout(() => {
      setConnected(provider)
      setLoading(null)
    }, 1200)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground text-balance">Connect your calendar</h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          We detect your meetings automatically so you never miss a recap.
        </p>
      </div>

      <div className="space-y-3">
        {/* Google Calendar */}
        <button
          onClick={() => !connected && handleConnect("google")}
          disabled={!!connected && connected !== "google"}
          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left
            ${connected === "google"
              ? "border-electric-blue bg-accent"
              : connected !== null
              ? "border-border bg-muted opacity-50 cursor-not-allowed"
              : "border-border bg-card hover:border-electric-blue/50 hover:shadow-sm cursor-pointer"
            }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center shadow-sm flex-shrink-0">
              <svg viewBox="0 0 48 48" className="w-6 h-6">
                <path fill="#4285F4" d="M45.525 24.52c0-1.542-.138-3.027-.395-4.455H24v8.43h12.087c-.52 2.808-2.1 5.19-4.476 6.787v5.64h7.249c4.24-3.905 6.665-9.657 6.665-16.402z"/>
                <path fill="#34A853" d="M24 46c6.107 0 11.228-2.025 14.972-5.483l-7.249-5.64c-2.018 1.355-4.6 2.155-7.723 2.155-5.938 0-10.97-4.01-12.764-9.402H3.796v5.826C7.52 41.572 15.197 46 24 46z"/>
                <path fill="#FBBC05" d="M11.236 27.63A13.935 13.935 0 0 1 10.5 24c0-1.25.213-2.465.736-3.63v-5.826H3.796A22.01 22.01 0 0 0 2 24c0 3.55.85 6.907 2.362 9.63l7.44-5.827-.566-.174z"/>
                <path fill="#EA4335" d="M24 10.968c3.347 0 6.35 1.15 8.714 3.41l6.54-6.54C35.223 4.14 30.102 2 24 2 15.197 2 7.52 6.428 3.796 14.544l7.44 5.826C13.03 14.979 18.062 10.968 24 10.968z"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">Google Calendar</p>
              <p className="text-sm text-muted-foreground">Connect via OAuth</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {loading === "google" ? (
              <div className="w-5 h-5 border-2 border-electric-blue border-t-transparent rounded-full animate-spin" />
            ) : connected === "google" ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-electric-blue">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Connected
              </span>
            ) : (
              <span className="text-sm font-medium text-electric-blue">Connect →</span>
            )}
          </div>
        </button>

        {/* Outlook */}
        <button
          onClick={() => !connected && handleConnect("outlook")}
          disabled={!!connected && connected !== "outlook"}
          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left
            ${connected === "outlook"
              ? "border-electric-blue bg-accent"
              : connected !== null
              ? "border-border bg-muted opacity-50 cursor-not-allowed"
              : "border-border bg-card hover:border-electric-blue/50 hover:shadow-sm cursor-pointer"
            }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-[#0078d4] flex items-center justify-center shadow-sm flex-shrink-0">
              <svg viewBox="0 0 48 48" fill="white" className="w-6 h-6">
                <path d="M8 8h14v14H8zm0 18h14v14H8zm18-18h14v14H26zm0 18h14v14H26z"/>
              </svg>
            </div>
            <div>
              <p className="font-medium text-foreground">Microsoft Outlook</p>
              <p className="text-sm text-muted-foreground">Connect via OAuth</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {loading === "outlook" ? (
              <div className="w-5 h-5 border-2 border-electric-blue border-t-transparent rounded-full animate-spin" />
            ) : connected === "outlook" ? (
              <span className="flex items-center gap-1.5 text-sm font-medium text-electric-blue">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Connected
              </span>
            ) : (
              <span className="text-sm font-medium text-electric-blue">Connect →</span>
            )}
          </div>
        </button>
      </div>

      <Button
        onClick={onNext}
        disabled={!connected}
        className="w-full bg-electric-blue hover:bg-electric-blue/90 text-primary-foreground font-semibold py-3 h-auto text-base rounded-xl transition-all duration-200 disabled:opacity-40"
      >
        Continue
      </Button>
    </div>
  )
}
