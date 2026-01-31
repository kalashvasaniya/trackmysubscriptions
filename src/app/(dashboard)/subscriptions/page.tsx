"use client"

import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/Select"
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
import {
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiMoreLine,
  RiDownloadLine,
  RiLoader4Line,
} from "@remixicon/react"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu"

interface Subscription {
  _id: string
  name: string
  amount: number
  currency: string
  displayAmount?: number
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

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [displayCurrency, setDisplayCurrency] = useState("USD")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  async function fetchSubscriptions() {
    try {
      setLoading(true)
      const response = await fetch("/api/subscriptions")
      if (!response.ok) {
        throw new Error("Failed to fetch subscriptions")
      }
      const data = await response.json()
      setSubscriptions(data.subscriptions ?? data)
      setDisplayCurrency(data.displayCurrency ?? "USD")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this subscription?")) return

    try {
      setDeleting(id)
      const response = await fetch(`/api/subscriptions/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete subscription")
      }

      setSubscriptions((prev) => prev.filter((s) => s._id !== id))
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete")
    } finally {
      setDeleting(null)
    }
  }

  async function handleExport() {
    try {
      const response = await fetch("/api/subscriptions/export")
      if (!response.ok) {
        throw new Error("Failed to export")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `subscriptions-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to export")
    }
  }

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStatus =
      statusFilter === "all" || sub.status === statusFilter
    const matchesCategory =
      categoryFilter === "all" || sub.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const categories = [...new Set(subscriptions.map((s) => s.category).filter(Boolean))]

  const amountForDisplay = (sub: Subscription) =>
    sub.displayAmount ?? sub.amount

  const totalMonthly = filteredSubscriptions.reduce((sum, sub) => {
    const amt = amountForDisplay(sub)
    if (sub.billingCycle === "monthly") return sum + amt
    if (sub.billingCycle === "yearly") return sum + amt / 12
    if (sub.billingCycle === "quarterly") return sum + amt / 3
    if (sub.billingCycle === "weekly") return sum + amt * 4
    return sum
  }, 0)

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center p-4 sm:p-6 lg:p-8">
        <RiLoader4Line className="size-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Subscriptions
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage and track all your subscriptions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleExport}>
            <RiDownloadLine className="mr-2 size-4" />
            Export CSV
          </Button>
          <Button asChild>
            <Link href="/subscriptions/new">
              <RiAddLine className="mr-2 size-4" />
              Add Subscription
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total Subscriptions
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              {filteredSubscriptions.length}
            </p>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Monthly Cost
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              {formatCurrency(totalMonthly, displayCurrency)}
            </p>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Yearly Cost
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              {formatCurrency(totalMonthly * 12, displayCurrency)}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <Input
          type="search"
          placeholder="Search subscriptions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="sm:w-64"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat!}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        {filteredSubscriptions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {subscriptions.length === 0
                ? "No subscriptions yet. Add your first subscription to get started."
                : "No subscriptions match your filters."}
            </p>
            {subscriptions.length === 0 && (
              <Button asChild className="mt-4">
                <Link href="/subscriptions/new">Add Subscription</Link>
              </Button>
            )}
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
                  <TableHeaderCell>Category</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell className="w-10"></TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSubscriptions.map((sub) => {
                  const status =
                    statusConfig[sub.status as keyof typeof statusConfig] ||
                    statusConfig.active
                  return (
                    <TableRow key={sub._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                            {sub.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-gray-50">
                            {sub.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          {formatCurrency(amountForDisplay(sub), displayCurrency)}
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
                        <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                          {sub.category || "Uncategorized"}
                        </span>
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
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="!p-1">
                              <RiMoreLine className="size-4 text-gray-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <Link href={`/subscriptions/${sub._id}`}>
                              <DropdownMenuItem>
                                <RiEditLine className="mr-2 size-4" />
                                Edit
                              </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400"
                              onClick={() => handleDelete(sub._id)}
                              disabled={deleting === sub._id}
                            >
                              {deleting === sub._id ? (
                                <RiLoader4Line className="mr-2 size-4 animate-spin" />
                              ) : (
                                <RiDeleteBinLine className="mr-2 size-4" />
                              )}
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableRoot>
        )}
      </div>
    </div>
  )
}
