"use client"

import { useEffect, useState, useRef } from "react"
import { RiStarFill, RiDoubleQuotesL } from "@remixicon/react"

const testimonials = [
  {
    content: "TrackMySubscriptions has saved me over $200/month by helping me identify subscriptions I forgot I had.",
    author: "Sarah Mitchell",
    role: "Freelance Designer",
    avatar: "SM",
    rating: 5,
  },
  {
    content: "Finally, a simple way to track all my subscriptions. The calendar view is incredibly helpful.",
    author: "James Kim",
    role: "Software Engineer",
    avatar: "JK",
    rating: 5,
  },
  {
    content: "TrackMySubscriptions helped me cut my expenses significantly. I was paying for services I didn't use.",
    author: "Emily Roberts",
    role: "Marketing Manager",
    avatar: "ER",
    rating: 5,
  },
]

export function Testimonials() {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-16 sm:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <div ref={ref} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-gray-200 bg-white px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm dark:border-gray-800 dark:bg-gray-950">
            <RiStarFill className="size-3.5 sm:size-4 text-amber-400" />
            <span className="font-medium text-gray-900 dark:text-white">4.9/5 from 2,000+ reviews</span>
          </div>
          <h2 className="mt-4 sm:mt-6 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Loved by
            <span className="text-gray-400 dark:text-gray-500"> thousands</span>
          </h2>
          <p className="mt-4 sm:mt-6 text-base sm:text-lg text-gray-500 dark:text-gray-400">
            See what our users have to say about TrackMySubscriptions.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-10 sm:mt-16 lg:mt-20 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 transition-all duration-500 hover:border-gray-300 hover:shadow-lg sm:hover:shadow-xl dark:border-gray-800 dark:bg-gray-950 dark:hover:border-gray-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              {/* Quote decoration */}
              <RiDoubleQuotesL className="absolute -right-2 -top-2 size-16 sm:size-20 text-gray-100 transition-transform duration-500 group-hover:scale-110 dark:text-gray-800" />
              
              {/* Stars */}
              <div className="relative flex gap-0.5">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <RiStarFill 
                    key={i} 
                    className="size-3.5 sm:size-4 text-amber-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p className="relative mt-3 sm:mt-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="relative mt-4 sm:mt-6 flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-800">
                <div className="flex size-10 sm:size-12 items-center justify-center rounded-full bg-gray-900 text-xs sm:text-sm font-bold text-white dark:bg-white dark:text-gray-900">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Hover line */}
              <div className="absolute bottom-0 left-0 h-0.5 sm:h-1 w-0 bg-gray-900 transition-all duration-700 group-hover:w-full dark:bg-white" />
            </div>
          ))}
        </div>

        {/* Bottom stats */}
        <div 
          className={`mt-10 sm:mt-12 lg:mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-8 lg:gap-12 transition-all duration-700 delay-500 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">4.9</p>
            <p className="text-xs sm:text-sm text-gray-500">Average rating</p>
          </div>
          <div className="h-8 sm:h-12 w-px bg-gray-200 dark:bg-gray-800" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">2,000+</p>
            <p className="text-xs sm:text-sm text-gray-500">Reviews</p>
          </div>
          <div className="h-8 sm:h-12 w-px bg-gray-200 dark:bg-gray-800" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">98%</p>
            <p className="text-xs sm:text-sm text-gray-500">Would recommend</p>
          </div>
        </div>
      </div>
    </section>
  )
}
