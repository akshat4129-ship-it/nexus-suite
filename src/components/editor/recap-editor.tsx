'use client'

import { useState } from 'react'
import { MeetingPanel } from './meeting-panel'
import { EmailPreview } from './email-preview'
import { BottomToolbar } from './bottom-toolbar'

export function RecapEditor() {
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null)

  const handleRegenerate = (section: string) => {
    setIsRegenerating(section)
    setTimeout(() => setIsRegenerating(null), 1500)
  }

  const handleSaveDraft = () => {
    console.log('Draft saved')
  }

  const handleSchedule = () => {
    console.log('Schedule send opened')
  }

  const handleSendNow = () => {
    console.log('Sending email...')
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Meeting Transcript (50%) */}
        <div className="w-1/2 overflow-hidden">
          <MeetingPanel />
        </div>

        {/* Right Panel - Email Preview (50%) */}
        <div className="w-1/2 overflow-hidden">
          <EmailPreview onRegenerate={handleRegenerate} />
        </div>
      </div>

      {/* Bottom Toolbar */}
      <BottomToolbar
        onSaveDraft={handleSaveDraft}
        onSchedule={handleSchedule}
        onSendNow={handleSendNow}
        recapScore={94}
        hasWarnings={true}
        warningText="2 action items have no due date"
      />
    </div>
  )
}
