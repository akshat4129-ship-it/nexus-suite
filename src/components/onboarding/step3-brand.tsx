"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface Step3BrandProps {
  onNext: () => void
  onBack: () => void
}

const DEFAULT_COLOR = "#4f6ef7"

export function Step3Brand({ onNext, onBack }: Step3BrandProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const [color, setColor] = useState(DEFAULT_COLOR)
  const [hexInput, setHexInput] = useState(DEFAULT_COLOR)
  const [signature, setSignature] = useState("Best regards,\nYour Agency Team\nagency.com")
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    const url = URL.createObjectURL(file)
    setLogoPreview(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleHexChange = (val: string) => {
    setHexInput(val)
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      setColor(val)
    }
  }

  const isComplete = !!logoPreview && hexInput.length >= 4

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground text-balance">Set up your brand</h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          Your clients will see your branding on every recap you send.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Inputs */}
        <div className="space-y-5">
          {/* Logo upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Agency logo</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-2 h-28 rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer
                ${dragging ? "border-electric-blue bg-accent" : logoPreview ? "border-electric-blue/60 bg-accent/40" : "border-border hover:border-electric-blue/50 hover:bg-muted/50"}`}
            >
              {logoPreview ? (
                <img src={logoPreview} alt="Agency logo preview" className="h-16 w-auto object-contain" />
              ) : (
                <>
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"/>
                  </svg>
                  <span className="text-sm text-muted-foreground">Drag & drop or <span className="text-electric-blue font-medium">browse</span></span>
                  <span className="text-xs text-muted-foreground">PNG, SVG, JPG up to 5MB</span>
                </>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </div>
          </div>

          {/* Color picker */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Primary brand color</label>
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-lg border border-border shadow-sm cursor-pointer overflow-hidden"
                  style={{ background: color }}
                >
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => { setColor(e.target.value); setHexInput(e.target.value) }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    aria-label="Pick brand color"
                  />
                </div>
              </div>
              <Input
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#4f6ef7"
                className="font-mono text-sm rounded-xl border-border focus-visible:ring-electric-blue/50"
                maxLength={7}
              />
            </div>
          </div>

          {/* Email signature */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Email signature</label>
            <Textarea
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              rows={4}
              className="resize-none rounded-xl border-border focus-visible:ring-electric-blue/50 font-mono text-sm"
              placeholder="Enter your email signature..."
            />
          </div>
        </div>

        {/* Right: Live preview */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Live preview</label>
          <div className="rounded-xl border border-border bg-[#f9fafb] overflow-hidden shadow-sm">
            {/* Email header */}
            <div className="px-4 py-3 border-b border-border bg-white flex items-center gap-3">
              {logoPreview ? (
                <img src={logoPreview} alt="Agency logo" className="h-6 w-auto object-contain" />
              ) : (
                <div className="h-6 w-16 bg-muted rounded" />
              )}
              <div className="ml-auto">
                <div className="w-4 h-4 rounded" style={{ background: color }} />
              </div>
            </div>
            {/* Email body preview */}
            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Meeting Recap</p>
                <h3 className="text-sm font-bold text-foreground" style={{ color }}>Weekly Strategy Call — March 2026</h3>
              </div>
              <div className="space-y-1.5">
                {["Discussed Q2 roadmap priorities", "Reviewed campaign performance metrics", "Aligned on next steps and owners"].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                    <p className="text-xs text-foreground leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground whitespace-pre-line">{signature || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 rounded-xl py-3 h-auto font-semibold border-border">
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!isComplete}
          className="flex-[2] bg-electric-blue hover:bg-electric-blue/90 text-primary-foreground font-semibold py-3 h-auto text-base rounded-xl disabled:opacity-40"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
