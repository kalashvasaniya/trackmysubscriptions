"use client"

import { BarChart } from "@/components/BarChart"
import { formatCurrency } from "@/lib/currency"
import { cx } from "@/lib/utils"
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiPieChartLine,
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
  categorySpending: Array<{
    category: string
    amount: number
  }>
  monthlyTrends: Array<{
    month: string
    amount: number
  }>
  statusBreakdown: {
    active: number
    trial: number
    paused: number
    cancelled: number
  }
  billingCycleBreakdown: {
    weekly: number
    monthly: number
    quarterly: number
    yearly: number
  }
  upcomingPayments: Array<{
    id: string
    name: string
    amount: number
    currency?: string
    nextBillingDate: string
  }>
}

const categoryColors: Record<string, string> = {
  Entertainment: "#E50914",
  Music: "#1DB954",
  Development: "#333333",
  Design: "#F24E1E",
  Cloud: "#FF9900",
  Productivity: "#0078D4",
  Uncategorized: "#6B7280",
}

export default function AnalyticsPage() {
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
      <div className="flex h-96 items-center justify-center p-4 sm:p-6 lg:p-8">
        <RiLoader4Line className="size-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error || "Failed to load analytics"}
        </div>
      </div>
    )
  }

  const currency = data.displayCurrency || "USD"
  const totalMonthly = data.metrics.monthlySpending
  const avgPerSubscription =
    data.metrics.activeSubscriptions > 0
      ? totalMonthly / data.metrics.activeSubscriptions
      : 0

  // Find highest month
  const highestMonth =
    data.monthlyTrends.length > 0
      ? data.monthlyTrends.reduce((max, m) => (m.amount > max.amount ? m : max))
      : { month: "N/A", amount: 0 }

  // Prepare chart data
  const monthlyChartData = data.monthlyTrends.map((item) => ({
    month: item.month,
    spending: item.amount,
  }))

  // Billing cycle breakdown
  const billingCycleData = [
    {
      cycle: "Monthly",
      count: data.billingCycleBreakdown.monthly,
    },
    {
      cycle: "Yearly",
      count: data.billingCycleBreakdown.yearly,
    },
    {
      cycle: "Quarterly",
      count: data.billingCycleBreakdown.quarterly,
    },
    {
      cycle: "Weekly",
      count: data.billingCycleBreakdown.weekly,
    },
  ].filter((item) => item.count > 0)

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Insights into your subscription spending
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Monthly Spending
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">
            {formatCurrency(totalMonthly, currency)}
          </p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              {data.metrics.activeSubscriptions} active subscriptions
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Yearly Estimate
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">
            {formatCurrency(data.metrics.yearlySpending, currency)}
          </p>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-gray-500 dark:text-gray-400">
              based on current subscriptions
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Average per Subscription
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">
            {formatCurrency(avgPerSubscription, currency)}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            across {data.metrics.totalSubscriptions} subscriptions
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Highest Month
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">
            {highestMonth.month}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {formatCurrency(highestMonth.amount, currency)} projected
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Spending Trend */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Monthly Spending Trend
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your spending over the past 12 months
          </p>
          <div className="mt-6">
            {monthlyChartData.length > 0 ? (
              <BarChart
                data={monthlyChartData}
                index="month"
                categories={["spending"]}
                colors={["blue"]}
                valueFormatter={(value) => formatCurrency(value, currency)}
                showLegend={false}
                className="h-72"
              />
            ) : (
              <div className="flex h-72 items-center justify-center text-gray-500">
                No spending data available
              </div>
            )}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Subscription Status
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Breakdown by subscription status
          </p>
          <div className="mt-6 space-y-4">
            {[
              { label: "Active", count: data.statusBreakdown.active, color: "#10B981" },
              { label: "Trial", count: data.statusBreakdown.trial, color: "#F59E0B" },
              { label: "Paused", count: data.statusBreakdown.paused, color: "#3B82F6" },
              { label: "Cancelled", count: data.statusBreakdown.cancelled, color: "#6B7280" },
            ]
              .filter((item) => item.count > 0)
              .map((item) => {
                const percentage =
                  data.metrics.totalSubscriptions > 0
                    ? (item.count / data.metrics.totalSubscriptions) * 100
                    : 0
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        {item.count}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>

      {/* Category Breakdown and Billing Cycle */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category Breakdown */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex items-center gap-2">
            <RiPieChartLine className="size-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Spending by Category
            </h3>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            How your spending is distributed
          </p>

          <div className="mt-6 space-y-4">
            {data.categorySpending.length === 0 ? (
              <p className="text-sm text-gray-500">No category data available</p>
            ) : (
              data.categorySpending.map((cat) => {
                const percentage = totalMonthly > 0 ? (cat.amount / totalMonthly) * 100 : 0
                const color = categoryColors[cat.category] || "#6B7280"
                return (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                          {cat.category}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        {formatCurrency(cat.amount, currency)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: color,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-right text-xs text-gray-500">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Billing Cycle Breakdown */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Billing Cycle Distribution
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Breakdown by payment frequency
          </p>

          <div className="mt-6 space-y-6">
            {billingCycleData.length === 0 ? (
              <p className="text-sm text-gray-500">No billing cycle data available</p>
            ) : (
              billingCycleData.map((item) => (
                <div
                  key={item.cycle}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                      {item.cycle}
                    </span>
                    <span
                      className={cx(
                        "rounded-full px-2.5 py-1 text-xs font-medium",
                        item.cycle === "Monthly"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                          : item.cycle === "Yearly"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                            : item.cycle === "Quarterly"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                      )}
                    >
                      {item.count} subscriptions
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Payments */}
      {data.upcomingPayments.length > 0 && (
        <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Upcoming Payments (Next 30 Days)
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.upcomingPayments.slice(0, 6).map((payment) => {
              const date = new Date(payment.nextBillingDate)
              const daysUntil = Math.ceil(
                (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
              )
              return (
                <div
                  key={payment.id}
                  className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-gray-50">
                      {payment.name}
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                      {formatCurrency(payment.amount, payment.currency || currency)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {daysUntil === 0
                      ? "Due today"
                      : daysUntil === 1
                        ? "Due tomorrow"
                        : `Due in ${daysUntil} days`}{" "}
                    ({date.toLocaleDateString()})
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
