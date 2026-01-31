"use client"

import { Button } from "@/components/Button"
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm"
import { formatCurrency } from "@/lib/currency"
import {
  RiEditLine,
  RiArrowLeftLine,
  RiLoader4Line,
  RiAlertLine,
  RiCalendarLine,
  RiTimeLine,
  RiExternalLinkLine,
  RiDeleteBinLine,
  RiPlayCircleLine,
  RiPauseCircleLine,
  RiTimerFlashLine,
  RiCloseCircleLine,
} from "@remixicon/react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface Subscription {
  _id: string
  name: string
  amount: number
  currency: string
  billingCycle: string
  nextBillingDate: string
  status: string
  category?: string
  url?: string
  createdAt?: string
  description?: string
  notes?: string
  alertDays: number
  alertEnabled: boolean
  startDate: string
  folderId?: string | { _id: string; name?: string; color?: string }
  tagIds?: string[] | Array<{ _id: string } | string>
  paymentMethodId?: string | { _id: string; name?: string; type?: string; lastFour?: string }
}

const statusConfig = {
  active: { label: "Active", color: "bg-emerald-500", textColor: "text-emerald-600", icon: RiPlayCircleLine },
  trial: { label: "Trial", color: "bg-amber-500", textColor: "text-amber-600", icon: RiTimerFlashLine },
  cancelled: { label: "Cancelled", color: "bg-gray-500", textColor: "text-gray-600", icon: RiCloseCircleLine },
  paused: { label: "Paused", color: "bg-blue-500", textColor: "text-blue-600", icon: RiPauseCircleLine },
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

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return `${Math.abs(diffDays)}d overdue`
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Tomorrow"
  if (diffDays < 7) return `In ${diffDays} days`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export default function EditSubscriptionPage() {
  const params = useParams()
  const router = useRouter()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const response = await fetch(`/api/subscriptions/${params.id}`)
        if (!response.ok) {
          throw new Error("Subscription not found")
        }
        const data = await response.json()
        setSubscription(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load subscription")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchSubscription()
    }
  }, [params.id])

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this subscription?")) return
    
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/subscriptions/${params.id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete")
      router.push("/subscriptions")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="size-16 rounded-full border-4 border-blue-100 dark:border-blue-900" />
            <div className="absolute inset-0 size-16 animate-spin rounded-full border-4 border-transparent border-t-blue-500" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">Loading subscription...</p>
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
          <Button variant="secondary" className="mt-4" asChild>
            <Link href="/subscriptions">Back to Subscriptions</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (!subscription) return null

  const status = statusConfig[subscription.status as keyof typeof statusConfig] || statusConfig.active
  const StatusIcon = status.icon
  const categoryColor = categoryColors[subscription.category || ""] || categoryColors.default
  const daysUntil = Math.ceil(
    (new Date(subscription.nextBillingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  )
  const isUrgent = daysUntil <= 3 && daysUntil >= 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Header Section */}
      <div 
        className="relative overflow-hidden border-b border-gray-200 dark:border-gray-800"
        style={{ 
          background: `linear-gradient(135deg, ${categoryColor}dd 0%, ${categoryColor}99 50%, ${categoryColor}66 100%)` 
        }}
      >
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-white/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-white">
              <Link 
                href="/subscriptions"
                className="mb-3 inline-flex items-center gap-1 text-sm text-white/80 hover:text-white transition-colors"
              >
                <RiArrowLeftLine className="size-4" />
                Back to Subscriptions
              </Link>
              <div className="flex items-center gap-4">
                <div 
                  className="flex size-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold backdrop-blur-sm"
                >
                  {subscription.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">{subscription.name}</h1>
                  <div className="mt-1 flex items-center gap-3">
                    <span className="text-white/90">{subscription.category || "Uncategorized"}</span>
                    <span className="text-white/50">•</span>
                    <div className="flex items-center gap-1.5">
                      <StatusIcon className="size-4" />
                      <span>{status.label}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {subscription.url && (
                <Button 
                  variant="secondary" 
                  className="bg-white/20 text-white hover:bg-white/30 border-white/20"
                  asChild
                >
                  <a href={subscription.url} target="_blank" rel="noopener noreferrer">
                    <RiExternalLinkLine className="mr-2 size-4" />
                    Visit Website
                  </a>
                </Button>
              )}
              <Button 
                variant="secondary" 
                className="bg-white/20 text-white hover:bg-white/30 border-white/20"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <RiLoader4Line className="mr-2 size-4 animate-spin" />
                ) : (
                  <RiDeleteBinLine className="mr-2 size-4" />
                )}
                Delete
              </Button>
            </div>
          </div>

          {/* Quick Stats Pills */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
              <span className="text-xl font-bold">{formatCurrency(subscription.amount, subscription.currency)}</span>
              <span className="text-white/80">/ {subscription.billingCycle}</span>
            </div>
            <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white backdrop-blur-sm ${isUrgent ? "bg-red-500/40" : "bg-white/20"}`}>
              <RiCalendarLine className="size-4" />
              <span className="font-medium">Next: {formatRelativeDate(subscription.nextBillingDate)}</span>
            </div>
            {subscription.alertEnabled && (
              <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm text-white backdrop-blur-sm">
                <RiTimeLine className="size-4" />
                <span className="font-medium">{subscription.alertDays}d alert</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Main Form */}
          <div className="lg:col-span-8">
            <SubscriptionForm subscription={subscription} />
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6 lg:col-span-4">
            {/* Current Status */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-50">Current Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <div className="flex items-center gap-2">
                    <div className={`size-2 rounded-full ${status.color}`} />
                    <span className="font-medium text-gray-900 dark:text-gray-50">{status.label}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Amount</span>
                  <span className="font-bold text-gray-900 dark:text-gray-50">
                    {formatCurrency(subscription.amount, subscription.currency)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Billing</span>
                  <span className="font-medium capitalize text-gray-900 dark:text-gray-50">
                    {subscription.billingCycle}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Next Payment</span>
                  <span className={`font-medium ${isUrgent ? "text-red-600" : "text-gray-900 dark:text-gray-50"}`}>
                    {formatRelativeDate(subscription.nextBillingDate)}
                  </span>
                </div>
                {subscription.createdAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Added</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(subscription.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Yearly Cost */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-5 text-white">
              <p className="text-sm text-indigo-100">Yearly Cost</p>
              <p className="mt-1 text-3xl font-bold">
                {formatCurrency(
                  subscription.billingCycle === "monthly" 
                    ? subscription.amount * 12 
                    : subscription.billingCycle === "yearly"
                    ? subscription.amount
                    : subscription.billingCycle === "quarterly"
                    ? subscription.amount * 4
                    : subscription.amount * 52,
                  subscription.currency
                )}
              </p>
              <p className="mt-2 text-sm text-indigo-100">
                Based on {subscription.billingCycle} billing
              </p>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900/50 dark:bg-red-900/20">
              <h3 className="mb-3 font-semibold text-red-900 dark:text-red-400">Danger Zone</h3>
              <p className="mb-4 text-sm text-red-700 dark:text-red-300">
                Permanently delete this subscription. This action cannot be undone.
              </p>
              <Button 
                variant="destructive" 
                className="w-full" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <RiLoader4Line className="mr-2 size-4 animate-spin" />
                ) : (
                  <RiDeleteBinLine className="mr-2 size-4" />
                )}
                Delete Subscription
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
