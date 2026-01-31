"use client"

import { formatCurrency } from "@/lib/currency"
import { cx } from "@/lib/utils"
import React, { memo } from "react"
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

// Memoized custom tooltip component
const CustomTooltip = memo(function CustomTooltip({ 
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
})

interface SpendingTrendChartProps {
  data: Array<{ month: string; amount: number }>
  currency: string
  yearly: number
  avgMonthly: number
  trends: number[]
}

export const SpendingTrendChart = memo(function SpendingTrendChart({
  data,
  currency,
  yearly,
  avgMonthly,
  trends,
}: SpendingTrendChartProps) {
  const COLORS = { blue: "#3B82F6" }
  
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:rounded-2xl sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-50 sm:text-lg">
            Spending Trend
          </h2>
          <p className="mt-0.5 text-xs text-gray-500 sm:mt-1 sm:text-sm">Monthly spending over the past year</p>
        </div>
        <div className="sm:text-right">
          <p className="text-xl font-bold text-gray-900 dark:text-gray-50 sm:text-2xl">
            {formatCurrency(yearly, currency)}
          </p>
          <p className="text-[10px] text-gray-500 sm:text-xs">yearly total</p>
        </div>
      </div>

      <div className="h-48 sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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

      <div className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 dark:border-gray-800 sm:mt-4 sm:gap-4 sm:pt-4">
        <div className="text-center">
          <p className="text-[10px] text-gray-500 sm:text-xs">Average</p>
          <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-50 sm:mt-1">
            {formatCurrency(avgMonthly, currency)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-500 sm:text-xs">Highest</p>
          <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-50 sm:mt-1">
            {formatCurrency(Math.max(...trends), currency)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-500 sm:text-xs">Lowest</p>
          <p className="mt-0.5 text-sm font-semibold text-gray-900 dark:text-gray-50 sm:mt-1">
            {formatCurrency(Math.min(...trends.filter((t) => t > 0)) || 0, currency)}
          </p>
        </div>
      </div>
    </div>
  )
})

interface CategoryPieChartProps {
  data: Array<{ name: string; value: number; fill: string }>
  currency: string
  categoryTotal: number
}

export const CategoryPieChart = memo(function CategoryPieChart({
  data,
  currency,
  categoryTotal,
}: CategoryPieChartProps) {
  if (data.length === 0) return null
  
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:rounded-2xl sm:p-6">
      <h2 className="mb-0.5 text-base font-semibold text-gray-900 dark:text-gray-50 sm:mb-1 sm:text-lg">
        Spending Distribution
      </h2>
      <p className="mb-4 text-xs text-gray-500 sm:mb-6 sm:text-sm">How your monthly spending is divided</p>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <div className="h-48 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
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
          {data.map((item) => {
            const percentage = categoryTotal > 0
              ? ((item.value / categoryTotal) * 100).toFixed(1)
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
  )
})

interface TopSubscriptionsChartProps {
  data: Array<{
    id: string
    name: string
    monthlyAmount: number
    actualAmount: number
    billingCycle: string
    category: string
  }>
  currency: string
  avgSubscriptionCost: number
}

export const TopSubscriptionsChart = memo(function TopSubscriptionsChart({
  data,
  currency,
  avgSubscriptionCost,
}: TopSubscriptionsChartProps) {
  const COLORS = { purple: "#8B5CF6" }
  
  if (data.length === 0) return null
  
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-50">
        Top Subscriptions by Cost
      </h2>
      <p className="mb-6 text-sm text-gray-500">Your most expensive subscriptions (monthly equivalent)</p>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
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
              formatter={(value: number) => [
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
              data.reduce((sum, s) => sum + s.monthlyAmount, 0),
              currency
            )}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Avg Cost</p>
          <p className="mt-1 font-semibold text-gray-900 dark:text-gray-50">
            {formatCurrency(avgSubscriptionCost, currency)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Most Expensive</p>
          <p className="mt-1 font-semibold text-gray-900 dark:text-gray-50">
            {data[0]?.name || "N/A"}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Top Category</p>
          <p className="mt-1 font-semibold text-gray-900 dark:text-gray-50">
            {data[0]?.category || "N/A"}
          </p>
        </div>
      </div>
    </div>
  )
})

interface MonthOverMonthChartProps {
  data: Array<{ month: string; amount: number; previous: number }>
  currency: string
}

export const MonthOverMonthChart = memo(function MonthOverMonthChart({
  data,
  currency,
}: MonthOverMonthChartProps) {
  const COLORS = { blue: "#3B82F6" }
  
  if (data.length <= 2) return null
  
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h2 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-50">
        Month-over-Month Growth
      </h2>
      <p className="mb-6 text-sm text-gray-500">Compare your spending changes over time</p>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data.slice(-6)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
  )
})

interface StatusPieChartProps {
  data: Array<{ name: string; value: number; fill: string }>
}

export const StatusPieChart = memo(function StatusPieChart({ data }: StatusPieChartProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">
        Subscription Status
      </h3>
      {data.length > 0 ? (
        <div className="space-y-4">
          <div className="mx-auto h-32 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {data.map((item) => (
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
  )
})

interface BillingCyclePieChartProps {
  data: Array<{ name: string; value: number; fill: string }>
  currency: string
}

export const BillingCyclePieChart = memo(function BillingCyclePieChart({
  data,
  currency,
}: BillingCyclePieChartProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">
        Cost by Billing Cycle
      </h3>
      {data.length > 0 ? (
        <div className="space-y-4">
          <div className="mx-auto h-32 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={50}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {data.map((item) => (
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
  )
})
