import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getPersonaBySlug, getAllPersonaSlugs, personas } from "@/data/pseo/personas"
import { getCategoryBySlug } from "@/data/pseo/services"
import { PseoBreadcrumb } from "@/components/pseo/PseoBreadcrumb"
import { CTABanner } from "@/components/pseo/CTABanner"
import { RelatedLinks } from "@/components/pseo/RelatedLinks"
import { faqPageJsonLd, webApplicationJsonLd } from "@/lib/jsonld"
import {
  RiCheckLine,
  RiAlertLine,
  RiBarChart2Line,
  RiArrowRightLine,
} from "@remixicon/react"

interface Props {
  params: Promise<{ persona: string }>
}

export async function generateStaticParams() {
  return getAllPersonaSlugs().map((persona) => ({ persona }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { persona } = await params
  const data = getPersonaBySlug(persona)
  if (!data) return {}

  const year = new Date().getFullYear()
  return {
    title: `Subscription Tracker for ${data.name} ${year} — Free | TrackMySubscriptions`,
    description: `${data.description.slice(0, 155)}...`,
    alternates: {
      canonical: `https://trackmysubscriptions.com/for/${persona}`,
    },
    openGraph: {
      title: `${data.headline}`,
      description: data.subheadline,
      url: `https://trackmysubscriptions.com/for/${persona}`,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `TrackMySubscriptions for ${data.name}` }],
    },
  }
}

export default async function PersonaPage({ params }: Props) {
  const { persona: personaSlug } = await params
  const persona = getPersonaBySlug(personaSlug)
  if (!persona) notFound()

  const otherPersonas = personas.filter((p) => p.slug !== personaSlug)
  const relevantCategories = persona.relevantCategories
    .map((slug) => getCategoryBySlug(slug))
    .filter(Boolean)

  const faqQuestions = [
    {
      question: `Is TrackMySubscriptions really free for ${persona.name.toLowerCase()}?`,
      answer: `Yes! TrackMySubscriptions is 100% free with no premium tier, no credit card required, and no hidden costs. ${persona.name} can track unlimited subscriptions completely free.`,
    },
    {
      question: `How does TrackMySubscriptions help ${persona.name.toLowerCase()}?`,
      answer: `TrackMySubscriptions helps ${persona.name.toLowerCase()} by ${persona.keyFeatures.map((f) => f.description.toLowerCase()).slice(0, 2).join(" and ")}. It addresses key pain points like ${persona.painPoints[0].toLowerCase()}.`,
    },
    {
      question: `How do I get started as ${persona.name.toLowerCase().startsWith("a") || persona.name.toLowerCase().startsWith("e") || persona.name.toLowerCase().startsWith("i") || persona.name.toLowerCase().startsWith("o") || persona.name.toLowerCase().startsWith("u") ? "an" : "a"} ${persona.name.toLowerCase().endsWith("s") ? persona.name.toLowerCase().slice(0, -1) : persona.name.toLowerCase()}?`,
      answer: `Simply sign up for a free account at TrackMySubscriptions, add your subscriptions manually or import via CSV, and you are all set. It takes less than 2 minutes to get started.`,
    },
  ]

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: webApplicationJsonLd({
            name: `TrackMySubscriptions for ${persona.name}`,
            description: persona.description,
            url: `/for/${personaSlug}`,
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
          { name: persona.name, href: `/for/${personaSlug}` },
        ]}
      />

      {/* Hero */}
      <section className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-gray-50">
          {persona.headline}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          {persona.subheadline}
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
          >
            {persona.cta}
            <RiArrowRightLine className="size-4" />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {persona.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-5 text-center dark:border-gray-800 dark:bg-gray-900"
            >
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      <section className="mt-12 rounded-xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
          {persona.description}
        </p>
      </section>

      {/* Pain Points */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
          Common Challenges for {persona.name}
        </h2>
        <div className="mt-5 space-y-3">
          {persona.painPoints.map((point) => (
            <div
              key={point}
              className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800/30 dark:bg-amber-900/10"
            >
              <RiAlertLine className="mt-0.5 size-5 shrink-0 text-amber-500" />
              <p className="text-sm text-gray-700 dark:text-gray-300">{point}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
          How TrackMySubscriptions Helps
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {persona.keyFeatures.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center gap-2">
                <RiCheckLine className="size-5 text-green-500" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                  {feature.title}
                </h3>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Relevant Categories */}
      {relevantCategories.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
            Popular Categories for {persona.name}
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relevantCategories.map((cat) =>
              cat ? (
                <Link
                  key={cat.slug}
                  href={`/browse/${cat.slug}`}
                  className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-800"
                >
                  <RiBarChart2Line className="size-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-gray-50 dark:group-hover:text-blue-400">
                      {cat.name}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                      {cat.description}
                    </p>
                  </div>
                  <RiArrowRightLine className="size-4 text-gray-400 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : null
            )}
          </div>
        </section>
      )}

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

      {/* Other Personas */}
      <RelatedLinks
        title={`TrackMySubscriptions for Others`}
        links={otherPersonas.map((p) => ({
          title: `For ${p.name}`,
          href: `/for/${p.slug}`,
          description: p.subheadline,
        }))}
      />

      <CTABanner title={persona.cta} />
    </div>
  )
}
