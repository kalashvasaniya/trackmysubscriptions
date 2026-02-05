import type { Metadata } from "next"
import Link from "next/link"
import { RiHome4Line, RiSearchLine } from "@remixicon/react"

export const metadata: Metadata = {
  title: "Page Not Found | TrackMySubscriptions",
  description:
    "The page you are looking for does not exist or has been moved. Return to TrackMySubscriptions to track your subscriptions.",
  robots: {
    index: false,
    follow: true,
  },
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 dark:bg-gray-950">
      <div className="mx-auto max-w-md text-center">
        {/* 404 Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400">
          <span className="size-2 rounded-full bg-red-500" />
          Error 404
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
          Page not found
        </h1>
        <p className="mt-4 text-base text-gray-500 dark:text-gray-400">
          Sorry, the page you are looking for doesn&apos;t exist or has been
          moved. Let&apos;s get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            <RiHome4Line className="size-4" />
            Go to Homepage
          </Link>
          <Link
            href="/browse"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <RiSearchLine className="size-4" />
            Browse Services
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-800">
          <p className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
            Popular pages
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { name: "Dashboard", href: "/dashboard" },
              { name: "Compare Services", href: "/compare" },
              { name: "Glossary", href: "/glossary" },
              { name: "Tools", href: "/tools" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 dark:border-gray-800 dark:text-gray-400 dark:hover:border-gray-700 dark:hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
