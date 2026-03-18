'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RotateCcw, Eye, EyeOff } from 'lucide-react'
import { ActionItemsTable } from './action-items-table'

interface EditableSection {
  subject: string
  opening: string
  decisions: string[]
  nextSteps: string[]
  nextMeeting: string
  signOff: string
}

interface EmailPreviewProps {
  initialData?: any
  onRegenerate?: (section: string) => void
  onUpdate?: (updatedData: any) => void
}

export function EmailPreview({ initialData, onRegenerate, onUpdate }: EmailPreviewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [showPreview, setShowPreview] = useState(true)
  const [template, setTemplate] = useState('Standard')
  const [content, setContent] = useState<EditableSection>({
    subject: initialData?.subject_line || 'Meeting Recap: Loading...',
    opening: initialData?.opening_paragraph || '',
    decisions: initialData?.decisions || [],
    nextSteps: initialData?.next_steps?.map((s: any) => s.text) || [],
    nextMeeting: initialData?.next_meeting_at ? new Date(initialData.next_meeting_at).toISOString().slice(0, 16) : '',
    signOff: initialData?.organization?.email_signature || 'Best regards,\nYour Agency',
  })

  // Sync state if initialData changes (e.g. after save)
  useEffect(() => {
    if (initialData) {
      setContent({
        subject: initialData.subject_line,
        opening: initialData.opening_paragraph,
        decisions: initialData.decisions || [],
        nextSteps: initialData.next_steps?.map((s: any) => s.text) || [],
        nextMeeting: initialData.next_meeting_at ? new Date(initialData.next_meeting_at).toISOString().slice(0, 16) : '',
        signOff: initialData.organization?.email_signature || 'Best regards,\nYour Agency',
      })
    }
  }, [initialData])

  const handleUpdateField = (field: keyof EditableSection, value: any) => {
    const newContent = { ...content, [field]: value }
    setContent(newContent)
    
    // Convert back to API format
    onUpdate?.({
      subject_line: newContent.subject,
      opening_paragraph: newContent.opening,
      decisions: newContent.decisions,
      next_steps: newContent.nextSteps.map((text: string, id: number) => ({ id, text })),
      next_meeting_at: newContent.nextMeeting,
    })
  }

  const handleUpdateDecision = (idx: number, value: string) => {
    const updated = [...content.decisions]
    updated[idx] = value
    handleUpdateField('decisions', updated)
  }

  const handleUpdateNextStep = (idx: number, value: string) => {
    const updated = [...content.nextSteps]
    updated[idx] = value
    handleUpdateField('nextSteps', updated)
  }

  const handleDeleteDecision = (idx: number) => {
    handleUpdateField('decisions', content.decisions.filter((_, i) => i !== idx))
  }

  const handleDeleteNextStep = (idx: number) => {
    handleUpdateField('nextSteps', content.nextSteps.filter((_, i) => i !== idx))
  }

  if (!showPreview) {
    return (
      <div className="h-full flex flex-col bg-card">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Email Preview</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(true)}
            className="gap-2"
          >
            <Eye className="w-4 h-4" />
            Show Preview
          </Button>
        </div>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Edit mode disabled
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-card">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Email Preview</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(false)}
              className="gap-2"
            >
              <EyeOff className="w-4 h-4" />
              Hide
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Template:</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="px-3 py-1.5 text-sm border border-border rounded bg-background text-foreground"
          >
            <option>Standard</option>
            <option>Formal</option>
            <option>Casual</option>
          </select>
        </div>
      </div>

      {/* Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Subject Line */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">Subject Line</label>
            <Button variant="ghost" size="sm" onClick={() => onRegenerate?.('subject')} className="gap-1.5 h-7 text-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              Regenerate
            </Button>
          </div>
          {isEditing ? (
            <Input
              value={content.subject}
              onChange={(e) => handleUpdateField('subject', e.target.value)}
              className="font-medium"
            />
          ) : (
            <p className="font-medium text-foreground border border-border rounded p-3 bg-muted/30">{content.subject}</p>
          )}
        </div>

        {/* Opening */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">Opening</label>
            <Button variant="ghost" size="sm" onClick={() => onRegenerate?.('opening')} className="gap-1.5 h-7 text-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              Regenerate
            </Button>
          </div>
          {isEditing ? (
            <Textarea
              value={content.opening}
              onChange={(e) => handleUpdateField('opening', e.target.value)}
              rows={3}
            />
          ) : (
            <p className="text-foreground whitespace-pre-wrap border border-border rounded p-3 bg-muted/30">{content.opening}</p>
          )}
        </div>

        {/* Decisions Made */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">Decisions Made</label>
            <Button variant="ghost" size="sm" onClick={() => onRegenerate?.('decisions')} className="gap-1.5 h-7 text-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              Regenerate
            </Button>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              {content.decisions.map((decision, idx) => (
                <div key={idx} className="flex gap-2">
                  <Input
                    value={decision}
                    onChange={(e) => handleUpdateDecision(idx, e.target.value)}
                    placeholder={`Decision ${idx + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDecision(idx)}
                    className="px-2 text-muted-foreground hover:text-red-600"
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-2 border border-border rounded p-3 bg-muted/30">
              {content.decisions.map((decision, idx) => (
                <li key={idx} className="text-foreground flex gap-2">
                  <span>•</span>
                  <span>{decision}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Items */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">Action Items</label>
            <Button variant="ghost" size="sm" onClick={() => onRegenerate?.('actions')} className="gap-1.5 h-7 text-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              Regenerate
            </Button>
          </div>
          {isEditing ? (
            <div className="border border-border rounded p-3 bg-muted/30">
              <ActionItemsTable isEditing={true} />
            </div>
          ) : (
            <div className="border border-border rounded p-3 bg-muted/30">
              <ActionItemsTable isEditing={false} />
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-semibold text-foreground">Next Steps</label>
            <Button variant="ghost" size="sm" onClick={() => onRegenerate?.('steps')} className="gap-1.5 h-7 text-xs">
              <RotateCcw className="w-3.5 h-3.5" />
              Regenerate
            </Button>
          </div>
          {isEditing ? (
            <div className="space-y-2">
              {content.nextSteps.map((step, idx) => (
                <div key={idx} className="flex gap-2">
                  <span className="text-muted-foreground font-medium">{idx + 1}.</span>
                  <Input
                    value={step}
                    onChange={(e) => handleUpdateNextStep(idx, e.target.value)}
                    placeholder={`Next step ${idx + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNextStep(idx)}
                    className="px-2 text-muted-foreground hover:text-red-600"
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <ol className="space-y-2 border border-border rounded p-3 bg-muted/30">
              {content.nextSteps.map((step, idx) => (
                <li key={idx} className="text-foreground flex gap-2">
                  <span className="font-medium">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Next Meeting */}
        <div className="space-y-2">
          <label className="font-semibold text-foreground">Next Meeting</label>
          {isEditing ? (
            <Input
              type="datetime-local"
              value={content.nextMeeting}
              onChange={(e) => handleUpdateField('nextMeeting', e.target.value)}
            />
          ) : (
            <p className="text-foreground border border-border rounded p-3 bg-muted/30">
              {new Date(content.nextMeeting).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </div>

        {/* Sign-off */}
        <div className="space-y-2">
          <label className="font-semibold text-foreground">Sign-off</label>
          {isEditing ? (
            <Textarea
              value={content.signOff}
              onChange={(e) => handleUpdateField('signOff', e.target.value)}
              rows={2}
            />
          ) : (
            <p className="text-foreground whitespace-pre-wrap border border-border rounded p-3 bg-muted/30">{content.signOff}</p>
          )}
        </div>
      </div>
    </div>
  )
}
