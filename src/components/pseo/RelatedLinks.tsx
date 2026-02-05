import Link from "next/link"
import { RiArrowRightLine } from "@remixicon/react"

interface RelatedLink {
  title: string
  href: string
  description?: string
}

interface RelatedLinksProps {
  title?: string
  links: RelatedLink[]
}

export function RelatedLinks({
  title = "Related Pages",
  links,
}: RelatedLinksProps) {
  if (links.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
        {title}
      </h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-blue-200 hover:bg-blue-50/50 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-blue-900 dark:hover:bg-blue-900/10"
          >
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 dark:text-gray-50 dark:group-hover:text-blue-400">
                {link.title}
              </h3>
              {link.description && (
                <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
                  {link.description}
                </p>
              )}
            </div>
            <RiArrowRightLine className="mt-0.5 size-4 shrink-0 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-blue-500" />
          </Link>
        ))}
      </div>
    </section>
  )
}
