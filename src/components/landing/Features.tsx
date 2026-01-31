import {
  RiBellLine,
  RiCalendarLine,
  RiFileExcelLine,
  RiFolderLine,
  RiGiftLine,
  RiListCheck2,
} from "@remixicon/react"

const features = [
  {
    name: "CSV Import & Export",
    description:
      "Update your subscriptions in bulk and take your own backups with the CSV import/export function.",
    icon: RiFileExcelLine,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "Track Everything",
    description:
      "Use SubTracker to set up alerts for everything: warranties, rent, gym memberships, loans, and more.",
    icon: RiListCheck2,
    color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  },
  {
    name: "Lifetime Deal Tracking",
    description:
      "Keep track of FREE trials, never miss a refund date, and see how much you've saved by having a lifetime deal!",
    icon: RiGiftLine,
    color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  },
  {
    name: "Organized For You",
    description:
      "With folders, tags, and payment methods, you can organize and filter all your subscriptions for easy management.",
    icon: RiFolderLine,
    color: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  {
    name: "Smart Alerts",
    description:
      "Customize your alerts, cancel BEFORE your next charge, and even send alerts to someone else.",
    icon: RiBellLine,
    color: "bg-red-500/10 text-red-600 dark:text-red-400",
  },
  {
    name: "Calendar View",
    description:
      "See exactly when payments are due. Full month or list view to identify expensive months.",
    icon: RiCalendarLine,
    color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-blue-600 dark:text-blue-400">
            Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
            Simple to Set Up, Easy to Manage
          </p>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Everything you need to take control of your subscriptions, automatic
            for your convenience.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="group relative rounded-2xl border border-gray-200 bg-white p-6 transition hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
              >
                <div
                  className={`inline-flex rounded-lg p-3 ${feature.color}`}
                >
                  <feature.icon className="size-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
