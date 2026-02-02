"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/Button"
import { RiArrowRightLine, RiCheckLine, RiSparklingLine } from "@remixicon/react"
import Link from "next/link"

const benefits = [
  "100% Free forever",
  "No credit card required", 
  "Set up in 2 minutes",
]

export function CTA() {
  const [inView, setInView] = useState(false)
  const [userCount, setUserCount] = useState<number | null>(null)
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
      .then((data) => setUserCount(data.totalUsers))
      .catch(() => setUserCount(null))
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000) return Math.floor(num / 1000) + "K+"
    return num + "+"
  }

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div 
          className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 lg:p-12 shadow-lg sm:shadow-xl dark:border-gray-800 dark:bg-gray-950 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:2rem_2rem] sm:bg-[size:4rem_4rem] opacity-50 dark:bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)]" />

          {/* Animated circles - hidden on mobile */}
          <div className="absolute -left-20 -top-20 size-40 sm:size-64 rounded-full border border-gray-200 opacity-50 dark:border-gray-800 animate-pulse hidden sm:block" />
          <div className="absolute -right-20 -bottom-20 size-40 sm:size-64 rounded-full border border-gray-200 opacity-50 dark:border-gray-800 animate-pulse hidden sm:block" style={{ animationDelay: "1s" }} />

          <div className="relative mx-auto max-w-3xl text-center">
            {/* Badge */}
            <div 
              className={`inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition-all duration-500 dark:border-gray-800 dark:bg-gray-900 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              }`}
            >
              <RiSparklingLine className="size-3.5 sm:size-4 text-amber-500" />
              <span className="text-gray-600 dark:text-gray-400">
                {userCount ? `Loved by ${formatNumber(userCount)} users` : "100% Free"}
              </span>
            </div>

            {/* Heading */}
            <h2 
              className={`mt-6 sm:mt-8 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold tracking-tight text-gray-900 dark:text-white transition-all duration-700 delay-100 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Ready to take control of
              <br />
              <span className="text-gray-400 dark:text-gray-500">your subscriptions?</span>
            </h2>

            {/* Subheading */}
            <p 
              className={`mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-gray-500 dark:text-gray-400 transition-all duration-700 delay-200 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {userCount 
                ? `Join ${formatNumber(userCount)} users saving money and staying on top of their recurring expenses.`
                : "Start saving money and stay on top of your recurring expenses for free."}
            </p>

            {/* CTA Buttons */}
            <div 
              className={`mt-6 sm:mt-8 lg:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 transition-all duration-700 delay-300 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Button size="lg" asChild className="px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base w-full sm:w-auto">
                <Link href="/register">
                  Get Started Free
                  <RiArrowRightLine className="size-4 sm:size-5" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild className="px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base w-full sm:w-auto">
                <Link href="#how-it-works">
                  See How It Works
                </Link>
              </Button>
            </div>

            {/* Benefits */}
            <div 
              className={`mt-6 sm:mt-8 lg:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-6 transition-all duration-700 delay-400 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              {benefits.map((benefit) => (
                <div 
                  key={benefit} 
                  className="flex items-center gap-1.5 sm:gap-2"
                >
                  <RiCheckLine className="size-3.5 sm:size-4 text-emerald-500" />
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
