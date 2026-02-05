import type { Metadata } from "next"
import Link from "next/link"
import { RiArrowLeftRightLine } from "@remixicon/react"
import { getPopularComparisons, getTotalComparisonCount } from "@/data/pseo/comparisons"
import { getServiceBySlug, categories } from "@/data/pseo/services"
import { PseoBreadcrumb } from "@/components/pseo/PseoBreadcrumb"
import { CTABanner } from "@/components/pseo/CTABanner"
import { RelatedLinks } from "@/components/pseo/RelatedLinks"
import { itemListJsonLd } from "@/lib/jsonld"

export const metadata: Metadata = {
  title: "Compare Subscription Services — Side-by-Side | TrackMySubscriptions",
  description:
    "Compare popular subscription services side-by-side. Netflix vs Hulu, Spotify vs Apple Music, Figma vs Sketch, and 30+ more comparisons with pricing, features, and recommendations.",
  alternates: {
    canonical: "https://trackmysubscriptions.com/compare",
  },
  openGraph: {
    title: "Compare Subscription Services Side-by-Side",
    description:
      "Head-to-head comparisons of popular subscription services with pricing, features, and recommendations.",
    url: "https://trackmysubscriptions.com/compare",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "TrackMySubscriptions — Compare Subscription Services" }],
  },
}

export default function ComparePage() {
  const popularComparisons = getPopularComparisons(100)
  const totalCount = getTotalComparisonCount()
  const comparisonsByCategory = categories
    .map((cat) => ({
      category: cat,
      comparisons: popularComparisons.filter((c) => c.category === cat.slug),
    }))
    .filter((group) => group.comparisons.length > 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: itemListJsonLd(
            "Subscription Service Comparisons",
            "Compare popular subscription services side-by-side",
            popularComparisons.slice(0, 20).map((c) => {
              const a = getServiceBySlug(c.slugA)
              const b = getServiceBySlug(c.slugB)
              return {
                name: `${a?.name || c.slugA} vs ${b?.name || c.slugB}`,
                url: `/compare/${c.slug}`,
              }
            })
          ),
        }}
      />

      <PseoBreadcrumb items={[{ name: "Compare", href: "/compare" }]} />

      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">
          Compare Subscription Services
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Side-by-side comparisons of {totalCount.toLocaleString()}+ popular
          subscription service matchups. Compare pricing, features, and find the best
          option for your needs.
        </p>
      </div>

      {/* Comparisons by Category */}
      <div className="mt-12 space-y-12">
        {comparisonsByCategory.map(({ category, comparisons }) => (
          <section key={category.slug}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                {category.name}
              </h2>
              <Link
                href={`/browse/${category.slug}`}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Browse all →
              </Link>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {comparisons.map((comp) => {
                const a = getServiceBySlug(comp.slugA)
                const b = getServiceBySlug(comp.slugB)
                if (!a || !b) return null

                return (
                  <Link
                    key={comp.slug}
                    href={`/compare/${comp.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {a.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                          {a.name}
                        </p>
                      </div>
                    </div>
                    <RiArrowLeftRightLine className="mx-2 size-4 shrink-0 text-gray-400" />
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {b.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-50">
                          {b.name}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <RelatedLinks
        title="Explore More"
        links={[
          {
            title: "Browse All Services",
            href: "/browse",
            description: "Explore subscription services by category",
          },
          {
            title: "Subscription Glossary",
            href: "/glossary",
            description: "Learn subscription and billing terminology",
          },
          {
            title: "Cost Calculator",
            href: "/tools/subscription-cost-calculator",
            description: "Calculate the true long-term cost of subscriptions",
          },
        ]}
      />

      <CTABanner
        title="Track All Your Subscriptions in One Place"
        description="After comparing, start tracking your subscriptions. Get alerts before renewals, spending analytics, and more."
      />
    </div>
  )
}
