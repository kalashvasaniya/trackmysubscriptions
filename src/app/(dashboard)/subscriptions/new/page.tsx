"use client"

import { Button } from "@/components/Button"
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm"
import {
  RiAddLine,
  RiArrowLeftLine,
  RiArrowRightLine,
  RiFileListLine,
  RiSparklingLine,
} from "@remixicon/react"
import Link from "next/link"

export default function NewSubscriptionPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:border-gray-800">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-white">
              <Link 
                href="/subscriptions"
                className="mb-3 inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white transition-colors"
              >
                <RiArrowLeftLine className="size-4" />
                Back to Subscriptions
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <RiAddLine className="size-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">Add Subscription</h1>
                  <p className="mt-1 text-blue-100">Add a new subscription to track your expenses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiFileListLine className="size-4" />
              <span className="font-medium">Track spending</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiSparklingLine className="size-4" />
              <span className="font-medium">Get reminders</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Form */}
          <div className="lg:col-span-8">
            <SubscriptionForm />
          </div>

          {/* Sidebar Tips */}
          <div className="space-y-6 lg:col-span-4">
            {/* Quick Tips */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">Quick Tips</h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                    1
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">Choose the right billing cycle</p>
                    <p className="text-xs text-gray-500">Monthly subscriptions are easier to track</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-sm font-bold text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                    2
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">Set up alerts</p>
                    <p className="text-xs text-gray-500">Get reminded before payments are due</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                    3
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">Use categories & tags</p>
                    <p className="text-xs text-gray-500">Organize for better insights</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">Need to add first?</h3>
              <div className="space-y-2">
                <Link
                  href="/folders"
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-sm transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <span className="text-gray-700 dark:text-gray-300">Create folders</span>
                  <span className="text-gray-400">→</span>
                </Link>
                <Link
                  href="/tags"
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-sm transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <span className="text-gray-700 dark:text-gray-300">Add tags</span>
                  <span className="text-gray-400">→</span>
                </Link>
                <Link
                  href="/payment-methods"
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-3 text-sm transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <span className="text-gray-700 dark:text-gray-300">Payment methods</span>
                  <span className="text-gray-400">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tip Footer */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 p-6 text-white">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <RiSparklingLine className="size-6" />
              </div>
              <div>
                <p className="text-lg font-semibold">Pro Tip: Accurate Billing Dates</p>
                <p className="mt-1 text-blue-100">
                  Set the next billing date accurately to get timely reminders and keep your calendar up to date.
                </p>
              </div>
            </div>
            <Link
              href="/calendar"
              className="inline-flex items-center rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30"
            >
              View Calendar
              <RiArrowRightLine className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
