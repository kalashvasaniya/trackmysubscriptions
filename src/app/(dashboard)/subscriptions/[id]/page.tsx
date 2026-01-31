"use client"

import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm"
import { Skeleton } from "@/components/Skeleton"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditSubscriptionPage() {
  const params = useParams()
  const [subscription, setSubscription] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

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

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl">
          <div className="rounded-md bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Edit Subscription
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Update subscription details
          </p>
        </div>
        {subscription && <SubscriptionForm subscription={subscription} />}
      </div>
    </div>
  )
}
