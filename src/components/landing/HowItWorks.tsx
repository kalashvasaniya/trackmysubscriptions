"use client"

import { useEffect, useRef, useState } from "react"
import { RiArrowRightLine, RiAddLine, RiBellLine, RiPieChartLine, RiCheckLine, RiTimeLine } from "@remixicon/react"
import Link from "next/link"
import { Button } from "@/components/Button"

const steps = [
  {
    step: "01",
    name: "Add Subscriptions",
    description: "Import via CSV or add manually. Set billing cycles, amounts, and organize with folders.",
    icon: RiAddLine,
  },
  {
    step: "02", 
    name: "Get Smart Alerts",
    description: "Receive email notifications before renewals. Customize timing — 1, 3, or 7 days before.",
    icon: RiBellLine,
  },
  {
    step: "03",
    name: "Track & Optimize",
    description: "View spending insights, identify unused subscriptions, and take control of your finances.",
    icon: RiPieChartLine,
  },
]

export function HowItWorks() {
  const [inView, setInView] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  // Auto cycle through steps
  useEffect(() => {
    if (!inView) return
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(timer)
  }, [inView])

  return (
    <section id="how-it-works" className="py-16 sm:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm dark:border-gray-800 dark:bg-gray-950">
            <span className="font-medium text-gray-900 dark:text-white">How It Works</span>
          </div>
          <h2 className="mt-4 sm:mt-6 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Get started in
            <br className="sm:hidden" />
            <span className="sm:ml-2 text-gray-400 dark:text-gray-500">3 simple steps</span>
          </h2>
        </div>

        {/* Main Content */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start lg:items-center">
          {/* Left - Steps */}
          <div className="space-y-4 sm:space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className={`relative rounded-xl sm:rounded-2xl border p-4 sm:p-6 transition-all duration-500 cursor-pointer ${
                  activeStep === index
                    ? "border-gray-900 bg-white shadow-lg sm:shadow-xl dark:border-white dark:bg-gray-950"
                    : "border-gray-200 bg-white/50 dark:border-gray-800 dark:bg-gray-950/50"
                } ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
                style={{ transitionDelay: `${index * 150}ms` }}
                onClick={() => setActiveStep(index)}
              >
                {/* Progress bar */}
                {activeStep === index && (
                  <div className="absolute bottom-0 left-0 h-0.5 sm:h-1 bg-gray-900 dark:bg-white rounded-b-xl sm:rounded-b-2xl animate-[progress_3s_linear]" style={{ width: "100%" }} />
                )}
                
                <div className="flex items-start gap-3 sm:gap-5">
                  {/* Step number */}
                  <div className={`flex size-10 sm:size-12 shrink-0 items-center justify-center rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-colors duration-300 ${
                    activeStep === index
                      ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                      : "bg-gray-100 text-gray-400 dark:bg-gray-800"
                  }`}>
                    {step.step}
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <h3 className={`text-base sm:text-lg font-semibold transition-colors duration-300 ${
                      activeStep === index ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {step.name}
                    </h3>
                    <p className={`mt-1 sm:mt-2 text-xs sm:text-sm leading-relaxed transition-colors duration-300 ${
                      activeStep === index ? "text-gray-600 dark:text-gray-300" : "text-gray-400 dark:text-gray-500"
                    }`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Demo Cards */}
          <div 
            className={`relative transition-all duration-700 delay-300 ${
              inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            {/* Demo Card Container */}
            <div className="relative h-[320px] sm:h-[380px] lg:h-[420px]">
              {/* Step 1 Card */}
              <div className={`absolute inset-0 rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-lg sm:shadow-xl transition-all duration-500 dark:border-gray-800 dark:bg-gray-950 ${
                activeStep === 0 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
              }`}>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  <RiAddLine className="size-3.5 sm:size-4" />
                  Add Subscriptions
                </div>
                <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3">
                  {/* Netflix */}
                  <div 
                    className={`flex items-center justify-between rounded-lg sm:rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4 transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 ${
                      activeStep === 0 && inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                    style={{ transitionDelay: "200ms" }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex size-8 sm:size-10 items-center justify-center rounded-md sm:rounded-lg bg-black">
                        <svg viewBox="0 0 111 30" className="h-3 sm:h-4 w-auto fill-[#E50914]">
                          <path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.563 26.937c-4.187-.281-8.375-.53-12.656-.625V0h4.687v21.875c2.688.062 5.375.28 7.969.405v4.657zM64.25 10.657v4.687h-6.406V26H53.22V0h13.125v4.687h-8.5v5.97h6.406zm-18.906-5.97V26.25c-1.563 0-3.156 0-4.688.062V4.687h-4.844V0h14.406v4.687h-4.874zM30.75 15.593c-2.062 0-4.5 0-6.25.095v6.968c2.75-.188 5.5-.406 8.281-.5v4.5l-12.968 1.032V0H32.78v4.687H24.5V11c1.813 0 4.594-.094 6.25-.094v4.688zM4.78 12.968v16.375C3.094 29.531 1.593 29.75 0 30V0h4.469l6.093 17.032V0h4.688v28.062c-1.656.282-3.344.376-5.125.625L4.78 12.968z"/>
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Netflix</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">$14.99</span>
                  </div>
                  {/* Spotify */}
                  <div 
                    className={`flex items-center justify-between rounded-lg sm:rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4 transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 ${
                      activeStep === 0 && inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                    style={{ transitionDelay: "300ms" }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex size-8 sm:size-10 items-center justify-center rounded-md sm:rounded-lg bg-[#1DB954]">
                        <svg viewBox="0 0 24 24" className="size-5 sm:size-6 fill-white">
                          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Spotify</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">$9.99</span>
                  </div>
                  {/* Adobe CC */}
                  <div 
                    className={`flex items-center justify-between rounded-lg sm:rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4 transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 ${
                      activeStep === 0 && inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                    style={{ transitionDelay: "400ms" }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex size-8 sm:size-10 items-center justify-center rounded-md sm:rounded-lg bg-[#ED2224]">
                        <svg viewBox="0 0 30 26" className="size-5 sm:size-6 fill-white">
                          <path d="M19.1 0H30v26L19.1 0zM10.9 0H0v26L10.9 0zM15 9.6L22.1 26h-4.6l-2.1-5.2h-5.2L15 9.6z"/>
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Adobe CC</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">$54.99</span>
                  </div>
                  {/* GitHub Pro */}
                  <div 
                    className={`flex items-center justify-between rounded-lg sm:rounded-xl border border-gray-100 bg-gray-50 p-3 sm:p-4 transition-all duration-300 dark:border-gray-800 dark:bg-gray-900 ${
                      activeStep === 0 && inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                    style={{ transitionDelay: "500ms" }}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="flex size-8 sm:size-10 items-center justify-center rounded-md sm:rounded-lg bg-[#24292F]">
                        <svg viewBox="0 0 24 24" className="size-5 sm:size-6 fill-white">
                          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                        </svg>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">GitHub Pro</span>
                    </div>
                    <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">$4.00</span>
                  </div>
                </div>
              </div>

              {/* Step 2 Card */}
              <div className={`absolute inset-0 rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-lg sm:shadow-xl transition-all duration-500 dark:border-gray-800 dark:bg-gray-950 ${
                activeStep === 1 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
              }`}>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  <RiBellLine className="size-3.5 sm:size-4" />
                  Smart Alerts
                </div>
                <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  <div className="rounded-lg sm:rounded-xl border-2 border-amber-200 bg-amber-50 p-4 sm:p-5 dark:border-amber-800 dark:bg-amber-950/50">
                    <div className="flex items-center gap-2">
                      <RiTimeLine className="size-4 sm:size-5 text-amber-600" />
                      <span className="text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400">Reminder</span>
                    </div>
                    <p className="mt-2 sm:mt-3 text-sm sm:text-lg font-semibold text-amber-900 dark:text-amber-100">Netflix renews in 3 days</p>
                    <p className="mt-1 text-xs sm:text-sm text-amber-700 dark:text-amber-300">$14.99 will be charged on Jan 15</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-emerald-200 bg-emerald-50 p-3 sm:p-4 dark:border-emerald-800 dark:bg-emerald-950/50">
                    <div className="flex size-6 sm:size-8 items-center justify-center rounded-full bg-emerald-500">
                      <RiCheckLine className="size-3 sm:size-4 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300">Alert sent to your email</span>
                  </div>
                  <div className="rounded-lg sm:rounded-xl bg-gray-50 p-3 sm:p-4 dark:bg-gray-900">
                    <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">Alert Timeline</p>
                    <div className="mt-2 sm:mt-3 flex items-center gap-2">
                      <div className="h-1.5 sm:h-2 flex-1 rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-full w-3/4 rounded-full bg-amber-500 animate-pulse" />
                      </div>
                      <span className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400">3 days left</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 Card */}
              <div className={`absolute inset-0 rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-lg sm:shadow-xl transition-all duration-500 dark:border-gray-800 dark:bg-gray-950 ${
                activeStep === 2 ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
              }`}>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                  <RiPieChartLine className="size-3.5 sm:size-4" />
                  Track & Optimize
                </div>
                <div className="mt-4 sm:mt-6">
                  <div className="rounded-lg sm:rounded-xl border-2 border-emerald-200 bg-emerald-50 p-4 sm:p-5 dark:border-emerald-800 dark:bg-emerald-950/50">
                    <p className="text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">Monthly Savings</p>
                    <p className="mt-1 sm:mt-2 text-3xl sm:text-4xl font-bold text-emerald-700 dark:text-emerald-300">$47.99</p>
                    <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">From cancelled unused subscriptions</p>
                  </div>
                  <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                    <div className="rounded-lg sm:rounded-xl bg-gray-50 p-3 sm:p-4 text-center dark:bg-gray-900">
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">24</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">Active</p>
                    </div>
                    <div className="rounded-lg sm:rounded-xl bg-gray-50 p-3 sm:p-4 text-center dark:bg-gray-900">
                      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">3</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">Paused</p>
                    </div>
                    <div className="rounded-lg sm:rounded-xl bg-gray-50 p-3 sm:p-4 text-center dark:bg-gray-900">
                      <p className="text-xl sm:text-2xl font-bold text-emerald-600">5</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">Cancelled</p>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 h-16 sm:h-24 rounded-lg sm:rounded-xl bg-gray-50 p-3 sm:p-4 dark:bg-gray-900">
                    <div className="flex h-full items-end gap-1 sm:gap-2">
                      {[40, 65, 45, 80, 55, 70, 60].map((h, i) => (
                        <div 
                          key={i} 
                          className="flex-1 rounded-t bg-gray-900 dark:bg-white transition-all duration-500"
                          style={{ height: `${h}%`, transitionDelay: `${i * 50}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div 
          className={`mt-12 sm:mt-16 lg:mt-20 text-center transition-all duration-700 delay-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Button size="lg" asChild className="px-6 sm:px-8 w-full sm:w-auto">
            <Link href="/register">
              Start Tracking Now
              <RiArrowRightLine className="size-4" />
            </Link>
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  )
}
