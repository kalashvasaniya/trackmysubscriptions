"use client"

import { Button } from "@/components/Button"
import { RiArrowRightLine, RiCheckLine } from "@remixicon/react"
import Link from "next/link"

const benefits = [
  "Free forever plan available",
  "No credit card required",
  "Set up in under 2 minutes",
]

export function CTA() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
          {/* Background decorations */}
          <div className="absolute inset-0">
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 size-64 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute right-1/4 top-1/2 size-32 rounded-full bg-white/5 blur-2xl" />
          </div>

          <div className="relative px-8 py-16 sm:px-16 sm:py-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Ready to take control of your subscriptions?
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
              Join 20,000+ users who are saving money and staying on top of their recurring expenses with SubTracker.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button 
                size="lg" 
                asChild 
                className="bg-white text-blue-700 hover:bg-blue-50 px-8 shadow-lg"
              >
                <Link href="/register">
                  Start Free Today
                  <RiArrowRightLine className="ml-2 size-5" />
                </Link>
              </Button>
              <Button 
                variant="secondary" 
                size="lg" 
                asChild 
                className="bg-white/10 text-white hover:bg-white/20 border-white/20 px-8"
              >
                <Link href="#pricing">View Pricing</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2 text-sm text-blue-100">
                  <div className="flex size-5 items-center justify-center rounded-full bg-white/20">
                    <RiCheckLine className="size-3 text-white" />
                  </div>
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
