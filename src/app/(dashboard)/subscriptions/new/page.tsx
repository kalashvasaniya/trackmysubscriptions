"use client"

import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm"

export default function NewSubscriptionPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Add Subscription
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Add a new subscription to track
          </p>
        </div>
        <SubscriptionForm />
      </div>
    </div>
  )
}
