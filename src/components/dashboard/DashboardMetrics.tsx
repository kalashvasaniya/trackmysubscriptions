"use client"

import { formatCurrency } from "@/lib/currency"
import {
  RiWalletLine,
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
            className="flex h-36 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900"
          >
            <RiLoader4Line className="size-6 animate-spin text-gray-400" />
          </div>
        ))}
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
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
      subValue: `${formatCurrency(data.metrics.yearlySpending, currency, { compact: true })}/yr`,
      description: "projected yearly",
      icon: RiWalletLine,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-400/20",
    },
    {
      name: "Active Subscriptions",
      value: data.metrics.activeSubscriptions.toString(),
      subValue: `${data.metrics.totalSubscriptions} total`,
      description: "being tracked",
      icon: RiFileListLine,
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-400/20",
    },
    {
      name: "Due This Week",
      value: formatCurrency(upcomingAmount, currency),
      subValue: `${upcomingThisWeek.length} payments`,
      description: "next 7 days",
      icon: RiCalendarCheckLine,
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-400/20",
    },
    {
      name: "Needs Attention",
      value: needsAttention.toString(),
      subValue: needsAttention > 0 ? "trials ending" : "all good",
      description: needsAttention > 0 ? "action required" : "no issues",
      icon: RiAlertLine,
      gradient: needsAttention > 0 ? "from-amber-500 to-orange-500" : "from-gray-400 to-gray-500",
      iconBg: needsAttention > 0 ? "bg-amber-400/20" : "bg-gray-400/20",
      isWarning: needsAttention > 0,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.name}
          className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${metric.gradient} p-6 text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02]`}
        >
          {/* Background decoration */}
          <div className="absolute -right-4 -top-4 size-24 rounded-full bg-white/10 transition-transform duration-300 group-hover:scale-110" />
          <div className="absolute -right-2 -top-2 size-16 rounded-full bg-white/5" />
          
          {/* Icon */}
          <div className={`mb-4 inline-flex rounded-xl ${metric.iconBg} p-2.5`}>
            <metric.icon className="size-6" />
          </div>
          
          {/* Content */}
          <p className="text-sm font-medium text-white/80">{metric.name}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">{metric.value}</p>
          
          {/* Sub info */}
          <div className="mt-2 flex items-center gap-1.5 text-sm text-white/70">
            <span className="font-medium text-white/90">{metric.subValue}</span>
            <span>•</span>
            <span>{metric.description}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
