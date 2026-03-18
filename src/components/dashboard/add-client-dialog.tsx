"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { mutate } from "swr"

export function AddClientDialog({ 
  triggerClassName = "btn-premium flex items-center gap-2 text-white",
  label = "Provision Client" 
}: { 
  triggerClassName?: string, 
  label?: React.ReactNode 
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        }),
      })

      if (!res.ok) throw new Error("Failed to provision client")

      toast.success(`${form.company} node online`)
      setOpen(false)
      setForm({ name: "", email: "", company: "" })
      mutate("/api/clients")
    } catch (error) {
      toast.error("Cluster synchronization failure: Could not add client")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName}>
          <Plus className="h-4 w-4" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-white tracking-tight">Provision Client Node</DialogTitle>
          <DialogDescription className="text-gray-400">
            Establish a new synchronization bridge with a client.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="company" className="text-xs font-bold uppercase tracking-widest text-indigo-400">Company Identity</Label>
            <Input
              id="company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="e.g. NovaTech Industries"
              className="bg-black/20 border-border rounded-xl text-white focus:ring-indigo-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-indigo-400">Primary Liaison</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Sarah Connor"
              className="bg-black/20 border-border rounded-xl text-white focus:ring-indigo-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-indigo-400">Communication Node (Email)</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="liaison@company.com"
              className="bg-black/20 border-border rounded-xl text-white focus:ring-indigo-500"
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="w-full btn-premium text-white font-bold tracking-widest uppercase text-xs h-12"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Synchronizing...
                </>
              ) : (
                "Establish Connection"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
