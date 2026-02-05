import type { Metadata } from "next"
import Link from "next/link"
import {
  RiTvLine,
  RiMusic2Line,
  RiCodeSSlashLine,
  RiPaletteLine,
  RiCloudLine,
  RiFlashlightLine,
  RiMoneyDollarCircleLine,
  RiHeartPulseLine,
  RiGraduationCapLine,
  RiRobot2Line,
  RiShieldLine,
  RiGamepadLine,
  RiNewspaperLine,
  RiArrowRightLine,
} from "@remixicon/react"
import { categories, getServiceCount, services } from "@/data/pseo/services"
import { PseoBreadcrumb } from "@/components/pseo/PseoBreadcrumb"
import { CTABanner } from "@/components/pseo/CTABanner"
import { RelatedLinks } from "@/components/pseo/RelatedLinks"
import { itemListJsonLd } from "@/lib/jsonld"

export const metadata: Metadata = {
  title: "Browse Subscription Services by Category | TrackMySubscriptions",
  description:
    "Explore and compare popular subscription services across entertainment, music, development, design, cloud, productivity, finance, health, and education categories.",
  alternates: {
    canonical: "https://trackmysubscriptions.com/browse",
  },
  openGraph: {
    title: "Browse Subscription Services by Category",
    description:
      "Explore and compare popular subscription services across 9 categories. Find the best services for your needs.",
    url: "https://trackmysubscriptions.com/browse",
  },
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  tv: RiTvLine,
  music: RiMusic2Line,
  code: RiCodeSSlashLine,
  palette: RiPaletteLine,
  cloud: RiCloudLine,
  zap: RiFlashlightLine,
  "dollar-sign": RiMoneyDollarCircleLine,
  heart: RiHeartPulseLine,
  "graduation-cap": RiGraduationCapLine,
  robot: RiRobot2Line,
  shield: RiShieldLine,
  gamepad: RiGamepadLine,
  newspaper: RiNewspaperLine,
}

export default function BrowsePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: itemListJsonLd(
            "Subscription Service Categories",
            "Browse subscription services by category",
            categories.map((c) => ({
              name: c.name,
              url: `/browse/${c.slug}`,
              description: c.description,
            }))
          ),
        }}
      />

      <PseoBreadcrumb items={[{ name: "Browse", href: "/browse" }]} />

      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">
          Browse Subscription Services
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Explore {services.length}+ popular subscription services across{" "}
          {categories.length} categories. Compare pricing, features, and find the
          best value for your needs.
        </p>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] || RiFlashlightLine
          const count = getServiceCount(category.slug)

          return (
            <Link
              key={category.slug}
              href={`/browse/${category.slug}`}
              className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Icon className="size-5" />
                </div>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                  {count} services
                </span>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-blue-600 dark:text-gray-50 dark:group-hover:text-blue-400">
                {category.name}
              </h2>
              <p className="mt-1 flex-1 text-sm text-gray-500 dark:text-gray-400">
                {category.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                Browse {category.name.toLowerCase()}
                <RiArrowRightLine className="size-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          )
        })}
      </div>

      <RelatedLinks
        title="Explore More"
        links={[
          {
            title: "Compare Services",
            href: "/compare",
            description: "Head-to-head comparisons of popular subscription services",
          },
          {
            title: "Subscription Glossary",
            href: "/glossary",
            description: "Learn key subscription and billing terminology",
          },
          {
            title: "Cost Calculator",
            href: "/tools/subscription-cost-calculator",
            description: "Calculate the true cost of your subscriptions",
          },
        ]}
      />

      <CTABanner />
    </div>
  )
}
