import { Button } from "@/components/Button"
import { cx } from "@/lib/utils"
import { RiCheckLine } from "@remixicon/react"
import Link from "next/link"

const tiers = [
  {
    name: "Free",
    id: "free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with subscription tracking.",
    features: [
      "Track up to 10 subscriptions",
      "Basic email alerts",
      "Monthly spending overview",
      "CSV export",
      "Single currency",
    ],
    cta: "Get Started Free",
    href: "/register",
    featured: false,
  },
  {
    name: "Pro",
    id: "pro",
    price: "$5",
    period: "per month",
    description: "Everything you need to manage all your subscriptions.",
    features: [
      "Unlimited subscriptions",
      "Advanced alerts & reminders",
      "Calendar view",
      "CSV import & export",
      "160+ currencies supported",
      "Folders & tags organization",
      "Detailed analytics & reports",
      "Priority support",
    ],
    cta: "Start Pro Trial",
    href: "/register?plan=pro",
    featured: true,
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400">
            Pricing
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Take control of your subscriptions!
          </p>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Start for free, track 10 subscriptions at no cost.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 lg:grid-cols-2">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={cx(
                "relative rounded-2xl border p-8",
                tier.featured
                  ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/20"
                  : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900",
              )}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-sm font-semibold text-white">
                  Most Popular
                </div>
              )}

              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tier.name}
                </h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {tier.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    /{tier.period}
                  </span>
                </div>
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {tier.description}
                </p>
              </div>

              <ul className="mt-8 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <RiCheckLine
                      className={cx(
                        "size-5 shrink-0",
                        tier.featured
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-emerald-500",
                      )}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Button
                  variant={tier.featured ? "primary" : "secondary"}
                  className="w-full"
                  asChild
                >
                  <Link href={tier.href}>{tier.cta}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
