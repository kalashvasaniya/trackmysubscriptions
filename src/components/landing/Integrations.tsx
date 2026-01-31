"use client"

import {
  RiSlackLine,
  RiNotification3Line,
  RiFlashlightLine,
  RiMailLine,
  RiCalendarLine,
  RiLinkLine,
} from "@remixicon/react"

const integrations = [
  {
    name: "Email",
    description: "Get email alerts directly to your inbox",
    icon: RiMailLine,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
  },
  {
    name: "Slack",
    description: "Receive alerts in your Slack channels",
    icon: RiSlackLine,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-500/10",
  },
  {
    name: "Pushover",
    description: "Push notifications on any device",
    icon: RiNotification3Line,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
  },
  {
    name: "Zapier",
    description: "Connect to 5000+ apps seamlessly",
    icon: RiFlashlightLine,
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-500/10",
  },
  {
    name: "Calendar",
    description: "Sync payments to your calendar",
    icon: RiCalendarLine,
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-500/10",
  },
  {
    name: "Webhooks",
    description: "Custom integrations via webhooks",
    icon: RiLinkLine,
    color: "from-gray-500 to-gray-600",
    bgColor: "bg-gray-500/10",
  },
]

export function Integrations() {
  return (
    <section className="relative border-y border-gray-200 bg-gradient-to-b from-gray-50 to-white py-24 sm:py-32 dark:border-gray-800 dark:from-gray-900 dark:to-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-cyan-50 px-4 py-1.5 text-sm font-medium text-cyan-700 dark:border-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400">
            <span className="size-1.5 rounded-full bg-cyan-500 animate-pulse" />
            Integrations
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
            Connect to{" "}
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              your favorite apps
            </span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            Get alerts where you want them. Email, Slack, Pushover, or any app through Zapier.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {integrations.map((integration) => (
            <div
              key={integration.name}
              className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className={`flex size-14 items-center justify-center rounded-xl ${integration.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                <integration.icon className={`size-7 bg-gradient-to-br ${integration.color} bg-clip-text`} style={{ color: 'transparent', backgroundClip: 'text', WebkitBackgroundClip: 'text' }} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">
                {integration.name}
              </h3>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                {integration.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
