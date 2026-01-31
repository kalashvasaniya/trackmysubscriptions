"use client"

import { formatCurrency } from "@/lib/currency"
import { cx } from "@/lib/utils"
import {
  RiMoneyDollarCircleLine,
  RiCalendarCheckLine,
  RiFileListLine,
  RiAlertLine,
  RiLoader4Line,
} from "@remixicon/react"
import { useEffect, useState } from "react"

interface AnalyticsData {
  displayCurrency?: string
  metrics: {
    totalSubscriptions: number
    activeSubscriptions: number
    monthlySpending: number
    yearlySpending: number
  }
  upcomingPayments: Array<{
    id: string
    name: string
    amount: number
    nextBillingDate: string
  }>
  statusBreakdown: {
    active: number
    trial: number
    paused: number
    cancelled: number
  }
}

export function DashboardMetrics() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/analytics")
        if (!response.ok) {
          throw new Error("Failed to fetch analytics")
        }
        const analyticsData = await response.json()
        setData(analyticsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex h-32 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
          >
            <RiLoader4Line className="size-6 animate-spin text-gray-400" />
          </div>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
        {error || "Failed to load metrics"}
      </div>
    )
  }

  const currency = data.displayCurrency || "USD"

  // Calculate upcoming payments for next 7 days
  const now = new Date()
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  const upcomingThisWeek = data.upcomingPayments.filter((p) => {
    const date = new Date(p.nextBillingDate)
    return date <= sevenDaysFromNow
  })
  const upcomingAmount = upcomingThisWeek.reduce((sum, p) => sum + p.amount, 0)

  // Calculate needs attention (trials ending soon)
  const needsAttention = data.statusBreakdown.trial

  const metrics = [
    {
      name: "Monthly Spending",
      value: formatCurrency(data.metrics.monthlySpending, currency),
      change: `${formatCurrency(data.metrics.yearlySpending, currency, { compact: true })}/yr`,
      changeType: "neutral" as const,
      icon: RiMoneyDollarCircleLine,
      description: "projected yearly cost",
    },
    {
      name: "Active Subscriptions",
      value: data.metrics.activeSubscriptions.toString(),
      change: `${data.metrics.totalSubscriptions} total`,
      changeType: "neutral" as const,
      icon: RiFileListLine,
      description: "being tracked",
    },
    {
      name: "Upcoming (7 days)",
      value: formatCurrency(upcomingAmount, currency),
      change: `${upcomingThisWeek.length} renewals`,
      changeType: "neutral" as const,
      icon: RiCalendarCheckLine,
      description: "due this week",
    },
    {
      name: "Needs Attention",
      value: needsAttention.toString(),
      change: "trials ending",
      changeType: needsAttention > 0 ? ("warning" as const) : ("neutral" as const),
      icon: RiAlertLine,
      description: needsAttention > 0 ? "action required" : "all good",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.name}
          className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {metric.name}
            </span>
            <metric.icon
              className={cx(
                "size-5",
                metric.changeType === "warning"
                  ? "text-amber-500"
                  : "text-gray-400 dark:text-gray-500",
              )}
            />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              {metric.value}
            </span>
            <span
              className={cx(
                "inline-flex items-center text-sm font-medium",
                metric.changeType === "neutral" &&
                  "text-blue-600 dark:text-blue-400",
                metric.changeType === "warning" &&
                  "text-amber-600 dark:text-amber-400",
              )}
            >
              {metric.change}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
            {metric.description}
          </p>
        </div>
      ))}
    </div>
  )
}
