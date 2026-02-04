"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/Button"
import { RiCheckLine, RiArrowRightLine, RiSparklingLine, RiGiftLine } from "@remixicon/react"

const features = [
  "Unlimited subscriptions",
  "Smart email alerts",
  "Calendar view",
  "CSV import & export",
  "30+ currencies",
  "Folders & tags",
  "Analytics & reports",
  "All future updates",
]

export function Pricing() {
  const [inView, setInView] = useState(false)
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

  return (
    <section id="pricing" className="py-16 sm:py-24 lg:py-32 bg-white dark:bg-gray-950 overflow-hidden">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm dark:border-gray-800 dark:bg-gray-900">
            <RiGiftLine className="size-3.5 sm:size-4 text-emerald-500" />
            <span className="font-medium text-gray-900 dark:text-white">100% Free & Open Source</span>
          </div>
          <h2 className="mt-4 sm:mt-6 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Free forever,
            <br className="sm:hidden" />
            <span className="sm:ml-2 text-gray-400 dark:text-gray-500">no catch</span>
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-500 dark:text-gray-400">
            All features included. No premium tier. No hidden fees.
          </p>
        </div>

        {/* Pricing Card */}
        <div 
          className={`mx-auto mt-10 sm:mt-12 lg:mt-16 max-w-md sm:max-w-lg transition-all duration-700 delay-200 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-emerald-500 bg-white p-6 sm:p-8 shadow-xl sm:shadow-2xl dark:border-emerald-400 dark:bg-gray-900">
            {/* Free badge */}
            <div className="absolute -right-10 sm:-right-12 top-6 sm:top-8 rotate-45 bg-emerald-500 px-10 sm:px-12 py-1 text-[10px] sm:text-xs font-medium text-white">
              Free Forever
            </div>

            {/* Header */}
            <div className="text-center">
              <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">Open Source</p>
              <div className="mt-3 sm:mt-4 flex items-baseline justify-center gap-1">
                <span className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">$0</span>
                <span className="text-lg sm:text-xl text-gray-500">forever</span>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                No credit card required • No limits
              </p>
            </div>

            {/* CTA */}
            <div className="mt-6 sm:mt-8">
              <Button 
                asChild
                size="lg" 
                className="w-full text-sm sm:text-base py-5 sm:py-6"
              >
                <a href="/register">
                  Get Started Free
                  <RiArrowRightLine className="size-4 sm:size-5" />
                </a>
              </Button>
            </div>

            {/* Features */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">Everything included:</p>
              <ul className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                {features.map((feature, index) => (
                  <li 
                    key={feature} 
                    className={`flex items-center gap-2 sm:gap-3 transition-all duration-300 ${
                      inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                    }`}
                    style={{ transitionDelay: `${index * 50 + 400}ms` }}
                  >
                    <div className="flex size-4 sm:size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500">
                      <RiCheckLine className="size-2.5 sm:size-3 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Trust badges */}
          <div 
            className={`mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 transition-all duration-700 delay-500 ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
              <RiCheckLine className="size-3.5 sm:size-4 text-emerald-500" />
              No account limits
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
              <RiSparklingLine className="size-3.5 sm:size-4 text-emerald-500" />
              Open source
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
              <RiGiftLine className="size-3.5 sm:size-4 text-emerald-500" />
              Self-hostable
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
