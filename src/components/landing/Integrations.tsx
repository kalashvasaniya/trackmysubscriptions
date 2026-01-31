import {
  RiSlackLine,
  RiNotification3Line,
  RiFlashlightLine,
} from "@remixicon/react"

const integrations = [
  {
    name: "Slack",
    description: "Get alerts directly in your Slack channels",
    icon: RiSlackLine,
  },
  {
    name: "Pushover",
    description: "Receive push notifications on any device",
    icon: RiNotification3Line,
  },
  {
    name: "Zapier",
    description: "Connect to 5000+ apps with Zapier automation",
    icon: RiFlashlightLine,
  },
]

export function Integrations() {
  return (
    <section className="border-y border-gray-200 bg-gray-50 py-24 sm:py-32 dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400">
            Integrations
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Connect to all your other apps
          </p>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Don&apos;t want an email alert? No worries, you can send alerts to
            Slack, Pushover, or any other app you choose through Zapier.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-gray-950"
            >
              <div className="flex size-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                <integration.icon className="size-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {integration.name}
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {integration.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
