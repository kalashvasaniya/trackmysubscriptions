"use client"

import { BarChart } from "@/components/BarChart"
import { formatCurrency } from "@/lib/currency"
import { RiLoader4Line } from "@remixicon/react"
import { useEffect, useState } from "react"

interface MonthlyTrend {
  month: string
  amount: number
}

interface ChartDataItem {
  month: string
  spending: number
}

export function SpendingChart() {
  const [chartData, setChartData] = useState<ChartDataItem[]>([])
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
        // Get last 6 months of data (already in display currency)
        const last6Months = data.monthlyTrends.slice(-6).map((item: MonthlyTrend) => ({
          month: item.month,
          spending: item.amount,
        }))
        setChartData(last6Months)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <RiLoader4Line className="size-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
        {error}
      </div>
    )
  }

  // Calculate average and highest month
  const total = chartData.reduce((sum, item) => sum + (item.spending || 0), 0)
  const average = chartData.length > 0 ? total / chartData.length : 0
  const highestMonth = chartData.reduce(
    (max, item) => ((item.spending || 0) > (max.spending || 0) ? item : max),
    chartData[0] || { month: "N/A", spending: 0 },
  )

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
          Monthly Spending
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Last 6 months
        </p>
      </div>

      {chartData.length > 0 ? (
        <>
          <BarChart
            data={chartData}
            index="month"
            categories={["spending"]}
            colors={["blue"]}
            valueFormatter={(value) => formatCurrency(value, displayCurrency)}
            showLegend={false}
            className="h-60"
          />

          <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Average monthly
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-50">
                {formatCurrency(average, displayCurrency)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Highest month
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-50">
                {formatCurrency(highestMonth.spending || 0, displayCurrency)} ({highestMonth.month})
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-60 items-center justify-center text-gray-500">
          No spending data available. Add some subscriptions to see your spending trends.
        </div>
      )}
    </div>
  )
}
