"use client"

import { Button } from "@/components/Button"
import { cx } from "@/lib/utils"
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarLine,
} from "@remixicon/react"
import { useState } from "react"

// Mock data - will be replaced with API call
const subscriptions = [
  { id: "1", name: "Netflix", amount: 14.99, day: 5, color: "#E50914" },
  { id: "2", name: "Spotify", amount: 9.99, day: 8, color: "#1DB954" },
  { id: "3", name: "GitHub Pro", amount: 4.0, day: 12, color: "#333333" },
  { id: "4", name: "Adobe CC", amount: 54.99, day: 15, color: "#FF0000" },
  { id: "5", name: "AWS", amount: 120.0, day: 20, color: "#FF9900" },
  { id: "6", name: "Microsoft 365", amount: 8.33, day: 25, color: "#0078D4" },
  { id: "7", name: "Figma", amount: 12.0, day: 28, color: "#F24E1E" },
]

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function CalendarPage() {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  )
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfMonth = getFirstDayOfMonth(year, month)

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

  const getSubscriptionsForDay = (day: number) => {
    return subscriptions.filter((sub) => sub.day === day)
  }

  const monthlyTotal = subscriptions.reduce((sum, sub) => sum + sub.amount, 0)

  // Generate calendar days
  const calendarDays = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const selectedDaySubscriptions = selectedDay
    ? getSubscriptionsForDay(selectedDay)
    : []

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Calendar
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            View your upcoming payments
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "calendar" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("calendar")}
          >
            Calendar
          </Button>
          <Button
            variant={viewMode === "list" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            List
          </Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            {/* Calendar Header */}
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                {MONTHS[month]} {year}
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={goToToday}>
                  Today
                </Button>
                <div className="flex items-center">
                  <Button variant="ghost" className="!p-1" onClick={prevMonth}>
                    <RiArrowLeftSLine className="size-5" />
                  </Button>
                  <Button variant="ghost" className="!p-1" onClick={nextMonth}>
                    <RiArrowRightSLine className="size-5" />
                  </Button>
                </div>
              </div>
            </div>

            {viewMode === "calendar" ? (
              <>
                {/* Days of Week Header */}
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7">
                  {calendarDays.map((day, index) => {
                    const daySubs = day ? getSubscriptionsForDay(day) : []
                    const isToday =
                      day === today.getDate() &&
                      month === today.getMonth() &&
                      year === today.getFullYear()
                    const isSelected = day === selectedDay

                    return (
                      <button
                        key={index}
                        onClick={() => day && setSelectedDay(day)}
                        disabled={!day}
                        className={cx(
                          "relative min-h-[80px] border-b border-r border-gray-200 p-2 text-left transition hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50",
                          !day && "bg-gray-50 dark:bg-gray-900",
                          isSelected && "bg-blue-50 dark:bg-blue-900/20",
                        )}
                      >
                        {day && (
                          <>
                            <span
                              className={cx(
                                "inline-flex size-6 items-center justify-center rounded-full text-sm",
                                isToday &&
                                  "bg-blue-600 font-bold text-white",
                                !isToday &&
                                  "text-gray-900 dark:text-gray-50",
                              )}
                            >
                              {day}
                            </span>
                            {daySubs.length > 0 && (
                              <div className="mt-1 space-y-1">
                                {daySubs.slice(0, 2).map((sub) => (
                                  <div
                                    key={sub.id}
                                    className="truncate rounded px-1 py-0.5 text-xs"
                                    style={{
                                      backgroundColor: `${sub.color}20`,
                                      color: sub.color,
                                    }}
                                  >
                                    {sub.name}
                                  </div>
                                ))}
                                {daySubs.length > 2 && (
                                  <div className="text-xs text-gray-500">
                                    +{daySubs.length - 2} more
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </button>
                    )
                  })}
                </div>
              </>
            ) : (
              /* List View */
              <div className="divide-y divide-gray-200 dark:divide-gray-800">
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                  (day) => {
                    const daySubs = getSubscriptionsForDay(day)
                    if (daySubs.length === 0) return null

                    const date = new Date(year, month, day)
                    const isToday =
                      day === today.getDate() &&
                      month === today.getMonth() &&
                      year === today.getFullYear()

                    return (
                      <div key={day} className="flex items-start gap-4 p-4">
                        <div
                          className={cx(
                            "flex size-12 flex-col items-center justify-center rounded-lg",
                            isToday
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50",
                          )}
                        >
                          <span className="text-xs font-medium">
                            {DAYS[date.getDay()]}
                          </span>
                          <span className="text-lg font-bold">{day}</span>
                        </div>
                        <div className="flex-1 space-y-2">
                          {daySubs.map((sub) => (
                            <div
                              key={sub.id}
                              className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className="size-8 rounded-lg"
                                  style={{
                                    backgroundColor: `${sub.color}20`,
                                  }}
                                >
                                  <div
                                    className="flex size-full items-center justify-center text-sm font-bold"
                                    style={{ color: sub.color }}
                                  >
                                    {sub.name.charAt(0)}
                                  </div>
                                </div>
                                <span className="font-medium text-gray-900 dark:text-gray-50">
                                  {sub.name}
                                </span>
                              </div>
                              <span className="font-medium text-gray-900 dark:text-gray-50">
                                ${sub.amount.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  },
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Monthly Summary */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
              <RiCalendarLine className="size-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                {MONTHS[month]} Summary
              </h3>
            </div>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total payments
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-50">
                  {subscriptions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total amount
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-50">
                  ${monthlyTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Selected Day Details */}
          {selectedDay && (
            <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                {MONTHS[month]} {selectedDay}
              </h3>
              {selectedDaySubscriptions.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {selectedDaySubscriptions.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="size-2 rounded-full"
                          style={{ backgroundColor: sub.color }}
                        />
                        <span className="text-sm text-gray-900 dark:text-gray-50">
                          {sub.name}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                        ${sub.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-3 dark:border-gray-800">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Day total
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-gray-50">
                        $
                        {selectedDaySubscriptions
                          .reduce((sum, s) => sum + s.amount, 0)
                          .toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  No payments scheduled
                </p>
              )}
            </div>
          )}

          {/* Upcoming This Month */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h3 className="font-semibold text-gray-900 dark:text-gray-50">
              All Payments
            </h3>
            <div className="mt-4 space-y-3">
              {subscriptions
                .sort((a, b) => a.day - b.day)
                .map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 text-xs text-gray-500">{sub.day}</span>
                      <span className="text-sm text-gray-900 dark:text-gray-50">
                        {sub.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ${sub.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
