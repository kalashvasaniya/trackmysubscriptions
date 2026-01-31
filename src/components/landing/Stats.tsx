"use client"

import { useEffect, useState, useRef } from "react"
import { RiGroupLine, RiHeart3Line, RiMoneyDollarCircleLine, RiFileList3Line } from "@remixicon/react"

const stats = [
  { 
    id: 1, 
    name: "Happy Users", 
    value: 20000, 
    suffix: "+", 
    prefix: "",
    icon: RiGroupLine,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
  },
  { 
    id: 2, 
    name: "5-Star Reviews", 
    value: 600, 
    suffix: "+", 
    prefix: "",
    icon: RiHeart3Line,
    color: "from-pink-500 to-rose-600",
    bgColor: "bg-pink-500/10",
  },
  { 
    id: 3, 
    name: "Subscriptions Tracked", 
    value: 250000, 
    suffix: "+", 
    prefix: "",
    icon: RiFileList3Line,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
  },
  { 
    id: 4, 
    name: "Money Saved", 
    value: 1000000, 
    suffix: "+", 
    prefix: "$",
    icon: RiMoneyDollarCircleLine,
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-500/10",
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
    if (num >= 1000000) {
      return (num / 1000000).toFixed(0) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K"
    }
    return num.toString()
  }

  return (
    <span>
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  )
}

export function Stats() {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/50 to-white dark:from-gray-950 dark:via-blue-950/10 dark:to-gray-950" />
      </div>

      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              20,000+
            </span>{" "}
            users worldwide
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            Join thousands who have already taken control of their subscription spending.
          </p>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
              
              <div className={`relative mx-auto flex size-14 items-center justify-center rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`size-7 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} />
              </div>
              
              <dd className="relative mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </dd>
              
              <dt className="relative mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.name}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
