'use client'

import { useState, useEffect } from 'react'
import { MeetingPanel } from './meeting-panel'
import { EmailPreview } from './email-preview'
import { BottomToolbar } from './bottom-toolbar'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export function RecapEditor() {
  const [isRegenerating, setIsRegenerating] = useState<string | null>(null)
  const [direction, setDirection] = useState<'horizontal' | 'vertical'>('horizontal')

  useEffect(() => {
    const checkWidth = () => {
      setDirection(window.innerWidth < 768 ? 'vertical' : 'horizontal')
    }
    checkWidth()
    window.addEventListener('resize', checkWidth)
    return () => window.removeEventListener('resize', checkWidth)
  }, [])

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
        <ResizablePanelGroup direction={direction} className="flex-1">
          {/* Left Panel - Meeting Transcript */}
          <ResizablePanel defaultSize={direction === 'horizontal' ? 50 : 40} minSize={30}>
            <div className="h-full overflow-hidden">
              <MeetingPanel />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Right Panel - Email Preview */}
          <ResizablePanel defaultSize={direction === 'horizontal' ? 50 : 60} minSize={30}>
            <div className="h-full overflow-hidden">
              <EmailPreview onRegenerate={handleRegenerate} />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
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
