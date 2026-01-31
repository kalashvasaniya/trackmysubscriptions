"use client"

import { formatCurrency } from "@/lib/currency"
import { cx } from "@/lib/utils"
import {
  RiArrowUpLine,
  RiArrowDownLine,
  RiCalendarCheckLine,
  RiWalletLine,
  RiSparklingLine,
  RiAlertLine,
  RiTrophyLine,
  RiLightbulbLine,
  RiLineChartLine,
  RiPieChart2Line,
  RiMoneyDollarCircleLine,
  RiRefund2Line,
  RiTimeLine,
  RiPercentLine,
  RiArrowRightLine,
} from "@remixicon/react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { useEffect, useState, useMemo } from "react"

// Dynamic imports for chart components - reduces initial bundle by ~200KB
const SpendingTrendChart = dynamic(
  () => import("@/components/analytics/AnalyticsCharts").then((mod) => mod.SpendingTrendChart),
  { ssr: false }
)

const CategoryPieChart = dynamic(
  () => import("@/components/analytics/AnalyticsCharts").then((mod) => mod.CategoryPieChart),
  { ssr: false }
)

const TopSubscriptionsChart = dynamic(
  () => import("@/components/analytics/AnalyticsCharts").then((mod) => mod.TopSubscriptionsChart),
  { ssr: false }
)

const MonthOverMonthChart = dynamic(
  () => import("@/components/analytics/AnalyticsCharts").then((mod) => mod.MonthOverMonthChart),
  { ssr: false }
)

const StatusPieChart = dynamic(
  () => import("@/components/analytics/AnalyticsCharts").then((mod) => mod.StatusPieChart),
  { ssr: false }
)

const BillingCyclePieChart = dynamic(
  () => import("@/components/analytics/AnalyticsCharts").then((mod) => mod.BillingCyclePieChart),
  { ssr: false }
)

interface AnalyticsData {
  displayCurrency?: string
  metrics: {
    totalSubscriptions: number
    activeSubscriptions: number
    monthlySpending: number
    yearlySpending: number
    avgSubscriptionCost: number
  }
  categorySpending: Array<{
    category: string
    amount: number
  }>
  monthlyTrends: Array<{
    month: string
    amount: number
  }>
  statusBreakdown: {
    active: number
    trial: number
    paused: number
    cancelled: number
  }
  billingCycleBreakdown: {
    weekly: number
    monthly: number
    quarterly: number
    yearly: number
  }
  billingCycleCost: {
    weekly: number
    monthly: number
    quarterly: number
    yearly: number
  }
  topSubscriptions: Array<{
    id: string
    name: string
    monthlyAmount: number
    actualAmount: number
    billingCycle: string
    category: string
  }>
  weekdaySpending: Array<{
    day: string
    amount: number
  }>
  upcomingPayments: Array<{
    id: string
    name: string
    amount: number
    currency?: string
    nextBillingDate: string
    category?: string
  }>
}

// Color constants moved outside component to avoid recreation
const COLORS = {
  blue: "#3B82F6",
  emerald: "#10B981",
  amber: "#F59E0B",
  purple: "#8B5CF6",
  red: "#EF4444",
  cyan: "#06B6D4",
  pink: "#EC4899",
} as const

const STATUS_COLORS = {
  active: COLORS.emerald,
  trial: COLORS.amber,
  paused: COLORS.blue,
  cancelled: COLORS.red,
} as const

const CYCLE_COLORS = {
  monthly: COLORS.blue,
  yearly: COLORS.emerald,
  quarterly: COLORS.purple,
  weekly: COLORS.amber,
} as const

