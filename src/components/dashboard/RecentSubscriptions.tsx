"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from "@/components/Table"
import { formatCurrency } from "@/lib/currency"
import { cx } from "@/lib/utils"
import { RiArrowRightLine, RiMoreLine, RiLoader4Line } from "@remixicon/react"
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
  active: { variant: "success" as const, label: "Active" },
  trial: { variant: "warning" as const, label: "Trial" },
  cancelled: { variant: "neutral" as const, label: "Cancelled" },
  paused: { variant: "default" as const, label: "Paused" },
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
      <div className="flex h-64 items-center justify-center rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
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

  return (
    <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 dark:border-gray-800">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50">
            Recent Subscriptions
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your latest subscription activities
          </p>
        </div>
        <Button variant="secondary" size="sm" asChild>
          <Link href="/subscriptions">
            View All
            <RiArrowRightLine className="ml-2 size-4" />
          </Link>
        </Button>
      </div>

      {subscriptions.length === 0 ? (
        <div className="px-6 py-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No subscriptions yet. Add your first subscription to get started.
          </p>
          <Button asChild className="mt-4">
            <Link href="/subscriptions/new">Add Subscription</Link>
          </Button>
        </div>
      ) : (
        <TableRoot>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Amount</TableHeaderCell>
                <TableHeaderCell>Cycle</TableHeaderCell>
                <TableHeaderCell>Next Billing</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="w-10"></TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subscriptions.map((sub) => {
                const status =
                  statusConfig[sub.status as keyof typeof statusConfig] ||
                  statusConfig.active
                return (
                  <TableRow key={sub.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-md bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                          {sub.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-50">
                            {sub.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {sub.category || "Uncategorized"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {formatCurrency(sub.amount, sub.currency)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="capitalize">{sub.billingCycle}</span>
                    </TableCell>
                    <TableCell>
                      {new Date(sub.nextBillingDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={status.variant} className="rounded-full">
                        <span
                          className={cx(
                            "mr-1.5 size-1.5 rounded-full",
                            status.variant === "success" && "bg-emerald-500",
                            status.variant === "warning" && "bg-amber-500",
                            status.variant === "neutral" && "bg-gray-500",
                            status.variant === "default" && "bg-blue-500",
                          )}
                        />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/subscriptions/${sub.id}`}>
                        <Button variant="ghost" className="!p-1">
                          <RiMoreLine className="size-4 text-gray-500" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableRoot>
      )}
    </div>
  )
}
