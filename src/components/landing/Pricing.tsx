"use client"

import { Button } from "@/components/Button"
import { RiCheckLine, RiSparklingLine, RiInfinityLine, RiHeartLine } from "@remixicon/react"
import Link from "next/link"

const features = [
  "Unlimited subscriptions",
  "Smart email alerts & reminders",
  "Calendar view",
  "CSV import & export",
  "160+ currencies supported",
  "Folders & tags organization",
  "Detailed analytics & reports",
  "All future updates included",
  "Priority support",
  "Lifetime access — pay once, use forever",
]

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-[600px] w-[600px] rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-900/20" />
        <div className="absolute right-1/4 bottom-1/4 h-[600px] w-[600px] rounded-full bg-purple-100/50 blur-3xl dark:bg-purple-900/20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-sm font-medium text-purple-700 dark:border-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
            <span className="size-1.5 rounded-full bg-purple-500 animate-pulse" />
            Pricing
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
            One price.{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Lifetime access.
            </span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            Pay once and get full access to SubTracker forever. No subscriptions, no recurring fees.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-lg">
          {/* Pricing Card */}
          <div className="relative overflow-hidden rounded-3xl border-2 border-blue-500 bg-gradient-to-b from-blue-50 via-white to-white p-8 shadow-2xl shadow-blue-500/20 dark:border-blue-400 dark:from-blue-950/50 dark:via-gray-900 dark:to-gray-900">
            {/* Popular badge */}
            <div className="absolute -right-12 top-8 rotate-45">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-12 py-1.5 text-xs font-bold text-white shadow-lg">
                BEST VALUE
              </div>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                <RiInfinityLine className="size-4" />
                Lifetime Deal
              </div>
              
              <div className="mt-6">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-6xl font-bold text-gray-900 dark:text-white">$9</span>
                  <span className="text-xl text-gray-500 line-through">$49</span>
                </div>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  One-time payment • Use forever
                </p>
              </div>

              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                <RiSparklingLine className="size-4" />
                Save 82% — Limited time offer
              </div>
            </div>

            <div className="mt-8">
              <Button size="lg" className="w-full shadow-lg shadow-blue-500/25" asChild>
                <Link href="/register">
                  Get Lifetime Access
                </Link>
              </Button>
            </div>

            <ul className="mt-8 space-y-4">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                    <RiCheckLine className="size-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

          </div>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-center">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <RiCheckLine className="size-4 text-emerald-500" />
              Secure payment
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <RiCheckLine className="size-4 text-emerald-500" />
              Instant access
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <RiCheckLine className="size-4 text-emerald-500" />
              No recurring fees
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-8 text-center">
            <p className="flex items-center justify-center gap-1 text-sm text-gray-500">
              <RiHeartLine className="size-4 text-red-500" />
              Loved by 20,000+ users worldwide
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
