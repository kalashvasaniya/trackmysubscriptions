import { Metadata } from "next"
import Link from "next/link"
import { RiArrowLeftLine } from "@remixicon/react"
import { webPageJsonLd, breadcrumbJsonLd } from "@/lib/jsonld"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Read the terms and conditions for using TrackMySubscriptions. Understand your rights and responsibilities as a user of our free subscription tracking service.",
  alternates: {
    canonical: "https://trackmysubscriptions.com/terms",
  },
  openGraph: {
    title: "Terms of Service | TrackMySubscriptions",
    description:
      "Read the terms and conditions for using TrackMySubscriptions.",
    url: "https://trackmysubscriptions.com/terms",
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: webPageJsonLd({
            name: "Terms of Service",
            description:
              "Read the terms and conditions for using TrackMySubscriptions.",
            url: "/terms",
            dateModified: "2026-02-01",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Terms of Service", url: "/terms" },
          ]),
        }}
      />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-8"
        >
          <RiArrowLeftLine className="size-4" />
          Back to home
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Last updated: February 1, 2026
        </p>

        <div className="mt-10 space-y-8 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using TrackMySubscriptions, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              2. Description of Service
            </h2>
            <p>
              TrackMySubscriptions is a subscription management tool that helps you track, organize, and manage your recurring subscriptions. We provide tools to monitor payment dates, categorize subscriptions, and analyze spending patterns.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              3. User Accounts
            </h2>
            <p className="mb-4">
              To use our service, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the confidentiality of your account</li>
              <li>All activities that occur under your account</li>
              <li>Providing accurate and complete information</li>
              <li>Notifying us of any unauthorized use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Free Service
            </h2>
            <p className="mb-4">
              TrackMySubscriptions is completely free to use. By creating an account:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You receive full access to all features at no cost</li>
              <li>No credit card or payment information is required</li>
              <li>All features are included in the free tier</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Acceptable Use
            </h2>
            <p className="mb-4">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the service for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with or disrupt the service</li>
              <li>Share your account with others</li>
              <li>Reverse engineer or attempt to extract source code</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Data Usage and Communications
            </h2>
            <p className="mb-4">
              By creating an account and using TrackMySubscriptions, you grant us permission to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Collect, store, and process your personal data including email address and subscription information</li>
              <li>Use your data to improve our services, develop new features, and analyze usage patterns</li>
              <li>Send you transactional emails (payment reminders, account notifications, security alerts)</li>
              <li>Send you promotional emails, newsletters, product updates, and marketing communications</li>
              <li>Use aggregated and anonymized data for analytics, research, and public statistics</li>
              <li>Contact you about new features, special offers, and partnership opportunities</li>
            </ul>
            <p>
              You may opt out of marketing emails at any time through your account settings or by clicking the unsubscribe link in any email. Your use of the service is also governed by our{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline dark:text-blue-400">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Disclaimer of Warranties
            </h2>
            <p>
              The service is provided &ldquo;as is&rdquo; without warranties of any kind, either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Limitation of Liability
            </h2>
            <p>
              TrackMySubscriptions shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              9. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the service. Continued use after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              10. Contact
            </h2>
            <p>
              For questions about these Terms of Service, please contact us at{" "}
              <a href="mailto:kalashvasaniya@gmail.com" className="text-blue-600 hover:underline dark:text-blue-400">
                kalashvasaniya@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
