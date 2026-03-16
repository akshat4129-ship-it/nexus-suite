"use client"

import { useState } from "react"
import { ProgressBar } from "./progress-bar"
import { Step1Calendar } from "./step1-calendar"
import { Step2Meetings } from "./step2-meetings"
import { Step3Brand } from "./step3-brand"
import { Step4Client } from "./step4-client"

export function OnboardingFlow() {
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)

  const next = () => setStep(s => Math.min(s + 1, 4))
  const back = () => setStep(s => Math.max(s - 1, 1))

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-5 max-w-sm mx-auto">
          <div className="w-20 h-20 bg-electric-blue/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-electric-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">You're all set!</h1>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              Your account is ready. Start your first call and AgencyRecap will handle the rest.
            </p>
          </div>
          <button
            onClick={() => { setDone(false); setStep(1) }}
            className="text-sm text-electric-blue hover:underline font-medium"
          >
            Restart demo
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-navy rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-foreground tracking-tight">AgencyRecap</span>
          </div>
          <span className="text-sm text-muted-foreground font-medium">
            Step {step} of 4
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-start justify-center py-10 px-4">
        <div className="w-full max-w-3xl">
          {/* Progress */}
          <div className="mb-8">
            <ProgressBar currentStep={step} />
          </div>

          {/* Step card */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
            {step === 1 && <Step1Calendar onNext={next} />}
            {step === 2 && <Step2Meetings onNext={next} onBack={back} />}
            {step === 3 && <Step3Brand onNext={next} onBack={back} />}
            {step === 4 && <Step4Client onBack={back} onFinish={() => setDone(true)} />}
          </div>

          {/* Reassurance footer */}
          <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed">
            Your data is encrypted and never shared. You can disconnect integrations at any time.
          </p>
        </div>
      </main>
    </div>
  )
}
