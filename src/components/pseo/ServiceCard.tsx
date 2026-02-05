import Link from "next/link"
import { RiArrowRightUpLine, RiExternalLinkLine } from "@remixicon/react"
import { type SubscriptionService, getStartingPrice } from "@/data/pseo/services"

interface ServiceCardProps {
  service: SubscriptionService
  showCategory?: boolean
}

export function ServiceCard({ service, showCategory = false }: ServiceCardProps) {
  const startPrice = getStartingPrice(service)
  const hasFree = service.pricing.some((p) => p.monthlyPrice === 0)

  return (
    <div className="group relative flex flex-col rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-sm font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
          {service.name.charAt(0)}
        </div>
        {showCategory && (
          <Link
            href={`/browse/${service.category}`}
            className="shrink-0 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50"
          >
            {service.category}
          </Link>
        )}
      </div>
      <h3 className="mt-3 text-base font-semibold text-gray-900 dark:text-gray-50">
        {service.name}
      </h3>
      <p className="mt-1 line-clamp-2 flex-1 text-sm text-gray-500 dark:text-gray-400">
        {service.shortDescription}
      </p>
      <div className="mt-3 flex items-center gap-2">
        {hasFree && (
          <span className="rounded-md bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
            Free plan
          </span>
        )}
        {startPrice !== null && startPrice > 0 && (
          <span className="text-sm font-medium text-gray-900 dark:text-gray-50">
            From ${startPrice}/mo
          </span>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {service.features.slice(0, 3).map((feature) => (
          <span
            key={feature}
            className="rounded-md bg-gray-50 px-2 py-0.5 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-400"
          >
            {feature}
          </span>
        ))}
        {service.features.length > 3 && (
          <span className="rounded-md bg-gray-50 px-2 py-0.5 text-xs text-gray-500 dark:bg-gray-800 dark:text-gray-400">
            +{service.features.length - 3} more
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center gap-3 border-t border-gray-100 pt-3 dark:border-gray-800">
        <a
          href={service.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
        >
          Visit site <RiExternalLinkLine className="size-3" />
        </a>
        <Link
          href={`/browse/${service.category}`}
          className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          More in {service.category} <RiArrowRightUpLine className="size-3" />
        </Link>
      </div>
    </div>
  )
}
