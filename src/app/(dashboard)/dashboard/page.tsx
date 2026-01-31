"use client"

import { Button } from "@/components/Button"
import { Badge } from "@/components/Badge"
import { formatCurrency } from "@/lib/currency"
import { cx } from "@/lib/utils"
import {
  RiAddLine,
  RiArrowRightLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiWalletLine,
  RiCalendarCheckLine,
  RiFileListLine,
  RiAlertLine,
  RiLoader4Line,
  RiTimeLine,
  RiSparklingLine,
  RiLineChartLine,
  RiPieChart2Line,
  RiCalendarLine,
  RiSettings4Line,
  RiCheckboxCircleLine,
  RiNotification3Line,
  RiFlashlightLine,
  RiExternalLinkLine,
  RiFolderLine,
  RiPriceTag3Line,
  RiBankCardLine,
} from "@remixicon/react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useState, useEffect, useMemo } from "react"

interface AnalyticsData {
  displayCurrency: string
  metrics: {
    totalSubscriptions: number
    activeSubscriptions: number
    monthlySpending: number
    yearlySpending: number
  }
  categorySpending: Array<{ category: string; amount: number }>
  monthlyTrends: Array<{ month: string; amount: number }>
  upcomingPayments: Array<{
    id: string
    name: string
    amount: number
    currency: string
    nextBillingDate: string
    billingCycle: string
    category?: string
    status?: string
  }>
  statusBreakdown: {
    active: number
    trial: number
    paused: number
    cancelled: number
  }
  recentSubscriptions: Array<{
    id: string
    name: string
    amount: number
    currency: string
    billingCycle: string
    status: string
    category?: string
    nextBillingDate: string
    createdAt: string
  }>
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

const statusConfig = {
  active: { label: "Active", color: "bg-emerald-500" },
  trial: { label: "Trial", color: "bg-amber-500" },
  cancelled: { label: "Cancelled", color: "bg-gray-500" },
  paused: { label: "Paused", color: "bg-blue-500" },
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays <= 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays < 7) return `${diffDays} days`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/analytics")
        if (!response.ok) throw new Error("Failed to fetch data")
        const analyticsData = await response.json()
        setData(analyticsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const insights = useMemo(() => {
    if (!data) return null

    const currency = data.displayCurrency || "USD"
    const trends = data.monthlyTrends.map((t) => t.amount)
    const currentMonth = trends[trends.length - 1] || 0
    const previousMonth = trends[trends.length - 2] || 0
    const monthlyChange = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0

    const now = new Date()
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const upcomingThisWeek = data.upcomingPayments.filter((p) => {
      const date = new Date(p.nextBillingDate)
      return date <= sevenDaysFromNow
    })

    const nextPayment = data.upcomingPayments[0]
    const daysUntilNext = nextPayment
      ? Math.ceil((new Date(nextPayment.nextBillingDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null

    return {
      currency,
      currentMonth,
      monthlyChange,
      upcomingThisWeek,
      nextPayment,
      daysUntilNext,
      trialsEnding: data.statusBreakdown.trial,
    }
  }, [data])

  const userName = session?.user?.name?.split(" ")[0] || "there"

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <RiLoader4Line className="size-10 animate-spin text-blue-500" />
          <p className="text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !data || !insights) {
    return (
      <div className="flex h-96 items-center justify-center p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
          <RiAlertLine className="mx-auto mb-4 size-12 text-red-400" />
          <p className="text-lg font-medium text-red-600 dark:text-red-400">{error || "Failed to load"}</p>
          <Button variant="secondary" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const { currency } = insights

  return (
    <div className="min-h-screen bg-gray-50 p-4 dark:bg-gray-950 sm:p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50 sm:text-3xl">
              {getGreeting()}, {userName}! 👋
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Here&apos;s what&apos;s happening with your subscriptions today
            </p>
          </div>
          <Button asChild className="shadow-lg shadow-blue-500/25">
            <Link href="/subscriptions/new">
              <RiAddLine className="mr-2 size-4" />
              Add Subscription
            </Link>
          </Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column - Main Content */}
        <div className="space-y-6 lg:col-span-8">
          {/* Hero Stats */}
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Monthly Spending Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white">
              <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10" />
              <div className="absolute -right-4 -top-4 size-20 rounded-full bg-white/5" />
              <div className="relative">
                <div className="flex items-center gap-2 text-blue-100">
                  <RiWalletLine className="size-5" />
                  <span className="text-sm font-medium">Monthly Spending</span>
                </div>
                <p className="mt-3 text-4xl font-bold">
                  {formatCurrency(data.metrics.monthlySpending, currency)}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={cx(
                    "flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
                    insights.monthlyChange > 0 ? "bg-red-500/30" : "bg-emerald-500/30"
                  )}>
                    {insights.monthlyChange > 0 ? <RiArrowUpLine className="size-3" /> : <RiArrowDownLine className="size-3" />}
                    {Math.abs(insights.monthlyChange).toFixed(1)}%
                  </span>
                  <span className="text-sm text-blue-200">vs last month</span>
                </div>
              </div>
            </div>

            {/* Next Payment Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 p-6 text-white">
              <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10" />
              <div className="absolute -right-4 -top-4 size-20 rounded-full bg-white/5" />
              <div className="relative">
                <div className="flex items-center gap-2 text-purple-100">
                  <RiTimeLine className="size-5" />
                  <span className="text-sm font-medium">Next Payment</span>
                </div>
                {insights.nextPayment ? (
                  <>
                    <p className="mt-3 text-4xl font-bold">
                      {insights.daysUntilNext === 0 ? "Today" : insights.daysUntilNext === 1 ? "Tomorrow" : `${insights.daysUntilNext}d`}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="truncate text-sm text-purple-100">{insights.nextPayment.name}</span>
                      <span className="text-purple-200">·</span>
                      <span className="text-sm font-medium">{formatCurrency(insights.nextPayment.amount, currency)}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mt-3 text-4xl font-bold">—</p>
                    <p className="mt-2 text-sm text-purple-200">No upcoming payments</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Upcoming This Week */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                  <RiCalendarCheckLine className="size-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-gray-50">Due This Week</h2>
                  <p className="text-sm text-gray-500">{insights.upcomingThisWeek.length} payments coming up</p>
                </div>
              </div>
              <Link href="/calendar" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                View calendar →
              </Link>
            </div>

            {insights.upcomingThisWeek.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {insights.upcomingThisWeek.slice(0, 4).map((payment) => {
                  const daysUntil = Math.ceil(
                    (new Date(payment.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  )
                  const isUrgent = daysUntil <= 1
                  const color = categoryColors[payment.category || ""] || categoryColors.default

                  return (
                    <div key={payment.id} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex size-12 items-center justify-center rounded-xl text-lg font-bold"
                          style={{ backgroundColor: `${color}15`, color }}
                        >
                          {payment.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-50">{payment.name}</p>
                          <p className="text-sm text-gray-500">{payment.category || "Subscription"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-gray-50">
                          {formatCurrency(payment.amount, currency)}
                        </p>
                        <p className={cx(
                          "text-sm font-medium",
                          isUrgent ? "text-red-500" : "text-gray-500"
                        )}>
                          {formatRelativeDate(payment.nextBillingDate)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                  <RiCheckboxCircleLine className="size-8 text-emerald-500" />
                </div>
                <p className="font-medium text-gray-900 dark:text-gray-50">All clear this week!</p>
                <p className="mt-1 text-sm text-gray-500">No upcoming payments in the next 7 days</p>
              </div>
            )}
          </div>

          {/* Recent Subscriptions */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-800">
              <h2 className="font-semibold text-gray-900 dark:text-gray-50">Recent Subscriptions</h2>
              <Link href="/subscriptions" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                View all →
              </Link>
            </div>

            {data.recentSubscriptions.length > 0 ? (
              <div className="grid gap-3 p-4 sm:grid-cols-2">
                {data.recentSubscriptions.slice(0, 4).map((sub) => {
                  const color = categoryColors[sub.category || ""] || categoryColors.default
                  const status = statusConfig[sub.status as keyof typeof statusConfig] || statusConfig.active

                  return (
                    <Link
                      key={sub.id}
                      href={`/subscriptions/${sub.id}`}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3 transition-all hover:border-gray-200 hover:bg-white dark:border-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                    >
                      <div
                        className="flex size-10 items-center justify-center rounded-lg text-sm font-bold"
                        style={{ backgroundColor: `${color}15`, color }}
                      >
                        {sub.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">{sub.name}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{formatCurrency(sub.amount, currency)}</span>
                          <span className={cx("size-1.5 rounded-full", status.color)} />
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <p className="text-sm text-gray-500">No subscriptions yet</p>
                <Button asChild className="mt-3" size="sm">
                  <Link href="/subscriptions/new">Add your first</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6 lg:col-span-4">
          {/* Quick Stats */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                    <RiFileListLine className="size-4 text-emerald-600" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-50">{data.statusBreakdown.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                    <RiFlashlightLine className="size-4 text-amber-600" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Trials</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-50">{data.statusBreakdown.trial}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <RiCalendarLine className="size-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Yearly Cost</span>
                </div>
                <span className="text-lg font-bold text-gray-900 dark:text-gray-50">
                  {formatCurrency(data.metrics.yearlySpending, currency, { compact: true })}
                </span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {insights.trialsEnding > 0 && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800/50 dark:bg-amber-900/20">
              <div className="flex items-start gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/50">
                  <RiNotification3Line className="size-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-200">
                    {insights.trialsEnding} trial{insights.trialsEnding > 1 ? "s" : ""} ending soon
                  </p>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                    Review your trials to avoid unexpected charges
                  </p>
                  <Link
                    href="/subscriptions?status=trial"
                    className="mt-3 inline-flex items-center text-sm font-medium text-amber-700 hover:text-amber-800 dark:text-amber-300"
                  >
                    Review trials
                    <RiArrowRightLine className="ml-1 size-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Quick Navigation */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">Quick Access</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: "/analytics", icon: RiLineChartLine, label: "Analytics", color: "text-blue-600 bg-blue-100 dark:bg-blue-900/50" },
                { href: "/calendar", icon: RiCalendarLine, label: "Calendar", color: "text-purple-600 bg-purple-100 dark:bg-purple-900/50" },
                { href: "/folders", icon: RiFolderLine, label: "Folders", color: "text-amber-600 bg-amber-100 dark:bg-amber-900/50" },
                { href: "/tags", icon: RiPriceTag3Line, label: "Tags", color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50" },
                { href: "/payment-methods", icon: RiBankCardLine, label: "Payment", color: "text-pink-600 bg-pink-100 dark:bg-pink-900/50" },
                { href: "/settings", icon: RiSettings4Line, label: "Settings", color: "text-gray-600 bg-gray-100 dark:bg-gray-800" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-gray-200 hover:bg-white dark:border-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                >
                  <div className={cx("flex size-10 items-center justify-center rounded-xl", item.color)}>
                    <item.icon className="size-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Pro Tip */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-5 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-start gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/50">
                <RiSparklingLine className="size-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-50">Pro Tip</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  Enable email alerts to get notified before subscription renewals.
                </p>
                <Link
                  href="/settings"
                  className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  Go to Settings
                  <RiArrowRightLine className="ml-1 size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
