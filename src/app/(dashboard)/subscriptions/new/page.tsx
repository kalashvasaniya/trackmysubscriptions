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
        
        <div className="relative mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-white">
              <Link 
                href="/subscriptions"
                className="mb-2 inline-flex items-center gap-1 text-xs text-blue-200 hover:text-white transition-colors sm:mb-3 sm:text-sm"
              >
                <RiArrowLeftLine className="size-3.5 sm:size-4" />
                Back to Subscriptions
              </Link>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm sm:size-12">
                  <RiAddLine className="size-5 sm:size-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">Add Subscription</h1>
                  <p className="mt-0.5 text-sm text-blue-100 sm:mt-1">Add a new subscription to track your expenses</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Pills */}
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs text-white backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
              <RiFileListLine className="size-3.5 sm:size-4" />
              <span className="font-medium">Track spending</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs text-white backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
              <RiSparklingLine className="size-3.5 sm:size-4" />
              <span className="font-medium">Get reminders</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-3 sm:p-6 lg:p-8">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
          {/* Main Form */}
          <div className="lg:col-span-8">
            <SubscriptionForm />
          </div>

          {/* Sidebar Tips */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-4">
            {/* Quick Tips */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:rounded-2xl sm:p-5">
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-50 sm:mb-4 sm:text-base">Quick Tips</h3>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex gap-2.5 sm:gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 sm:size-8 sm:text-sm">
                    1
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-50 sm:text-sm">Choose the right billing cycle</p>
                    <p className="text-[10px] text-gray-500 sm:text-xs">Monthly subscriptions are easier to track</p>
                  </div>
                </div>
                <div className="flex gap-2.5 sm:gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 sm:size-8 sm:text-sm">
                    2
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-50 sm:text-sm">Set up alerts</p>
                    <p className="text-[10px] text-gray-500 sm:text-xs">Get reminded before payments are due</p>
                  </div>
                </div>
                <div className="flex gap-2.5 sm:gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 sm:size-8 sm:text-sm">
                    3
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-900 dark:text-gray-50 sm:text-sm">Use categories & tags</p>
                    <p className="text-[10px] text-gray-500 sm:text-xs">Organize for better insights</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:rounded-2xl sm:p-5">
              <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-50 sm:mb-4 sm:text-base">Need to add first?</h3>
              <div className="space-y-1.5 sm:space-y-2">
                <Link
                  href="/folders"
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5 text-xs transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 sm:rounded-xl sm:p-3 sm:text-sm"
                >
                  <span className="text-gray-700 dark:text-gray-300">Create folders</span>
                  <span className="text-gray-400">→</span>
                </Link>
                <Link
                  href="/tags"
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5 text-xs transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 sm:rounded-xl sm:p-3 sm:text-sm"
                >
                  <span className="text-gray-700 dark:text-gray-300">Add tags</span>
                  <span className="text-gray-400">→</span>
                </Link>
                <Link
                  href="/payment-methods"
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5 text-xs transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 sm:rounded-xl sm:p-3 sm:text-sm"
                >
                  <span className="text-gray-700 dark:text-gray-300">Payment methods</span>
                  <span className="text-gray-400">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Pro Tip Footer */}
        <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 p-4 text-white sm:mt-8 sm:rounded-2xl sm:p-6">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="flex items-start gap-3 sm:items-center sm:gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm sm:size-12">
                <RiSparklingLine className="size-5 sm:size-6" />
              </div>
              <div>
                <p className="text-base font-semibold sm:text-lg">Pro Tip: Accurate Billing Dates</p>
                <p className="mt-0.5 text-sm text-blue-100 sm:mt-1">
                  Set the next billing date accurately to get timely reminders and keep your calendar up to date.
                </p>
              </div>
            </div>
            <Link
              href="/calendar"
              className="inline-flex w-full items-center justify-center rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30 sm:w-auto sm:px-5 sm:py-2.5"
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
