import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  categories,
  getCategoryBySlug,
  getServicesByCategory,
  getAllCategorySlugs,
} from "@/data/pseo/services"
import { getComparisonsByCategory } from "@/data/pseo/comparisons"
import { getServiceBySlug } from "@/data/pseo/services"
import { ServiceCard } from "@/components/pseo/ServiceCard"
import { PseoBreadcrumb } from "@/components/pseo/PseoBreadcrumb"
import { CTABanner } from "@/components/pseo/CTABanner"
import { RelatedLinks } from "@/components/pseo/RelatedLinks"
import { itemListJsonLd, faqPageJsonLd } from "@/lib/jsonld"
import { RiArrowLeftRightLine } from "@remixicon/react"

interface Props {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  return getAllCategorySlugs().map((category) => ({ category }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = getCategoryBySlug(category)
  if (!cat) return {}

  const year = new Date().getFullYear()
  return {
    title: `Best ${cat.name} Subscriptions ${year} — Compare & Track | TrackMySubscriptions`,
    description: `Compare the best ${cat.name.toLowerCase()} subscription services in ${year}. ${cat.description} Track them all free with TrackMySubscriptions.`,
    alternates: {
      canonical: `https://trackmysubscriptions.com/browse/${category}`,
    },
    openGraph: {
      title: `Best ${cat.name} Subscriptions ${year}`,
      description: cat.description,
      url: `https://trackmysubscriptions.com/browse/${category}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `Best ${cat.name} Subscriptions` }],
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = getCategoryBySlug(category)
  if (!cat) notFound()

  const categoryServices = getServicesByCategory(category)
  const comparisons = getComparisonsByCategory(category)
  const otherCategories = categories.filter((c) => c.slug !== category)
  const year = new Date().getFullYear()

  const faqQuestions = [
    {
      question: `What are the best ${cat.name.toLowerCase()} subscriptions in ${year}?`,
      answer: `The top ${cat.name.toLowerCase()} subscriptions include ${categoryServices
        .slice(0, 3)
        .map((s) => s.name)
        .join(", ")}, and more. Compare all ${categoryServices.length} services to find the best fit for your needs.`,
    },
    {
      question: `How much do ${cat.name.toLowerCase()} subscriptions cost?`,
      answer: `${cat.name} subscription prices vary widely. Many offer free plans, with paid plans typically starting from $${Math.min(
        ...categoryServices
          .flatMap((s) => s.pricing)
          .filter((p) => p.monthlyPrice && p.monthlyPrice > 0)
          .map((p) => p.monthlyPrice!)
      ).toFixed(2)}/month. Use TrackMySubscriptions to track and compare costs.`,
    },
    {
      question: `How can I track my ${cat.name.toLowerCase()} subscriptions?`,
      answer: `Use TrackMySubscriptions to track all your ${cat.name.toLowerCase()} subscriptions in one place. Get renewal alerts, spending analytics, and never miss a payment. It's 100% free.`,
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: itemListJsonLd(
            `Best ${cat.name} Subscriptions`,
            cat.description,
            categoryServices.map((s) => ({
              name: s.name,
              url: `/browse/${category}`,
              description: s.shortDescription,
            }))
          ),
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
          { name: "Browse", href: "/browse" },
          { name: cat.name, href: `/browse/${category}` },
        ]}
      />

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">
          Best {cat.name} Subscriptions {year}
        </h1>
        <p className="mt-3 max-w-3xl text-lg text-gray-600 dark:text-gray-400">
          {cat.description}
        </p>
      </div>

      {/* Service Grid */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryServices.map((service) => (
          <ServiceCard key={service.slug} service={service} />
        ))}
      </div>

      {/* Popular Comparisons in this Category */}
      {comparisons.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
            Popular {cat.name} Comparisons
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            See how these {cat.name.toLowerCase()} services stack up against each other
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {comparisons.map((comp) => {
              const a = getServiceBySlug(comp.slugA)
              const b = getServiceBySlug(comp.slugB)
              if (!a || !b) return null
              return (
                <Link
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    {a.name}
                  </span>
                  <RiArrowLeftRightLine className="size-4 shrink-0 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    {b.name}
                  </span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {/* FAQ Section */}
      <section className="mt-16">
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

      {/* Other Categories */}
      <RelatedLinks
        title="Browse Other Categories"
        links={otherCategories.map((c) => ({
          title: c.name,
          href: `/browse/${c.slug}`,
          description: c.description,
        }))}
      />

      <CTABanner
        title={`Track Your ${cat.name} Subscriptions`}
        description={`Never lose track of your ${cat.name.toLowerCase()} subscriptions again. Get renewal alerts, spending analytics, and more — 100% free.`}
      />
    </div>
  )
}
