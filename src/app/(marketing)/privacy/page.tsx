import { Metadata } from "next"
import Link from "next/link"
import { RiArrowLeftLine } from "@remixicon/react"
import { webPageJsonLd, breadcrumbJsonLd } from "@/lib/jsonld"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how TrackMySubscriptions collects, uses, and protects your personal information. We are committed to safeguarding your data with bank-level security.",
  alternates: {
    canonical: "https://trackmysubscriptions.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy | TrackMySubscriptions",
    description:
      "Learn how TrackMySubscriptions collects, uses, and protects your personal information.",
    url: "https://trackmysubscriptions.com/privacy",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "TrackMySubscriptions — Privacy Policy" }],
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: webPageJsonLd({
            name: "Privacy Policy",
            description:
              "Learn how TrackMySubscriptions collects, uses, and protects your personal information.",
            url: "/privacy",
            dateModified: "2026-02-01",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd([
            { name: "Home", url: "/" },
            { name: "Privacy Policy", url: "/privacy" },
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
          Privacy Policy
        </h1>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Last updated: February 1, 2026
        </p>

        <div className="mt-10 space-y-8 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email address)</li>
              <li>Subscription data you choose to track</li>
              <li>Payment information for premium features</li>
              <li>Communications you send to us</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              2. How We Use Your Information
            </h2>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Send you notifications about upcoming payments</li>
              <li>Process transactions and send related information</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Send promotional emails, newsletters, and marketing communications</li>
              <li>Develop new products, services, and features</li>
              <li>Create aggregated statistics and insights for internal and public use</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              3. Email Communications
            </h2>
            <p className="mb-4">
              By creating an account, you consent to receive the following types of emails:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Transactional emails:</strong> Payment reminders, account notifications, security alerts, and service updates</li>
              <li><strong>Marketing emails:</strong> Product announcements, feature updates, tips and best practices</li>
              <li><strong>Promotional emails:</strong> Special offers, partner promotions, and newsletters</li>
            </ul>
            <p className="mt-4">
              You can unsubscribe from marketing and promotional emails at any time through your account settings or by clicking the unsubscribe link in any email. Transactional emails related to your account cannot be opted out of while your account is active.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              4. Data Security
            </h2>
            <p>
              We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. Your data is encrypted in transit and at rest.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              5. Data Retention
            </h2>
            <p>
              We retain your information for as long as your account is active or as needed to provide you services. You can request deletion of your account and associated data at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              6. Third-Party Services
            </h2>
            <p>
              We may use third-party services for authentication (Google OAuth), payment processing, and analytics. These services have their own privacy policies governing the use of your information.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              7. Your Rights
            </h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Delete your account and data</li>
              <li>Export your subscription data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              8. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at{" "}
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
