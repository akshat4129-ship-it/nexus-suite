'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

interface BottomToolbarProps {
  onSaveDraft?: () => void
  onSchedule?: () => void
  onSendNow?: () => void
  recapScore?: number
  hasWarnings?: boolean
  warningText?: string
  isSending?: boolean
}

export function BottomToolbar({
  onSaveDraft,
  onSchedule,
  onSendNow,
  recapScore = 94,
  hasWarnings = true,
  warningText = '2 action items have no due date',
  isSending = false,
}: BottomToolbarProps) {
  const [sent, setSent] = useState(false)

  const handleSendNow = () => {
    onSendNow?.()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="border-t border-border bg-card/80 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky bottom-0 z-50">
      <div className="flex items-center gap-6">
        {/* Score Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-green-400">Recap Score: {recapScore}/100</span>
          </div>
        </div>

        {/* Warning */}
        {hasWarnings && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span className="text-sm text-amber-400">⚠ {warningText}</span>
          </div>
        )}

        {/* Success Message */}
        {sent && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-sm font-semibold text-green-400">Sent!</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onSaveDraft}
        >
          Save Draft
        </Button>
        <Button
          variant="outline"
          onClick={onSchedule}
        >
          Schedule Send
        </Button>
        <Button
          onClick={handleSendNow}
          disabled={isSending || sent}
          className="bg-primary hover:bg-primary/90"
        >
          {isSending ? 'Sending...' : sent ? 'Sent!' : 'Send Now'}
        </Button>
      </div>
    </div>
  )
}
