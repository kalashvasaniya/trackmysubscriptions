"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/Button"
import { RiArrowRightLine, RiCheckLine, RiPlayCircleLine, RiShieldCheckLine } from "@remixicon/react"
import Link from "next/link"

export function Hero() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <section className="relative pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 lg:pb-24 bg-[#FAFAFA] dark:bg-gray-950 overflow-hidden">
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)]" />
      
      {/* Floating shapes - hidden on mobile */}
      <div className="absolute left-10 top-40 size-72 rounded-full border border-gray-200/50 dark:border-gray-800/50 animate-pulse hidden lg:block" />
      <div className="absolute right-20 bottom-20 size-48 rounded-full border border-gray-200/50 dark:border-gray-800/50 animate-pulse hidden lg:block" style={{ animationDelay: "1s" }} />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div 
              className={`mb-6 sm:mb-8 inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-gray-200/80 bg-white px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-medium shadow-sm transition-all duration-700 dark:border-gray-800 dark:bg-gray-900 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
              }`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-gray-500 dark:text-gray-400">Tracking</span>
              <span className="font-semibold text-gray-900 dark:text-white">$100M+</span>
              <span className="text-gray-500 dark:text-gray-400 hidden xs:inline">in subscriptions</span>
            </div>

            {/* Headline */}
            <h1 
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] xl:text-[3.5rem] font-semibold tracking-tight text-gray-900 leading-[1.15] transition-all duration-700 delay-100 dark:text-white ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              Never lose track of
              <br />
              <span className="text-gray-400 dark:text-gray-500">subscriptions again</span>
            </h1>

            {/* Subheadline */}
            <p 
              className={`mt-4 sm:mt-6 text-base sm:text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg mx-auto lg:mx-0 transition-all duration-700 delay-200 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              TrackMySubscriptions is your personal subscription assistant. Track spending, get smart alerts before charges, and save money by identifying unused subscriptions.
            </p>

            {/* CTA Buttons */}
            <div 
              className={`mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start transition-all duration-700 delay-300 ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Button size="lg" asChild className="px-6 group w-full sm:w-auto">
                <Link href="/register">
                  Start Free Today
                  <RiArrowRightLine className="size-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="secondary" size="lg" asChild className="px-6 group w-full sm:w-auto">
                <Link href="#how-it-works">
                  <RiPlayCircleLine className="size-4" />
                  See How It Works
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Side - Cards */}
          <div 
            className={`relative h-[380px] sm:h-[420px] md:h-[480px] lg:h-[540px] transition-all duration-1000 delay-300 ${
              loaded ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            }`}
          >
            {/* Alert Card - Floating */}
            <div 
              className={`absolute -left-2 sm:left-0 top-0 sm:top-4 z-20 rounded-xl sm:rounded-2xl border border-gray-200/80 bg-white p-3 sm:p-5 shadow-xl shadow-gray-200/50 transition-all duration-700 delay-500 hover:-translate-y-2 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex size-9 sm:size-11 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/30">
                  <RiCheckLine className="size-4 sm:size-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] sm:text-xs font-medium text-emerald-600 dark:text-emerald-400">Alert sent!</p>
                  <p className="mt-0.5 text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Netflix renews in 3 days</p>
                </div>
              </div>
            </div>

            {/* Savings Card - Floating */}
            <div 
              className={`absolute -right-2 sm:right-0 bottom-8 sm:bottom-16 z-20 rounded-xl sm:rounded-2xl border border-gray-200/80 bg-white p-3 sm:p-5 shadow-xl shadow-gray-200/50 transition-all duration-700 delay-700 hover:-translate-y-2 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none ${
                loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">Monthly savings</p>
              <p className="mt-1 text-2xl sm:text-3xl font-semibold text-emerald-600 dark:text-emerald-400">$47.99</p>
            </div>

            {/* Main Dashboard Card */}
            <div 
              className={`relative mx-4 sm:ml-8 mt-10 sm:mt-16 rounded-xl sm:rounded-2xl border border-gray-200/80 bg-white shadow-2xl shadow-gray-300/40 overflow-hidden transition-all duration-700 delay-400 dark:border-gray-800 dark:bg-gray-900 dark:shadow-none ${
                loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"
              }`}
            >
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 sm:px-6 py-3 sm:py-4 dark:border-gray-800">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="size-2.5 sm:size-3 rounded-full bg-red-400" />
                  <div className="size-2.5 sm:size-3 rounded-full bg-amber-400" />
                  <div className="size-2.5 sm:size-3 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] sm:text-xs font-medium text-gray-400 truncate">TrackMySubscriptions</span>
              </div>

              <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div className="rounded-lg sm:rounded-xl bg-gray-50 p-3 sm:p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800">
                    <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">Monthly Spending</p>
                    <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white">$247.00</p>
                    <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs font-medium text-emerald-600">↓ 12% vs last month</p>
                  </div>
                  <div className="rounded-lg sm:rounded-xl bg-gray-50 p-3 sm:p-4 transition-colors hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800">
                    <p className="text-[10px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">Active Subscriptions</p>
                    <p className="mt-1 sm:mt-2 text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white">24</p>
                    <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-gray-400">Across 5 categories</p>
                  </div>
                </div>

                {/* Subscriptions List */}
                <div className="rounded-lg sm:rounded-xl border border-gray-100 overflow-hidden dark:border-gray-800">
                  <div className="bg-gray-50 px-3 sm:px-4 py-2 sm:py-3 dark:bg-gray-800/50">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Upcoming Renewals</p>
                  </div>
                  <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {/* Netflix */}
                    <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3.5 bg-white transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex size-7 sm:size-9 items-center justify-center rounded-md sm:rounded-lg bg-black">
                          <svg viewBox="0 0 111 30" className="h-3 sm:h-4 w-auto fill-[#E50914]">
                            <path d="M105.062 14.28L111 30c-1.75-.25-3.499-.563-5.28-.845l-3.345-8.686-3.437 7.969c-1.687-.282-3.344-.376-5.031-.595l6.031-13.75L94.468 0h5.063l3.062 7.874L105.875 0h5.124l-5.937 14.28zM90.47 0h-4.594v27.25c1.5.094 3.062.156 4.594.343V0zm-8.563 26.937c-4.187-.281-8.375-.53-12.656-.625V0h4.687v21.875c2.688.062 5.375.28 7.969.405v4.657zM64.25 10.657v4.687h-6.406V26H53.22V0h13.125v4.687h-8.5v5.97h6.406zm-18.906-5.97V26.25c-1.563 0-3.156 0-4.688.062V4.687h-4.844V0h14.406v4.687h-4.874zM30.75 15.593c-2.062 0-4.5 0-6.25.095v6.968c2.75-.188 5.5-.406 8.281-.5v4.5l-12.968 1.032V0H32.78v4.687H24.5V11c1.813 0 4.594-.094 6.25-.094v4.688zM4.78 12.968v16.375C3.094 29.531 1.593 29.75 0 30V0h4.469l6.093 17.032V0h4.688v28.062c-1.656.282-3.344.376-5.125.625L4.78 12.968z"/>
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Netflix</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">$14.99</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">in 3 days</p>
                      </div>
                    </div>
                    {/* Spotify */}
                    <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3.5 bg-white transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex size-7 sm:size-9 items-center justify-center rounded-md sm:rounded-lg bg-[#1DB954]">
                          <svg viewBox="0 0 24 24" className="size-4 sm:size-5 fill-white">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Spotify</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">$5</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">in 5 days</p>
                      </div>
                    </div>
                    {/* Adobe CC */}
                    <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3.5 bg-white transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex size-7 sm:size-9 items-center justify-center rounded-md sm:rounded-lg bg-[#ED2224]">
                          <svg viewBox="0 0 30 26" className="size-4 sm:size-5 fill-white">
                            <path d="M19.1 0H30v26L19.1 0zM10.9 0H0v26L10.9 0zM15 9.6L22.1 26h-4.6l-2.1-5.2h-5.2L15 9.6z"/>
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">Adobe CC</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">$54.99</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">in 8 days</p>
                      </div>
                    </div>
                    {/* GitHub Pro - Hidden on very small screens */}
                    <div className="hidden xs:flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3.5 bg-white transition-colors hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex size-7 sm:size-9 items-center justify-center rounded-md sm:rounded-lg bg-[#24292F]">
                          <svg viewBox="0 0 24 24" className="size-4 sm:size-5 fill-white">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                          </svg>
                        </div>
                        <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">GitHub Pro</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">$4.00</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">in 12 days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div 
          className={`mt-12 sm:mt-16 lg:mt-20 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 transition-all duration-700 delay-700 dark:text-gray-400 ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <RiShieldCheckLine className="size-4 sm:size-5 text-emerald-500" />
          <span className="text-center">Bank-level security • Your data is encrypted and never shared</span>
        </div>
      </div>
    </section>
  )
}
