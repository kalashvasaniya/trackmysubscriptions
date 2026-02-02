"use client"

import { useEffect, useState, useRef } from "react"
import { RiGroupLine, RiFileList3Line, RiMoneyDollarCircleLine, RiCheckboxCircleLine } from "@remixicon/react"

interface StatsData {
  totalUsers: number
  totalSubscriptions: number
  activeSubscriptions: number
  totalMonthlySpending: number
  totalTrackedValue: number
}

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
    if (!inView || value === 0) return
    
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
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
    if (num >= 1000) return (num / 1000).toFixed(0) + "K"
    return num.toString()
  }

  return (
    <span>{prefix}{formatNumber(count)}{suffix}</span>
  )
}

export function Stats() {
  const [inView, setInView] = useState(false)
  const [statsData, setStatsData] = useState<StatsData | null>(null)
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

  useEffect(() => {
    fetch("/api/stats/public")
      .then((res) => res.json())
      .then((data) => setStatsData(data))
      .catch(() => setStatsData(null))
  }, [])

  const stats = [
    { 
      id: 1, 
      name: "Users", 
      value: statsData?.totalUsers || 0, 
      suffix: "+", 
      prefix: "",
      description: "Tracking subscriptions",
      icon: RiGroupLine,
    },
    { 
      id: 2, 
      name: "Active Subscriptions", 
      value: statsData?.activeSubscriptions || 0, 
      suffix: "+", 
      prefix: "",
      description: "Currently tracked",
      icon: RiCheckboxCircleLine,
    },
    { 
      id: 3, 
      name: "Total Subscriptions", 
      value: statsData?.totalSubscriptions || 0, 
      suffix: "+", 
      prefix: "",
      description: "Being managed",
      icon: RiFileList3Line,
    },
    { 
      id: 4, 
      name: "Value Tracked", 
      value: statsData?.totalTrackedValue || 0, 
      suffix: "+", 
      prefix: "$",
      description: "Annual subscriptions",
      icon: RiMoneyDollarCircleLine,
    },
  ]

  const formatUserCount = (num: number) => {
    if (num >= 1000) return Math.floor(num / 1000) + "K+"
    if (num > 0) return num + "+"
    return "growing"
  }

  return (
    <section id="stats" className="py-16 sm:py-24 lg:py-32 bg-white dark:bg-gray-950 overflow-hidden">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Trusted by
            <span className="text-gray-400 dark:text-gray-500"> {statsData?.totalUsers ? formatUserCount(statsData.totalUsers) : ""} </span>
            <br className="sm:hidden" />
            users worldwide
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-500 dark:text-gray-400">
            Join our community and take control of your subscription spending.
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
                {stat.value > 0 ? (
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    inView={inView}
                  />
                ) : (
                  <span className="text-gray-400">-</span>
                )}
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
          {["Open Source", "GDPR Ready", "256-bit SSL", "100% Free"].map((badge) => (
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
