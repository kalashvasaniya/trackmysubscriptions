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
  RiAlertLine,
  RiLoader4Line,
  RiTimeLine,
  RiSparklingLine,
  RiLineChartLine,
  RiCalendarLine,
  RiSettings4Line,
  RiCheckboxCircleLine,
  RiNotification3Line,
  RiFlashlightLine,
  RiFolderLine,
  RiPriceTag3Line,
  RiBankCardLine,
  RiFireLine,
  RiMedalLine,
  RiShieldCheckLine,
  RiErrorWarningLine,
  RiRefreshLine,
  RiEyeLine,
  RiPlayCircleLine,
  RiPauseCircleLine,
  RiCloseCircleLine,
  RiThumbUpLine,
  RiHeartPulseLine,
  RiTimerFlashLine,
  RiCalendar2Line,
  RiBarChartBoxLine,
  RiMore2Line,
  RiExternalLinkLine,
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
  active: { label: "Active", color: "bg-emerald-500", icon: RiPlayCircleLine },
  trial: { label: "Trial", color: "bg-amber-500", icon: RiTimerFlashLine },
  cancelled: { label: "Cancelled", color: "bg-gray-500", icon: RiCloseCircleLine },
  paused: { label: "Paused", color: "bg-blue-500", icon: RiPauseCircleLine },
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

function getTimeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// Health Score Gauge Component
function HealthScoreGauge({ score }: { score: number }) {
  const getScoreColor = () => {
    if (score >= 80) return { main: "#10B981", light: "#D1FAE5", text: "Excellent" }
    if (score >= 60) return { main: "#3B82F6", light: "#DBEAFE", text: "Good" }
    if (score >= 40) return { main: "#F59E0B", light: "#FEF3C7", text: "Fair" }
    return { main: "#EF4444", light: "#FEE2E2", text: "Needs Attention" }
  }
  
  const { main, light, text } = getScoreColor()
  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (score / 100) * circumference
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg className="size-28 -rotate-90 transform">
          <circle
            cx="56"
            cy="56"
            r="45"
            stroke={light}
            strokeWidth="10"
            fill="none"
            className="dark:opacity-30"
          />
          <circle
            cx="56"
            cy="56"
            r="45"
            stroke={main}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">{score}</span>
          <span className="text-xs text-gray-500">/ 100</span>
        </div>
      </div>
      <span className="mt-2 text-sm font-medium" style={{ color: main }}>{text}</span>
    </div>
  )
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDate] = useState(new Date())

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
    
    // Today's payments
    const todayPayments = data.upcomingPayments.filter((p) => {
      const date = new Date(p.nextBillingDate)
      return date.toDateString() === now.toDateString()
    })
    
    // This week's payments (next 7 days)
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const upcomingThisWeek = data.upcomingPayments.filter((p) => {
      const date = new Date(p.nextBillingDate)
      return date <= sevenDaysFromNow && date >= now
    })
    
    // Payments grouped by day for timeline
    const paymentsByDay: Record<string, typeof data.upcomingPayments> = {}
    upcomingThisWeek.forEach((p) => {
      const dateKey = new Date(p.nextBillingDate).toDateString()
      if (!paymentsByDay[dateKey]) paymentsByDay[dateKey] = []
      paymentsByDay[dateKey].push(p)
    })

    const nextPayment = data.upcomingPayments[0]
    const daysUntilNext = nextPayment
      ? Math.ceil((new Date(nextPayment.nextBillingDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null

    // Calculate health score
    const activeRatio = data.metrics.totalSubscriptions > 0
      ? (data.statusBreakdown.active / data.metrics.totalSubscriptions) * 50
      : 50
    const noOverdue = todayPayments.length === 0 ? 20 : 10
    const hasCategories = data.categorySpending.length > 0 ? 15 : 0
    const trending = monthlyChange <= 0 ? 15 : Math.max(0, 15 - monthlyChange / 10)
    const healthScore = Math.round(Math.min(100, activeRatio + noOverdue + hasCategories + trending))

    // Action items
    const actionItems = []
    if (todayPayments.length > 0) {
      actionItems.push({
        type: "urgent",
        icon: RiFireLine,
        title: `${todayPayments.length} payment${todayPayments.length > 1 ? "s" : ""} due today`,
        description: `Total: ${formatCurrency(todayPayments.reduce((s, p) => s + p.amount, 0), currency)}`,
        link: "/calendar",
      })
    }
    if (data.statusBreakdown.trial > 0) {
      actionItems.push({
        type: "warning",
        icon: RiTimerFlashLine,
        title: `${data.statusBreakdown.trial} trial${data.statusBreakdown.trial > 1 ? "s" : ""} to review`,
        description: "Review before they convert",
        link: "/subscriptions?status=trial",
      })
    }
    if (data.statusBreakdown.paused > 0) {
      actionItems.push({
        type: "info",
        icon: RiPauseCircleLine,
        title: `${data.statusBreakdown.paused} paused subscription${data.statusBreakdown.paused > 1 ? "s" : ""}`,
        description: "Consider cancelling or resuming",
        link: "/subscriptions?status=paused",
      })
    }

    // Week total
    const weekTotal = upcomingThisWeek.reduce((sum, p) => sum + p.amount, 0)

    return {
      currency,
      currentMonth,
      monthlyChange,
      upcomingThisWeek,
      paymentsByDay,
      nextPayment,
      daysUntilNext,
      trialsEnding: data.statusBreakdown.trial,
      todayPayments,
      healthScore,
      actionItems,
      weekTotal,
    }
  }, [data])

  const userName = session?.user?.name?.split(" ")[0] || "there"

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <RiLoader4Line className="size-10 animate-spin text-blue-500" />
          <p className="text-gray-500 dark:text-gray-400">Loading your command center...</p>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:border-gray-800">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="text-white">
              <p className="text-sm font-medium text-blue-200">
                {currentDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
                {getGreeting()}, {userName}!
              </h1>
              <p className="mt-2 text-blue-100">
                {insights.todayPayments.length > 0 
                  ? `You have ${insights.todayPayments.length} payment${insights.todayPayments.length > 1 ? "s" : ""} due today`
                  : "No payments due today - you're all caught up!"}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-white/20">
                <Link href="/analytics">
                  <RiBarChartBoxLine className="mr-2 size-4" />
                  View Analytics
                </Link>
              </Button>
              <Button asChild className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg">
                <Link href="/subscriptions/new">
                  <RiAddLine className="mr-2 size-4" />
                  Add Subscription
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Stats Pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiWalletLine className="size-4" />
              <span className="font-medium">{formatCurrency(data.metrics.monthlySpending, currency)}/mo</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiPlayCircleLine className="size-4" />
              <span className="font-medium">{data.statusBreakdown.active} Active</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiCalendarCheckLine className="size-4" />
              <span className="font-medium">{insights.upcomingThisWeek.length} due this week</span>
            </div>
            {insights.monthlyChange !== 0 && (
              <div className={cx(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm backdrop-blur-sm",
                insights.monthlyChange > 0 ? "bg-red-500/30 text-white" : "bg-emerald-500/30 text-white"
              )}>
                {insights.monthlyChange > 0 ? <RiArrowUpLine className="size-4" /> : <RiArrowDownLine className="size-4" />}
                <span className="font-medium">{Math.abs(insights.monthlyChange).toFixed(1)}% vs last month</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Column - Action Center */}
          <div className="space-y-6 lg:col-span-8">
            {/* Action Items */}
            {insights.actionItems.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-3 border-b border-gray-200 p-5 dark:border-gray-800">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
                    <RiNotification3Line className="size-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-gray-50">Action Required</h2>
                    <p className="text-sm text-gray-500">{insights.actionItems.length} item{insights.actionItems.length > 1 ? "s" : ""} need{insights.actionItems.length === 1 ? "s" : ""} your attention</p>
                  </div>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {insights.actionItems.map((item, i) => (
                    <Link
                      key={i}
                      href={item.link}
                      className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className={cx(
                          "flex size-10 items-center justify-center rounded-xl",
                          item.type === "urgent" && "bg-red-100 dark:bg-red-900/30",
                          item.type === "warning" && "bg-amber-100 dark:bg-amber-900/30",
                          item.type === "info" && "bg-blue-100 dark:bg-blue-900/30"
                        )}>
                          <item.icon className={cx(
                            "size-5",
                            item.type === "urgent" && "text-red-600",
                            item.type === "warning" && "text-amber-600",
                            item.type === "info" && "text-blue-600"
                          )} />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-50">{item.title}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      <RiArrowRightLine className="size-5 text-gray-400" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Payments Timeline */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                    <RiCalendar2Line className="size-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-gray-50">Payment Timeline</h2>
                    <p className="text-sm text-gray-500">Next 7 days • {formatCurrency(insights.weekTotal, currency)} total</p>
                  </div>
                </div>
                <Link href="/calendar" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Full calendar →
                </Link>
              </div>

              {Object.keys(insights.paymentsByDay).length > 0 ? (
                <div className="p-4">
                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute bottom-0 left-6 top-0 w-px bg-gray-200 dark:bg-gray-700" />
                    
                    <div className="space-y-6">
                      {Object.entries(insights.paymentsByDay).slice(0, 5).map(([dateKey, payments], index) => {
                        const date = new Date(dateKey)
                        const isToday = date.toDateString() === new Date().toDateString()
                        const isTomorrow = date.toDateString() === new Date(Date.now() + 86400000).toDateString()
                        const dayLabel = isToday ? "Today" : isTomorrow ? "Tomorrow" : date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
                        const dayTotal = payments.reduce((s, p) => s + p.amount, 0)

                        return (
                          <div key={dateKey} className="relative pl-12">
                            {/* Timeline dot */}
                            <div className={cx(
                              "absolute left-4 top-1 size-4 rounded-full border-2",
                              isToday 
                                ? "border-red-500 bg-red-500" 
                                : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800"
                            )} />
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={cx(
                                  "text-sm font-semibold",
                                  isToday ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-50"
                                )}>
                                  {dayLabel}
                                </span>
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                  {payments.length} payment{payments.length > 1 ? "s" : ""}
                                </span>
                              </div>
                              <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                                {formatCurrency(dayTotal, currency)}
                              </span>
                            </div>
                            
                            <div className="mt-2 space-y-2">
                              {payments.map((payment) => {
                                const color = categoryColors[payment.category || ""] || categoryColors.default
                                return (
                                  <Link
                                    key={payment.id}
                                    href={`/subscriptions/${payment.id}`}
                                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-3 transition-all hover:border-gray-200 hover:bg-white dark:border-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div
                                        className="flex size-9 items-center justify-center rounded-lg text-sm font-bold"
                                        style={{ backgroundColor: `${color}15`, color }}
                                      >
                                        {payment.name.charAt(0)}
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{payment.name}</p>
                                        <p className="text-xs text-gray-500">{payment.category || "Subscription"}</p>
                                      </div>
                                    </div>
                                    <span className="font-semibold text-gray-900 dark:text-gray-50">
                                      {formatCurrency(payment.amount, currency)}
                                    </span>
                                  </Link>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
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

            {/* Recent Activity */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                    <RiTimeLine className="size-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 dark:text-gray-50">Recent Activity</h2>
                    <p className="text-sm text-gray-500">Your latest subscription changes</p>
                  </div>
                </div>
                <Link href="/subscriptions" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  View all →
                </Link>
              </div>

              {data.recentSubscriptions.length > 0 ? (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {data.recentSubscriptions.slice(0, 5).map((sub) => {
                    const color = categoryColors[sub.category || ""] || categoryColors.default
                    const status = statusConfig[sub.status as keyof typeof statusConfig] || statusConfig.active

                    return (
                      <Link
                        key={sub.id}
                        href={`/subscriptions/${sub.id}`}
                        className="flex items-center justify-between p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex size-10 items-center justify-center rounded-xl text-sm font-bold"
                            style={{ backgroundColor: `${color}15`, color }}
                          >
                            {sub.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium text-gray-900 dark:text-gray-50">{sub.name}</p>
                              <span className={cx("size-2 rounded-full", status.color)} />
                            </div>
                            <p className="text-sm text-gray-500">
                              Added {getTimeAgo(sub.createdAt)} • {sub.category || "Uncategorized"}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-gray-50">
                            {formatCurrency(sub.amount, currency)}
                          </p>
                          <p className="text-xs capitalize text-gray-500">{sub.billingCycle}</p>
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

            {/* Quick Access */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                    <RiFlashlightLine className="size-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-50">Quick Access</h3>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {[
                  { href: "/analytics", icon: RiLineChartLine, label: "Analytics", color: "text-blue-600 bg-blue-100 dark:bg-blue-900/50" },
                  { href: "/calendar", icon: RiCalendarLine, label: "Calendar", color: "text-purple-600 bg-purple-100 dark:bg-purple-900/50" },
                  { href: "/folders", icon: RiFolderLine, label: "Folders", color: "text-amber-600 bg-amber-100 dark:bg-amber-900/50" },
                  { href: "/tags", icon: RiPriceTag3Line, label: "Tags", color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50" },
                  { href: "/payment-methods", icon: RiBankCardLine, label: "Cards", color: "text-pink-600 bg-pink-100 dark:bg-pink-900/50" },
                  { href: "/settings", icon: RiSettings4Line, label: "Settings", color: "text-gray-600 bg-gray-100 dark:bg-gray-800" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 p-4 transition-all hover:border-gray-200 hover:bg-white hover:shadow-sm dark:border-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                  >
                    <div className={cx("flex size-10 items-center justify-center rounded-xl", item.color)}>
                      <item.icon className="size-5" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6 lg:col-span-4">
            {/* Subscription Health */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-2">
                <RiHeartPulseLine className="size-5 text-rose-500" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">Subscription Health</h3>
              </div>
              <HealthScoreGauge score={insights.healthScore} />
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{data.statusBreakdown.active}</p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-3 text-center dark:bg-gray-800">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">{data.metrics.totalSubscriptions}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
              </div>
            </div>

            {/* Status Overview */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">Status Overview</h3>
              <div className="space-y-3">
                {Object.entries(statusConfig).map(([key, config]) => {
                  const count = data.statusBreakdown[key as keyof typeof data.statusBreakdown] || 0
                  const Icon = config.icon
                  
                  return (
                    <Link
                      key={key}
                      href={`/subscriptions?status=${key}`}
                      className="flex items-center justify-between rounded-xl p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <div className="flex items-center gap-3">
                        <div className={cx("flex size-8 items-center justify-center rounded-lg", config.color, "bg-opacity-20")}>
                          <Icon className={cx("size-4", config.color.replace("bg-", "text-"))} />
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{config.label}</span>
                      </div>
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-50">{count}</span>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Monthly Spending Indicator */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-3 text-sm font-medium text-gray-500">This Month&apos;s Spending</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                {formatCurrency(data.metrics.monthlySpending, currency)}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                    style={{ width: `${Math.min(100, (data.metrics.monthlySpending / (data.metrics.yearlySpending / 12 || 1)) * 100)}%` }}
                  />
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Yearly projection: {formatCurrency(data.metrics.yearlySpending, currency)}
              </p>
            </div>
          </div>
        </div>

        {/* Pro Tip Footer */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 p-6 text-white">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <RiSparklingLine className="size-6" />
              </div>
              <div>
                <p className="text-lg font-semibold">Did you know?</p>
                <p className="mt-1 text-indigo-100">
                  {data.statusBreakdown.trial > 0
                    ? `Review your ${data.statusBreakdown.trial} trial subscription${data.statusBreakdown.trial > 1 ? "s" : ""} to avoid unexpected charges.`
                    : insights.monthlyChange > 5
                    ? "Your spending increased this month. Check analytics to see where."
                    : "Switch monthly subscriptions to yearly plans to save up to 20%!"}
                </p>
              </div>
            </div>
            <Link
              href={data.statusBreakdown.trial > 0 ? "/subscriptions?status=trial" : "/analytics"}
              className="inline-flex items-center rounded-xl bg-white/20 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30"
            >
              {data.statusBreakdown.trial > 0 ? "Review Trials" : "View Analytics"}
              <RiArrowRightLine className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
