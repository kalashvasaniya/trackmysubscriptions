import { type SubscriptionService, getStartingPrice } from "@/data/pseo/services"
import { RiCheckLine, RiCloseLine } from "@remixicon/react"

interface ComparisonTableProps {
  serviceA: SubscriptionService
  serviceB: SubscriptionService
}

export function ComparisonTable({ serviceA, serviceB }: ComparisonTableProps) {
  const allFeatures = Array.from(
    new Set([...serviceA.features, ...serviceB.features])
  )

  const startA = getStartingPrice(serviceA)
  const startB = getStartingPrice(serviceB)
  const hasFreeA = serviceA.pricing.some((p) => p.monthlyPrice === 0)
  const hasFreeB = serviceB.pricing.some((p) => p.monthlyPrice === 0)

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800">
            <th className="py-3 pr-4 text-left font-medium text-gray-500 dark:text-gray-400">
              Feature
            </th>
            <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-gray-50">
              {serviceA.name}
            </th>
            <th className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-gray-50">
              {serviceB.name}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {/* Pricing row */}
          <tr className="bg-gray-50/50 dark:bg-gray-900/50">
            <td className="py-3 pr-4 font-medium text-gray-900 dark:text-gray-50">
              Starting Price
            </td>
            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
              {hasFreeA ? (
                <span className="font-medium text-green-600 dark:text-green-400">Free</span>
              ) : startA ? (
                `$${startA}/mo`
              ) : (
                "Contact sales"
              )}
            </td>
            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
              {hasFreeB ? (
                <span className="font-medium text-green-600 dark:text-green-400">Free</span>
              ) : startB ? (
                `$${startB}/mo`
              ) : (
                "Contact sales"
              )}
            </td>
          </tr>
          {/* Plans count */}
          <tr>
            <td className="py-3 pr-4 font-medium text-gray-900 dark:text-gray-50">
              Plans Available
            </td>
            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
              {serviceA.pricing.length}
            </td>
            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
              {serviceB.pricing.length}
            </td>
          </tr>
          {/* Founded */}
          <tr className="bg-gray-50/50 dark:bg-gray-900/50">
            <td className="py-3 pr-4 font-medium text-gray-900 dark:text-gray-50">
              Year Founded
            </td>
            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
              {serviceA.yearFounded}
            </td>
            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
              {serviceB.yearFounded}
            </td>
          </tr>
          {/* HQ */}
          <tr>
            <td className="py-3 pr-4 font-medium text-gray-900 dark:text-gray-50">
              Headquarters
            </td>
            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
              {serviceA.headquarters}
            </td>
            <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">
              {serviceB.headquarters}
            </td>
          </tr>
          {/* Feature comparison */}
          {allFeatures.map((feature, i) => (
            <tr
              key={feature}
              className={i % 2 === 0 ? "bg-gray-50/50 dark:bg-gray-900/50" : ""}
            >
              <td className="py-3 pr-4 text-gray-700 dark:text-gray-300">
                {feature}
              </td>
              <td className="px-4 py-3 text-center">
                {serviceA.features.includes(feature) ? (
                  <RiCheckLine className="mx-auto size-5 text-green-500" />
                ) : (
                  <RiCloseLine className="mx-auto size-5 text-gray-300 dark:text-gray-600" />
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {serviceB.features.includes(feature) ? (
                  <RiCheckLine className="mx-auto size-5 text-green-500" />
                ) : (
                  <RiCloseLine className="mx-auto size-5 text-gray-300 dark:text-gray-600" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Pricing comparison sub-component ─────────────────────────────────

export function PricingComparison({
  serviceA,
  serviceB,
}: ComparisonTableProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {[serviceA, serviceB].map((service) => (
        <div
          key={service.slug}
          className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            {service.name} Pricing
          </h3>
          <div className="mt-4 space-y-3">
            {service.pricing.map((plan) => (
              <div
                key={plan.plan}
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {plan.plan}
                </span>
                <div className="text-right">
                  {plan.monthlyPrice === 0 ? (
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                      Free
                    </span>
                  ) : plan.monthlyPrice ? (
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                      ${plan.monthlyPrice}/mo
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Varies
                    </span>
                  )}
                  {plan.yearlyPrice && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ${plan.yearlyPrice}/yr
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
