import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { getServiceBySlug, getAllServiceSlugs, getStartingPrice } from "@/data/pseo/services"
import { PseoBreadcrumb } from "@/components/pseo/PseoBreadcrumb"
import { CTABanner } from "@/components/pseo/CTABanner"
import { RelatedLinks } from "@/components/pseo/RelatedLinks"
import { productJsonLd, faqPageJsonLd } from "@/lib/jsonld"
import { RiCheckLine } from "@remixicon/react"

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
    title: `${s.name} Pricing ${year} — Plans & Costs | TrackMySubscriptions`,
    description: `${s.name} pricing breakdown for ${year}. Compare all ${s.pricing.length} plans with monthly and yearly costs, features per tier, and savings tips.`,
    alternates: { canonical: `https://trackmysubscriptions.com/pricing/${slug}` },
    openGraph: { title: `${s.name} Pricing ${year}`, description: `Detailed pricing for all ${s.name} plans`, url: `https://trackmysubscriptions.com/pricing/${slug}` },
  }
}

export default async function PricingPage({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  const startPrice = getStartingPrice(service)
  const year = new Date().getFullYear()

  const costPerYear = service.pricing.map((p) => {
    const yearly = p.yearlyPrice || (p.monthlyPrice ? p.monthlyPrice * 12 : null)
    const fiveYear = yearly ? yearly * 5 : null
    return { ...p, yearly, fiveYear }
  })

  const annualSavings = service.pricing
    .filter((p) => p.monthlyPrice && p.yearlyPrice)
    .map((p) => {
      const monthlyAnnualized = p.monthlyPrice! * 12
      const saving = monthlyAnnualized - p.yearlyPrice!
      const pct = ((saving / monthlyAnnualized) * 100).toFixed(0)
      return { plan: p.plan, saving: saving.toFixed(2), pct }
    })

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: productJsonLd({ name: service.name, description: `${service.name} pricing and plans`, url: service.website, category: service.category, price: startPrice, currency: "USD" }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqPageJsonLd([
        { question: `How much does ${service.name} cost per month?`, answer: service.pricing.some((p) => p.monthlyPrice === 0) ? `${service.name} offers a free plan. Paid plans start at $${startPrice}/month.` : `${service.name} starts at $${startPrice}/month.` },
        { question: `Does ${service.name} offer annual billing?`, answer: service.pricing.some((p) => p.yearlyPrice) ? `Yes, ${service.name} offers annual billing with savings of up to ${annualSavings[0]?.pct || "15"}% compared to monthly pricing.` : `${service.name} currently offers monthly billing.` },
        { question: `Is there a free plan for ${service.name}?`, answer: service.pricing.some((p) => p.monthlyPrice === 0) ? `Yes, ${service.name} offers a free tier with basic features.` : `${service.name} does not currently offer a free plan, but may offer a free trial.` },
      ]) }} />

      <PseoBreadcrumb items={[{ name: "Browse", href: "/browse" }, { name: service.name, href: `/services/${slug}` }, { name: "Pricing", href: `/pricing/${slug}` }]} />

      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">{service.name} Pricing {year}</h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Complete pricing breakdown for {service.name}. Compare all {service.pricing.length} plan{service.pricing.length > 1 ? "s" : ""} with costs and features.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {service.pricing.map((plan, i) => (
          <div key={plan.plan} className={`rounded-xl border p-5 ${i === Math.min(1, service.pricing.length - 1) ? "border-blue-300 bg-blue-50/30 ring-1 ring-blue-200 dark:border-blue-700 dark:bg-blue-900/10 dark:ring-blue-800" : "border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"}`}>
            {i === Math.min(1, service.pricing.length - 1) && <span className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">Most Popular</span>}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">{plan.plan}</h3>
            <div className="mt-2">
              {plan.monthlyPrice === 0 ? (
                <span className="text-3xl font-bold text-green-600 dark:text-green-400">Free</span>
              ) : plan.monthlyPrice ? (
                <><span className="text-3xl font-bold text-gray-900 dark:text-gray-50">${plan.monthlyPrice}</span><span className="text-gray-500 dark:text-gray-400">/month</span></>
              ) : (
                <span className="text-lg text-gray-500 dark:text-gray-400">Contact sales</span>
              )}
            </div>
            {plan.yearlyPrice && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">${plan.yearlyPrice}/year {plan.monthlyPrice ? `($${(plan.yearlyPrice / 12).toFixed(2)}/mo)` : ""}</p>}
          </div>
        ))}
      </div>

      {/* Annual Savings */}
      {annualSavings.length > 0 && (
        <section className="mt-8 rounded-xl border border-green-200 bg-green-50/50 p-5 dark:border-green-800/50 dark:bg-green-900/10">
          <h2 className="font-semibold text-green-800 dark:text-green-200">Annual Billing Savings</h2>
          <div className="mt-3 space-y-2">
            {annualSavings.map((s) => (
              <div key={s.plan} className="flex items-center justify-between text-sm">
                <span className="text-green-700 dark:text-green-300">{s.plan}</span>
                <span className="font-medium text-green-800 dark:text-green-200">Save ${s.saving}/year ({s.pct}% off)</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Long-term Costs */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Long-Term Cost Breakdown</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-200 dark:border-gray-800"><th className="py-2 pr-4 text-left text-gray-500 dark:text-gray-400">Plan</th><th className="px-4 py-2 text-right text-gray-500 dark:text-gray-400">Monthly</th><th className="px-4 py-2 text-right text-gray-500 dark:text-gray-400">Yearly</th><th className="px-4 py-2 text-right text-gray-500 dark:text-gray-400">5 Years</th></tr></thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {costPerYear.map((p) => (
                <tr key={p.plan}><td className="py-2 pr-4 font-medium text-gray-900 dark:text-gray-50">{p.plan}</td><td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">{p.monthlyPrice === 0 ? "Free" : p.monthlyPrice ? `$${p.monthlyPrice}` : "—"}</td><td className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">{p.yearly === 0 ? "Free" : p.yearly ? `$${p.yearly.toFixed(2)}` : "—"}</td><td className="px-4 py-2 text-right font-medium text-gray-900 dark:text-gray-50">{p.fiveYear === 0 ? "Free" : p.fiveYear ? `$${p.fiveYear.toFixed(2)}` : "—"}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Features */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">What You Get</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {service.features.map((f) => (<div key={f} className="flex items-center gap-2"><RiCheckLine className="size-4 text-green-500" /><span className="text-sm text-gray-700 dark:text-gray-300">{f}</span></div>))}
        </div>
      </section>

      <RelatedLinks title="More Resources" links={[
        { title: `${service.name} Overview`, href: `/services/${slug}`, description: `Full review of ${service.name}` },
        { title: `${service.name} Alternatives`, href: `/alternatives/${slug}`, description: `Compare alternatives to ${service.name}` },
        { title: "Cost Calculator", href: "/tools/subscription-cost-calculator", description: "Calculate total subscription costs" },
      ]} />
      <CTABanner title={`Track Your ${service.name} Costs`} description={`Add ${service.name} to your subscription tracker. Get renewal alerts and see how it fits your total spending.`} />
    </div>
  )
}
