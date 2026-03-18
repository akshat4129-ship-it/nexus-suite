'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { toast } from 'sonner'
import { MeetingPanel } from './meeting-panel'
import { EmailPreview } from './email-preview'
import { BottomToolbar } from './bottom-toolbar'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function RecapEditor() {
  const { id } = useParams()
  const router = useRouter()
  const { data: recap, error, mutate, isLoading } = useSWR(`/api/recaps/${id}`, fetcher)
  
  const [isSaving, setIsSaving] = useState(false)
  const [isSending, setIsSending] = useState(false)
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
    toast.info(`Regenerating ${section}...`)
    // Simulation of AI regeneration
    setTimeout(() => toast.success(`${section} regenerated with GPT-4o`), 1200)
  }

  const handleSaveDraft = async (updatedData: any) => {
    setIsSaving(true)
    try {
      const res = await fetch(`/api/recaps/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })
      if (!res.ok) throw new Error('Failed to save draft')
      toast.success('Draft synchronization complete')
      mutate()
    } catch (e) {
      toast.error('Sync failure: Local only')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSendNow = async () => {
    setIsSending(true)
    try {
      const res = await fetch(`/api/recaps/${id}/send`, { method: 'POST' })
      if (!res.ok) throw new Error('Send failed')
      toast.success('Recap dispatched to client nodes')
      router.push('/dashboard')
    } catch (e) {
      toast.error('Communication error: Node unreachable')
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-background text-indigo-400 font-bold tracking-widest animate-pulse">SYNCHRONIZING RECAP ASSETS...</div>
  if (error) return <div className="h-screen flex items-center justify-center bg-background text-red-400">NODE OFFLINE: RECAP NOT FOUND</div>

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        <ResizablePanelGroup direction={direction} className="flex-1">
          {/* Left Panel - Meeting Transcript */}
          <ResizablePanel defaultSize={direction === 'horizontal' ? 50 : 40} minSize={30}>
            <div className="h-full overflow-hidden">
              <MeetingPanel 
                initialData={recap?.meeting?.transcript} 
                meetingData={recap?.meeting} 
              />
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          {/* Right Panel - Email Preview */}
          <ResizablePanel defaultSize={direction === 'horizontal' ? 50 : 60} minSize={30}>
            <div className="h-full overflow-hidden">
              <EmailPreview 
                initialData={recap} 
                onRegenerate={handleRegenerate} 
                onUpdate={handleSaveDraft}
              />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>


      {/* Bottom Toolbar */}
      <BottomToolbar
        onSaveDraft={() => handleSaveDraft(recap)}
        onSchedule={() => toast.info('Scheduling module initializing...')}
        onSendNow={handleSendNow}
        isSending={isSending}
        recapScore={recap?.quality_score || 90}
        hasWarnings={!recap?.next_meeting_at}
        warningText="Next meeting parameter not set"
      />
    </div>
  )
}
