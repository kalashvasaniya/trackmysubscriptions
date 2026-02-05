import Link from "next/link"
import { RiArrowRightSLine, RiHome4Line } from "@remixicon/react"
import { breadcrumbJsonLd } from "@/lib/jsonld"

interface BreadcrumbItem {
  name: string
  href: string
}

export function PseoBreadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const allItems = [{ name: "Home", href: "/" }, ...items]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: breadcrumbJsonLd(
            allItems.map((item) => ({ name: item.name, url: item.href }))
          ),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          {allItems.map((item, i) => (
            <li key={item.href} className="flex items-center gap-1">
              {i > 0 && (
                <RiArrowRightSLine className="size-4 shrink-0 text-gray-400 dark:text-gray-500" />
              )}
              {i === 0 && (
                <RiHome4Line className="mr-0.5 size-3.5 shrink-0" />
              )}
              {i === allItems.length - 1 ? (
                <span className="font-medium text-gray-900 dark:text-gray-50">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-gray-900 dark:hover:text-gray-50"
                >
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
