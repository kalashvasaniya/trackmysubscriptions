import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getServiceBySlug, getAllServiceSlugs, getServicesByCategory } from "@/data/pseo/services"
import { ServiceCard } from "@/components/pseo/ServiceCard"
import { PseoBreadcrumb } from "@/components/pseo/PseoBreadcrumb"
import { CTABanner } from "@/components/pseo/CTABanner"
import { RelatedLinks } from "@/components/pseo/RelatedLinks"
import { itemListJsonLd } from "@/lib/jsonld"

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return getAllServiceSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const s = getServiceBySlug(slug)
  if (!s) return {}
  const year = new Date().getFullYear()
  return {
    title: `Best ${s.name} Alternatives ${year} — Compare & Switch | TrackMySubscriptions`,
    description: `Looking for ${s.name} alternatives? Compare the best ${s.category} services with pricing, features, and honest reviews.`,
    alternates: { canonical: `https://trackmysubscriptions.com/alternatives/${slug}` },
    openGraph: { title: `Best ${s.name} Alternatives ${year}`, description: `Compare the best alternatives to ${s.name}`, url: `https://trackmysubscriptions.com/alternatives/${slug}`, images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `Best ${s.name} Alternatives` }] },
  }
}

export default async function AlternativesPage({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  const alternatives = getServicesByCategory(service.category).filter((s) => s.slug !== slug)
  const year = new Date().getFullYear()

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: itemListJsonLd(`${service.name} Alternatives`, `Best alternatives to ${service.name} in ${year}`, alternatives.map((s) => ({ name: s.name, url: `/services/${s.slug}`, description: s.shortDescription }))) }} />

      <PseoBreadcrumb items={[{ name: "Browse", href: "/browse" }, { name: service.name, href: `/services/${slug}` }, { name: "Alternatives", href: `/alternatives/${slug}` }]} />

      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">Best {service.name} Alternatives {year}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Looking to switch from {service.name}? Here are {alternatives.length} {service.category} alternatives to consider, with pricing and feature comparisons.
        </p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {alternatives.map((alt) => (
          <ServiceCard key={alt.slug} service={alt} />
        ))}
      </div>

      {alternatives.length === 0 && (
        <div className="mt-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">No alternatives found in the same category. Browse other categories for similar services.</p>
        </div>
      )}

      <RelatedLinks title="More Resources" links={[
        { title: `${service.name} Details`, href: `/services/${slug}`, description: `Full review and pricing for ${service.name}` },
        { title: `${service.name} Pricing`, href: `/pricing/${slug}`, description: `Detailed pricing breakdown` },
        { title: `Browse ${service.category}`, href: `/browse/${service.category}`, description: `All ${service.category} services` },
        { title: "Compare Services", href: "/compare", description: "Head-to-head service comparisons" },
      ]} />

      <CTABanner title="Track Your Subscription Switch" description={`Switching from ${service.name}? Track your new subscription alongside all others — get renewal alerts and spending insights.`} />
    </div>
  )
}
