"use client"

import { useState } from "react"
import { Check, Calendar, ExternalLink } from "lucide-react"

interface ActionItem {
  task: string
  owner: string
  dueDate: string
  status: "pending" | "in-progress" | "complete"
}

interface ClientRecapEmailProps {
  agencyName?: string
  agencyLogo?: string
  brandColor?: string
  clientName?: string
  meetingDate?: string
  meetingDuration?: string
  attendees?: string[]
  decisions?: { title: string; context: string }[]
  actionItems?: ActionItem[]
  nextSteps?: string[]
  nextMeetingDate?: string
  nextMeetingTime?: string
  calendarLink?: string
}

export function ClientRecapEmail({
  agencyName = "Stellar Agency",
  agencyLogo,
  brandColor = "#4f6ef7",
  clientName = "Sarah",
  meetingDate = "March 16, 2026",
  meetingDuration = "45 minutes",
  attendees = ["You", "Marcus Chen", "Emily Rodriguez"],
  decisions = [
    { title: "Launch date set for April 15th", context: "Aligned on the spring campaign timeline to maximize seasonal engagement." },
    { title: "Budget approved at $45,000", context: "Includes paid media, creative production, and influencer partnerships." },
    { title: "Primary audience: 25-34 urban professionals", context: "Based on Q4 analytics showing highest conversion rates in this segment." },
  ],
  actionItems = [
    { task: "Finalize creative brief", owner: "Stellar Agency", dueDate: "Mar 20", status: "in-progress" },
    { task: "Review brand guidelines", owner: clientName, dueDate: "Mar 18", status: "pending" },
    { task: "Send media kit assets", owner: clientName, dueDate: "Mar 19", status: "pending" },
    { task: "Draft influencer shortlist", owner: "Stellar Agency", dueDate: "Mar 22", status: "pending" },
  ],
  nextSteps = [
    "Agency will prepare initial creative concepts for review",
    "Client to provide updated product photography",
    "Schedule stakeholder alignment call for final sign-off",
  ],
  nextMeetingDate = "March 25, 2026",
  nextMeetingTime = "2:00 PM EST",
  calendarLink = "#",
}: ClientRecapEmailProps) {
  const [confirmed, setConfirmed] = useState(false)
  const [showChangeRequest, setShowChangeRequest] = useState(false)

  const getStatusStyle = (status: ActionItem["status"]) => {
    switch (status) {
      case "complete":
        return { bg: "#dcfce7", text: "#166534", label: "Complete" }
      case "in-progress":
        return { bg: "#dbeafe", text: "#1e40af", label: "In Progress" }
      default:
        return { bg: "#f3f4f6", text: "#374151", label: "Pending" }
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      {/* Email Container */}
      <div
        className="mx-auto bg-background shadow-lg"
        style={{ maxWidth: 600 }}
      >
        {/* Header with brand color bar */}
        <div
          className="h-2"
          style={{ backgroundColor: brandColor }}
        />
        
        <div className="p-8">
          {/* Logo + Title */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              {agencyLogo ? (
                <img src={agencyLogo} alt={agencyName} className="h-10 w-auto" />
              ) : (
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-semibold text-lg"
                  style={{ backgroundColor: brandColor }}
                >
                  {agencyName.charAt(0)}
                </div>
              )}
              <span className="font-semibold text-foreground text-lg">{agencyName}</span>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Meeting Recap</div>
              <div className="text-sm text-foreground">{meetingDate}</div>
            </div>
          </div>

          {/* Greeting */}
          <div className="mb-6">
            <p className="text-foreground text-base leading-relaxed">
              Hi {clientName}, great speaking today.
            </p>
          </div>

          {/* Meeting Overview */}
          <div className="mb-8 p-4 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-muted-foreground">
              We met for <span className="font-medium text-foreground">{meetingDuration}</span> with{" "}
              <span className="font-medium text-foreground">{attendees.join(", ")}</span>.
            </p>
          </div>

          {/* Decisions Made */}
          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-4">
              Decisions Made
            </h2>
            <ul className="space-y-3">
              {decisions.map((decision, index) => (
                <li key={index} className="flex gap-3">
                  <div
                    className="mt-1.5 h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: brandColor }}
                  />
                  <div>
                    <span className="font-semibold text-foreground">{decision.title}</span>
                    <span className="text-muted-foreground"> — {decision.context}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Items Table */}
          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-4">
              Action Items
            </h2>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Task</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Owner</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Due</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {actionItems.map((item, index) => {
                    const statusStyle = getStatusStyle(item.status)
                    return (
                      <tr key={index} className="border-t border-border">
                        <td className="py-3 px-4 text-foreground">{item.task}</td>
                        <td className="py-3 px-4 text-muted-foreground">{item.owner}</td>
                        <td className="py-3 px-4 text-muted-foreground">{item.dueDate}</td>
                        <td className="py-3 px-4">
                          <span
                            className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                            style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                          >
                            {statusStyle.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Next Steps */}
          <div className="mb-8">
            <h2 className="text-sm uppercase tracking-wider text-muted-foreground font-semibold mb-4">
              Next Steps
            </h2>
            <ol className="space-y-2">
              {nextSteps.map((step, index) => (
                <li key={index} className="flex gap-3 text-foreground">
                  <span
                    className="shrink-0 h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                    style={{ backgroundColor: brandColor }}
                  >
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Next Meeting */}
          <div className="mb-8 p-4 border border-border rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${brandColor}15` }}
              >
                <Calendar className="h-5 w-5" style={{ color: brandColor }} />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Next Meeting</div>
                <div className="text-foreground font-medium">{nextMeetingDate} at {nextMeetingTime}</div>
              </div>
            </div>
            <a
              href={calendarLink}
              className="flex items-center gap-1 text-sm font-medium hover:underline"
              style={{ color: brandColor }}
            >
              Add to calendar
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Confirmation Block */}
          <div className="mb-8 p-6 bg-muted/30 rounded-xl border border-border text-center">
            {confirmed ? (
              <div className="space-y-2">
                <div
                  className="mx-auto h-12 w-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#dcfce7" }}
                >
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <p className="font-semibold text-foreground">Thanks for confirming!</p>
                <p className="text-sm text-muted-foreground">We have noted that you reviewed this recap.</p>
              </div>
            ) : showChangeRequest ? (
              <div className="space-y-4">
                <p className="font-medium text-foreground">What would you like to change?</p>
                <textarea
                  className="w-full p-3 border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2"
                  style={{ focusRingColor: brandColor } as React.CSSProperties}
                  rows={3}
                  placeholder="Describe the changes you'd like to request..."
                />
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={() => setShowChangeRequest(false)}
                    className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowChangeRequest(false)
                      setConfirmed(true)
                    }}
                    className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
                    style={{ backgroundColor: brandColor }}
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setConfirmed(true)}
                  className="w-full py-3.5 px-6 text-white font-semibold rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ backgroundColor: brandColor }}
                >
                  <Check className="h-5 w-5" />
                  Confirm I've reviewed this recap
                </button>
                <button
                  onClick={() => setShowChangeRequest(true)}
                  className="text-sm font-medium hover:underline"
                  style={{ color: brandColor }}
                >
                  Request a change
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-border my-8" />

          {/* Footer */}
          <div className="text-center space-y-2">
            <p className="text-sm text-foreground font-medium">{agencyName}</p>
            <p className="text-xs text-muted-foreground">
              Sent via <span className="font-medium">AgencyRecap</span>
            </p>
            <a
              href="#"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors underline"
            >
              Unsubscribe from these emails
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
