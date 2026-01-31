"use client"

import { formatCurrency } from "@/lib/currency"
import { cx } from "@/lib/utils"
import {
  RiArrowUpLine,
  RiArrowDownLine,
  RiLoader4Line,
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
import { useEffect, useState, useMemo } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Line,
  ComposedChart,
} from "recharts"

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

const COLORS = {
  blue: "#3B82F6",
  emerald: "#10B981",
  amber: "#F59E0B",
  purple: "#8B5CF6",
  red: "#EF4444",
  cyan: "#06B6D4",
  pink: "#EC4899",
}

const STATUS_COLORS = {
  active: COLORS.emerald,
  trial: COLORS.amber,
  paused: COLORS.blue,
  cancelled: COLORS.red,
}

const CYCLE_COLORS = {
  monthly: COLORS.blue,
  yearly: COLORS.emerald,
  quarterly: COLORS.purple,
  weekly: COLORS.amber,
}

const CATEGORY_COLORS = [COLORS.blue, COLORS.emerald, COLORS.purple, COLORS.amber, COLORS.pink, COLORS.cyan]

// Custom tooltip for charts
function CustomTooltip({ 
  active, 
  payload, 
  label, 
  currency,
  valuePrefix = "",
}: { 
  active?: boolean
  payload?: Array<{ value: number; name?: string; dataKey?: string }>
  label?: string 
  currency: string
  valuePrefix?: string
}) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
        {label && <p className="mb-1 text-xs font-medium text-gray-500">{label}</p>}
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">
          {valuePrefix}{formatCurrency(payload[0].value, currency)}
        </p>
      </div>
    )
  }
  return null
}

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

  // Calculate derived insights
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
        
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-white">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                  <RiLineChartLine className="size-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">Financial Insights</h1>
                  <p className="mt-1 text-purple-100">Understand where your money goes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiMoneyDollarCircleLine className="size-4" />
              <span className="font-medium">{formatCurrency(insights.monthly, currency)}/mo</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiCalendarCheckLine className="size-4" />
              <span className="font-medium">{formatCurrency(insights.yearly, currency)}/yr</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <RiPercentLine className="size-4" />
              <span className="font-medium">{insights.efficiencyScore}% Efficiency</span>
            </div>
            {insights.monthlyChange !== 0 && (
              <div className={cx(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-sm backdrop-blur-sm",
                insights.isIncreasing ? "bg-red-500/30 text-white" : "bg-emerald-500/30 text-white"
              )}>
                {insights.isIncreasing ? <RiArrowUpLine className="size-4" /> : <RiArrowDownLine className="size-4" />}
                <span className="font-medium">{Math.abs(insights.monthlyChange).toFixed(1)}% vs last month</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        {/* Quick Stats Row */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <RiMoneyDollarCircleLine className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Monthly</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">
              {formatCurrency(insights.monthly, currency)}
            </p>
            <p className="mt-1 text-xs text-gray-500">total spending</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <RiCalendarCheckLine className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Yearly</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">
              {formatCurrency(insights.yearly, currency)}
            </p>
            <div className={cx(
              "mt-1 flex items-center gap-1 text-xs font-medium",
              insights.isIncreasing ? "text-red-500" : "text-emerald-500"
            )}>
              {insights.isIncreasing ? <RiArrowUpLine className="size-3" /> : <RiArrowDownLine className="size-3" />}
              {Math.abs(insights.monthlyChange).toFixed(1)}% vs last month
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <RiWalletLine className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Avg/Sub</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">
              {formatCurrency(insights.avgSubscriptionCost, currency)}
            </p>
            <p className="mt-1 text-xs text-gray-500">per subscription</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <RiTimeLine className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Next 7 Days</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">
              {formatCurrency(insights.next7DaysTotal, currency)}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {insights.next7Days.length} payment{insights.next7Days.length !== 1 ? "s" : ""} due
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <RiPercentLine className="size-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Efficiency</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-50">
              {insights.efficiencyScore}%
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {insights.efficiencyScore >= 80 ? "Excellent" : insights.efficiencyScore >= 60 ? "Good" : "Needs review"}
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Charts */}
          <div className="space-y-6 lg:col-span-2">
            {/* Spending Trend - Area Chart */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                    Spending Trend
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">Monthly spending over the past year</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                    {formatCurrency(insights.yearly, currency)}
                  </p>
                  <p className="text-xs text-gray-500">yearly total</p>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.monthlyTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="spendingGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: "#6b7280" }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      width={40}
                    />
                    <Tooltip content={<CustomTooltip currency={currency} />} />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke={COLORS.blue}
                      strokeWidth={2}
                      fill="url(#spendingGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4 border-t border-gray-100 pt-4 dark:border-gray-800">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Average</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-50">
                    {formatCurrency(insights.avgMonthly, currency)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Highest</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-50">
                    {formatCurrency(Math.max(...insights.trends), currency)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Lowest</p>
                  <p className="mt-1 font-semibold text-gray-900 dark:text-gray-50">
                    {formatCurrency(Math.min(...insights.trends.filter((t) => t > 0)) || 0, currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Category Pie Chart */}
            {insights.categoryPieData.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-50">
                  Spending Distribution
                </h2>
                <p className="mb-6 text-sm text-gray-500">How your monthly spending is divided</p>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={insights.categoryPieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {insights.categoryPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) => formatCurrency(value, currency)}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col justify-center space-y-2">
                    {insights.categoryPieData.map((item, index) => {
                      const percentage = insights.categoryTotal > 0
                        ? ((item.value / insights.categoryTotal) * 100).toFixed(1)
                        : "0"
                      return (
                        <div key={item.name} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                          <div className="flex items-center gap-3">
                            <div className="size-3 rounded-full" style={{ backgroundColor: item.fill }} />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-gray-50">
                              {formatCurrency(item.value, currency)}
                            </p>
                            <p className="text-xs text-gray-500">{percentage}%</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Top Subscriptions */}
            {insights.topSubscriptions.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-50">
                  Top Subscriptions by Cost
                </h2>
                <p className="mb-6 text-sm text-gray-500">Your most expensive subscriptions (monthly equivalent)</p>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={insights.topSubscriptions}
                      layout="vertical"
                      margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => formatCurrency(value, currency)}
                      />
                      <YAxis
                        type="category"
                        dataKey="name"
                        tick={{ fontSize: 12, fill: "#374151" }}
                        axisLine={false}
                        tickLine={false}
                        width={100}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          formatCurrency(value, currency),
                          "Monthly Cost"
                        ]}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="monthlyAmount" fill={COLORS.purple} radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 dark:border-gray-800 sm:grid-cols-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Top 5 Total</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-50">
                      {formatCurrency(
                        insights.topSubscriptions.reduce((sum, s) => sum + s.monthlyAmount, 0),
                        currency
                      )}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Avg Cost</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-50">
                      {formatCurrency(insights.avgSubscriptionCost, currency)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Most Expensive</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-50">
                      {insights.topSubscriptions[0]?.name || "N/A"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Top Category</p>
                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-50">
                      {insights.topSubscriptions[0]?.category || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Month Over Month Comparison */}
            {insights.monthOverMonth.length > 2 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-50">
                  Month-over-Month Growth
                </h2>
                <p className="mb-6 text-sm text-gray-500">Compare your spending changes over time</p>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={insights.monthOverMonth.slice(-6)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 11, fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                        width={40}
                      />
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          formatCurrency(value, currency),
                          name === "amount" ? "Current" : "Previous"
                        ]}
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="previous" fill="#e5e7eb" radius={[4, 4, 0, 0]} name="Previous" />
                      <Line type="monotone" dataKey="amount" stroke={COLORS.blue} strokeWidth={3} dot={{ fill: COLORS.blue, strokeWidth: 2 }} name="Current" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Insights & Actions */}
          <div className="space-y-6">
            {/* Status Distribution with Pie */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">
                Subscription Status
              </h3>
              {insights.statusChartData.length > 0 ? (
                <div className="space-y-4">
                  <div className="mx-auto h-32 w-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={insights.statusChartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={50}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {insights.statusChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {insights.statusChartData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <div className="size-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-gray-50">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center text-gray-400">
                  <p className="text-sm">No subscriptions yet</p>
                </div>
              )}
            </div>

            {/* Billing Cycle Cost Distribution */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">
                Cost by Billing Cycle
              </h3>
              {insights.billingCycleCostData.length > 0 ? (
                <div className="space-y-4">
                  <div className="mx-auto h-32 w-32">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={insights.billingCycleCostData}
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={50}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {insights.billingCycleCostData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-2">
                    {insights.billingCycleCostData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between rounded-lg bg-gray-50 p-2.5 dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <div className="size-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-gray-50">
                          {formatCurrency(item.value, currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center text-gray-400">
                  <p className="text-sm">No subscriptions yet</p>
                </div>
              )}
            </div>

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
