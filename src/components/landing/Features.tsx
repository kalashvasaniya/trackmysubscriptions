"use client"

import {
  RiBellLine,
  RiCalendarLine,
  RiFileExcelLine,
  RiFolderLine,
  RiGiftLine,
  RiListCheck2,
  RiLineChartLine,
  RiShieldCheckLine,
} from "@remixicon/react"

const features = [
  {
    name: "CSV Import & Export",
    description:
      "Import your subscriptions in bulk via CSV or export your data anytime for backup and analysis.",
    icon: RiFileExcelLine,
    color: "from-emerald-500 to-teal-600",
    bgColor: "bg-emerald-500/10",
    textColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    name: "Track Everything",
    description:
      "From streaming services to gym memberships, warranties to loans — track all your recurring expenses.",
    icon: RiListCheck2,
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-500/10",
    textColor: "text-blue-600 dark:text-blue-400",
  },
  {
    name: "Lifetime Deal Tracking",
    description:
      "Keep track of lifetime deals, see how much you've saved, and never miss a refund window.",
    icon: RiGiftLine,
    color: "from-purple-500 to-pink-600",
    bgColor: "bg-purple-500/10",
    textColor: "text-purple-600 dark:text-purple-400",
  },
  {
    name: "Smart Organization",
    description:
      "Organize with folders, tags, and payment methods. Filter and find any subscription instantly.",
    icon: RiFolderLine,
    color: "from-orange-500 to-amber-600",
    bgColor: "bg-orange-500/10",
    textColor: "text-orange-600 dark:text-orange-400",
  },
  {
    name: "Intelligent Alerts",
    description:
      "Get notified before renewals via email. Customize timing and never be surprised by a charge.",
    icon: RiBellLine,
    color: "from-red-500 to-rose-600",
    bgColor: "bg-red-500/10",
    textColor: "text-red-600 dark:text-red-400",
  },
  {
    name: "Calendar View",
    description:
      "Visualize your payments on a beautiful calendar. Identify expensive months at a glance.",
    icon: RiCalendarLine,
    color: "from-cyan-500 to-blue-600",
    bgColor: "bg-cyan-500/10",
    textColor: "text-cyan-600 dark:text-cyan-400",
  },
  {
    name: "Detailed Analytics",
    description:
      "Get insights into your spending patterns, category breakdowns, and month-over-month trends.",
    icon: RiLineChartLine,
    color: "from-indigo-500 to-purple-600",
    bgColor: "bg-indigo-500/10",
    textColor: "text-indigo-600 dark:text-indigo-400",
  },
  {
    name: "Secure & Private",
    description:
      "Your data is encrypted and secure. We never share your information with third parties.",
    icon: RiShieldCheckLine,
    color: "from-gray-500 to-gray-600",
    bgColor: "bg-gray-500/10",
    textColor: "text-gray-600 dark:text-gray-400",
  },
]

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-900/20" />
        <div className="absolute right-1/4 bottom-0 h-[500px] w-[500px] rounded-full bg-purple-100/50 blur-3xl dark:bg-purple-900/20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
            <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
            Features
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              take control
            </span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Simple to set up, powerful to use. All the tools you need to manage your subscriptions effortlessly.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className="group relative rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-5`} />
                
                <div className={`relative inline-flex rounded-xl p-3 ${feature.bgColor}`}>
                  <feature.icon className={`size-6 ${feature.textColor}`} />
                </div>
                
                <h3 className="relative mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                  {feature.name}
                </h3>
                
                <p className="relative mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
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
