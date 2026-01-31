import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics"
import { UpcomingPayments } from "@/components/dashboard/UpcomingPayments"
import { SpendingChart } from "@/components/dashboard/SpendingChart"
import { RecentSubscriptions } from "@/components/dashboard/RecentSubscriptions"
import { Button } from "@/components/Button"
import { RiAddLine } from "@remixicon/react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Overview of your subscription spending
          </p>
        </div>
        <Button asChild>
          <Link href="/subscriptions/new">
            <RiAddLine className="mr-2 size-4" />
            Add Subscription
          </Link>
        </Button>
      </div>

      {/* Metrics Cards */}
      <div className="mt-8">
        <DashboardMetrics />
      </div>

      {/* Charts and Lists */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SpendingChart />
        <UpcomingPayments />
      </div>

      {/* Recent Subscriptions */}
      <div className="mt-8">
        <RecentSubscriptions />
      </div>
    </div>
  )
}
