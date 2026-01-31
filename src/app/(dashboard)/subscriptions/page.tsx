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
import { formatCurrency } from "@/lib/currency"
import { cx } from "@/lib/utils"
import {
  RiAddLine,
  RiDeleteBinLine,
  RiEditLine,
  RiMoreLine,
  RiDownloadLine,
  RiUploadLine,
  RiLoader4Line,
  RiSearchLine,
  RiFilterLine,
  RiWalletLine,
  RiCalendarLine,
  RiGridLine,
  RiListCheck2,
  RiLayoutColumnLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiAlertLine,
  RiExternalLinkLine,
  RiSortAsc,
  RiSortDesc,
  RiCloseLine,
  RiFileListLine,
} from "@remixicon/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect, useMemo, useRef } from "react"
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
  description?: string
  url?: string
  createdAt?: string
}

type ViewMode = "grid" | "list" | "kanban"
type SortField = "name" | "amount" | "nextBillingDate" | "status" | "category"
type SortOrder = "asc" | "desc"

const statusConfig = {
  active: { variant: "success" as const, label: "Active", color: "emerald", bg: "bg-emerald-500" },
  trial: { variant: "warning" as const, label: "Trial", color: "amber", bg: "bg-amber-500" },
  cancelled: { variant: "neutral" as const, label: "Cancelled", color: "gray", bg: "bg-gray-500" },
  paused: { variant: "default" as const, label: "Paused", color: "blue", bg: "bg-blue-500" },
}

const categoryColors: Record<string, string> = {
  Entertainment: "#E50914",
  Music: "#1DB954",
  Development: "#6366F1",
  Design: "#F24E1E",
  Cloud: "#FF9900",
  Productivity: "#0078D4",
  Finance: "#00D4AA",
  Health: "#FF6B6B",
  Education: "#9B59B6",
  Other: "#6B7280",
  default: "#3B82F6",
}

