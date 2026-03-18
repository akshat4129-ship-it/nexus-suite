"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ProgressBar } from "./progress-bar"
import { Step1Calendar } from "./step1-calendar"
import { Step2Meetings } from "./step2-meetings"
import { Step3Brand } from "./step3-brand"
import { Step4Client } from "./step4-client"
import { Box, CheckCircle2, Globe, Shield, Zap } from "lucide-react"

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function OnboardingFlow() {
  const [step, setStep] = useState(1)
  const [done, setDone] = useState(false)

  const next = () => setStep(s => Math.min(s + 1, 4))
  const back = () => setStep(s => Math.max(s - 1, 1))

  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8 max-w-md mx-auto glass-card p-12"
        >
          <div className="w-24 h-24 bg-gradient-premium rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(99,102,241,0.4)]">
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white tracking-tighter mb-4">Node Activated</h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              Your Nexus node is now synchronized with the global fabric. Ready for intelligent orchestration.
            </p>
          </div>
          <button
            onClick={() => { setDone(false); setStep(1) }}
            className="btn-premium text-white w-full"
          >
            Enter Dashboard
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center">
      <motion.div 
        initial="initial"
        animate="animate"
        variants={fadeInUp}
        className="w-full max-w-3xl"
      >
        <div className="text-center mb-12">
           <span className="px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6 inline-block">
             Initialization Phase {step}/4
           </span>
           <h2 className="text-4xl font-black text-white tracking-tighter mb-4">
             Configure your <span className="text-glow bg-gradient-premium bg-clip-text text-transparent">Nexus Node</span>
           </h2>
        </div>

        {/* Progress */}
        <div className="mb-12">
          <ProgressBar currentStep={step} />
        </div>

        {/* Step card */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="glass-card p-1"
          >
            <div className="bg-black/40 rounded-[calc(1rem-4px)] p-8 sm:p-12">
              {step === 1 && <Step1Calendar onNext={next} />}
              {step === 2 && <Step2Meetings onNext={next} onBack={back} />}
              {step === 3 && <Step3Brand onNext={next} onBack={back} />}
              {step === 4 && <Step4Client onBack={back} onFinish={() => setDone(true)} />}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Reassurance footer */}
        <div className="flex items-center justify-center gap-6 mt-12 text-gray-500">
           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
              <Shield className="w-3 h-3 text-indigo-400" />
              Quantum Encrypted
           </div>
           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
              <Zap className="w-3 h-3 text-indigo-400" />
              Real-time Sync
           </div>
        </div>
      </motion.div>
    </div>
  )
}
