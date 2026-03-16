'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { RotateCw } from 'lucide-react'

interface Speaker {
  name: string
  timestamp: string
  text: string
  confidence: 'high' | 'medium' | 'low'
}

const mockTranscript: Speaker[] = [
  {
    name: 'Sarah Johnson',
    timestamp: '0:00',
    text: 'Good morning everyone. Today we\'re discussing Q2 marketing strategy and our new campaign initiatives.',
    confidence: 'high',
  },
  {
    name: 'Mike Chen',
    timestamp: '0:45',
    text: 'I\'ve prepared the budget breakdown. We\'re looking at a 20% increase in digital ad spend.',
    confidence: 'high',
  },
  {
    name: 'Sarah Johnson',
    timestamp: '2:15',
    text: 'Sounds good. We need to finalize the creative assets by end of week.',
    confidence: 'high',
  },
  {
    name: 'Alex Rivera',
    timestamp: '3:20',
    text: 'The social media team will need those assets. We want to launch the TikTok campaign in parallel.',
    confidence: 'medium',
  },
  {
    name: 'Mike Chen',
    timestamp: '4:50',
    text: 'I think we should also consider influencer partnerships. It could really amplify reach.',
    confidence: 'medium',
  },
  {
    name: 'Sarah Johnson',
    timestamp: '6:00',
    text: 'Great idea. Let\'s bring that up with the partnership team next week.',
    confidence: 'high',
  },
]

const confidenceDot = (level: 'high' | 'medium' | 'low') => {
  switch (level) {
    case 'high':
      return 'bg-green-500'
    case 'medium':
      return 'bg-amber-400'
    case 'low':
      return 'bg-red-500'
  }
}

export function MeetingPanel() {
  const [isReprocessing, setIsReprocessing] = useState(false)

  const handleReprocess = () => {
    setIsReprocessing(true)
    setTimeout(() => setIsReprocessing(false), 1500)
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-border">
      {/* Header */}
      <div className="border-b border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-2">Q2 Marketing Strategy</h2>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>March 15, 2026</span>
          <span>45 minutes</span>
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
              S
            </div>
            <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
              M
            </div>
            <div className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
              A
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {mockTranscript.map((item, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-start gap-3">
              <div className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${confidenceDot(item.confidence)}`} />
              <div className="flex-1">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-medium text-sm text-foreground">{item.name}</span>
                  <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reprocess Button */}
      <div className="border-t border-border p-6">
        <Button
          onClick={handleReprocess}
          disabled={isReprocessing}
          variant="outline"
          className="w-full gap-2"
        >
          <RotateCw className="w-4 h-4" />
          {isReprocessing ? 'Reprocessing...' : 'Re-process'}
        </Button>
      </div>
    </div>
  )
}
