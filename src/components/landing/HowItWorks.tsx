"use client"

import {
  RiAddLine,
  RiBellLine,
  RiPieChartLine,
  RiArrowRightLine,
  RiCheckLine,
  RiTimeLine,
} from "@remixicon/react"
import Link from "next/link"
import { Button } from "@/components/Button"

const steps = [
  {
    step: "01",
    name: "Add Your Subscriptions",
    description:
      "Import via CSV or add manually. Set billing cycles, amounts, categories, and organize everything with folders and tags.",
    icon: RiAddLine,
    color: "from-blue-500 to-indigo-600",
  },
  {
    step: "02",
    name: "Get Smart Alerts",
    description:
      "Receive email notifications before renewals. Customize timing — 1, 3, or 7 days before. Never be surprised again.",
    icon: RiBellLine,
    color: "from-amber-500 to-orange-600",
  },
  {
    step: "03",
    name: "Track & Optimize",
    description:
      "View spending insights, identify unused subscriptions, compare months, and take full control of your finances.",
    icon: RiPieChartLine,
    color: "from-emerald-500 to-teal-600",
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative border-y border-gray-200 bg-gradient-to-b from-gray-50 to-white py-24 sm:py-32 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            How It Works
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
            Get started in{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              3 simple steps
            </span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            Sign up for free and start tracking your recurring spending in minutes.
          </p>
        </div>

        <div className="mx-auto mt-20 max-w-5xl">
          {/* Desktop Timeline */}
          <div className="hidden md:block">
            {/* Connection line */}
            <div className="relative mb-8">
              <div className="absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 bg-gradient-to-r from-blue-500 via-amber-500 to-emerald-500 rounded-full opacity-20" />
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <div key={step.step} className="relative flex flex-col items-center" style={{ width: "33.333%" }}>
                    {/* Step circle */}
                    <div className={`relative z-10 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg`}>
                      <step.icon className="size-8" />
                    </div>
                    <div className={`absolute -inset-3 rounded-3xl bg-gradient-to-br ${step.color} opacity-20 blur-xl -z-10`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Step content */}
            <div className="grid grid-cols-3 gap-8">
              {steps.map((step) => (
                <div key={step.step} className="text-center">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    STEP {step.step}
                  </span>
                  <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                    {step.name}
                  </h3>
                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="space-y-6 md:hidden">
            {steps.map((step, index) => (
              <div key={step.step} className="relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-8 top-16 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-gray-200 dark:from-gray-700 dark:to-gray-800" />
                )}
                
                <div className="flex gap-4">
                  <div className={`relative z-10 flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg`}>
                    <step.icon className="size-8" />
                  </div>
                  <div className="pt-1">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      STEP {step.step}
                    </span>
                    <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                      {step.name}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Demo Preview Card */}
          <div className="mt-16 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200 dark:divide-gray-800">
              {/* Add subscriptions preview */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                  <RiAddLine className="size-4" />
                  Add Subscriptions
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { name: "Netflix", amount: "$14.99", color: "#E50914" },
                    { name: "Spotify", amount: "$9.99", color: "#1DB954" },
                    { name: "Adobe CC", amount: "$54.99", color: "#FF0000" },
                  ].map((sub) => (
                    <div key={sub.name} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ backgroundColor: sub.color }}>
                          {sub.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{sub.name}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">{sub.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alerts preview */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
                  <RiBellLine className="size-4" />
                  Smart Alerts
                </div>
                <div className="mt-4 space-y-3">
                  <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20 ring-1 ring-amber-200 dark:ring-amber-800">
                    <div className="flex items-center gap-2">
                      <RiTimeLine className="size-4 text-amber-600" />
                      <span className="text-xs font-medium text-amber-700 dark:text-amber-300">Reminder</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-amber-900 dark:text-amber-100">Netflix renews in 3 days</p>
                    <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">$14.99 will be charged on Jan 15</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-900/20">
                    <RiCheckLine className="size-4 text-emerald-600" />
                    <span className="text-xs text-emerald-700 dark:text-emerald-300">Alert sent to your email</span>
                  </div>
                </div>
              </div>

              {/* Analytics preview */}
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  <RiPieChartLine className="size-4" />
                  Track & Save
                </div>
                <div className="mt-4">
                  <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20 ring-1 ring-emerald-200 dark:ring-emerald-800">
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">Monthly Savings</p>
                    <p className="mt-1 text-3xl font-bold text-emerald-700 dark:text-emerald-300">$47.99</p>
                    <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-400">From cancelled unused subscriptions</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <div className="flex-1 rounded-lg bg-gray-50 p-2.5 text-center dark:bg-gray-800">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">24</p>
                      <p className="text-xs text-gray-500">Active</p>
                    </div>
                    <div className="flex-1 rounded-lg bg-gray-50 p-2.5 text-center dark:bg-gray-800">
                      <p className="text-lg font-bold text-gray-900 dark:text-white">3</p>
                      <p className="text-xs text-gray-500">Cancelled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Button size="lg" asChild className="px-8 shadow-lg shadow-blue-500/25">
              <Link href="/register">
                Start Tracking Now
                <RiArrowRightLine className="ml-2 size-5" />
              </Link>
            </Button>
            <p className="mt-4 text-sm text-gray-500">Free forever. No credit card required.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
