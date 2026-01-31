"use client"

import Link from "next/link"
import { Logo } from "@/components/Logo"
import { RiTwitterXLine, RiGithubLine, RiLinkedinLine, RiHeartFill } from "@remixicon/react"

const navigation = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "How It Works", href: "#how-it-works" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Contact", href: "mailto:kalashvasaniya@gmail.com" },
    { name: "Status", href: "#" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Refund Policy", href: "/terms#refund" },
  ],
}

const social = [
  { name: "Twitter", href: "https://x.com/kalashbuilds", icon: RiTwitterXLine },
  { name: "GitHub", href: "https://github.com/kalashvasaniya", icon: RiGithubLine },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/kalashvasaniya/", icon: RiLinkedinLine },
]

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-10 sm:py-12 lg:py-16 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
              <div className="flex size-8 sm:size-10 items-center justify-center rounded-lg sm:rounded-xl bg-gray-900 transition-transform group-hover:scale-105 dark:bg-white">
                <Logo className="size-4 sm:size-5 text-white dark:text-gray-900" />
              </div>
              <span className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white">
                TrackMySubscriptions
              </span>
            </Link>
            <p className="mt-3 sm:mt-4 max-w-xs text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Track all your subscriptions in one place. Never miss a payment or forget about unused services again.
            </p>
            {/* Social links */}
            <div className="mt-4 sm:mt-6 flex gap-2 sm:gap-3">
              {social.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex size-8 sm:size-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-all hover:border-gray-300 hover:text-gray-900 dark:border-gray-800 dark:hover:border-gray-700 dark:hover:text-white"
                >
                  <item.icon className="size-4 sm:size-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation columns */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Product</h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-xs sm:text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Company</h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-xs sm:text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Support</h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-xs sm:text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white">Legal</h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-xs sm:text-sm text-gray-500 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 sm:mt-12 lg:mt-16 flex flex-col items-center justify-between gap-3 sm:gap-4 border-t border-gray-200 pt-6 sm:pt-8 sm:flex-row dark:border-gray-800">
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} TrackMySubscriptions. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Made with <RiHeartFill className="size-3.5 sm:size-4 text-red-500 animate-pulse" /> for subscription sanity
          </p>
        </div>
      </div>
    </footer>
  )
}
