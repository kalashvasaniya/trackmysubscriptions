import { Button } from "@/components/Button"
import { RiArrowRightLine, RiCheckLine } from "@remixicon/react"
import Link from "next/link"

const features = [
  "Track unlimited subscriptions",
  "Get alerts before charges",
  "Export to CSV anytime",
]

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-32">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20" />
        <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-900/20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
            </span>
            Now tracking $100M+ in subscriptions
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl dark:text-white">
            All your subscriptions{" "}
            <span className="text-blue-600 dark:text-blue-400">
              tracked in one place
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            SubTracker is like having your own virtual assistant keeping watch
            on all your recurring payments. Track spending, get alerts before
            charges, and stay in control.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="px-8">
              <Link href="/register">
                Start for Free
                <RiArrowRightLine className="ml-2 size-5" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild className="px-8">
              <Link href="#how-it-works">See How It Works</Link>
            </Button>
          </div>

          {/* Feature list */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
              >
                <RiCheckLine className="size-5 text-emerald-500" />
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image/Dashboard Preview */}
        <div className="mt-16 sm:mt-20">
          <div className="relative mx-auto max-w-5xl">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-900 shadow-2xl dark:border-gray-800">
              <div className="flex items-center gap-2 border-b border-gray-800 bg-gray-950 px-4 py-3">
                <div className="size-3 rounded-full bg-red-500" />
                <div className="size-3 rounded-full bg-yellow-500" />
                <div className="size-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-gray-400">
                  SubTracker Dashboard
                </span>
              </div>
              <div className="bg-gradient-to-br from-gray-900 to-gray-950 p-8">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {/* Metric Cards Preview */}
                  <div className="rounded-lg bg-gray-800/50 p-4">
                    <p className="text-sm text-gray-400">Monthly Spending</p>
                    <p className="mt-1 text-2xl font-bold text-white">
                      $247.00
                    </p>
                    <p className="mt-1 text-xs text-emerald-400">
                      -12% from last month
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-800/50 p-4">
                    <p className="text-sm text-gray-400">Active Subscriptions</p>
                    <p className="mt-1 text-2xl font-bold text-white">24</p>
                    <p className="mt-1 text-xs text-gray-400">
                      Across 5 categories
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-800/50 p-4">
                    <p className="text-sm text-gray-400">Upcoming (7 days)</p>
                    <p className="mt-1 text-2xl font-bold text-white">$89.97</p>
                    <p className="mt-1 text-xs text-blue-400">3 renewals</p>
                  </div>
                </div>
                {/* Table Preview */}
                <div className="mt-6 rounded-lg bg-gray-800/30">
                  <div className="border-b border-gray-700/50 px-4 py-3">
                    <p className="text-sm font-medium text-gray-300">
                      Recent Subscriptions
                    </p>
                  </div>
                  <div className="divide-y divide-gray-700/50">
                    {["Netflix", "Spotify", "GitHub Pro"].map((name, i) => (
                      <div
                        key={name}
                        className="flex items-center justify-between px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`size-8 rounded-lg ${
                              i === 0
                                ? "bg-red-500/20"
                                : i === 1
                                  ? "bg-green-500/20"
                                  : "bg-gray-500/20"
                            }`}
                          />
                          <span className="text-sm text-gray-300">{name}</span>
                        </div>
                        <span className="text-sm text-gray-400">
                          ${[14.99, 9.99, 4.0][i]}/mo
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
