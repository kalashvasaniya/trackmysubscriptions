import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import {
  getTermBySlug,
  getAllTermSlugs,
  getRelatedTerms,
  getTermsAlphabetical,
} from "@/data/pseo/glossary"
import { PseoBreadcrumb } from "@/components/pseo/PseoBreadcrumb"
import { CTABanner } from "@/components/pseo/CTABanner"
import { RelatedLinks } from "@/components/pseo/RelatedLinks"
import { definedTermJsonLd, faqPageJsonLd } from "@/lib/jsonld"
import { RiBookOpenLine, RiArrowRightLine, RiArrowLeftLine } from "@remixicon/react"

interface Props {
  params: Promise<{ term: string }>
}

export async function generateStaticParams() {
  return getAllTermSlugs().map((term) => ({ term }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { term } = await params
  const data = getTermBySlug(term)
  if (!data) return {}

  return {
    title: `What is ${data.term}? — Definition & Guide | TrackMySubscriptions`,
    description: `${data.definition} Learn everything about ${data.term.toLowerCase()} with our comprehensive guide.`,
    alternates: {
      canonical: `https://trackmysubscriptions.com/glossary/${term}`,
    },
    openGraph: {
      title: `What is ${data.term}? — Subscription Glossary`,
      description: data.definition,
      url: `https://trackmysubscriptions.com/glossary/${term}`,
    },
  }
}

const categoryLabels: Record<string, string> = {
  billing: "Billing & Payments",
  metrics: "Business Metrics",
  management: "Subscription Management",
  finance: "Finance & Pricing",
  general: "General Concepts",
}

export default async function TermPage({ params }: Props) {
  const { term: termSlug } = await params
  const term = getTermBySlug(termSlug)
  if (!term) notFound()

  const relatedTerms = getRelatedTerms(termSlug)
  const allTerms = getTermsAlphabetical()
  const currentIndex = allTerms.findIndex((t) => t.slug === termSlug)
  const prevTerm = currentIndex > 0 ? allTerms[currentIndex - 1] : null
  const nextTerm =
    currentIndex < allTerms.length - 1 ? allTerms[currentIndex + 1] : null

  const faqQuestions = [
    {
      question: `What is ${term.term}?`,
      answer: term.definition,
    },
    {
      question: `Why is ${term.term.toLowerCase()} important?`,
      answer: term.explanation.slice(0, 300) + "...",
    },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: definedTermJsonLd({
            name: term.term,
            description: term.definition,
            url: `/glossary/${termSlug}`,
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
          { name: "Glossary", href: "/glossary" },
          { name: term.term, href: `/glossary/${termSlug}` },
        ]}
      />

      <article>
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <RiBookOpenLine className="size-6" />
          </div>
          <div>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {categoryLabels[term.category] || term.category}
            </span>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">
              What is {term.term}?
            </h1>
          </div>
        </div>

        {/* Definition */}
        <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50/50 p-5 dark:border-blue-800/50 dark:bg-blue-900/10">
          <p className="text-sm font-medium uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Definition
          </p>
          <p className="mt-2 text-lg font-medium leading-relaxed text-gray-900 dark:text-gray-50">
            {term.definition}
          </p>
        </div>

        {/* Detailed Explanation */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
            Understanding {term.term}
          </h2>
          <div className="mt-4 space-y-4 text-base leading-relaxed text-gray-600 dark:text-gray-400">
            {term.explanation.split(". ").reduce<string[][]>((acc, sentence, i) => {
              const groupIndex = Math.floor(i / 3)
              if (!acc[groupIndex]) acc[groupIndex] = []
              acc[groupIndex].push(sentence)
              return acc
            }, []).map((group, i) => (
              <p key={i}>{group.join(". ")}{group[group.length - 1].endsWith(".") ? "" : "."}</p>
            ))}
          </div>
        </div>

        {/* Related Terms */}
        {relatedTerms.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
              Related Terms
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {relatedTerms.map((related) => (
                <Link
                  key={related.slug}
                  href={`/glossary/${related.slug}`}
                  className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
                >
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 dark:text-gray-50 dark:group-hover:text-blue-400">
                    {related.term}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {related.definition}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Prev / Next Navigation */}
        <nav className="mt-12 flex items-stretch gap-4">
          {prevTerm ? (
            <Link
              href={`/glossary/${prevTerm.slug}`}
              className="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 p-4 transition-colors hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
            >
              <RiArrowLeftLine className="size-4 shrink-0 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Previous</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {prevTerm.term}
                </p>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {nextTerm ? (
            <Link
              href={`/glossary/${nextTerm.slug}`}
              className="flex flex-1 items-center justify-end gap-2 rounded-lg border border-gray-200 p-4 text-right transition-colors hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
            >
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Next</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                  {nextTerm.term}
                </p>
              </div>
              <RiArrowRightLine className="size-4 shrink-0 text-gray-400" />
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      </article>

      <RelatedLinks
        title="Explore More"
        links={[
          {
            title: "Full Glossary",
            href: "/glossary",
            description: "Browse all subscription and SaaS terms",
          },
          {
            title: "Browse Services",
            href: "/browse",
            description: "Explore subscription services by category",
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