const CATEGORY_COLORS = [COLORS.blue, COLORS.emerald, COLORS.purple, COLORS.amber, COLORS.pink, COLORS.cyan] as const

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch("/api/analytics")
        if (!response.ok) throw new Error("Failed to fetch analytics")
        const analyticsData = await response.json()
        setData(analyticsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  // Calculate derived insights with memoization
  const insights = useMemo(() => {
    if (!data) return null

    const currency = data.displayCurrency || "USD"
    const monthly = data.metrics.monthlySpending
    const yearly = data.metrics.yearlySpending
    const trends = data.monthlyTrends.map((t) => t.amount)

    const currentMonth = trends[trends.length - 1] || 0
    const previousMonth = trends[trends.length - 2] || 0
    const avgMonthly = trends.length > 0 ? trends.reduce((a, b) => a + b, 0) / trends.length : 0
    const monthlyChange = previousMonth > 0 ? ((currentMonth - previousMonth) / previousMonth) * 100 : 0
    const isIncreasing = monthlyChange > 0

    const monthlyOnlyCost = data.billingCycleBreakdown.monthly * avgMonthly
    const potentialYearlySavings = monthlyOnlyCost * 0.15

    const topCategory = data.categorySpending.length > 0
      ? data.categorySpending.reduce((a, b) => (a.amount > b.amount ? a : b))
      : null
    const categoryTotal = data.categorySpending.reduce((sum, c) => sum + c.amount, 0)

    const next7Days = data.upcomingPayments.filter((p) => {
      const days = Math.ceil((new Date(p.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return days <= 7 && days >= 0
    })
    const next7DaysTotal = next7Days.reduce((sum, p) => sum + p.amount, 0)

    const unusedCount = data.statusBreakdown.paused + data.statusBreakdown.cancelled
    const dailyCost = monthly / 30

    const activeRatio = data.metrics.totalSubscriptions > 0
      ? data.statusBreakdown.active / data.metrics.totalSubscriptions
      : 0
    const efficiencyScore = Math.round(activeRatio * 100)

    // Prepare chart data
    const statusChartData = [
      { name: "Active", value: data.statusBreakdown.active, fill: STATUS_COLORS.active },
      { name: "Trial", value: data.statusBreakdown.trial, fill: STATUS_COLORS.trial },
      { name: "Paused", value: data.statusBreakdown.paused, fill: STATUS_COLORS.paused },
      { name: "Cancelled", value: data.statusBreakdown.cancelled, fill: STATUS_COLORS.cancelled },
    ].filter((item) => item.value > 0)

    const cycleChartData = [
      { name: "Monthly", value: data.billingCycleBreakdown.monthly, fill: CYCLE_COLORS.monthly },
      { name: "Yearly", value: data.billingCycleBreakdown.yearly, fill: CYCLE_COLORS.yearly },
      { name: "Quarterly", value: data.billingCycleBreakdown.quarterly, fill: CYCLE_COLORS.quarterly },
      { name: "Weekly", value: data.billingCycleBreakdown.weekly, fill: CYCLE_COLORS.weekly },
    ].filter((item) => item.value > 0)

    const categoryChartData = data.categorySpending
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6)
      .map((cat, i) => ({
        name: cat.category,
        amount: cat.amount,
        fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }))

    // Pie chart data for categories
    const categoryPieData = data.categorySpending
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)
      .map((cat, i) => ({
        name: cat.category,
        value: cat.amount,
        fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }))

    // Billing cycle cost data
    const billingCycleCostData = [
      { name: "Monthly", value: data.billingCycleCost.monthly, fill: CYCLE_COLORS.monthly },
      { name: "Yearly", value: data.billingCycleCost.yearly, fill: CYCLE_COLORS.yearly },
      { name: "Quarterly", value: data.billingCycleCost.quarterly, fill: CYCLE_COLORS.quarterly },
      { name: "Weekly", value: data.billingCycleCost.weekly, fill: CYCLE_COLORS.weekly },
    ].filter((item) => item.value > 0)

    // Weekday spending data
    const weekdayData = data.weekdaySpending.filter((d) => d.amount > 0)

    // Month over month comparison
    const monthOverMonth = trends.length >= 2
      ? trends.map((amount, i) => ({
          month: data.monthlyTrends[i]?.month || "",
          amount,
          previous: i > 0 ? trends[i - 1] : 0,
        }))
      : []

    return {
      currency,
      monthly,
      yearly,
      currentMonth,
      previousMonth,
      avgMonthly,
      avgSubscriptionCost: data.metrics.avgSubscriptionCost,
      monthlyChange,
      isIncreasing,
      potentialYearlySavings,
      topCategory,
      categoryTotal,
      next7Days,
      next7DaysTotal,
      unusedCount,
      dailyCost,
      efficiencyScore,
      trends,
      statusChartData,
      cycleChartData,
      categoryChartData,
      categoryPieData,
      billingCycleCostData,
      topSubscriptions: data.topSubscriptions,
      weekdayData,
      monthOverMonth,
    }
  }, [data])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-16 rounded-full border-4 border-purple-100 dark:border-purple-900" />
            <div className="absolute inset-0 size-16 animate-spin rounded-full border-4 border-transparent border-t-purple-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">Analyzing your subscriptions...</p>
        </div>
      </div>
    )
  }

  if (error || !data || !insights) {
    return (
      <div className="flex h-96 items-center justify-center p-8">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
          <RiAlertLine className="mx-auto mb-4 size-12 text-red-400" />
          <p className="text-lg font-medium text-red-600 dark:text-red-400">{error || "Failed to load analytics"}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const { currency } = insights

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 dark:border-gray-800">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-white">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm sm:size-12">
                  <RiLineChartLine className="size-5 sm:size-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">Financial Insights</h1>
                  <p className="mt-0.5 text-sm text-purple-100 sm:mt-1">Understand where your money goes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Pills */}
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs text-white backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
              <RiMoneyDollarCircleLine className="size-3.5 sm:size-4" />
              <span className="font-medium">{formatCurrency(insights.monthly, currency)}/mo</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs text-white backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
              <RiCalendarCheckLine className="size-3.5 sm:size-4" />
              <span className="font-medium">{formatCurrency(insights.yearly, currency)}/yr</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs text-white backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
              <RiPercentLine className="size-3.5 sm:size-4" />
              <span className="font-medium">{insights.efficiencyScore}%<span className="hidden sm:inline"> Efficiency</span></span>
            </div>
            {insights.monthlyChange !== 0 && (
              <div className={cx(
                "flex items-center gap-1 rounded-full px-3 py-1.5 text-xs backdrop-blur-sm sm:gap-1.5 sm:px-4 sm:py-2 sm:text-sm",
                insights.isIncreasing ? "bg-red-500/30 text-white" : "bg-emerald-500/30 text-white"
              )}>
                {insights.isIncreasing ? <RiArrowUpLine className="size-3.5 sm:size-4" /> : <RiArrowDownLine className="size-3.5 sm:size-4" />}
                <span className="font-medium">{Math.abs(insights.monthlyChange).toFixed(1)}%<span className="hidden sm:inline"> vs last month</span></span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-3 sm:p-6 lg:p-8">
        {/* Quick Stats Row */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-6 sm:gap-4 lg:grid-cols-5">
          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:p-4">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 sm:gap-2">
              <RiMoneyDollarCircleLine className="size-3.5 sm:size-4" />
              <span className="text-[10px] font-medium uppercase tracking-wide sm:text-xs">Monthly</span>
            </div>
            <p className="mt-1.5 text-lg font-bold text-gray-900 dark:text-gray-50 sm:mt-2 sm:text-2xl">
              {formatCurrency(insights.monthly, currency)}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">total spending</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:p-4">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 sm:gap-2">
              <RiCalendarCheckLine className="size-3.5 sm:size-4" />
              <span className="text-[10px] font-medium uppercase tracking-wide sm:text-xs">Yearly</span>
            </div>
            <p className="mt-1.5 text-lg font-bold text-gray-900 dark:text-gray-50 sm:mt-2 sm:text-2xl">
              {formatCurrency(insights.yearly, currency)}
            </p>
            <div className={cx(
              "mt-0.5 flex items-center gap-0.5 text-[10px] font-medium sm:mt-1 sm:gap-1 sm:text-xs",
              insights.isIncreasing ? "text-red-500" : "text-emerald-500"
            )}>
              {insights.isIncreasing ? <RiArrowUpLine className="size-2.5 sm:size-3" /> : <RiArrowDownLine className="size-2.5 sm:size-3" />}
              {Math.abs(insights.monthlyChange).toFixed(1)}%<span className="hidden sm:inline"> vs last month</span>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:p-4">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 sm:gap-2">
              <RiWalletLine className="size-3.5 sm:size-4" />
              <span className="text-[10px] font-medium uppercase tracking-wide sm:text-xs">Avg/Sub</span>
            </div>
            <p className="mt-1.5 text-lg font-bold text-gray-900 dark:text-gray-50 sm:mt-2 sm:text-2xl">
              {formatCurrency(insights.avgSubscriptionCost, currency)}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">per subscription</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:p-4">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 sm:gap-2">
              <RiTimeLine className="size-3.5 sm:size-4" />
              <span className="text-[10px] font-medium uppercase tracking-wide sm:text-xs">Next 7 Days</span>
            </div>
            <p className="mt-1.5 text-lg font-bold text-gray-900 dark:text-gray-50 sm:mt-2 sm:text-2xl">
              {formatCurrency(insights.next7DaysTotal, currency)}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">
              {insights.next7Days.length} payment{insights.next7Days.length !== 1 ? "s" : ""} due
            </p>
          </div>

          <div className="col-span-2 rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:p-4 lg:col-span-1">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 sm:gap-2">
              <RiPercentLine className="size-3.5 sm:size-4" />
              <span className="text-[10px] font-medium uppercase tracking-wide sm:text-xs">Efficiency</span>
            </div>
            <p className="mt-1.5 text-lg font-bold text-gray-900 dark:text-gray-50 sm:mt-2 sm:text-2xl">
              {insights.efficiencyScore}%
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">
              {insights.efficiencyScore >= 80 ? "Excellent" : insights.efficiencyScore >= 60 ? "Good" : "Needs review"}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Left Column - Charts */}
          <div className="space-y-4 sm:space-y-6 lg:col-span-2">
            {/* Spending Trend - Area Chart */}
            <SpendingTrendChart
              data={data.monthlyTrends}
              currency={currency}
              yearly={insights.yearly}
              avgMonthly={insights.avgMonthly}
              trends={insights.trends}
            />

            {/* Category Pie Chart */}
            <CategoryPieChart
              data={insights.categoryPieData}
              currency={currency}
              categoryTotal={insights.categoryTotal}
            />

            {/* Top Subscriptions */}
            <TopSubscriptionsChart
              data={insights.topSubscriptions}
              currency={currency}
              avgSubscriptionCost={insights.avgSubscriptionCost}
            />

            {/* Month Over Month Comparison */}
            <MonthOverMonthChart
              data={insights.monthOverMonth}
              currency={currency}
            />
          </div>

          {/* Right Column - Insights & Actions */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-1 lg:space-y-0">
            {/* Status Distribution with Pie */}
            <StatusPieChart data={insights.statusChartData} />

            {/* Billing Cycle Cost Distribution */}
            <BillingCyclePieChart
              data={insights.billingCycleCostData}
              currency={currency}
            />

            {/* Smart Insights */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center gap-2">
                <RiLightbulbLine className="size-5 text-amber-500" />
                <h2 className="font-semibold text-gray-900 dark:text-gray-50">Smart Insights</h2>
              </div>

              <div className="space-y-4">
                {insights.monthlyChange !== 0 && (
                  <div className={cx(
                    "rounded-xl p-4",
                    insights.isIncreasing ? "bg-red-50 dark:bg-red-900/20" : "bg-emerald-50 dark:bg-emerald-900/20"
                  )}>
                    <div className="flex items-start gap-3">
                      {insights.isIncreasing ? (
                        <RiArrowUpLine className="mt-0.5 size-5 text-red-500" />
                      ) : (
                        <RiArrowDownLine className="mt-0.5 size-5 text-emerald-500" />
                      )}
                      <div>
                        <p className={cx(
                          "font-medium",
                          insights.isIncreasing ? "text-red-700 dark:text-red-400" : "text-emerald-700 dark:text-emerald-400"
                        )}>
                          Spending {insights.isIncreasing ? "increased" : "decreased"} {Math.abs(insights.monthlyChange).toFixed(0)}%
                        </p>
                        <p className={cx(
                          "mt-1 text-sm",
                          insights.isIncreasing ? "text-red-600/80 dark:text-red-400/80" : "text-emerald-600/80 dark:text-emerald-400/80"
                        )}>
                          {insights.isIncreasing ? "Review recent additions" : "Great job!"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {insights.potentialYearlySavings > 10 && (
                  <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                    <div className="flex items-start gap-3">
                      <RiRefund2Line className="mt-0.5 size-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-blue-700 dark:text-blue-400">
                          Save up to {formatCurrency(insights.potentialYearlySavings, currency)}/year
                        </p>
                        <p className="mt-1 text-sm text-blue-600/80 dark:text-blue-400/80">
                          Switch to annual billing
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {insights.unusedCount > 0 && (
                  <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
                    <div className="flex items-start gap-3">
                      <RiAlertLine className="mt-0.5 size-5 text-amber-500" />
                      <div>
                        <p className="font-medium text-amber-700 dark:text-amber-400">
                          {insights.unusedCount} inactive subscription{insights.unusedCount !== 1 ? "s" : ""}
                        </p>
                        <p className="mt-1 text-sm text-amber-600/80 dark:text-amber-400/80">
                          Review paused/cancelled items
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {insights.topCategory && (
                  <div className="rounded-xl bg-purple-50 p-4 dark:bg-purple-900/20">
                    <div className="flex items-start gap-3">
                      <RiPieChart2Line className="mt-0.5 size-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-purple-700 dark:text-purple-400">
                          Top: {insights.topCategory.category}
                        </p>
                        <p className="mt-1 text-sm text-purple-600/80 dark:text-purple-400/80">
                          {formatCurrency(insights.topCategory.amount, currency)}/month
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Payments */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RiTimeLine className="size-5 text-blue-500" />
                  <h2 className="font-semibold text-gray-900 dark:text-gray-50">Due Soon</h2>
                </div>
                <Link href="/calendar" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  View all
                </Link>
              </div>

              {insights.next7Days.length > 0 ? (
                <div className="space-y-3">
                  {insights.next7Days.slice(0, 5).map((payment) => {
                    const daysUntil = Math.ceil(
                      (new Date(payment.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                    )
                    const isUrgent = daysUntil <= 2

                    return (
                      <div
                        key={payment.id}
                        className={cx(
                          "flex items-center justify-between rounded-xl p-3",
                          isUrgent ? "bg-red-50 dark:bg-red-900/20" : "bg-gray-50 dark:bg-gray-800"
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-gray-900 dark:text-gray-50">{payment.name}</p>
                          <p className={cx("text-xs", isUrgent ? "text-red-500" : "text-gray-500")}>
                            {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `In ${daysUntil} days`}
                          </p>
                        </div>
                        <p className="ml-3 font-semibold text-gray-900 dark:text-gray-50">
                          {formatCurrency(payment.amount, payment.currency || currency)}
                        </p>
                      </div>
                    )
                  })}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-800">
                    <span className="text-sm text-gray-500">7-day total</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-50">
                      {formatCurrency(insights.next7DaysTotal, currency)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <RiSparklingLine className="mb-2 size-8 text-emerald-400" />
                  <p className="font-medium text-gray-900 dark:text-gray-50">All clear!</p>
                  <p className="text-sm text-gray-500">No payments in next 7 days</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  href="/subscriptions"
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                      <RiWalletLine className="size-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Manage Subscriptions</span>
                  </div>
                  <RiArrowRightLine className="size-4 text-gray-400" />
                </Link>

                <Link
                  href="/calendar"
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/50">
                      <RiCalendarCheckLine className="size-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Calendar</span>
                  </div>
                  <RiArrowRightLine className="size-4 text-gray-400" />
                </Link>

                <Link
                  href="/settings"
                  className="flex items-center justify-between rounded-xl bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                      <RiLineChartLine className="size-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Settings</span>
                  </div>
                  <RiArrowRightLine className="size-4 text-gray-400" />
                </Link>
              </div>
            </div>

            {/* Achievement Badge */}
            {insights.efficiencyScore >= 80 && (
              <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white">
                <div className="flex items-center gap-3">
                  <RiTrophyLine className="size-10" />
                  <div>
                    <p className="text-lg font-bold">Subscription Pro!</p>
                    <p className="text-sm text-amber-100">
                      {insights.efficiencyScore}% efficiency score
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
