"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { cx } from "@/lib/utils"
import { RiArrowRightLine } from "@remixicon/react"
import Link from "next/link"
import { useEffect, useState } from "react"

// Mock data - using relative days instead of Date.now() to avoid hydration issues
const mockPaymentsData = [
  {
    id: "1",
    name: "Netflix",
    amount: 14.99,
    currency: "USD",
    daysFromNow: 1,
    status: "active",
    category: "Entertainment",
    color: "#E50914",
  },
  {
    id: "2",
    name: "Spotify",
    amount: 9.99,
    currency: "USD",
    daysFromNow: 2,
    status: "active",
    category: "Music",
    color: "#1DB954",
  },
  {
    id: "3",
    name: "GitHub Pro",
    amount: 4.0,
    currency: "USD",
    daysFromNow: 3,
    status: "active",
    category: "Development",
    color: "#333333",
  },
  {
    id: "4",
    name: "Adobe Creative Cloud",
    amount: 54.99,
    currency: "USD",
    daysFromNow: 5,
    status: "trial",
    category: "Design",
    color: "#FF0000",
  },
  {
    id: "5",
    name: "AWS",
    amount: 120.0,
    currency: "USD",
    daysFromNow: 7,
    status: "active",
    category: "Cloud",
    color: "#FF9900",
  },
]

function formatDaysFromNow(days: number) {
  if (days === 0) return "Today"
  if (days === 1) return "Tomorrow"
  if (days < 7) return `In ${days} days`
  return `In ${days} days`
}

export function UpcomingPayments() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const total = mockPaymentsData.reduce((sum, p) => sum + p.amount, 0)

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
        {mockPaymentsData.map((payment) => {
          // Determine if payment is urgent (due within 2 days)
          // Use consistent value during SSR/hydration, then update on client
          const isUrgent = mounted && payment.daysFromNow < 2

          return (
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
                      isUrgent
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-gray-500 dark:text-gray-400",
                    )}
                  >
                    {formatDaysFromNow(payment.daysFromNow)}
                  </p>
                </div>
                {payment.status === "trial" && (
                  <Badge variant="warning" className="rounded-full">
                    Trial
                  </Badge>
                )}
              </div>
            </div>
          )
        })}
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