const billingCycleLabels: Record<string, string> = {
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays < 7) return `In ${diffDays} days`
  if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export default function SubscriptionsPage() {
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [displayCurrency, setDisplayCurrency] = useState("USD")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [cycleFilter, setCycleFilter] = useState("all")
  const [deleting, setDeleting] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [sortField, setSortField] = useState<SortField>("nextBillingDate")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  async function fetchSubscriptions() {
    try {
      setLoading(true)
      const response = await fetch("/api/subscriptions")
      if (!response.ok) throw new Error("Failed to fetch subscriptions")
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
      const response = await fetch(`/api/subscriptions/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete subscription")
      setSubscriptions((prev) => prev.filter((s) => s._id !== id))
      setSelectedIds((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete")
    } finally {
      setDeleting(null)
    }
  }

  async function handleBulkDelete() {
    if (selectedIds.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedIds.size} subscription(s)?`)) return

    try {
      await Promise.all(
        Array.from(selectedIds).map((id) =>
          fetch(`/api/subscriptions/${id}`, { method: "DELETE" })
        )
      )
      setSubscriptions((prev) => prev.filter((s) => !selectedIds.has(s._id)))
      setSelectedIds(new Set())
    } catch (err) {
      alert("Failed to delete some subscriptions")
    }
  }

  async function handleExport() {
    try {
      const response = await fetch("/api/subscriptions/export")
      if (!response.ok) throw new Error("Failed to export")

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

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/subscriptions/import", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Import failed")
      }

      await fetchSubscriptions()
      alert("Import successful!")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Import failed")
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Filtering & Sorting
  const filteredSubscriptions = useMemo(() => {
    let result = subscriptions.filter((sub) => {
      const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      const matchesStatus = statusFilter === "all" || sub.status === statusFilter
      const matchesCategory = categoryFilter === "all" || sub.category === categoryFilter
      const matchesCycle = cycleFilter === "all" || sub.billingCycle === cycleFilter
      return matchesSearch && matchesStatus && matchesCategory && matchesCycle
    })

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "amount":
          comparison = (a.displayAmount ?? a.amount) - (b.displayAmount ?? b.amount)
          break
        case "nextBillingDate":
          comparison = new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime()
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "category":
          comparison = (a.category || "").localeCompare(b.category || "")
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return result
  }, [subscriptions, searchQuery, statusFilter, categoryFilter, cycleFilter, sortField, sortOrder])

  const categories = useMemo(() => 
    [...new Set(subscriptions.map((s) => s.category).filter(Boolean))],
  [subscriptions])

  const amountForDisplay = (sub: Subscription) => sub.displayAmount ?? sub.amount

  // Stats
  const stats = useMemo(() => {
    const filtered = filteredSubscriptions
    const active = filtered.filter((s) => s.status === "active")
    
    const monthlyTotal = filtered.reduce((sum, sub) => {
      const amt = amountForDisplay(sub)
      if (sub.billingCycle === "monthly") return sum + amt
      if (sub.billingCycle === "yearly") return sum + amt / 12
      if (sub.billingCycle === "quarterly") return sum + amt / 3
      if (sub.billingCycle === "weekly") return sum + amt * 4.33
      return sum
    }, 0)

    const upcoming7Days = filtered.filter((s) => {
      const days = Math.ceil((new Date(s.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return days >= 0 && days <= 7 && s.status === "active"
    })

    const upcoming7DaysAmount = upcoming7Days.reduce((sum, s) => sum + amountForDisplay(s), 0)

    return {
      total: filtered.length,
      active: active.length,
      monthlyTotal,
      yearlyTotal: monthlyTotal * 12,
      upcoming7Days: upcoming7Days.length,
      upcoming7DaysAmount,
    }
  }, [filteredSubscriptions])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredSubscriptions.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredSubscriptions.map((s) => s._id)))
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setCategoryFilter("all")
    setCycleFilter("all")
  }

  const hasActiveFilters = searchQuery || statusFilter !== "all" || categoryFilter !== "all" || cycleFilter !== "all"

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-16 rounded-full border-4 border-blue-100 dark:border-blue-900" />
            <div className="absolute inset-0 size-16 animate-spin rounded-full border-4 border-transparent border-t-blue-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">Loading subscriptions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
          <RiAlertLine className="mx-auto mb-4 size-12 text-red-400" />
          <p className="text-lg font-medium text-red-600 dark:text-red-400">{error}</p>
          <Button variant="secondary" className="mt-4" onClick={fetchSubscriptions}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-4 py-6 dark:border-gray-800 dark:bg-gray-900 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 sm:text-3xl">
              Subscriptions
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Manage and track all your subscriptions in one place
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
            />
            <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
              <RiUploadLine className="mr-2 size-4" />
              Import
            </Button>
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <RiDownloadLine className="mr-2 size-4" />
              Export
            </Button>
            <Button asChild className="shadow-lg shadow-blue-500/25">
              <Link href="/subscriptions/new">
                <RiAddLine className="mr-2 size-4" />
                Add Subscription
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats Cards */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <RiFileListLine className="size-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <RiWalletLine className="size-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Monthly</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                  {formatCurrency(stats.monthlyTotal, displayCurrency)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <RiCalendarLine className="size-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Yearly</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                  {formatCurrency(stats.yearlyTotal, displayCurrency)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                <RiTimeLine className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Due 7 days</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                  {formatCurrency(stats.upcoming7DaysAmount, displayCurrency)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search & Filters */}
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative flex-1 sm:max-w-xs">
                <RiSearchLine className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search subscriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                variant={showFilters ? "primary" : "secondary"}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden"
              >
                <RiFilterLine className="mr-2 size-4" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 rounded-full bg-blue-500 px-1.5 text-xs text-white">!</span>
                )}
              </Button>
              <div className="hidden gap-2 sm:flex">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat!}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={cycleFilter} onValueChange={setCycleFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cycles</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
                {hasActiveFilters && (
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <RiCloseLine className="mr-1 size-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* View Mode & Sort */}
            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm">
                    {sortOrder === "asc" ? <RiSortAsc className="mr-2 size-4" /> : <RiSortDesc className="mr-2 size-4" />}
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {[
                    { field: "nextBillingDate" as SortField, label: "Next Billing" },
                    { field: "name" as SortField, label: "Name" },
                    { field: "amount" as SortField, label: "Amount" },
                    { field: "status" as SortField, label: "Status" },
                    { field: "category" as SortField, label: "Category" },
                  ].map(({ field, label }) => (
                    <DropdownMenuItem key={field} onClick={() => toggleSort(field)}>
                      {label}
                      {sortField === field && (
                        <span className="ml-auto">
                          {sortOrder === "asc" ? <RiArrowUpLine className="size-4" /> : <RiArrowDownLine className="size-4" />}
                        </span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Mode */}
              <div className="flex rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
                {[
                  { mode: "grid" as ViewMode, icon: RiGridLine },
                  { mode: "list" as ViewMode, icon: RiListCheck2 },
                  { mode: "kanban" as ViewMode, icon: RiLayoutColumnLine },
                ].map(({ mode, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cx(
                      "rounded-md p-1.5 transition-all",
                      viewMode === mode
                        ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-gray-50"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    )}
                  >
                    <Icon className="size-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="flex flex-col gap-2 border-t border-gray-200 pt-4 dark:border-gray-700 sm:hidden">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat!}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={cycleFilter} onValueChange={setCycleFilter}>
                <SelectTrigger><SelectValue placeholder="Billing Cycle" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cycles</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <RiCloseLine className="mr-1 size-4" />
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Bulk Actions */}
          {selectedIds.size > 0 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredSubscriptions.length}
                  onChange={toggleSelectAll}
                  className="size-4 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedIds.size} selected
                </span>
              </div>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <RiDeleteBinLine className="mr-2 size-4" />
                Delete Selected
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        {filteredSubscriptions.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
              <RiFileListLine className="size-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              {subscriptions.length === 0 ? "No subscriptions yet" : "No results found"}
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {subscriptions.length === 0
                ? "Add your first subscription to start tracking your expenses."
                : "Try adjusting your filters to find what you're looking for."}
            </p>
            {subscriptions.length === 0 ? (
              <Button asChild className="mt-4">
                <Link href="/subscriptions/new">Add Subscription</Link>
              </Button>
            ) : (
              <Button variant="secondary" className="mt-4" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSubscriptions.map((sub) => {
              const status = statusConfig[sub.status as keyof typeof statusConfig] || statusConfig.active
              const color = categoryColors[sub.category || ""] || categoryColors.default
              const daysUntil = Math.ceil(
                (new Date(sub.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              )
              const isUrgent = daysUntil <= 3 && daysUntil >= 0
              const isSelected = selectedIds.has(sub._id)

              return (
                <div
                  key={sub._id}
                  className={cx(
                    "group relative overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-900",
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-gray-200 dark:border-gray-800"
                  )}
                >
                  {/* Selection checkbox */}
                  <div className="absolute left-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(sub._id)}
                      className="size-4 rounded border-gray-300"
                    />
                  </div>

                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex size-12 items-center justify-center rounded-xl text-lg font-bold"
                        style={{ backgroundColor: `${color}15`, color }}
                      >
                        {sub.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-gray-900 dark:text-gray-50">
                          {sub.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {sub.category || "Uncategorized"}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="!p-1 opacity-0 group-hover:opacity-100">
                          <RiMoreLine className="size-5 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/subscriptions/${sub._id}`}>
                            <RiEditLine className="mr-2 size-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        {sub.url && (
                          <DropdownMenuItem asChild>
                            <a href={sub.url} target="_blank" rel="noopener noreferrer">
                              <RiExternalLinkLine className="mr-2 size-4" />
                              Visit Website
                            </a>
                          </DropdownMenuItem>
                        )}
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
                  </div>

                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                        {formatCurrency(amountForDisplay(sub), displayCurrency)}
                      </p>
                      <p className="text-sm capitalize text-gray-500 dark:text-gray-400">
                        {billingCycleLabels[sub.billingCycle] || sub.billingCycle}
                      </p>
                    </div>
                    <Badge variant={status.variant} className="rounded-full">
                      <span className={cx("mr-1.5 size-1.5 rounded-full", status.bg)} />
                      {status.label}
                    </Badge>
                  </div>

                  <div className={cx(
                    "mt-4 flex items-center justify-between rounded-xl p-3",
                    isUrgent ? "bg-amber-50 dark:bg-amber-900/20" : "bg-gray-50 dark:bg-gray-800"
                  )}>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Next billing</span>
                    <span className={cx(
                      "text-sm font-medium",
                      isUrgent ? "text-amber-600 dark:text-amber-400" : "text-gray-900 dark:text-gray-50"
                    )}>
                      {formatRelativeDate(sub.nextBillingDate)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : viewMode === "list" ? (
          // List View
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {/* Header */}
            <div className="hidden border-b border-gray-200 px-4 py-3 dark:border-gray-700 sm:grid sm:grid-cols-12 sm:gap-4">
              <div className="col-span-1 flex items-center">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredSubscriptions.length && filteredSubscriptions.length > 0}
                  onChange={toggleSelectAll}
                  className="size-4 rounded border-gray-300"
                />
              </div>
              <div className="col-span-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Name</div>
              <div className="col-span-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Amount</div>
              <div className="col-span-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Next Billing</div>
              <div className="col-span-2 text-xs font-semibold uppercase tracking-wide text-gray-500">Status</div>
              <div className="col-span-1" />
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredSubscriptions.map((sub) => {
                const status = statusConfig[sub.status as keyof typeof statusConfig] || statusConfig.active
                const color = categoryColors[sub.category || ""] || categoryColors.default
                const daysUntil = Math.ceil(
                  (new Date(sub.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                )
                const isUrgent = daysUntil <= 3 && daysUntil >= 0
                const isSelected = selectedIds.has(sub._id)

                return (
                  <div
                    key={sub._id}
                    className={cx(
                      "grid grid-cols-1 items-center gap-2 px-4 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 sm:grid-cols-12 sm:gap-4",
                      isSelected && "bg-blue-50 dark:bg-blue-900/20"
                    )}
                  >
                    <div className="hidden sm:col-span-1 sm:flex sm:items-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelect(sub._id)}
                        className="size-4 rounded border-gray-300"
                      />
                    </div>
                    <div className="flex items-center gap-3 sm:col-span-4">
                      <div
                        className="flex size-10 items-center justify-center rounded-xl text-sm font-bold sm:size-12"
                        style={{ backgroundColor: `${color}15`, color }}
                      >
                        {sub.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-gray-900 dark:text-gray-50">{sub.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {sub.category || "Uncategorized"} · {billingCycleLabels[sub.billingCycle]}
                        </p>
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                        {formatCurrency(amountForDisplay(sub), displayCurrency)}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <p className={cx(
                        "text-sm font-medium",
                        isUrgent ? "text-amber-600 dark:text-amber-400" : "text-gray-600 dark:text-gray-400"
                      )}>
                        {formatRelativeDate(sub.nextBillingDate)}
                      </p>
                    </div>
                    <div className="sm:col-span-2">
                      <Badge variant={status.variant} className="rounded-full">
                        <span className={cx("mr-1.5 size-1.5 rounded-full", status.bg)} />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="flex justify-end sm:col-span-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="!p-1">
                            <RiMoreLine className="size-5 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/subscriptions/${sub._id}`}>
                              <RiEditLine className="mr-2 size-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400"
                            onClick={() => handleDelete(sub._id)}
                          >
                            <RiDeleteBinLine className="mr-2 size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          // Kanban View
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {(["active", "trial", "paused", "cancelled"] as const).map((statusKey) => {
              const statusSubs = filteredSubscriptions.filter((s) => s.status === statusKey)
              const statusInfo = statusConfig[statusKey]
              const statusTotal = statusSubs.reduce((sum, s) => sum + amountForDisplay(s), 0)

              return (
                <div key={statusKey} className="rounded-2xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
                  <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className={cx("size-3 rounded-full", statusInfo.bg)} />
                      <span className="font-semibold text-gray-900 dark:text-gray-50">{statusInfo.label}</span>
                      <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                        {statusSubs.length}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {formatCurrency(statusTotal, displayCurrency)}
                    </span>
                  </div>

                  <div className="max-h-[500px] space-y-2 overflow-y-auto p-2">
                    {statusSubs.length === 0 ? (
                      <div className="py-8 text-center text-sm text-gray-400">
                        No subscriptions
                      </div>
                    ) : (
                      statusSubs.map((sub) => {
                        const color = categoryColors[sub.category || ""] || categoryColors.default

                        return (
                          <Link
                            key={sub._id}
                            href={`/subscriptions/${sub._id}`}
                            className="block rounded-xl border border-gray-200 bg-white p-3 transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="flex size-9 items-center justify-center rounded-lg text-sm font-bold"
                                style={{ backgroundColor: `${color}15`, color }}
                              >
                                {sub.name.charAt(0)}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                                  {sub.name}
                                </p>
                                <p className="text-xs text-gray-500">{sub.category || "Uncategorized"}</p>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="font-semibold text-gray-900 dark:text-gray-50">
                                {formatCurrency(amountForDisplay(sub), displayCurrency)}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatRelativeDate(sub.nextBillingDate)}
                              </span>
                            </div>
                          </Link>
                        )
                      })
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Results count */}
        {filteredSubscriptions.length > 0 && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Showing {filteredSubscriptions.length} of {subscriptions.length} subscription{subscriptions.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  )
}
