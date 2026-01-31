"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const routeLabels: Record<string, string> = {
  dashboard: "Dashboard",
  subscriptions: "Subscriptions",
  calendar: "Calendar",
  analytics: "Analytics",
  settings: "Settings",
  folders: "Folders",
  tags: "Tags",
  "payment-methods": "Payment Methods",
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)

  return (
    <nav aria-label="Breadcrumb" className="ml-2">
      <ol role="list" className="flex items-center space-x-3 text-sm">
        <li className="flex">
          <Link
            href="/dashboard"
            className="text-gray-500 transition hover:text-gray-700 dark:text-gray-400 hover:dark:text-gray-300"
          >
            Home
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join("/")}`
          const isLast = index === segments.length - 1
          const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)

          return (
            <li key={segment} className="flex items-center">
              <ChevronRight
                className="mr-3 size-4 shrink-0 text-gray-600 dark:text-gray-400"
                aria-hidden="true"
              />
              <Link
                href={href}
                aria-current={isLast ? "page" : undefined}
                className={
                  isLast
                    ? "text-gray-900 dark:text-gray-50"
                    : "text-gray-500 transition hover:text-gray-700 dark:text-gray-400 hover:dark:text-gray-300"
                }
              >
                {label}
              </Link>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
