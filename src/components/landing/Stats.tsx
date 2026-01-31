"use client"

import { useEffect, useState, useRef } from "react"
import { RiGroupLine, RiStarFill, RiFileList3Line, RiMoneyDollarCircleLine } from "@remixicon/react"

const stats = [
  { 
    id: 1, 
    name: "Happy Users", 
    value: 20000, 
    suffix: "+", 
    prefix: "",
    description: "Trust us",
    icon: RiGroupLine,
  },
  { 
    id: 2, 
    name: "5-Star Reviews", 
    value: 600, 
    suffix: "+", 
    prefix: "",
    description: "On App Store",
    icon: RiStarFill,
  },
  { 
    id: 3, 
    name: "Subscriptions", 
    value: 250000, 
    suffix: "+", 
    prefix: "",
    description: "Being tracked",
    icon: RiFileList3Line,
  },
  { 
    id: 4, 
    name: "Money Saved", 
    value: 1000000, 
    suffix: "+", 
    prefix: "$",
    description: "By our users",
    icon: RiMoneyDollarCircleLine,
  },
]

function AnimatedCounter({
  value,
  prefix,
  suffix,
  inView,
}: {
  value: number
  prefix: string
  suffix: string
  inView: boolean
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!inView) return
    
    const duration = 2000
    const steps = 60
    const stepValue = value / steps
    let current = 0
    const timer = setInterval(() => {
      current += stepValue
      if (current >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value, inView])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(0) + "M"
    if (num >= 1000) return (num / 1000).toFixed(0) + "K"
    return num.toString()
  }

  return (
    <span>{prefix}{formatNumber(count)}{suffix}</span>
  )
}

export function Stats() {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-white dark:bg-gray-950 overflow-hidden">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Trusted by
            <span className="text-gray-400 dark:text-gray-500"> 20,000+ </span>
            <br className="sm:hidden" />
            users worldwide
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-500 dark:text-gray-400">
            Join thousands who have already taken control of their subscription spending.
          </p>
        </div>

        {/* Stats Grid */}
        <dl className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 lg:p-8 transition-all duration-500 hover:border-gray-300 hover:shadow-lg sm:hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Animated background on hover */}
              <div className="absolute inset-0 bg-gray-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100 dark:bg-gray-800/50" />
              
              {/* Icon */}
              <div className="relative flex size-10 sm:size-12 items-center justify-center rounded-lg sm:rounded-xl bg-gray-100 transition-transform duration-500 group-hover:scale-110 dark:bg-gray-800">
                <stat.icon className="size-5 sm:size-6 text-gray-900 dark:text-white" />
              </div>
              
              {/* Number */}
              <dd className="relative mt-4 sm:mt-6 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </dd>
              
              {/* Label */}
              <dt className="relative mt-1 sm:mt-2 text-sm sm:text-base font-medium text-gray-900 dark:text-white">
                {stat.name}
              </dt>
              <p className="relative text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {stat.description}
              </p>

              {/* Decorative line */}
              <div className="absolute bottom-0 left-0 h-0.5 sm:h-1 w-0 bg-gray-900 transition-all duration-700 group-hover:w-full dark:bg-white" />
            </div>
          ))}
        </dl>

        {/* Trust indicators */}
        <div 
          className={`mt-10 sm:mt-12 lg:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 transition-all duration-700 delay-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          {["Product Hunt", "SOC 2", "GDPR Ready", "256-bit SSL"].map((badge) => (
            <div 
              key={badge}
              className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400"
            >
              <div className="size-1 sm:size-1.5 rounded-full bg-emerald-500" />
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
