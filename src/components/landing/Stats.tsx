"use client"

import { useEffect, useState } from "react"

const stats = [
  { id: 1, name: "Users", value: 20000, suffix: "+", prefix: "" },
  { id: 2, name: "Customers", value: 600, suffix: "+", prefix: "" },
  { id: 3, name: "Subscriptions Tracked", value: 250000, suffix: "+", prefix: "" },
  { id: 4, name: "Saved", value: 1000000, suffix: "+", prefix: "$" },
]

function AnimatedCounter({
  value,
  prefix,
  suffix,
}: {
  value: number
  prefix: string
  suffix: string
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
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
  }, [value])

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
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Tracking over{" "}
            <span className="text-blue-600 dark:text-blue-400">
              $100+ Million
            </span>{" "}
            worth of subscriptions
          </h2>
        </div>

        <dl className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-900"
            >
              <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.name}
              </dt>
              <dd className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
