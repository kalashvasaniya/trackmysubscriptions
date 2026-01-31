"use client"

import { BarChart } from "@/components/BarChart"
import { cx } from "@/lib/utils"
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiPieChartLine,
} from "@remixicon/react"

// Mock data - will be replaced with API calls
const monthlySpendingData = [
  { month: "Jan", spending: 180 },
  { month: "Feb", spending: 195 },
  { month: "Mar", spending: 210 },
  { month: "Apr", spending: 225 },
  { month: "May", spending: 280 },
  { month: "Jun", spending: 247 },
  { month: "Jul", spending: 260 },
  { month: "Aug", spending: 235 },
  { month: "Sep", spending: 245 },
  { month: "Oct", spending: 255 },
  { month: "Nov", spending: 270 },
  { month: "Dec", spending: 290 },
]

const categoryData = [
  { category: "Entertainment", amount: 45.98, count: 3, color: "#E50914" },
  { category: "Development", amount: 120.0, count: 4, color: "#333333" },
  { category: "Design", amount: 66.99, count: 2, color: "#F24E1E" },
  { category: "Productivity", amount: 24.99, count: 3, color: "#0078D4" },
  { category: "Cloud", amount: 180.0, count: 2, color: "#FF9900" },
  { category: "Music", amount: 9.99, count: 1, color: "#1DB954" },
]

const billingCycleData = [
  { cycle: "Monthly", amount: 324.95, count: 12 },
  { cycle: "Yearly", amount: 199.99, count: 3 },
  { cycle: "Quarterly", amount: 89.97, count: 2 },
]

const yearComparisonData = [
  { month: "Jan", "This Year": 180, "Last Year": 150 },
  { month: "Feb", "This Year": 195, "Last Year": 165 },
  { month: "Mar", "This Year": 210, "Last Year": 180 },
  { month: "Apr", "This Year": 225, "Last Year": 195 },
  { month: "May", "This Year": 280, "Last Year": 230 },
  { month: "Jun", "This Year": 247, "Last Year": 210 },
]

const totalMonthly = categoryData.reduce((sum, cat) => sum + cat.amount, 0)

export default function AnalyticsPage() {
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
            ${totalMonthly.toFixed(2)}
          </p>
          <div className="mt-2 flex items-center text-sm">
            <RiArrowDownLine className="size-4 text-emerald-500" />
            <span className="ml-1 text-emerald-600 dark:text-emerald-400">
              12% less than last month
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Yearly Estimate
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">
            ${(totalMonthly * 12).toFixed(2)}
          </p>
          <div className="mt-2 flex items-center text-sm">
            <RiArrowUpLine className="size-4 text-red-500" />
            <span className="ml-1 text-red-600 dark:text-red-400">
              8% more than last year
            </span>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Average per Subscription
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">
            $
            {(
              totalMonthly / categoryData.reduce((sum, c) => sum + c.count, 0)
            ).toFixed(2)}
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            across {categoryData.reduce((sum, c) => sum + c.count, 0)}{" "}
            subscriptions
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Most Expensive Month
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-50">
            December
          </p>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            $290.00 projected
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
            <BarChart
              data={monthlySpendingData}
              index="month"
              categories={["spending"]}
              colors={["blue"]}
              valueFormatter={(value) => `$${value}`}
              showLegend={false}
              className="h-72"
            />
          </div>
        </div>

        {/* Year over Year Comparison */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Year over Year Comparison
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Compare spending with last year
          </p>
          <div className="mt-6">
            <BarChart
              data={yearComparisonData}
              index="month"
              categories={["This Year", "Last Year"]}
              colors={["blue", "gray"]}
              valueFormatter={(value) => `$${value}`}
              className="h-72"
            />
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
            {categoryData
              .sort((a, b) => b.amount - a.amount)
              .map((cat) => {
                const percentage = (cat.amount / totalMonthly) * 100
                return (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="size-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                          {cat.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({cat.count} subs)
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        ${cat.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                    <p className="mt-1 text-right text-xs text-gray-500">
                      {percentage.toFixed(1)}%
                    </p>
                  </div>
                )
              })}
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
            {billingCycleData.map((item) => {
              const monthlyEquivalent =
                item.cycle === "Monthly"
                  ? item.amount
                  : item.cycle === "Yearly"
                    ? item.amount / 12
                    : item.amount / 3
              return (
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
                            : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
                      )}
                    >
                      {item.count} subscriptions
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                      ${item.amount.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      / {item.cycle.toLowerCase()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    ≈ ${monthlyEquivalent.toFixed(2)}/month equivalent
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Insights & Recommendations
        </h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <p className="font-medium text-blue-900 dark:text-blue-400">
              Highest spending category
            </p>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Cloud services account for 40% of your spending. Consider
              reviewing your AWS usage.
            </p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-900/20">
            <p className="font-medium text-emerald-900 dark:text-emerald-400">
              Potential savings
            </p>
            <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-300">
              Switching 3 monthly subscriptions to yearly could save you
              $45/year.
            </p>
          </div>
          <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
            <p className="font-medium text-amber-900 dark:text-amber-400">
              Upcoming renewal
            </p>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
              Microsoft 365 ($99.99/year) renews in 45 days. Review if you still
              need it.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
