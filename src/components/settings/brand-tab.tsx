"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, Check, Globe } from "lucide-react"

export function BrandTab() {
  const [logo, setLogo] = useState<string | null>(null)
  const [brandColor, setBrandColor] = useState("#4f6ef7")
  const [signature, setSignature] = useState("Best regards,\nThe BrandForge Team")
  const [customDomain, setCustomDomain] = useState("")
  const [domainVerified, setDomainVerified] = useState(false)
  const [saved, setSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleVerifyDomain = () => {
    if (customDomain) {
      setDomainVerified(true)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">Brand Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize how your recaps look when sent to clients
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agency Logo</CardTitle>
            <CardDescription>
              Upload your logo to appear in recap emails. Recommended: 200x50px PNG
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            {logo ? (
              <div className="relative inline-block rounded-lg border border-border bg-muted/50 p-4">
                <img src={logo} alt="Logo preview" className="h-12 object-contain" />
                <button
                  onClick={() => setLogo(null)}
                  className="absolute -right-2 -top-2 rounded-full bg-foreground p-1 text-background hover:bg-foreground/90"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-colors hover:border-primary hover:bg-muted/50"
              >
                <Upload className="h-8 w-8" />
                <span className="text-sm font-medium">Click to upload</span>
                <span className="text-xs">PNG, JPG up to 2MB</span>
              </button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Brand Color</CardTitle>
            <CardDescription>
              Used for email headers and buttons in client-facing recaps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div
                className="h-16 w-16 rounded-lg border border-border shadow-sm"
                style={{ backgroundColor: brandColor }}
              />
              <div className="flex-1 space-y-2">
                <Input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  placeholder="#4f6ef7"
                  className="font-mono"
                />
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="h-10 w-full cursor-pointer rounded-md border border-border"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Email Signature</CardTitle>
            <CardDescription>
              Default closing text for all recap emails
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              rows={4}
              placeholder="Best regards,&#10;Your Team"
              className="resize-none"
            />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Custom Email Domain</CardTitle>
            <CardDescription>
              Send recaps from your own domain (e.g., recaps@youragency.com)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  value={customDomain}
                  onChange={(e) => {
                    setCustomDomain(e.target.value)
                    setDomainVerified(false)
                  }}
                  placeholder="mail.youragency.com"
                  className="pl-10"
                />
              </div>
              <Button
                variant={domainVerified ? "outline" : "secondary"}
                onClick={handleVerifyDomain}
                disabled={!customDomain}
              >
                {domainVerified ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-600" />
                    Verified
                  </>
                ) : (
                  "Verify Domain"
                )}
              </Button>
            </div>
            {customDomain && !domainVerified && (
              <p className="mt-2 text-xs text-muted-foreground">
                Add this TXT record to your DNS: <code className="rounded bg-muted px-1 py-0.5">agencyrecap-verify=abc123</code>
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>
          {saved ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Saved
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </div>
  )
}
