"use client"

import { BarChart } from "@/components/BarChart"

// Mock data - will be replaced with API call
const chartData = [
  { month: "Jan", spending: 180 },
  { month: "Feb", spending: 195 },
  { month: "Mar", spending: 210 },
  { month: "Apr", spending: 225 },
  { month: "May", spending: 280 },
  { month: "Jun", spending: 247 },
]

export function SpendingChart() {
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

      <BarChart
        data={chartData}
        index="month"
        categories={["spending"]}
        colors={["blue"]}
        valueFormatter={(value) => `$${value}`}
        showLegend={false}
        className="h-60"
      />

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Average monthly
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-50">
            $222.83
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Highest month
          </p>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-50">
            $280 (May)
          </p>
        </div>
      </div>
    </div>
  )
}
