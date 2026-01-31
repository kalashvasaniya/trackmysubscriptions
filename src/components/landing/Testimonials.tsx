"use client"

import { RiStarFill, RiDoubleQuotesL } from "@remixicon/react"

const testimonials = [
  {
    content: "SubTracker has saved me over $200/month by helping me identify subscriptions I forgot I had. The alerts are a game-changer!",
    author: "Sarah M.",
    role: "Freelance Designer",
    avatar: "SM",
    color: "from-pink-500 to-rose-600",
  },
  {
    content: "Finally, a simple way to track all my subscriptions. The calendar view is incredibly helpful for planning my monthly budget.",
    author: "James K.",
    role: "Software Engineer",
    avatar: "JK",
    color: "from-blue-500 to-indigo-600",
  },
  {
    content: "I was paying for 3 different streaming services I didn't even use. SubTracker helped me cut my expenses significantly.",
    author: "Emily R.",
    role: "Marketing Manager",
    avatar: "ER",
    color: "from-emerald-500 to-teal-600",
  },
  {
    content: "The CSV import feature made it so easy to get started. I had all my subscriptions organized in minutes!",
    author: "Michael T.",
    role: "Small Business Owner",
    avatar: "MT",
    color: "from-amber-500 to-orange-600",
  },
  {
    content: "Best subscription tracker I've used. Clean interface, powerful features, and the Slack integration is perfect for my workflow.",
    author: "Lisa P.",
    role: "Product Manager",
    avatar: "LP",
    color: "from-purple-500 to-pink-600",
  },
  {
    content: "The analytics dashboard gives me great insights into my spending patterns. Highly recommend for anyone with multiple subscriptions.",
    author: "David W.",
    role: "Data Analyst",
    avatar: "DW",
    color: "from-cyan-500 to-blue-600",
  },
]

export function Testimonials() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full bg-amber-100/50 blur-3xl dark:bg-amber-900/20" />
        <div className="absolute right-0 bottom-1/4 h-[500px] w-[500px] rounded-full bg-rose-100/50 blur-3xl dark:bg-rose-900/20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-sm font-medium text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
            <span className="size-1.5 rounded-full bg-amber-500 animate-pulse" />
            Testimonials
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl dark:text-white">
            Loved by{" "}
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              thousands
            </span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
            See what our users have to say about SubTracker.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Quote icon */}
              <RiDoubleQuotesL className="absolute right-4 top-4 size-8 text-gray-100 dark:text-gray-800" />
              
              {/* Stars */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <RiStarFill key={i} className="size-4 text-amber-400" />
                ))}
              </div>

              {/* Content */}
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div className={`flex size-10 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} text-sm font-bold text-white`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
