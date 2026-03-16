"use client"

import { cn } from "@/lib/utils"

const STEPS = [
  { number: 1, label: "Calendar" },
  { number: 2, label: "Meetings" },
  { number: 3, label: "Branding" },
  { number: 4, label: "Client" },
]

interface ProgressBarProps {
  currentStep: number
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        {STEPS.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                  currentStep > step.number
                    ? "bg-electric-blue text-primary-foreground"
                    : currentStep === step.number
                    ? "bg-electric-blue text-primary-foreground ring-4 ring-electric-blue/20"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {currentStep > step.number ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium hidden sm:block",
                  currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <div className="flex-1 h-px mx-3 mt-0 sm:-mt-5 transition-all duration-300">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    currentStep > step.number ? "bg-electric-blue" : "bg-border"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
