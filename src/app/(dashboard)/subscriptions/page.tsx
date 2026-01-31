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
import { cx } from "@/lib/utils"
import {
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiMoreLine,
  RiDownloadLine,
} from "@remixicon/react"
import Link from "next/link"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/DropdownMenu"

// Mock data - will be replaced with API call
const subscriptions = [
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
  {
    id: "6",
    name: "AWS",
    amount: 120.0,
    currency: "USD",
    billingCycle: "monthly",
    nextBillingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: "active",
    category: "Cloud",
  },
  {
    id: "7",
    name: "Figma",
    amount: 12.0,
    currency: "USD",
    billingCycle: "monthly",
    nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    status: "active",
    category: "Design",
  },
  {
    id: "8",
    name: "Notion",
    amount: 8.0,
    currency: "USD",
    billingCycle: "monthly",
    nextBillingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    status: "paused",
    category: "Productivity",
  },
]

const statusConfig = {
  active: { variant: "success" as const, label: "Active" },
  trial: { variant: "warning" as const, label: "Trial" },
  cancelled: { variant: "neutral" as const, label: "Cancelled" },
  paused: { variant: "default" as const, label: "Paused" },
}

export default function SubscriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

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

  const categories = [...new Set(subscriptions.map((s) => s.category))]

  const totalMonthly = filteredSubscriptions.reduce((sum, sub) => {
    if (sub.billingCycle === "monthly") return sum + sub.amount
    if (sub.billingCycle === "yearly") return sum + sub.amount / 12
    if (sub.billingCycle === "quarterly") return sum + sub.amount / 3
    if (sub.billingCycle === "weekly") return sum + sub.amount * 4
    return sum
  }, 0)

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
          <Button variant="secondary">
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
              ${totalMonthly.toFixed(2)}
            </p>
          </div>
          <div className="h-8 w-px bg-gray-200 dark:bg-gray-800" />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Yearly Cost
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
              ${(totalMonthly * 12).toFixed(2)}
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
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
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
                  statusConfig[sub.status as keyof typeof statusConfig]
                return (
                  <TableRow key={sub.id}>
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
                      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                        {sub.category}
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
                          <Link href={`/subscriptions/${sub.id}`}>
                            <DropdownMenuItem>
                              <RiEditLine className="mr-2 size-4" />
                              Edit
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600 dark:text-red-400">
                            <RiDeleteBinLine className="mr-2 size-4" />
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
      </div>
    </div>
  )
}
