"use client"

import { useState } from "react"
import { RiCalculatorLine, RiArrowLeftRightLine } from "@remixicon/react"

const BILLING_CYCLES = [
  { label: "Weekly", value: "weekly", multiplier: 52 },
  { label: "Monthly", value: "monthly", multiplier: 12 },
  { label: "Quarterly", value: "quarterly", multiplier: 4 },
  { label: "Yearly", value: "yearly", multiplier: 1 },
] as const

export function CostCalculator() {
  const [amount, setAmount] = useState<string>("")
  const [fromCycle, setFromCycle] = useState<string>("monthly")
  const [numberOfSubscriptions, setNumberOfSubscriptions] = useState<string>("1")

  const numericAmount = parseFloat(amount) || 0
  const numSubs = parseInt(numberOfSubscriptions) || 1

  const fromMultiplier =
    BILLING_CYCLES.find((c) => c.value === fromCycle)?.multiplier ?? 12

  const yearlyTotal = numericAmount * fromMultiplier * numSubs

  const conversions = BILLING_CYCLES.map((cycle) => ({
    label: cycle.label,
    value: cycle.value,
    amount: yearlyTotal / cycle.multiplier,
  }))

  const fiveYearCost = yearlyTotal * 5
  const tenYearCost = yearlyTotal * 10

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <RiCalculatorLine className="size-5" />
          <h3 className="font-semibold">Enter Your Subscription Details</h3>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Amount ($)
            </label>
            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="9.99"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder:text-gray-500"
            />
          </div>
          <div>
            <label
              htmlFor="cycle"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Billing Cycle
            </label>
            <select
              id="cycle"
              value={fromCycle}
              onChange={(e) => setFromCycle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
            >
              {BILLING_CYCLES.map((cycle) => (
                <option key={cycle.value} value={cycle.value}>
                  {cycle.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="subs"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Number of Subscriptions
            </label>
            <input
              id="subs"
              type="number"
              min="1"
              max="100"
              value={numberOfSubscriptions}
              onChange={(e) => setNumberOfSubscriptions(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:placeholder:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {numericAmount > 0 && (
        <>
          {/* Conversion Grid */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2 text-gray-900 dark:text-gray-50">
              <RiArrowLeftRightLine className="size-5 text-blue-500" />
              <h3 className="font-semibold">Cost Breakdown</h3>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {conversions.map((conv) => (
                <div
                  key={conv.value}
                  className={`rounded-lg border p-4 text-center ${
                    conv.value === fromCycle
                      ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20"
                      : "border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-800"
                  }`}
                >
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {conv.label}
                  </p>
                  <p className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-50">
                    ${conv.amount.toFixed(2)}
                  </p>
                  {numSubs > 1 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ({numSubs} subscriptions)
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Long-term Cost */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-800/50 dark:bg-amber-900/10">
            <h3 className="font-semibold text-amber-900 dark:text-amber-200">
              Long-Term Cost Impact
            </h3>
            <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
              See how this subscription adds up over time
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-xs font-medium uppercase text-amber-600 dark:text-amber-400">
                  1 Year
                </p>
                <p className="mt-1 text-2xl font-bold text-amber-900 dark:text-amber-100">
                  ${yearlyTotal.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium uppercase text-amber-600 dark:text-amber-400">
                  5 Years
                </p>
                <p className="mt-1 text-2xl font-bold text-amber-900 dark:text-amber-100">
                  ${fiveYearCost.toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium uppercase text-amber-600 dark:text-amber-400">
                  10 Years
                </p>
                <p className="mt-1 text-2xl font-bold text-amber-900 dark:text-amber-100">
                  ${tenYearCost.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Savings Tip */}
          <div className="rounded-xl border border-green-200 bg-green-50 p-5 dark:border-green-800/50 dark:bg-green-900/10">
            <p className="text-sm font-medium text-green-800 dark:text-green-200">
              💡 Savings Tip
            </p>
            <p className="mt-1 text-sm text-green-700 dark:text-green-300">
              Switching from monthly to annual billing typically saves 15-20%. On
              this subscription, that could save you{" "}
              <strong>${(yearlyTotal * 0.175).toFixed(2)}/year</strong>.
              Track all your subscriptions with TrackMySubscriptions to find more
              savings opportunities.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
