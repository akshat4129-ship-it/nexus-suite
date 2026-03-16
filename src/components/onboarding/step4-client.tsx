"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface Step4ClientProps {
  onBack: () => void
  onFinish: () => void
}

export function Step4Client({ onBack, onFinish }: Step4ClientProps) {
  const [form, setForm] = useState({ name: "", email: "", company: "" })
  const [invite, setInvite] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  const isValid = form.name.trim() && form.email.trim() && form.company.trim()

  const handleFinish = () => {
    if (!isValid) return
    setSubmitted(true)
    setTimeout(onFinish, 800)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-electric-blue/10 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-electric-blue border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-lg font-semibold text-foreground">Setting up your account...</p>
        <p className="text-muted-foreground text-sm">You'll be recapping in seconds.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground text-balance">Add your first client</h2>
        <p className="mt-2 text-muted-foreground leading-relaxed">
          This is who will receive your first meeting recap.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="client-name" className="text-sm font-medium text-foreground">Client name</Label>
            <Input
              id="client-name"
              value={form.name}
              onChange={set("name")}
              placeholder="Jane Smith"
              className="rounded-xl border-border focus-visible:ring-electric-blue/50 h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="client-company" className="text-sm font-medium text-foreground">Company</Label>
            <Input
              id="client-company"
              value={form.company}
              onChange={set("company")}
              placeholder="Acme Inc."
              className="rounded-xl border-border focus-visible:ring-electric-blue/50 h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="client-email" className="text-sm font-medium text-foreground">Email address</Label>
          <Input
            id="client-email"
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder="jane@acmeinc.com"
            className="rounded-xl border-border focus-visible:ring-electric-blue/50 h-11"
          />
        </div>

        {/* Invite toggle */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/40">
          <div>
            <p className="text-sm font-medium text-foreground">Invite to confirm recaps</p>
            <p className="text-xs text-muted-foreground mt-0.5">Client can approve or comment on each recap before it's sent.</p>
          </div>
          <Switch
            checked={invite}
            onCheckedChange={setInvite}
            className="data-[state=checked]:bg-electric-blue"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 rounded-xl py-3 h-auto font-semibold border-border">
          Back
        </Button>
        <Button
          onClick={handleFinish}
          disabled={!isValid}
          className="flex-[2] bg-electric-blue hover:bg-electric-blue/90 text-primary-foreground font-bold py-3 h-auto text-base rounded-xl disabled:opacity-40 transition-all"
        >
          Start Recapping →
        </Button>
      </div>
    </div>
  )
}
