"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { formatCurrency } from "@/lib/currency"
import { cx } from "@/lib/utils"
import { RiArrowRightLine, RiLoader4Line } from "@remixicon/react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface UpcomingPayment {
  id: string
  name: string
  amount: number
  currency: string
  nextBillingDate: string
  billingCycle: string
  category?: string
  status?: string
}

function formatDaysFromNow(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (days <= 0) return "Today"
  if (days === 1) return "Tomorrow"
  return `In ${days} days`
}

function getDaysUntil(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Color mapping for categories
const categoryColors: Record<string, string> = {
  Entertainment: "#E50914",
  Music: "#1DB954",
  Development: "#333333",
  Design: "#FF0000",
  Cloud: "#FF9900",
  Productivity: "#0078D4",
  default: "#6B7280",
}

export function UpcomingPayments() {
  const [payments, setPayments] = useState<UpcomingPayment[]>([])
  const [displayCurrency, setDisplayCurrency] = useState("USD")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/analytics")
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const data = await response.json()
        setDisplayCurrency(data.displayCurrency || "USD")
        // Filter to only show next 7 days and limit to 5
        const now = new Date()
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
        const upcoming = (data.upcomingPayments || [])
          .filter((p: UpcomingPayment) => {
            const date = new Date(p.nextBillingDate)
            return date <= sevenDaysFromNow
          })
          .slice(0, 5)
        setPayments(upcoming)
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

  const total = payments.reduce((sum, p) => sum + p.amount, 0)

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
            {formatCurrency(total, displayCurrency)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">total due</p>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {payments.length === 0 ? (
          <div className="px-6 py-8 text-center text-sm text-gray-500">
            No upcoming payments in the next 7 days
          </div>
        ) : (
          payments.map((payment) => {
            const daysUntil = getDaysUntil(payment.nextBillingDate)
            const isUrgent = daysUntil < 2
            const color = categoryColors[payment.category || ""] || categoryColors.default

            return (
              <div
                key={payment.id}
                className="flex items-center justify-between px-6 py-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="size-10 rounded-lg"
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <div
                      className="flex size-full items-center justify-center rounded-lg text-sm font-bold"
                      style={{ color }}
                    >
                      {payment.name.charAt(0)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      {payment.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {payment.category || payment.billingCycle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                      {formatCurrency(payment.amount, payment.currency || displayCurrency)}
                    </p>
                    <p
                      className={cx(
                        "text-xs",
                        isUrgent
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-gray-500 dark:text-gray-400",
                      )}
                    >
                      {formatDaysFromNow(payment.nextBillingDate)}
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
          })
        )}
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
