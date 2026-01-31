"use client"

import { Button } from "@/components/Button"
import { RiArrowRightLine, RiCheckLine, RiPlayCircleLine, RiStarFill } from "@remixicon/react"
import Link from "next/link"

const features = [
  "Track unlimited subscriptions",
  "Get alerts before charges",
  "Export to CSV anytime",
  "160+ currencies supported",
]

// Brand logos as SVG paths
const brandLogos = [
  {
    name: "Netflix",
    svg: (
      <svg viewBox="0 0 111 30" className="h-6 w-auto fill-current">
        <path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.563 26.937c-4.187-.281-8.375-.53-12.656-.625V0h4.687v21.875c2.688.062 5.375.28 7.969.405v4.657zM64.25 10.657v4.687h-6.406V26H53.22V0h13.125v4.687h-8.5v5.97h6.406zm-18.906-5.97V26.25c-1.563 0-3.156 0-4.688.062V4.687h-4.844V0h14.406v4.687h-4.874zM30.75 15.593c-2.062 0-4.5 0-6.25.095v6.968c2.75-.188 5.5-.406 8.281-.5v4.5l-12.968 1.032V0H32.78v4.687H24.5V11c1.813 0 4.594-.094 6.25-.094v4.688zM4.78 12.968v16.375C3.094 29.531 1.593 29.75 0 30V0h4.469l6.093 17.032V0h4.688v28.062c-1.656.282-3.344.376-5.125.625L4.78 12.968z"/>
      </svg>
    ),
  },
  {
    name: "Spotify",
    svg: (
      <svg viewBox="0 0 168 168" className="h-7 w-auto fill-current">
        <path d="M84 0C37.8 0 0 37.8 0 84s37.8 84 84 84 84-37.8 84-84S130.2 0 84 0zm38.4 121.2c-1.8 2.4-4.8 3-7.2 1.8-19.8-12-44.4-14.4-73.8-7.8-2.4.6-5.4-.6-6-3.6-.6-2.4.6-5.4 3.6-6 32.4-7.2 60-4.2 82.2 9 2.4 1.2 3 4.8 1.2 6.6zm10.2-22.8c-2.4 2.4-5.4 3.6-8.4 1.8-22.8-13.8-57-18-84-9.6-3 .6-6.6-.6-7.2-4.2-.6-3 .6-6.6 4.2-7.2 30.6-9 68.4-4.8 94.2 11.4 2.4 1.8 3.6 5.4 1.2 7.8zm1.2-24c-27-16.2-72-17.4-97.8-9.6-4.2 1.2-8.4-1.2-9.6-5.4-1.2-4.2 1.2-8.4 5.4-9.6 30-9 79.2-7.2 110.4 11.4 3.6 2.4 4.8 7.2 2.4 10.8-1.8 3-6.6 4.2-10.8 2.4z"/>
      </svg>
    ),
  },
  {
    name: "GitHub",
    svg: (
      <svg viewBox="0 0 98 96" className="h-7 w-auto fill-current">
        <path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/>
      </svg>
    ),
  },
  {
    name: "Adobe",
    svg: (
      <svg viewBox="0 0 512 512" className="h-7 w-auto fill-current">
        <path d="M315.5 64h170.9v384zm-119 0H25.6v384zM196.5 186.3L320 448h-72l-52.4-117.9h-66.3z"/>
      </svg>
    ),
  },
  {
    name: "Slack",
    svg: (
      <svg viewBox="0 0 127 127" className="h-7 w-auto fill-current">
        <path d="M27.2 80c0 7.3-5.9 13.2-13.2 13.2C6.7 93.2.8 87.3.8 80c0-7.3 5.9-13.2 13.2-13.2h13.2V80zm6.6 0c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2v33c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V80z"/>
        <path d="M47 27c-7.3 0-13.2-5.9-13.2-13.2C33.8 6.5 39.7.6 47 .6c7.3 0 13.2 5.9 13.2 13.2V27H47zm0 6.7c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H13.9C6.6 60.1.7 54.2.7 46.9c0-7.3 5.9-13.2 13.2-13.2H47z"/>
        <path d="M99.9 46.9c0-7.3 5.9-13.2 13.2-13.2 7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H99.9V46.9zm-6.6 0c0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V13.8C66.9 6.5 72.8.6 80.1.6c7.3 0 13.2 5.9 13.2 13.2v33.1z"/>
        <path d="M80.1 99.8c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2-7.3 0-13.2-5.9-13.2-13.2V99.8h13.2zm0-6.6c-7.3 0-13.2-5.9-13.2-13.2 0-7.3 5.9-13.2 13.2-13.2h33.1c7.3 0 13.2 5.9 13.2 13.2 0 7.3-5.9 13.2-13.2 13.2H80.1z"/>
      </svg>
    ),
  },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 sm:pt-32 pb-16">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white dark:from-blue-950/30 dark:via-gray-950 dark:to-gray-950" />
        <div className="absolute left-1/2 top-0 -z-10 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 opacity-50 blur-3xl dark:from-blue-900/30 dark:to-purple-900/30" />
        <div className="absolute right-0 top-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-emerald-100 to-cyan-100 opacity-40 blur-3xl dark:from-emerald-900/20 dark:to-cyan-900/20" />
        <div className="absolute left-0 bottom-0 -z-10 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-amber-100 to-orange-100 opacity-40 blur-3xl dark:from-amber-900/20 dark:to-orange-900/20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-blue-200 bg-white/80 px-5 py-2 text-sm font-medium shadow-sm backdrop-blur-sm dark:border-blue-800 dark:bg-gray-900/80">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
            </span>
            <span className="text-gray-600 dark:text-gray-400">Now tracking</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">$100M+</span>
            <span className="text-gray-600 dark:text-gray-400">in subscriptions</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-7xl dark:text-white">
            Never lose track of{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                subscriptions
              </span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C50 4 150 4 298 10" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="300" y2="0">
                    <stop stopColor="#2563EB"/>
                    <stop offset="0.5" stopColor="#4F46E5"/>
                    <stop offset="1" stopColor="#9333EA"/>
                  </linearGradient>
                </defs>
              </svg>
            </span>{" "}
            again
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-8 max-w-2xl text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
            SubTracker is your personal subscription assistant. Track spending, get smart alerts before charges, and save money by identifying unused subscriptions.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="px-8 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow">
              <Link href="/register">
                Start Free Today
                <RiArrowRightLine className="ml-2 size-5" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild className="px-8 group">
              <Link href="#how-it-works">
                <RiPlayCircleLine className="mr-2 size-5 text-blue-600 group-hover:scale-110 transition-transform" />
                See How It Works
              </Link>
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <RiStarFill key={i} className="size-5 text-amber-400" />
              ))}
              <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">4.9/5 from 2,000+ users</span>
            </div>
          </div>

          {/* Feature list */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {features.map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                <div className="flex size-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                  <RiCheckLine className="size-3 text-emerald-600 dark:text-emerald-400" />
                </div>
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Hero Image/Dashboard Preview */}
        <div className="mt-20">
          <div className="relative mx-auto max-w-6xl">
            {/* Floating elements */}
            <div className="absolute -left-4 top-1/4 z-10 hidden animate-bounce rounded-2xl border border-emerald-200 bg-white p-4 shadow-xl dark:border-emerald-800 dark:bg-gray-900 lg:block" style={{ animationDuration: "3s" }}>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/50">
                  <RiCheckLine className="size-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Alert sent!</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Netflix renews in 3 days</p>
                </div>
              </div>
            </div>

            <div className="absolute -right-4 top-1/3 z-10 hidden animate-bounce rounded-2xl border border-blue-200 bg-white p-4 shadow-xl dark:border-blue-800 dark:bg-gray-900 lg:block" style={{ animationDuration: "4s", animationDelay: "1s" }}>
              <div className="text-center">
                <p className="text-xs text-gray-500">Monthly savings</p>
                <p className="text-2xl font-bold text-emerald-600">$47.99</p>
              </div>
            </div>

            {/* Main Dashboard Card */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-900 shadow-2xl dark:border-gray-800">
              <div className="flex items-center gap-2 border-b border-gray-800 bg-gray-950 px-4 py-3">
                <div className="size-3 rounded-full bg-red-500" />
                <div className="size-3 rounded-full bg-yellow-500" />
                <div className="size-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-gray-400">
                  SubTracker — Dashboard
                </span>
              </div>
              <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-gray-950 p-6 sm:p-8">
                {/* Stats Row */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 p-4 ring-1 ring-blue-500/20">
                    <p className="text-xs text-blue-300">Monthly Spending</p>
                    <p className="mt-1 text-2xl font-bold text-white">$247.00</p>
                    <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                      <span>↓ 12%</span>
                      <span className="text-gray-500">vs last month</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 p-4 ring-1 ring-emerald-500/20">
                    <p className="text-xs text-emerald-300">Active Subscriptions</p>
                    <p className="mt-1 text-2xl font-bold text-white">24</p>
                    <p className="mt-2 text-xs text-gray-500">Across 5 categories</p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 p-4 ring-1 ring-purple-500/20">
                    <p className="text-xs text-purple-300">Upcoming (7 days)</p>
                    <p className="mt-1 text-2xl font-bold text-white">$89.97</p>
                    <p className="mt-2 text-xs text-amber-400">3 renewals due</p>
                  </div>
                  <div className="rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 p-4 ring-1 ring-amber-500/20">
                    <p className="text-xs text-amber-300">Yearly Total</p>
                    <p className="mt-1 text-2xl font-bold text-white">$2,964</p>
                    <p className="mt-2 text-xs text-gray-500">Projected spending</p>
                  </div>
                </div>

                {/* Subscriptions Preview */}
                <div className="mt-6 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50">
                  <div className="flex items-center justify-between border-b border-gray-700/50 px-4 py-3">
                    <p className="text-sm font-medium text-gray-300">Recent Subscriptions</p>
                    <span className="text-xs text-blue-400">View all →</span>
                  </div>
                  <div className="divide-y divide-gray-700/50">
                    {[
                      { name: "Netflix", category: "Entertainment", amount: 14.99, color: "#E50914", due: "3 days" },
                      { name: "Spotify", category: "Music", amount: 9.99, color: "#1DB954", due: "5 days" },
                      { name: "GitHub Pro", category: "Development", amount: 4.00, color: "#333", due: "12 days" },
                      { name: "Adobe CC", category: "Design", amount: 54.99, color: "#FF0000", due: "18 days" },
                    ].map((sub) => (
                      <div key={sub.name} className="flex items-center justify-between px-4 py-3 hover:bg-gray-700/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex size-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                            style={{ backgroundColor: `${sub.color}30` }}
                          >
                            {sub.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-200">{sub.name}</p>
                            <p className="text-xs text-gray-500">{sub.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-white">${sub.amount}/mo</p>
                          <p className="text-xs text-gray-500">Due in {sub.due}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-gray-950" />
          </div>
        </div>

        {/* Trusted by logos */}
        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Trusted by users tracking subscriptions from</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {brandLogos.map((brand) => (
              <div key={brand.name} className="text-gray-400 opacity-60 transition-all hover:opacity-100 hover:text-gray-600 dark:hover:text-gray-300">
                {brand.svg}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
