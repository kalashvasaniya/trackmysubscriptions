"use client"

import { useEffect, useRef, useState } from "react"
import {
  RiBellLine,
  RiCalendarLine,
  RiFileExcelLine,
  RiFolderLine,
  RiGiftLine,
  RiListCheck2,
  RiLineChartLine,
  RiShieldCheckLine,
  RiArrowRightLine,
} from "@remixicon/react"
import Link from "next/link"

const features = [
  {
    name: "CSV Import & Export",
    description: "Import subscriptions in bulk via CSV or export your data anytime for backup.",
    icon: RiFileExcelLine,
    color: "bg-emerald-500",
    lightBg: "bg-emerald-50 dark:bg-emerald-950/50",
  },
  {
    name: "Track Everything",
    description: "From streaming to gym memberships — track all recurring expenses.",
    icon: RiListCheck2,
    color: "bg-blue-500",
    lightBg: "bg-blue-50 dark:bg-blue-950/50",
  },
  {
    name: "Lifetime Deals",
    description: "Keep track of lifetime deals and never miss a refund window.",
    icon: RiGiftLine,
    color: "bg-purple-500",
    lightBg: "bg-purple-50 dark:bg-purple-950/50",
  },
  {
    name: "Smart Organization",
    description: "Organize with folders, tags, and payment methods.",
    icon: RiFolderLine,
    color: "bg-amber-500",
    lightBg: "bg-amber-50 dark:bg-amber-950/50",
  },
  {
    name: "Smart Alerts",
    description: "Get notified before renewals. Customize alert timing.",
    icon: RiBellLine,
    color: "bg-red-500",
    lightBg: "bg-red-50 dark:bg-red-950/50",
  },
  {
    name: "Calendar View",
    description: "Visualize payments on a calendar. Spot expensive months.",
    icon: RiCalendarLine,
    color: "bg-cyan-500",
    lightBg: "bg-cyan-50 dark:bg-cyan-950/50",
  },
  {
    name: "Detailed Analytics",
    description: "Insights into spending patterns and month-over-month trends.",
    icon: RiLineChartLine,
    color: "bg-indigo-500",
    lightBg: "bg-indigo-50 dark:bg-indigo-950/50",
  },
  {
    name: "Secure & Private",
    description: "Your data is encrypted. We never share your information.",
    icon: RiShieldCheckLine,
    color: "bg-gray-900 dark:bg-white",
    lightBg: "bg-gray-100 dark:bg-gray-800",
  },
]

export function Features() {
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
    <section id="features" className="py-16 sm:py-24 lg:py-32 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          ref={ref}
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm dark:border-gray-800 dark:bg-gray-900">
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-blue-500"></span>
            </span>
            <span className="font-medium text-gray-900 dark:text-white">Features</span>
          </div>
          <h2 className="mt-4 sm:mt-6 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Everything you need to
            <br />
            <span className="text-gray-400 dark:text-gray-500">take control</span>
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-500 dark:text-gray-400">
            Simple to set up, powerful to use. All the tools you need.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="grid grid-cols-1 gap-3 sm:gap-4 xs:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className={`group relative rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 lg:p-6 transition-all duration-500 hover:border-gray-300 hover:shadow-lg sm:hover:shadow-2xl sm:hover:shadow-gray-200/50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 dark:hover:shadow-none ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 75}ms` }}
              >
                {/* Animated background */}
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gray-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-gray-800/50" />
                
                {/* Icon */}
                <div className={`relative ${feature.lightBg} w-fit rounded-lg sm:rounded-xl p-2 sm:p-3 transition-transform duration-500 group-hover:scale-110`}>
                  <feature.icon className={`size-5 sm:size-6 ${feature.color === "bg-gray-900 dark:bg-white" ? "text-gray-900 dark:text-white" : "text-white"} ${feature.color} rounded-md sm:rounded-lg p-0.5 sm:p-1`} />
                </div>

                {/* Content */}
                <h3 className="relative mt-3 sm:mt-4 lg:mt-5 text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                  {feature.name}
                </h3>
                <p className="relative mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover arrow - hidden on mobile */}
                <div className="relative mt-3 sm:mt-4 hidden sm:flex items-center gap-1 text-xs sm:text-sm font-medium text-gray-900 opacity-0 transition-all duration-300 group-hover:opacity-100 dark:text-white">
                  <span>Learn more</span>
                  <RiArrowRightLine className="size-3 sm:size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div 
          className={`mt-10 sm:mt-12 lg:mt-16 flex items-center justify-center transition-all duration-700 delay-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <Link 
            href="/register"
            className="group inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-gray-900 dark:text-white"
          >
            <span>Explore all features</span>
            <RiArrowRightLine className="size-3.5 sm:size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
