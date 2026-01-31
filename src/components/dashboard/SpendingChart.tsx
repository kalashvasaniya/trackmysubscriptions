"use client"

import { formatCurrency } from "@/lib/currency"
import { cx } from "@/lib/utils"
import { RiLoader4Line, RiArrowUpLine, RiArrowDownLine } from "@remixicon/react"
import Link from "next/link"
import { useEffect, useState, useMemo } from "react"

interface MonthlyTrend {
  month: string
  amount: number
}

export function SpendingChart() {
  const [chartData, setChartData] = useState<MonthlyTrend[]>([])
  const [displayCurrency, setDisplayCurrency] = useState("USD")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/analytics")
        if (!response.ok) {
          throw new Error("Failed to fetch analytics")
        }
        const data = await response.json()
        setDisplayCurrency(data.displayCurrency || "USD")
        // Get last 6 months of data
        const last6Months = data.monthlyTrends.slice(-6) as MonthlyTrend[]
        setChartData(last6Months)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Calculate insights
  const insights = useMemo(() => {
    if (chartData.length < 2) return null

    const current = chartData[chartData.length - 1]?.amount || 0
    const previous = chartData[chartData.length - 2]?.amount || 0
    const change = previous > 0 ? ((current - previous) / previous) * 100 : 0
    const isIncreasing = change > 0

    const total = chartData.reduce((sum, item) => sum + (item.amount || 0), 0)
    const average = total / chartData.length
    const max = Math.max(...chartData.map((d) => d.amount || 0))

    return { current, previous, change, isIncreasing, average, max, total }
  }, [chartData])

  if (loading) {
    return (
      <div className="flex h-80 items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <RiLoader4Line className="size-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Spending Trend
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Last 6 months</p>
        </div>
        {insights && (
          <div className="text-right">
            <p className="text-xl font-bold text-gray-900 dark:text-gray-50">
              {formatCurrency(insights.current, displayCurrency)}
            </p>
            <div
              className={cx(
                "flex items-center justify-end gap-1 text-xs font-medium",
                insights.isIncreasing ? "text-red-500" : "text-emerald-500"
              )}
            >
              {insights.isIncreasing ? (
                <RiArrowUpLine className="size-3" />
              ) : (
                <RiArrowDownLine className="size-3" />
              )}
              {Math.abs(insights.change).toFixed(1)}%
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      {chartData.length > 0 && insights ? (
        <div className="space-y-3">
          {chartData.map((month, index) => {
            const percentage = insights.max > 0 ? (month.amount / insights.max) * 100 : 0
            const isCurrent = index === chartData.length - 1

            return (
              <div key={month.month} className="group">
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span
                    className={cx(
                      "font-medium",
                      isCurrent
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    )}
                  >
                    {month.month}
                  </span>
                  <span
                    className={cx(
                      "tabular-nums",
                      isCurrent
                        ? "font-semibold text-gray-900 dark:text-gray-50"
                        : "text-gray-600 dark:text-gray-300"
                    )}
                  >
                    {formatCurrency(month.amount, displayCurrency)}
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div
                    className={cx(
                      "h-full rounded-full transition-all duration-500",
                      isCurrent
                        ? "bg-gradient-to-r from-blue-500 to-blue-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex h-48 items-center justify-center text-sm text-gray-500">
          No spending data yet
        </div>
      )}

      {/* Footer Stats */}
      {insights && (
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
          <div>
            <p className="text-xs text-gray-500">6-month average</p>
            <p className="font-semibold text-gray-900 dark:text-gray-50">
              {formatCurrency(insights.average, displayCurrency)}
            </p>
          </div>
          <Link
            href="/analytics"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            View details →
          </Link>
        </div>
      )}
    </div>
  )
}
