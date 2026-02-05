import { CTA } from "@/components/landing/CTA"
import { Features } from "@/components/landing/Features"
import { Hero } from "@/components/landing/Hero"
import { HowItWorks } from "@/components/landing/HowItWorks"
import { Stats } from "@/components/landing/Stats"
// import { Testimonials } from "@/components/landing/Testimonials"
import {
  organizationJsonLd,
  webSiteJsonLd,
  softwareApplicationJsonLd,
  faqPageJsonLd,
} from "@/lib/jsonld"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title:
    "TrackMySubscriptions — Free Subscription Tracker & Billing Manager (2026)",
  description:
    "Track all your subscriptions in one place for free. Get payment alerts, spending analytics, calendar view, and smart insights. Never miss a charge or forget an unused subscription again.",
  keywords: [
    "subscription tracker",
    "subscription manager",
    "track subscriptions",
    "billing tracker",
    "recurring payment tracker",
    "subscription spending",
    "cancel unused subscriptions",
    "free subscription tracker",
    "manage subscriptions",
    "subscription reminder",
    "subscription alerts",
    "subscription calendar",
  ],
  alternates: {
    canonical: "https://trackmysubscriptions.com",
  },
  openGraph: {
    title: "TrackMySubscriptions — Free Subscription Tracker & Billing Manager",
    description:
      "Track all subscriptions in one place. Get payment alerts, spending analytics, and insights to save money. 100% free.",
    url: "https://trackmysubscriptions.com",
    type: "website",
    images: [
      {
        url: "https://trackmysubscriptions.com/logo.png",
        width: 512,
        height: 512,
        alt: "TrackMySubscriptions — Subscription Tracker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrackMySubscriptions — Free Subscription Tracker",
    description:
      "Track all subscriptions in one place. Payment alerts, spending analytics, and smart insights. 100% free.",
    images: ["https://trackmysubscriptions.com/logo.png"],
    creator: "@trackmysubs",
  },
}

const homepageFaq = [
  {
    question: "Is TrackMySubscriptions really free?",
    answer:
      "Yes, TrackMySubscriptions is 100% free to use. All features including subscription tracking, payment alerts, spending analytics, calendar view, and CSV export are included at no cost.",
  },
  {
    question: "How does TrackMySubscriptions help me save money?",
    answer:
      "TrackMySubscriptions helps you save money by giving you a clear overview of all your recurring charges, alerting you before payments, identifying unused subscriptions you can cancel, and providing spending analytics to find optimization opportunities.",
  },
  {
    question: "What subscriptions can I track?",
    answer:
      "You can track any recurring subscription or payment — streaming services like Netflix and Spotify, software tools, gym memberships, cloud services, news subscriptions, and more. If it has a recurring charge, you can track it.",
  },
  {
    question: "Is my subscription data secure?",
    answer:
      "Yes, your data is protected with bank-level encryption. We never share your data with third parties. All connections are secured with HTTPS and data is encrypted at rest.",
  },
  {
    question: "Can I import my existing subscriptions?",
    answer:
      "Yes, TrackMySubscriptions supports CSV import so you can quickly add all your existing subscriptions. You can also export your data anytime.",
  },
]

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: organizationJsonLd() }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: webSiteJsonLd() }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: softwareApplicationJsonLd() }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: faqPageJsonLd(homepageFaq) }}
      />
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      {/* Testimonials – Loved by thousands, Sarah/James/Emily quotes, 4.9 rating, 98% recommend */}
      {/* <Testimonials /> */}
      <CTA />

      {/* Hidden FAQ section for SEO — visible to crawlers */}
      <section className="sr-only" aria-label="Frequently Asked Questions">
        <h2>Frequently Asked Questions</h2>
        {homepageFaq.map((faq) => (
          <div key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </div>
        ))}
      </section>
    </>
  )
}
