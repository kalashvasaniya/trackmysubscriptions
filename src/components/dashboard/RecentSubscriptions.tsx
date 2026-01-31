"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { formatCurrency } from "@/lib/currency"
import { cx } from "@/lib/utils"
import { RiArrowRightLine, RiLoader4Line } from "@remixicon/react"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Subscription {
  id: string
  name: string
  amount: number
  currency: string
  billingCycle: string
  nextBillingDate: string
  status: string
  category?: string
}

const statusConfig = {
  active: { variant: "success" as const, label: "Active", color: "emerald" },
  trial: { variant: "warning" as const, label: "Trial", color: "amber" },
  cancelled: { variant: "neutral" as const, label: "Cancelled", color: "gray" },
  paused: { variant: "default" as const, label: "Paused", color: "blue" },
}

const categoryColors: Record<string, string> = {
  Entertainment: "#E50914",
  Music: "#1DB954",
  Development: "#6366F1",
  Design: "#F24E1E",
  Cloud: "#FF9900",
  Productivity: "#0078D4",
  default: "#6B7280",
}

export function RecentSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
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
        setSubscriptions(data.recentSubscriptions || [])
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
      <div className="flex h-64 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <RiLoader4Line className="size-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
        {error}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 p-6 dark:border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Recent Subscriptions
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your latest subscription activities
          </p>
        </div>
        <Button variant="secondary" asChild className="group">
          <Link href="/subscriptions">
            View All
            <RiArrowRightLine className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </div>

      {subscriptions.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
            <svg className="size-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No subscriptions yet. Add your first subscription to get started.
          </p>
          <Button asChild className="mt-4">
            <Link href="/subscriptions/new">Add Subscription</Link>
          </Button>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {subscriptions.map((sub) => {
            const status =
              statusConfig[sub.status as keyof typeof statusConfig] ||
              statusConfig.active
            const color = categoryColors[sub.category || ""] || categoryColors.default
            
            return (
              <Link
                key={sub.id}
                href={`/subscriptions/${sub.id}`}
                className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="flex size-12 items-center justify-center rounded-xl text-lg font-bold"
                    style={{
                      backgroundColor: `${color}15`,
                      color: color,
                    }}
                  >
                    {sub.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-50">
                      {sub.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <span>{sub.category || "Uncategorized"}</span>
                      <span>•</span>
                      <span className="capitalize">{sub.billingCycle}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-gray-50">
                      {formatCurrency(sub.amount, sub.currency)}
                    </p>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Next: {new Date(sub.nextBillingDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Badge variant={status.variant} className="rounded-full">
                    <span
                      className={cx(
                        "mr-1.5 size-1.5 rounded-full",
                        status.color === "emerald" && "bg-emerald-500",
                        status.color === "amber" && "bg-amber-500",
                        status.color === "gray" && "bg-gray-500",
                        status.color === "blue" && "bg-blue-500",
                      )}
                    />
                    {status.label}
                  </Badge>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
