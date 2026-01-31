"use client"

import { Button } from "@/components/Button"
import { formatCurrency } from "@/lib/currency"
import { cx } from "@/lib/utils"
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarLine,
  RiLoader4Line,
  RiListCheck2,
  RiCalendar2Line,
  RiGridLine,
  RiTimeLine,
  RiFireLine,
  RiAlertLine,
  RiCheckboxCircleLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiCalendarCheckLine,
  RiWalletLine,
  RiMore2Fill,
} from "@remixicon/react"
import Link from "next/link"
import { useState, useEffect, useMemo } from "react"

interface Subscription {
  _id: string
  name: string
  amount: number
  currency: string
  displayAmount?: number
  nextBillingDate: string
  billingCycle: string
  status: string
  category?: string
}

interface CalendarSubscription {
  id: string
  name: string
  amount: number
  day: number
  date: Date
  color: string
  status: string
  billingCycle: string
  category: string
}

type ViewMode = "month" | "week" | "year" | "agenda"

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const DAYS_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

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

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

function getWeekNumber(date: Date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

function formatRelativeDate(date: Date): string {
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return "Overdue"
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays < 7) return `In ${diffDays} days`
  if (diffDays < 14) return "Next week"
  if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`
  return `In ${Math.ceil(diffDays / 30)} months`
}

export default function CalendarPage() {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  )
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())
  const [viewMode, setViewMode] = useState<ViewMode>("month")
  const [subscriptions, setSubscriptions] = useState<CalendarSubscription[]>([])
  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([])
  const [displayCurrency, setDisplayCurrency] = useState("USD")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  useEffect(() => {
    processSubscriptions()
  }, [allSubscriptions, year, month])

  async function fetchSubscriptions() {
    try {
      setLoading(true)
      const response = await fetch("/api/subscriptions")
      if (!response.ok) throw new Error("Failed to fetch subscriptions")
      
      const data = await response.json()
      const subs: Subscription[] = data.subscriptions ?? data
      setDisplayCurrency(data.displayCurrency ?? "USD")
      setAllSubscriptions(subs)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  function processSubscriptions() {
    const calendarSubs: CalendarSubscription[] = allSubscriptions
      .filter((sub) => sub.status === "active" || sub.status === "trial")
      .map((sub) => {
        const billingDate = new Date(sub.nextBillingDate)
        let day = billingDate.getDate()
        let targetDate = new Date(year, month, day)

        if (billingDate.getMonth() === month && billingDate.getFullYear() === year) {
          day = billingDate.getDate()
          targetDate = billingDate
        } else if (sub.billingCycle === "monthly") {
          day = Math.min(billingDate.getDate(), daysInMonth)
          targetDate = new Date(year, month, day)
        } else if (sub.billingCycle === "weekly") {
          const dayOfWeek = billingDate.getDay()
          const firstOfMonth = new Date(year, month, 1)
          const firstDayOfWeek = firstOfMonth.getDay()
          day = 1 + ((7 + dayOfWeek - firstDayOfWeek) % 7)
          targetDate = new Date(year, month, day)
        } else if (sub.billingCycle === "yearly" || sub.billingCycle === "quarterly") {
          if (sub.billingCycle === "yearly" && billingDate.getMonth() !== month) return null
          if (sub.billingCycle === "quarterly") {
            const monthDiff = (month - billingDate.getMonth() + 12) % 12
            if (monthDiff % 3 !== 0) return null
          }
          day = Math.min(billingDate.getDate(), daysInMonth)
          targetDate = new Date(year, month, day)
        }

        return {
          id: sub._id,
          name: sub.name,
          amount: sub.displayAmount ?? sub.amount,
          day,
          date: targetDate,
          color: categoryColors[sub.category || ""] || categoryColors.default,
          status: sub.status,
          billingCycle: sub.billingCycle,
          category: sub.category || "Other",
        }
      })
      .filter((sub): sub is CalendarSubscription => sub !== null)

    setSubscriptions(calendarSubs)
  }

  // Navigation functions
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
    setSelectedDay(null)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
    setSelectedDay(null)
  }

  const goToToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1))
    setSelectedDay(today.getDate())
  }

  const goToMonth = (targetMonth: number) => {
    setCurrentDate(new Date(year, targetMonth, 1))
    setSelectedDay(null)
  }

  // Computed values
  const getSubscriptionsForDay = (day: number) => subscriptions.filter((sub) => sub.day === day)
  
  const monthlyTotal = useMemo(() => 
    subscriptions.reduce((sum, sub) => sum + sub.amount, 0),
  [subscriptions])

  const upcomingPayments = useMemo(() => {
    const now = new Date()
    return allSubscriptions
      .filter((sub) => sub.status === "active" || sub.status === "trial")
      .map((sub) => ({
        ...sub,
        nextBillingDate: new Date(sub.nextBillingDate),
      }))
      .filter((sub) => sub.nextBillingDate >= now)
      .sort((a, b) => a.nextBillingDate.getTime() - b.nextBillingDate.getTime())
      .slice(0, 10)
  }, [allSubscriptions])

  const calendarStats = useMemo(() => {
    const dayTotals = Array.from({ length: daysInMonth }, (_, i) => {
      const daySubs = getSubscriptionsForDay(i + 1)
      return daySubs.reduce((sum, s) => sum + s.amount, 0)
    })
    
    const maxDaySpend = Math.max(...dayTotals)
    const busiestDay = dayTotals.indexOf(maxDaySpend) + 1
    const paymentDays = dayTotals.filter((t) => t > 0).length
    const avgPerPaymentDay = paymentDays > 0 ? monthlyTotal / paymentDays : 0
    
    const nextPayment = upcomingPayments[0]
    const daysUntilNext = nextPayment
      ? Math.ceil((nextPayment.nextBillingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      : null

    // Category breakdown
    const categoryTotals: Record<string, number> = {}
    subscriptions.forEach((sub) => {
      categoryTotals[sub.category] = (categoryTotals[sub.category] || 0) + sub.amount
    })

    return {
      dayTotals,
      maxDaySpend,
      busiestDay,
      paymentDays,
      avgPerPaymentDay,
      daysUntilNext,
      nextPayment,
      categoryTotals,
    }
  }, [subscriptions, daysInMonth, monthlyTotal, upcomingPayments])

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = []
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null)
    for (let day = 1; day <= daysInMonth; day++) days.push(day)
    return days
  }, [firstDayOfMonth, daysInMonth])

  const selectedDaySubscriptions = selectedDay ? getSubscriptionsForDay(selectedDay) : []

  // Get heat intensity for day
  const getHeatIntensity = (amount: number): string => {
    if (amount === 0) return "bg-transparent"
    const intensity = Math.min(amount / (calendarStats.maxDaySpend || 1), 1)
    if (intensity < 0.25) return "bg-blue-100 dark:bg-blue-900/30"
    if (intensity < 0.5) return "bg-blue-200 dark:bg-blue-900/50"
    if (intensity < 0.75) return "bg-blue-300 dark:bg-blue-800/60"
    return "bg-blue-400 dark:bg-blue-700/70"
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-16 rounded-full border-4 border-blue-100 dark:border-blue-900" />
            <div className="absolute inset-0 size-16 animate-spin rounded-full border-4 border-transparent border-t-blue-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">Loading your calendar...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center p-4">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
          <RiAlertLine className="mx-auto mb-4 size-12 text-red-400" />
          <p className="text-lg font-medium text-red-600 dark:text-red-400">{error}</p>
          <Button variant="secondary" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Header Section */}
      <div className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-700 dark:border-gray-800">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-white">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm sm:size-12">
                  <RiCalendarLine className="size-5 sm:size-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold sm:text-2xl lg:text-3xl">Payment Calendar</h1>
                  <p className="mt-0.5 text-sm text-cyan-100 sm:mt-1">Track and visualize your subscription payments</p>
                </div>
              </div>
            </div>
            
            {/* View Mode Switcher */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg bg-white/10 p-0.5 backdrop-blur-sm sm:p-1">
                {[
                  { mode: "month" as ViewMode, icon: RiCalendar2Line, label: "Month" },
                  { mode: "week" as ViewMode, icon: RiGridLine, label: "Week" },
                  { mode: "year" as ViewMode, icon: RiCalendarLine, label: "Year" },
                  { mode: "agenda" as ViewMode, icon: RiListCheck2, label: "Agenda" },
                ].map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cx(
                      "flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-all sm:gap-1.5 sm:px-3 sm:py-1.5 sm:text-sm",
                      viewMode === mode
                        ? "bg-white text-teal-700 shadow-sm"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <Icon className="size-3.5 sm:size-4" />
                    <span className="hidden xs:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats Pills */}
          <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs text-white backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
              <RiWalletLine className="size-3.5 sm:size-4" />
              <span className="font-medium">{formatCurrency(monthlyTotal, displayCurrency)}<span className="hidden sm:inline"> this month</span></span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 text-xs text-white backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm">
              <RiCalendarCheckLine className="size-3.5 sm:size-4" />
              <span className="font-medium">{subscriptions.length} payments</span>
            </div>
            {calendarStats.nextPayment && (
              <div className={cx(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-white backdrop-blur-sm sm:gap-2 sm:px-4 sm:py-2 sm:text-sm",
                calendarStats.daysUntilNext !== null && calendarStats.daysUntilNext <= 3 
                  ? "bg-amber-500/40" 
                  : "bg-white/20"
              )}>
                <RiTimeLine className="size-3.5 sm:size-4" />
                <span className="font-medium">
                  Next: {calendarStats.daysUntilNext === 0 ? "Today" : `${calendarStats.daysUntilNext}d`}<span className="hidden sm:inline"> ({calendarStats.nextPayment.name})</span>
                </span>
              </div>
            )}
            {calendarStats.paymentDays > 0 && (
              <div className="hidden items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm sm:flex">
                <RiFireLine className="size-4" />
                <span className="font-medium">{calendarStats.paymentDays} payment days</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-3 sm:p-6 lg:p-8">
        {/* Quick Stats Row */}
        <div className="mb-4 grid grid-cols-2 gap-2 sm:mb-6 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:p-4">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 sm:gap-2">
              <RiWalletLine className="size-3.5 sm:size-4" />
              <span className="text-[10px] font-medium uppercase tracking-wide sm:text-xs">This Month</span>
            </div>
            <p className="mt-1.5 text-lg font-bold text-gray-900 dark:text-gray-50 sm:mt-2 sm:text-2xl">
              {formatCurrency(monthlyTotal, displayCurrency)}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">{subscriptions.length} payments</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:p-4">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 sm:gap-2">
              <RiTimeLine className="size-3.5 sm:size-4" />
              <span className="text-[10px] font-medium uppercase tracking-wide sm:text-xs">Next Payment</span>
            </div>
            <p className="mt-1.5 text-lg font-bold text-gray-900 dark:text-gray-50 sm:mt-2 sm:text-2xl">
              {calendarStats.daysUntilNext !== null ? (
                calendarStats.daysUntilNext === 0 ? "Today" : `${calendarStats.daysUntilNext}d`
              ) : "—"}
            </p>
            <p className="mt-0.5 truncate text-[10px] text-gray-500 sm:mt-1 sm:text-xs">
              {calendarStats.nextPayment?.name || "No upcoming"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:p-4">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 sm:gap-2">
              <RiFireLine className="size-3.5 sm:size-4" />
              <span className="text-[10px] font-medium uppercase tracking-wide sm:text-xs">Busiest Day</span>
            </div>
            <p className="mt-1.5 text-lg font-bold text-gray-900 dark:text-gray-50 sm:mt-2 sm:text-2xl">
              {calendarStats.busiestDay > 0 ? MONTHS_SHORT[month] + " " + calendarStats.busiestDay : "—"}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">
              {calendarStats.maxDaySpend > 0 ? formatCurrency(calendarStats.maxDaySpend, displayCurrency) : "No payments"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900 sm:p-4">
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 sm:gap-2">
              <RiCalendarCheckLine className="size-3.5 sm:size-4" />
              <span className="text-[10px] font-medium uppercase tracking-wide sm:text-xs">Payment Days</span>
            </div>
            <p className="mt-1.5 text-lg font-bold text-gray-900 dark:text-gray-50 sm:mt-2 sm:text-2xl">
              {calendarStats.paymentDays}
            </p>
            <p className="mt-0.5 text-[10px] text-gray-500 sm:mt-1 sm:text-xs">
              Avg {formatCurrency(calendarStats.avgPerPaymentDay, displayCurrency)}/day
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 xl:grid-cols-4">
          {/* Main Calendar Area */}
          <div className="xl:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              {/* Calendar Navigation */}
              <div className="flex items-center justify-between border-b border-gray-200 p-3 dark:border-gray-800 sm:p-4 lg:p-6">
                <div className="flex items-center gap-2 sm:gap-4">
                  <h2 className="text-base font-bold text-gray-900 dark:text-gray-50 sm:text-xl lg:text-2xl">
                    {viewMode === "year" ? year : `${MONTHS[month]} ${year}`}
                  </h2>
                  {viewMode !== "year" && (
                    <span className="hidden rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 sm:inline-block sm:px-3 sm:py-1 sm:text-sm">
                      Week {getWeekNumber(new Date(year, month, selectedDay || 1))}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Button variant="secondary" size="sm" onClick={goToToday} className="text-xs sm:text-sm">
                    Today
                  </Button>
                  <div className="flex items-center overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={viewMode === "year" ? () => setCurrentDate(new Date(year - 1, 0, 1)) : prevMonth}
                      className="p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 sm:p-2"
                    >
                      <RiArrowLeftSLine className="size-4 sm:size-5" />
                    </button>
                    <button
                      onClick={viewMode === "year" ? () => setCurrentDate(new Date(year + 1, 0, 1)) : nextMonth}
                      className="p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50 sm:p-2"
                    >
                      <RiArrowRightSLine className="size-4 sm:size-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Month View */}
              {viewMode === "month" && (
                <>
                  {/* Days Header */}
                  <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-800/50">
                    {DAYS.map((day, i) => (
                      <div
                        key={day}
                        className={cx(
                          "py-3 text-center text-xs font-semibold uppercase tracking-wide",
                          i === 0 || i === 6 ? "text-gray-400" : "text-gray-600 dark:text-gray-400"
                        )}
                      >
                        <span className="hidden sm:inline">{DAYS_FULL[i]}</span>
                        <span className="sm:hidden">{day}</span>
                      </div>
                    ))}
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7">
                    {calendarDays.map((day, index) => {
                      const daySubs = day ? getSubscriptionsForDay(day) : []
                      const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                      const isSelected = day === selectedDay
                      const isHovered = day === hoveredDay
                      const dayTotal = daySubs.reduce((sum, s) => sum + s.amount, 0)
                      const isPast = day !== null && new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate())

                      return (
                        <button
                          key={index}
                          onClick={() => day && setSelectedDay(day)}
                          onMouseEnter={() => day && setHoveredDay(day)}
                          onMouseLeave={() => setHoveredDay(null)}
                          disabled={!day}
                          className={cx(
                            "group relative min-h-[70px] border-b border-r border-gray-100 p-1 text-left transition-all dark:border-gray-800 sm:min-h-[90px] sm:p-1.5 lg:min-h-[110px] lg:p-2",
                            !day && "bg-gray-50/50 dark:bg-gray-900/30",
                            day && !isSelected && "hover:bg-gray-50 dark:hover:bg-gray-800/50",
                            isSelected && "bg-blue-50 ring-2 ring-inset ring-blue-500 dark:bg-blue-900/20",
                            isPast && !isToday && "opacity-60"
                          )}
                        >
                          {day && (
                            <>
                              {/* Heat map background */}
                              <div className={cx(
                                "absolute inset-0 transition-opacity",
                                getHeatIntensity(dayTotal),
                                isSelected ? "opacity-0" : "opacity-50"
                              )} />
                              
                              <div className="relative">
                                {/* Day number */}
                                <div className="flex items-start justify-between">
                                  <span
                                    className={cx(
                                      "inline-flex size-7 items-center justify-center rounded-full text-sm font-medium transition-all sm:size-8",
                                      isToday && "bg-blue-600 text-white shadow-md",
                                      !isToday && isSelected && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
                                      !isToday && !isSelected && "text-gray-900 group-hover:bg-gray-200 dark:text-gray-50 dark:group-hover:bg-gray-700"
                                    )}
                                  >
                                    {day}
                                  </span>
                                  {dayTotal > 0 && (
                                    <span className="hidden text-xs font-semibold text-gray-500 dark:text-gray-400 sm:block">
                                      {formatCurrency(dayTotal, displayCurrency)}
                                    </span>
                                  )}
                                </div>

                                {/* Subscription pills */}
                                {daySubs.length > 0 && (
                                  <div className="mt-1 space-y-0.5 sm:mt-1.5 sm:space-y-1">
                                    {daySubs.slice(0, 2).map((sub) => (
                                      <div
                                        key={sub.id}
                                        className="flex items-center gap-1 truncate rounded px-1 py-0.5 text-xs font-medium sm:rounded-md sm:px-1.5"
                                        style={{
                                          backgroundColor: `${sub.color}20`,
                                          color: sub.color,
                                        }}
                                      >
                                        <span className="hidden size-1.5 rounded-full sm:block" style={{ backgroundColor: sub.color }} />
                                        <span className="truncate">{sub.name}</span>
                                      </div>
                                    ))}
                                    {daySubs.length > 2 && (
                                      <div className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                        <RiMore2Fill className="size-3" />
                                        <span>{daySubs.length - 2} more</span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </>
              )}

              {/* Week View */}
              {viewMode === "week" && (
                <div className="p-3 sm:p-4 lg:p-6">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-7 lg:gap-4">
                    {DAYS.map((dayName, dayIndex) => {
                      // Find the first day of the current week
                      const currentWeekStart = new Date(year, month, selectedDay || today.getDate())
                      currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay())
                      
                      const weekDay = new Date(currentWeekStart)
                      weekDay.setDate(currentWeekStart.getDate() + dayIndex)
                      
                      const isCurrentMonth = weekDay.getMonth() === month
                      const isToday = weekDay.toDateString() === today.toDateString()
                      const dayOfMonth = weekDay.getDate()
                      const daySubs = isCurrentMonth ? getSubscriptionsForDay(dayOfMonth) : []
                      const dayTotal = daySubs.reduce((sum, s) => sum + s.amount, 0)

                      return (
                        <div
                          key={dayName}
                          className={cx(
                            "min-h-[140px] rounded-xl border p-2.5 transition-all sm:min-h-[180px] sm:p-3 lg:min-h-[280px] lg:p-4",
                            isToday
                              ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                              : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50",
                            !isCurrentMonth && "opacity-50"
                          )}
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
                                {dayName}
                              </p>
                              <p className={cx(
                                "text-2xl font-bold",
                                isToday ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-50"
                              )}>
                                {dayOfMonth}
                              </p>
                            </div>
                            {dayTotal > 0 && (
                              <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                {formatCurrency(dayTotal, displayCurrency)}
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            {daySubs.map((sub) => (
                              <div
                                key={sub.id}
                                className="rounded-lg border-l-4 bg-white p-2 shadow-sm dark:bg-gray-800 sm:p-3"
                                style={{ borderLeftColor: sub.color }}
                              >
                                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                                  {sub.name}
                                </p>
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                                  {formatCurrency(sub.amount, displayCurrency)}
                                </p>
                              </div>
                            ))}
                            {daySubs.length === 0 && (
                              <p className="py-4 text-center text-xs text-gray-400">No payments</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Year View */}
              {viewMode === "year" && (
                <div className="p-3 sm:p-4 lg:p-6">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                    {MONTHS.map((monthName, monthIndex) => {
                      const monthDays = getDaysInMonth(year, monthIndex)
                      const monthFirstDay = getFirstDayOfMonth(year, monthIndex)
                      const isCurrentMonth = monthIndex === today.getMonth() && year === today.getFullYear()
                      
                      // Calculate month's subscriptions
                      const monthSubs = allSubscriptions
                        .filter((sub) => sub.status === "active" || sub.status === "trial")
                        .filter((sub) => {
                          const billingDate = new Date(sub.nextBillingDate)
                          if (sub.billingCycle === "monthly") return true
                          if (sub.billingCycle === "yearly") return billingDate.getMonth() === monthIndex
                          if (sub.billingCycle === "quarterly") {
                            const monthDiff = (monthIndex - billingDate.getMonth() + 12) % 12
                            return monthDiff % 3 === 0
                          }
                          return billingDate.getMonth() === monthIndex
                        })
                      
                      const monthTotal = monthSubs.reduce((sum, sub) => sum + (sub.displayAmount ?? sub.amount), 0)

                      return (
                        <button
                          key={monthName}
                          onClick={() => goToMonth(monthIndex)}
                          className={cx(
                            "rounded-xl border p-3 text-left transition-all hover:shadow-md sm:p-4",
                            isCurrentMonth
                              ? "border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20"
                              : "border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600",
                            monthIndex === month && "ring-2 ring-blue-500"
                          )}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <span className={cx(
                              "text-sm font-bold",
                              isCurrentMonth ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-50"
                            )}>
                              {MONTHS_SHORT[monthIndex]}
                            </span>
                            <span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                              {monthSubs.length}
                            </span>
                          </div>
                          
                          {/* Mini calendar grid */}
                          <div className="mb-2 grid grid-cols-7 gap-px text-center">
                            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                              <div key={i} className="text-[8px] text-gray-400">{d}</div>
                            ))}
                            {Array.from({ length: monthFirstDay }).map((_, i) => (
                              <div key={`empty-${i}`} />
                            ))}
                            {Array.from({ length: monthDays }).map((_, i) => {
                              const day = i + 1
                              const isToday = day === today.getDate() && monthIndex === today.getMonth() && year === today.getFullYear()
                              return (
                                <div
                                  key={day}
                                  className={cx(
                                    "text-[9px]",
                                    isToday && "rounded-full bg-blue-600 font-bold text-white",
                                    !isToday && "text-gray-500 dark:text-gray-400"
                                  )}
                                >
                                  {day}
                                </div>
                              )
                            })}
                          </div>
                          
                          <div className="border-t border-gray-200 pt-2 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-50">
                              {formatCurrency(monthTotal, displayCurrency)}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Agenda View */}
              {viewMode === "agenda" && (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {subscriptions.length === 0 ? (
                    <div className="p-12 text-center">
                      <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
                        <RiCalendarLine className="size-8 text-gray-400" />
                      </div>
                      <p className="text-lg font-medium text-gray-900 dark:text-gray-50">No payments this month</p>
                      <p className="mt-1 text-gray-500 dark:text-gray-400">Your calendar is clear!</p>
                    </div>
                  ) : (
                    <>
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                        const daySubs = getSubscriptionsForDay(day)
                        if (daySubs.length === 0) return null

                        const date = new Date(year, month, day)
                        const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                        const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate())
                        const dayTotal = daySubs.reduce((sum, s) => sum + s.amount, 0)

                        return (
                          <div
                            key={day}
                            className={cx(
                              "flex gap-4 p-4 sm:gap-6 sm:p-6",
                              isPast && !isToday && "opacity-60"
                            )}
                          >
                            <div
                              className={cx(
                                "flex size-16 flex-shrink-0 flex-col items-center justify-center rounded-2xl sm:size-20",
                                isToday
                                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
                                  : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                              )}
                            >
                              <span className="text-xs font-semibold uppercase opacity-80">
                                {DAYS[date.getDay()]}
                              </span>
                              <span className="text-2xl font-bold sm:text-3xl">{day}</span>
                            </div>
                            
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  {isToday ? "Today" : formatRelativeDate(date)}
                                </p>
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                  {formatCurrency(dayTotal, displayCurrency)}
                                </span>
                              </div>
                              
                              {daySubs.map((sub) => (
                                <Link
                                  key={sub.id}
                                  href={`/subscriptions/${sub.id}`}
                                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                                >
                                  <div className="flex items-center gap-4">
                                    <div
                                      className="flex size-12 items-center justify-center rounded-xl text-lg font-bold"
                                      style={{ backgroundColor: `${sub.color}20`, color: sub.color }}
                                    >
                                      {sub.name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-900 dark:text-gray-50">
                                        {sub.name}
                                      </p>
                                      <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {sub.category} · {sub.billingCycle}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900 dark:text-gray-50">
                                      {formatCurrency(sub.amount, displayCurrency)}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {sub.status === "trial" && "Trial"}
                                    </p>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-1 xl:space-y-0">
            {/* Mini Calendar Navigator */}
            {viewMode !== "year" && (
              <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                    {MONTHS_SHORT[month]} {year}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={prevMonth} className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <RiArrowLeftSLine className="size-4 text-gray-500" />
                    </button>
                    <button onClick={nextMonth} className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <RiArrowRightSLine className="size-4 text-gray-500" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {DAYS.map((d) => (
                    <div key={d} className="text-[10px] font-medium text-gray-400">{d.charAt(0)}</div>
                  ))}
                  {calendarDays.map((day, i) => {
                    const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                    const isSelected = day === selectedDay
                    const hasSubs = day ? getSubscriptionsForDay(day).length > 0 : false
                    
                    return (
                      <button
                        key={i}
                        onClick={() => day && setSelectedDay(day)}
                        disabled={!day}
                        className={cx(
                          "relative aspect-square rounded text-xs font-medium transition-all",
                          !day && "invisible",
                          day && !isSelected && !isToday && "hover:bg-gray-100 dark:hover:bg-gray-800",
                          isToday && "bg-blue-600 text-white",
                          isSelected && !isToday && "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
                          !isToday && !isSelected && "text-gray-700 dark:text-gray-300"
                        )}
                      >
                        {day}
                        {hasSubs && !isToday && (
                          <span className="absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-blue-500" />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Selected Day Details */}
            {selectedDay && viewMode === "month" && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-4 flex items-center gap-3">
                  <div className={cx(
                    "flex size-12 items-center justify-center rounded-xl",
                    selectedDay === today.getDate() && month === today.getMonth() && year === today.getFullYear()
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                  )}>
                    <span className="text-xl font-bold">{selectedDay}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-50">
                      {DAYS_FULL[new Date(year, month, selectedDay).getDay()]}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {MONTHS[month]} {year}
                    </p>
                  </div>
                </div>

                {selectedDaySubscriptions.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDaySubscriptions.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/subscriptions/${sub.id}`}
                        className="flex items-center justify-between rounded-xl bg-gray-50 p-3 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="flex size-8 items-center justify-center rounded-lg text-sm font-bold"
                            style={{ backgroundColor: `${sub.color}20`, color: sub.color }}
                          >
                            {sub.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-50">{sub.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{sub.billingCycle}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-gray-50">
                          {formatCurrency(sub.amount, displayCurrency)}
                        </span>
                      </Link>
                    ))}
                    
                    <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Day Total</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-50">
                          {formatCurrency(
                            selectedDaySubscriptions.reduce((sum, s) => sum + s.amount, 0),
                            displayCurrency
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-6 text-center">
                    <RiCheckboxCircleLine className="mb-2 size-10 text-emerald-400" />
                    <p className="font-medium text-gray-900 dark:text-gray-50">No payments</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">This day is clear!</p>
                  </div>
                )}
              </div>
            )}

            {/* Upcoming Payments */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">Upcoming</h3>
                <Link href="/subscriptions" className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  View all
                </Link>
              </div>

              {upcomingPayments.length > 0 ? (
                <div className="space-y-2">
                  {upcomingPayments.slice(0, 5).map((sub) => {
                    const daysUntil = Math.ceil(
                      (sub.nextBillingDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
                    )
                    const isUrgent = daysUntil <= 3
                    
                    return (
                      <div
                        key={sub._id}
                        className={cx(
                          "flex items-center justify-between rounded-xl p-3",
                          isUrgent ? "bg-red-50 dark:bg-red-900/20" : "bg-gray-50 dark:bg-gray-800"
                        )}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                            {sub.name}
                          </p>
                          <p className={cx(
                            "text-xs",
                            isUrgent ? "text-red-600 dark:text-red-400" : "text-gray-500 dark:text-gray-400"
                          )}>
                            {formatRelativeDate(sub.nextBillingDate)}
                          </p>
                        </div>
                        <span className="ml-3 text-sm font-semibold text-gray-900 dark:text-gray-50">
                          {formatCurrency(sub.displayAmount ?? sub.amount, displayCurrency)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No upcoming payments
                </p>
              )}
            </div>

            {/* Category Breakdown */}
            {Object.keys(calendarStats.categoryTotals).length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">
                  By Category
                </h3>
                <div className="space-y-3">
                  {Object.entries(calendarStats.categoryTotals)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([category, amount]) => {
                      const percentage = monthlyTotal > 0 ? (amount / monthlyTotal) * 100 : 0
                      const color = categoryColors[category] || categoryColors.default
                      
                      return (
                        <div key={category}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="size-2 rounded-full" style={{ backgroundColor: color }} />
                              <span className="text-gray-700 dark:text-gray-300">{category}</span>
                            </div>
                            <span className="font-medium text-gray-900 dark:text-gray-50">
                              {formatCurrency(amount, displayCurrency)}
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${percentage}%`, backgroundColor: color }}
                            />
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
