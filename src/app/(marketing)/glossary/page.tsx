import type { Metadata } from "next"
import Link from "next/link"
import { getTermsAlphabetical, glossaryTerms } from "@/data/pseo/glossary"
import { PseoBreadcrumb } from "@/components/pseo/PseoBreadcrumb"
import { CTABanner } from "@/components/pseo/CTABanner"
import { RelatedLinks } from "@/components/pseo/RelatedLinks"
import { definedTermSetJsonLd } from "@/lib/jsonld"
import { RiArrowRightLine } from "@remixicon/react"

export const metadata: Metadata = {
  title: "Subscription & SaaS Glossary — Key Terms Defined | TrackMySubscriptions",
  description:
    "Comprehensive glossary of subscription, SaaS, and recurring billing terminology. Learn what MRR, churn rate, ARR, and other key terms mean with clear definitions and examples.",
  alternates: {
    canonical: "https://trackmysubscriptions.com/glossary",
  },
  openGraph: {
    title: "Subscription & SaaS Glossary",
    description:
      "Learn key subscription and SaaS terms with clear definitions. From MRR to churn rate, understand the language of subscriptions.",
    url: "https://trackmysubscriptions.com/glossary",
  },
}

const categoryLabels: Record<string, string> = {
  billing: "Billing & Payments",
  metrics: "Business Metrics",
  management: "Subscription Management",
  finance: "Finance & Pricing",
  general: "General Concepts",
}

export default function GlossaryPage() {
  const sortedTerms = getTermsAlphabetical()
  const letters = Array.from(new Set(sortedTerms.map((t) => t.term.charAt(0).toUpperCase()))).sort()

  // Group by category
  const termsByCategory = Object.entries(categoryLabels).map(([key, label]) => ({
    key,
    label,
    terms: glossaryTerms.filter((t) => t.category === key),
  })).filter((g) => g.terms.length > 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: definedTermSetJsonLd(
            glossaryTerms.map((t) => ({
              name: t.term,
              url: `/glossary/${t.slug}`,
            }))
          ),
        }}
      />

      <PseoBreadcrumb items={[{ name: "Glossary", href: "/glossary" }]} />

      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">
          Subscription & SaaS Glossary
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          {glossaryTerms.length} key terms and concepts for understanding
          subscriptions, SaaS metrics, billing, and subscription management.
        </p>
      </div>

      {/* Alphabet Quick Nav */}
      <nav className="mt-8 flex flex-wrap justify-center gap-1.5">
        {letters.map((letter) => (
          <a
            key={letter}
            href={`#letter-${letter}`}
            className="flex size-9 items-center justify-center rounded-lg border border-gray-200 text-sm font-medium text-gray-700 transition-colors hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:text-gray-300 dark:hover:border-blue-800 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
          >
            {letter}
          </a>
        ))}
      </nav>

      {/* A-Z Term List */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
          All Terms A-Z
        </h2>
        <div className="mt-6 space-y-8">
          {letters.map((letter) => {
            const letterTerms = sortedTerms.filter(
              (t) => t.term.charAt(0).toUpperCase() === letter
            )
            return (
              <div key={letter} id={`letter-${letter}`}>
                <h3 className="sticky top-16 z-10 border-b border-gray-200 bg-white/95 py-2 text-lg font-bold text-blue-600 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95 dark:text-blue-400">
                  {letter}
                </h3>
                <ul className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
                  {letterTerms.map((term) => (
                    <li key={term.slug}>
                      <Link
                        href={`/glossary/${term.slug}`}
                        className="group flex items-start gap-3 py-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 dark:text-gray-50 dark:group-hover:text-blue-400">
                            {term.term}
                          </h4>
                          <p className="mt-0.5 line-clamp-1 text-sm text-gray-500 dark:text-gray-400">
                            {term.definition}
                          </p>
                        </div>
                        <RiArrowRightLine className="mt-1 size-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-500" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      {/* Browse by Category */}
      <section className="mt-16">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
          Browse by Category
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {termsByCategory.map((group) => (
            <div
              key={group.key}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                {group.label}
              </h3>
              <ul className="mt-3 space-y-1.5">
                {group.terms.map((term) => (
                  <li key={term.slug}>
                    <Link
                      href={`/glossary/${term.slug}`}
                      className="text-sm text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      {term.term}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <RelatedLinks
        title="Explore More"
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
            title: "Cost Calculator",
            href: "/tools/subscription-cost-calculator",
            description: "Calculate the true cost of your subscriptions",
          },
        ]}
      />

      <CTABanner
        title="Put These Terms Into Practice"
        description="Now that you understand subscription terminology, take control of your subscriptions with our free tracking tool."
      />
    </div>
  )
}
