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
import { cx } from "@/lib/utils"
import { RiArrowRightLine, RiMoreLine } from "@remixicon/react"
import Link from "next/link"

// Mock data - will be replaced with API call
const recentSubscriptions = [
  {
    id: "1",
    name: "Netflix",
    amount: 14.99,
    currency: "USD",
    billingCycle: "monthly",
    nextBillingDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: "active",
    category: "Entertainment",
  },
  {
    id: "2",
    name: "Spotify",
    amount: 9.99,
    currency: "USD",
    billingCycle: "monthly",
    nextBillingDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: "active",
    category: "Music",
  },
  {
    id: "3",
    name: "GitHub Pro",
    amount: 4.0,
    currency: "USD",
    billingCycle: "monthly",
    nextBillingDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    status: "active",
    category: "Development",
  },
  {
    id: "4",
    name: "Adobe Creative Cloud",
    amount: 54.99,
    currency: "USD",
    billingCycle: "monthly",
    nextBillingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "trial",
    category: "Design",
  },
  {
    id: "5",
    name: "Microsoft 365",
    amount: 99.99,
    currency: "USD",
    billingCycle: "yearly",
    nextBillingDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    status: "active",
    category: "Productivity",
  },
]

const statusConfig = {
  active: { variant: "success" as const, label: "Active" },
  trial: { variant: "warning" as const, label: "Trial" },
  cancelled: { variant: "neutral" as const, label: "Cancelled" },
  paused: { variant: "default" as const, label: "Paused" },
}

export function RecentSubscriptions() {
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
            {recentSubscriptions.map((sub) => {
              const status = statusConfig[sub.status as keyof typeof statusConfig]
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
                          {sub.category}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      ${sub.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{sub.billingCycle}</span>
                  </TableCell>
                  <TableCell>
                    {sub.nextBillingDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
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
                    <Button variant="ghost" className="!p-1">
                      <RiMoreLine className="size-4 text-gray-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableRoot>
    </div>
  )
}
