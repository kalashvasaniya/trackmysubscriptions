import {
  RiAddLine,
  RiBellLine,
  RiPieChartLine,
} from "@remixicon/react"

const steps = [
  {
    step: "01",
    name: "Add Your Subscriptions",
    description:
      "Import via CSV or add subscriptions manually. Set billing cycles, amounts, and categories.",
    icon: RiAddLine,
  },
  {
    step: "02",
    name: "Get Smart Alerts",
    description:
      "Receive notifications before your subscriptions renew. Never be surprised by a charge again.",
    icon: RiBellLine,
  },
  {
    step: "03",
    name: "Track & Optimize",
    description:
      "View spending insights, identify unused subscriptions, and take control of your finances.",
    icon: RiPieChartLine,
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-gray-200 bg-gray-50 py-24 sm:py-32 dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400">
            How It Works
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Getting started is super easy
          </p>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Sign up for a free account and start tracking your recurring
            spending today.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-4xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.name} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-12 hidden h-0.5 w-full -translate-x-1/2 translate-y-4 bg-gradient-to-r from-blue-500 to-blue-300 md:block" />
                )}

                <div className="relative flex flex-col items-center text-center">
                  {/* Step number */}
                  <div className="relative z-10 flex size-24 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                    <step.icon className="size-10" />
                  </div>

                  <span className="mt-6 text-sm font-semibold text-blue-600 dark:text-blue-400">
                    Step {step.step}
                  </span>

                  <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
                    {step.name}
                  </h3>

                  <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
