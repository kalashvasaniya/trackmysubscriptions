import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  getStaticComparisonSlugs,
  parseComparisonSlug,
  getComparisonsForService,
} from "@/data/pseo/comparisons"
import { getServiceBySlug, type ServicePricing } from "@/data/pseo/services"
import {
  ComparisonTable,
  PricingComparison,
} from "@/components/pseo/ComparisonTable"
import { PseoBreadcrumb } from "@/components/pseo/PseoBreadcrumb"
import { CTABanner } from "@/components/pseo/CTABanner"
import { RelatedLinks } from "@/components/pseo/RelatedLinks"
import { productJsonLd, faqPageJsonLd } from "@/lib/jsonld"
import { RiArrowLeftRightLine, RiExternalLinkLine } from "@remixicon/react"

interface Props {
  params: Promise<{ slugs: string[] }>
}

export const dynamicParams = true

export async function generateStaticParams() {
  // Only pre-render top comparisons; rest are generated on-demand
  return getStaticComparisonSlugs(500).map((slug) => ({
    slugs: [slug],
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugs } = await params
  const slug = slugs?.[0]
  if (!slug) return {}

  const data = parseComparisonSlug(slug)
  if (!data) return {}

  const { serviceA, serviceB } = data
  const year = new Date().getFullYear()

  return {
    title: `${serviceA.name} vs ${serviceB.name} ${year} — Comparison | TrackMySubscriptions`,
    description: `Compare ${serviceA.name} vs ${serviceB.name} in ${year}. Side-by-side comparison of pricing, features, and plans to help you choose the best option.`,
    alternates: {
      canonical: `https://trackmysubscriptions.com/compare/${slug}`,
    },
    openGraph: {
      title: `${serviceA.name} vs ${serviceB.name} — Full Comparison ${year}`,
      description: `Detailed comparison of ${serviceA.name} and ${serviceB.name} including pricing, features, and recommendations.`,
      url: `https://trackmysubscriptions.com/compare/${slug}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${serviceA.name} vs ${serviceB.name} Comparison` }],
    },
  }
}

