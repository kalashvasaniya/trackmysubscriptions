import Link from "next/link"
import { RiArrowRightLine, RiCheckLine } from "@remixicon/react"

interface CTABannerProps {
  title?: string
  description?: string
  ctaText?: string
  ctaHref?: string
}

export function CTABanner({
  title = "Start Tracking Your Subscriptions",
  description = "Join thousands of users who have taken control of their subscription spending. 100% free, no credit card required.",
  ctaText = "Get Started Free",
  ctaHref = "/register",
}: CTABannerProps) {
  return (
    <section className="relative mt-16 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 px-6 py-12 text-center sm:px-12 sm:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative mx-auto max-w-2xl">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        <p className="mt-3 text-base text-blue-100 sm:text-lg">{description}</p>
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
          >
            {ctaText}
            <RiArrowRightLine className="size-4" />
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-blue-100">
          {["100% Free forever", "No credit card required", "Set up in 2 minutes"].map(
            (item) => (
              <span key={item} className="flex items-center gap-1.5">
                <RiCheckLine className="size-4 text-blue-200" />
                {item}
              </span>
            )
          )}
        </div>
      </div>
    </section>
  )
}
