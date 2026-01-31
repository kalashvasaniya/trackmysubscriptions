"use client"

import { cx } from "@/lib/utils"
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiMoneyDollarCircleLine,
  RiCalendarCheckLine,
  RiFileListLine,
  RiAlertLine,
} from "@remixicon/react"

// Mock data - will be replaced with API call
const metrics = [
  {
    name: "Monthly Spending",
    value: "$247.00",
    change: "-12%",
    changeType: "decrease" as const,
    icon: RiMoneyDollarCircleLine,
    description: "vs last month",
  },
  {
    name: "Active Subscriptions",
    value: "24",
    change: "+2",
    changeType: "increase" as const,
    icon: RiFileListLine,
    description: "across 5 categories",
  },
  {
    name: "Upcoming (7 days)",
    value: "$89.97",
    change: "3 renewals",
    changeType: "neutral" as const,
    icon: RiCalendarCheckLine,
    description: "due this week",
  },
  {
    name: "Needs Attention",
    value: "2",
    change: "trials ending",
    changeType: "warning" as const,
    icon: RiAlertLine,
    description: "action required",
  },
]

export function DashboardMetrics() {
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
                metric.changeType === "increase" &&
                  "text-emerald-600 dark:text-emerald-400",
                metric.changeType === "decrease" &&
                  "text-red-600 dark:text-red-400",
                metric.changeType === "neutral" &&
                  "text-blue-600 dark:text-blue-400",
                metric.changeType === "warning" &&
                  "text-amber-600 dark:text-amber-400",
              )}
            >
              {metric.changeType === "increase" && (
                <RiArrowUpLine className="mr-0.5 size-4" />
              )}
              {metric.changeType === "decrease" && (
                <RiArrowDownLine className="mr-0.5 size-4" />
              )}
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
