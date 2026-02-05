import type { Metadata } from "next"
import Link from "next/link"
import { RiCalculatorLine, RiArrowRightLine } from "@remixicon/react"
import { PseoBreadcrumb } from "@/components/pseo/PseoBreadcrumb"
import { CTABanner } from "@/components/pseo/CTABanner"
import { RelatedLinks } from "@/components/pseo/RelatedLinks"
import { itemListJsonLd } from "@/lib/jsonld"

export const metadata: Metadata = {
  title: "Free Subscription Tools & Calculators (2026)",
  description:
    "Free tools to help you manage your subscriptions better. Calculate subscription costs, compare billing cycles, and find savings opportunities.",
  alternates: {
    canonical: "https://trackmysubscriptions.com/tools",
  },
  openGraph: {
    title: "Free Subscription Tools & Calculators",
    description:
      "Free tools to calculate subscription costs, compare billing cycles, and find savings.",
    url: "https://trackmysubscriptions.com/tools",
  },
}

const tools = [
  {
    name: "Subscription Cost Calculator",
    description:
      "Calculate the true cost of your subscriptions across different billing cycles. See monthly, quarterly, yearly, and long-term costs at a glance. Understand how small recurring charges add up over 5 and 10 years.",
    href: "/tools/subscription-cost-calculator",
    icon: RiCalculatorLine,
    features: [
      "Convert between billing cycles",
      "Multi-subscription totals",
      "5 and 10-year projections",
      "Savings tips included",
    ],
  },
]

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: itemListJsonLd(
            "Free Subscription Tools & Calculators",
            "Free calculators and tools to help you understand, manage, and optimize your subscription spending.",
            tools.map((tool) => ({
              name: tool.name,
              url: tool.href,
              description: tool.description,
            })),
          ),
        }}
      />
      <PseoBreadcrumb items={[{ name: "Tools", href: "/tools" }]} />

      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">
          Free Subscription Tools
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Free calculators and tools to help you understand, manage, and
          optimize your subscription spending.
        </p>
      </div>

      <div className="mt-12 grid gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg sm:p-8 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
            >
              <div className="flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Icon className="size-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-50 dark:group-hover:text-blue-400">
                    {tool.name}
                  </h2>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {tool.description}
                  </p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {tool.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                      >
                        <span className="size-1.5 shrink-0 rounded-full bg-blue-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                    Open tool
                    <RiArrowRightLine className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <RelatedLinks
        title="More Resources"
        links={[
          {
            title: "Browse Services",
            href: "/browse",
            description: "Explore subscription services by category",
          },
          {
            title: "Compare Services",
            href: "/compare",
            description: "Side-by-side comparisons of popular services",
          },
          {
            title: "Glossary",
            href: "/glossary",
            description: "Learn subscription and billing terminology",
          },
        ]}
      />

      <CTABanner
        title="Track Your Subscriptions Automatically"
        description="Go beyond calculators — track all your subscriptions with alerts, analytics, and spending insights."
      />
    </div>
  )
}
