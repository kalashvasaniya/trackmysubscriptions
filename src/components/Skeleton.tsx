"use client"

import { cx } from "@/lib/utils"
import React from "react"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export function Skeleton({ className, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cx(
        "animate-pulse rounded-md bg-gray-200 dark:bg-gray-800",
        className
      )}
      style={style}
      {...props}
    />
  )
}

export function ChartSkeleton({ className }: { className?: string }) {
  return (
    <div className={cx("space-y-3", className)}>
      <div className="flex items-end justify-between gap-2 h-48">
        {[...Array(8)].map((_, i) => (
          <Skeleton 
            key={i} 
            className="flex-1" 
            style={{ height: `${40 + i * 7}%` }}
          />
        ))}
      </div>
      <Skeleton className="h-4 w-full" />
    </div>
  )
}

export function PieChartSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cx("flex items-center justify-center", className)}>
      <Skeleton className="size-32 rounded-full" />
    </div>
  )
}

export function MetricCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <Skeleton className="size-4 rounded" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="mt-3 h-8 w-24" />
      <Skeleton className="mt-2 h-3 w-20" />
    </div>
  )
}
