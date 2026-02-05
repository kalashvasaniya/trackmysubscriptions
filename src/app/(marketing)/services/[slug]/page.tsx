import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getServiceBySlug, getAllServiceSlugs, getServicesByCategory, getStartingPrice } from "@/data/pseo/services"
import { getComparisonsForService } from "@/data/pseo/comparisons"
import { PseoBreadcrumb } from "@/components/pseo/PseoBreadcrumb"
import { CTABanner } from "@/components/pseo/CTABanner"
import { RelatedLinks } from "@/components/pseo/RelatedLinks"
import { productJsonLd, faqPageJsonLd } from "@/lib/jsonld"
import { RiExternalLinkLine, RiArrowLeftRightLine, RiCheckLine } from "@remixicon/react"

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
    title: `${s.name} — Subscription Review & Pricing ${year} | TrackMySubscriptions`,
    description: `${s.shortDescription}. See ${s.name} pricing plans, features, and alternatives. Track your ${s.name} subscription free.`,
    alternates: { canonical: `https://trackmysubscriptions.com/services/${slug}` },
    openGraph: { title: `${s.name} — Review & Pricing ${year}`, description: s.shortDescription, url: `https://trackmysubscriptions.com/services/${slug}`, images: [{ url: "/og-image.png", width: 1200, height: 630, alt: `${s.name} Review & Pricing` }] },
  }
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  const startPrice = getStartingPrice(service)
  const hasFree = service.pricing.some((p) => p.monthlyPrice === 0)
  const related = getServicesByCategory(service.category).filter((s) => s.slug !== slug).slice(0, 6)
  const comparisons = getComparisonsForService(slug).slice(0, 8)
  const year = new Date().getFullYear()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productJsonLd({ name: service.name, description: service.description, url: service.website, category: service.category, price: startPrice, currency: "USD" }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqPageJsonLd([
        { question: `How much does ${service.name} cost?`, answer: hasFree ? `${service.name} offers a free plan. Paid plans start from $${startPrice}/month.` : `${service.name} plans start from $${startPrice}/month with ${service.pricing.length} plan options available.` },
        { question: `Is ${service.name} worth it in ${year}?`, answer: `${service.name} offers ${service.features.slice(0, 3).join(", ")}. It's a strong choice in the ${service.category} category. Track your subscription with TrackMySubscriptions to ensure you're getting value.` },
      ]) }} />

      <PseoBreadcrumb items={[{ name: "Browse", href: "/browse" }, { name: service.category.charAt(0).toUpperCase() + service.category.slice(1), href: `/browse/${service.category}` }, { name: service.name, href: `/services/${slug}` }]} />

      <div className="flex items-start gap-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">{service.name.charAt(0)}</div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl dark:text-gray-50">{service.name}</h1>
          <p className="mt-1 text-lg text-gray-600 dark:text-gray-400">{service.shortDescription}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Link href={`/browse/${service.category}`} className="rounded-full bg-blue-50 px-3 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">{service.category}</Link>
            {hasFree && <span className="rounded-full bg-green-50 px-3 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">Free plan</span>}
            <a href={service.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">Visit site <RiExternalLinkLine className="size-3" /></a>
          </div>
        </div>
      </div>

      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">About {service.name}</h2>
        <p className="mt-3 leading-relaxed text-gray-600 dark:text-gray-400">{service.description}</p>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500 dark:text-gray-400">Founded</span><p className="font-medium text-gray-900 dark:text-gray-50">{service.yearFounded}</p></div>
          <div><span className="text-gray-500 dark:text-gray-400">Headquarters</span><p className="font-medium text-gray-900 dark:text-gray-50">{service.headquarters}</p></div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{service.name} Pricing</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {service.pricing.map((plan) => (
            <div key={plan.plan} className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <h3 className="font-medium text-gray-900 dark:text-gray-50">{plan.plan}</h3>
              <div className="mt-1">{plan.monthlyPrice === 0 ? <span className="text-lg font-bold text-green-600 dark:text-green-400">Free</span> : plan.monthlyPrice ? <span className="text-lg font-bold text-gray-900 dark:text-gray-50">${plan.monthlyPrice}<span className="text-sm font-normal text-gray-500">/mo</span></span> : <span className="text-sm text-gray-500">Contact for pricing</span>}</div>
              {plan.yearlyPrice && <p className="mt-0.5 text-xs text-gray-500">${plan.yearlyPrice}/year</p>}
            </div>
          ))}
        </div>
        <p className="mt-3 text-center text-sm"><Link href={`/pricing/${slug}`} className="text-blue-600 hover:underline dark:text-blue-400">View detailed pricing breakdown →</Link></p>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Key Features</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {service.features.map((f) => (<div key={f} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-900"><RiCheckLine className="size-4 text-green-500" /><span className="text-sm text-gray-700 dark:text-gray-300">{f}</span></div>))}
        </div>
      </section>

      {comparisons.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Compare {service.name}</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {comparisons.map((c) => {
              const other = c.slugA === slug ? getServiceBySlug(c.slugB) : getServiceBySlug(c.slugA)
              if (!other) return null
              return (<Link key={c.slug} href={`/compare/${c.slug}`} className="flex items-center gap-2 rounded-lg border border-gray-200 p-3 text-sm hover:border-blue-200 hover:bg-blue-50/50 dark:border-gray-800 dark:hover:border-blue-800 dark:hover:bg-blue-900/10"><span className="font-medium text-gray-900 dark:text-gray-50">{service.name}</span><RiArrowLeftRightLine className="size-3.5 text-gray-400" /><span className="font-medium text-gray-900 dark:text-gray-50">{other.name}</span></Link>)
            })}
          </div>
        </section>
      )}

      <RelatedLinks title={`Similar ${service.category.charAt(0).toUpperCase() + service.category.slice(1)} Services`} links={related.map((s) => ({ title: s.name, href: `/services/${s.slug}`, description: s.shortDescription }))} />
      <RelatedLinks title="More Resources" links={[{ title: `${service.name} Alternatives`, href: `/alternatives/${slug}`, description: `Explore alternatives to ${service.name}` }, { title: `${service.name} Pricing`, href: `/pricing/${slug}`, description: `Detailed pricing breakdown for ${service.name}` }, { title: `Browse ${service.category}`, href: `/browse/${service.category}`, description: `All ${service.category} services` }]} />
      <CTABanner title={`Track Your ${service.name} Subscription`} description={`Never miss a ${service.name} renewal. Track it alongside all your other subscriptions — free.`} />
    </div>
  )
}