export default async function ComparisonPage({ params }: Props) {
  const { slugs } = await params
  const slug = slugs?.[0]
  if (!slug) notFound()

  const data = parseComparisonSlug(slug)
  if (!data) notFound()

  const { serviceA, serviceB } = data
  const year = new Date().getFullYear()

  // Related comparisons for each service
  const relatedA = getComparisonsForService(serviceA.slug)
    .filter((c) => c.slug !== slug)
    .slice(0, 3)
  const relatedB = getComparisonsForService(serviceB.slug)
    .filter((c) => c.slug !== slug)
    .slice(0, 3)
  const allRelated = [...relatedA, ...relatedB].filter(
    (c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i
  )

  const faqQuestions = [
    {
      question: `Is ${serviceA.name} or ${serviceB.name} better in ${year}?`,
      answer: `Both ${serviceA.name} and ${serviceB.name} are excellent ${serviceA.category} services. ${serviceA.name} offers ${serviceA.features.slice(0, 2).join(" and ")}, while ${serviceB.name} features ${serviceB.features.slice(0, 2).join(" and ")}. The best choice depends on your specific needs and budget.`,
    },
    {
      question: `How much does ${serviceA.name} cost compared to ${serviceB.name}?`,
      answer: `${serviceA.name} starts at $${serviceA.pricing.find((p: ServicePricing) => p.monthlyPrice && p.monthlyPrice > 0)?.monthlyPrice || "Free"}/month, while ${serviceB.name} starts at $${serviceB.pricing.find((p: ServicePricing) => p.monthlyPrice && p.monthlyPrice > 0)?.monthlyPrice || "Free"}/month. Both offer multiple pricing tiers to fit different budgets.`,
    },
    {
      question: `Can I track both ${serviceA.name} and ${serviceB.name} subscriptions?`,
      answer: `Yes! TrackMySubscriptions lets you track all your subscriptions in one place, including ${serviceA.name} and ${serviceB.name}. Get renewal alerts, spending analytics, and never miss a payment — 100% free.`,
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: productJsonLd({
            name: serviceA.name,
            description: serviceA.description,
            url: serviceA.website,
            category: serviceA.category,
            price: serviceA.pricing.find((p: ServicePricing) => p.monthlyPrice && p.monthlyPrice > 0)
              ?.monthlyPrice,
            currency: "USD",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: productJsonLd({
            name: serviceB.name,
            description: serviceB.description,
            url: serviceB.website,
            category: serviceB.category,
            price: serviceB.pricing.find((p: ServicePricing) => p.monthlyPrice && p.monthlyPrice > 0)
              ?.monthlyPrice,
            currency: "USD",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: faqPageJsonLd(faqQuestions),
        }}
      />

      <PseoBreadcrumb
        items={[
          { name: "Compare", href: "/compare" },
          {
            name: `${serviceA.name} vs ${serviceB.name}`,
            href: `/compare/${slug}`,
          },
        ]}
      />

      {/* Header */}
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-xl bg-gray-100 text-lg font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {serviceA.name.charAt(0)}
          </div>
          <RiArrowLeftRightLine className="size-6 text-gray-400" />
          <div className="flex size-14 items-center justify-center rounded-xl bg-gray-100 text-lg font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            {serviceB.name.charAt(0)}
          </div>
        </div>
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">
          {serviceA.name} vs {serviceB.name}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          A detailed comparison of {serviceA.name} and {serviceB.name} in{" "}
          {year}. Compare pricing plans, features, and find out which{" "}
          {serviceA.category} service is right for you.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <a
            href={serviceA.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {serviceA.name} <RiExternalLinkLine className="size-3.5" />
          </a>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <a
            href={serviceB.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            {serviceB.name} <RiExternalLinkLine className="size-3.5" />
          </a>
        </div>
      </div>

      {/* Quick Overview */}
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        {[serviceA, serviceB].map((service) => (
          <div
            key={service.slug}
            className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
          >
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              {service.name}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {service.shortDescription}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              {service.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {service.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Feature Comparison Table */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
          Feature Comparison
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Side-by-side comparison of features and capabilities
        </p>
        <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4 sm:p-6 dark:border-gray-800 dark:bg-gray-900">
          <ComparisonTable serviceA={serviceA} serviceB={serviceB} />
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
          Pricing Comparison
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Compare all available plans and pricing tiers
        </p>
        <div className="mt-5">
          <PricingComparison serviceA={serviceA} serviceB={serviceB} />
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
          Frequently Asked Questions
        </h2>
        <div className="mt-5 space-y-4">
          {faqQuestions.map((faq) => (
            <div
              key={faq.question}
              className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 className="font-medium text-gray-900 dark:text-gray-50">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Related Comparisons */}
      {allRelated.length > 0 && (
        <RelatedLinks
          title="Related Comparisons"
          links={allRelated.map((comp) => {
            const a = getServiceBySlug(comp.slugA)
            const b = getServiceBySlug(comp.slugB)
            return {
              title: `${a?.name || comp.slugA} vs ${b?.name || comp.slugB}`,
              href: `/compare/${comp.slug}`,
              description: `Compare ${a?.name} and ${b?.name} side-by-side`,
            }
          })}
        />
      )}

      <RelatedLinks
        title="Explore More"
        links={[
          {
            title: `Browse ${serviceA.category.charAt(0).toUpperCase() + serviceA.category.slice(1)} Services`,
            href: `/browse/${serviceA.category}`,
            description: `See all ${serviceA.category} subscription services`,
          },
          {
            title: "All Comparisons",
            href: "/compare",
            description: "Browse all subscription service comparisons",
          },
          {
            title: "Cost Calculator",
            href: "/tools/subscription-cost-calculator",
            description: "Calculate the true cost of your subscriptions",
          },
        ]}
      />

      <CTABanner
        title="Track Both Services in One Dashboard"
        description={`Whether you choose ${serviceA.name}, ${serviceB.name}, or both — track all your subscriptions in one place with smart alerts and analytics.`}
      />
    </div>
  )
}
