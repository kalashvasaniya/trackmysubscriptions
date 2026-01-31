"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { cx } from "@/lib/utils"
import { RiArrowRightLine } from "@remixicon/react"
import Link from "next/link"

// Mock data - will be replaced with API call
const upcomingPayments = [
  {
    id: "1",
    name: "Netflix",
    amount: 14.99,
    currency: "USD",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: "active",
    category: "Entertainment",
    color: "#E50914",
  },
  {
    id: "2",
    name: "Spotify",
    amount: 9.99,
    currency: "USD",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: "active",
    category: "Music",
    color: "#1DB954",
  },
  {
    id: "3",
    name: "GitHub Pro",
    amount: 4.0,
    currency: "USD",
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: "active",
    category: "Development",
    color: "#333333",
  },
  {
    id: "4",
    name: "Adobe Creative Cloud",
    amount: 54.99,
    currency: "USD",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "trial",
    category: "Design",
    color: "#FF0000",
  },
  {
    id: "5",
    name: "AWS",
    amount: 120.0,
    currency: "USD",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: "active",
    category: "Cloud",
    color: "#FF9900",
  },
]

function formatDate(date: Date) {
  const now = new Date()
  const diffDays = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
  )

  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays < 7) return `In ${diffDays} days`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function UpcomingPayments() {
  const total = upcomingPayments.reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            Upcoming Payments
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Next 7 days
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900 dark:text-gray-50">
            ${total.toFixed(2)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">total due</p>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {upcomingPayments.map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between px-6 py-4"
          >
            <div className="flex items-center gap-3">
              <div
                className="size-10 rounded-lg"
                style={{ backgroundColor: `${payment.color}20` }}
              >
                <div
                  className="flex size-full items-center justify-center rounded-lg text-sm font-bold"
                  style={{ color: payment.color }}
                >
                  {payment.name.charAt(0)}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {payment.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {payment.category}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  ${payment.amount.toFixed(2)}
                </p>
                <p
                  className={cx(
                    "text-xs",
                    payment.dueDate.getTime() - Date.now() < 2 * 24 * 60 * 60 * 1000
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  {formatDate(payment.dueDate)}
                </p>
              </div>
              {payment.status === "trial" && (
                <Badge variant="warning" className="rounded-full">
                  Trial
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
        <Button variant="ghost" asChild className="w-full justify-center">
          <Link href="/calendar">
            View Calendar
            <RiArrowRightLine className="ml-2 size-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
