import type { Metadata } from "next"
import { PseoBreadcrumb } from "@/components/pseo/PseoBreadcrumb"
import { CTABanner } from "@/components/pseo/CTABanner"
import { RelatedLinks } from "@/components/pseo/RelatedLinks"
import { CostCalculator } from "@/components/pseo/CostCalculator"
import { webApplicationJsonLd, faqPageJsonLd } from "@/lib/jsonld"

export const metadata: Metadata = {
  title:
    "Subscription Cost Calculator — Monthly to Yearly Converter | TrackMySubscriptions",
  description:
    "Free subscription cost calculator. Convert monthly to yearly costs, see 5 and 10-year projections, and discover how much your subscriptions really cost over time.",
  alternates: {
    canonical:
      "https://trackmysubscriptions.com/tools/subscription-cost-calculator",
  },
  openGraph: {
    title: "Free Subscription Cost Calculator",
    description:
      "Calculate the true long-term cost of your subscriptions. Convert between billing cycles and see 5-10 year projections.",
    url: "https://trackmysubscriptions.com/tools/subscription-cost-calculator",
  },
}

const faqQuestions = [
  {
    question: "How do I calculate my total subscription spending?",
    answer:
      "Enter each subscription amount and its billing cycle (weekly, monthly, quarterly, or yearly) into the calculator. It will normalize everything to a comparable period so you can see your true total across all billing frequencies.",
  },
  {
    question: "Is it cheaper to pay monthly or yearly for subscriptions?",
    answer:
      "Annual (yearly) billing is almost always cheaper, typically saving 15-20% compared to monthly pricing. However, you pay more upfront and may lose money if you cancel early. The calculator shows you the exact difference.",
  },
  {
    question: "How much does the average person spend on subscriptions?",
    answer:
      "Studies show the average American spends $200-300 per month on subscriptions, though most people estimate they spend about 40% less than they actually do. Using a subscription tracker helps reveal your true spending.",
  },
  {
    question: "What is the best way to reduce subscription costs?",
    answer:
      "Start with a subscription audit: list all subscriptions, cancel unused ones, downgrade underused plans, switch to annual billing for keepers, and look for bundle deals. TrackMySubscriptions makes this process easy and ongoing.",
  },
]

export default function SubscriptionCostCalculatorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: webApplicationJsonLd({
            name: "Subscription Cost Calculator",
            description:
              "Free tool to calculate the true long-term cost of your subscriptions across different billing cycles.",
            url: "/tools/subscription-cost-calculator",
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
          { name: "Tools", href: "/tools" },
          {
            name: "Cost Calculator",
            href: "/tools/subscription-cost-calculator",
          },
        ]}
      />

      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-gray-50">
          Subscription Cost Calculator
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          Calculate the true cost of your subscriptions. Convert between billing
          cycles and see how small recurring charges add up over 5 and 10 years.
        </p>
      </div>

      <div className="mt-10">
        <CostCalculator />
      </div>

      {/* How to Use */}
      <section className="mt-16">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
          How to Use This Calculator
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            {
              step: "1",
              title: "Enter Amount",
              description:
                "Type in the subscription price you pay each billing period.",
            },
            {
              step: "2",
              title: "Select Billing Cycle",
              description:
                "Choose whether you pay weekly, monthly, quarterly, or yearly.",
            },
            {
              step: "3",
              title: "See Results",
              description:
                "Instantly see the cost converted to all billing frequencies plus long-term projections.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                {item.step}
              </div>
              <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-50">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
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

      <RelatedLinks
        title="More Resources"
        links={[
          {
            title: "Browse Subscription Services",
            href: "/browse",
            description: "Compare pricing across popular subscription services",
          },
          {
            title: "Subscription Glossary",
            href: "/glossary",
            description: "Learn key subscription and billing terms",
          },
          {
            title: "Compare Services",
            href: "/compare",
            description: "Head-to-head subscription comparisons",
          },
        ]}
      />

      <CTABanner
        title="Track All Your Subscriptions Automatically"
        description="Go beyond calculating — track every subscription with smart alerts, spending analytics, and renewal reminders."
      />
    </div>
  )
}
