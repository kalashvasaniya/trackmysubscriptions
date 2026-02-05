"use client"

import { Button } from "@/components/Button"
import { Logo } from "@/components/Logo"
import { cx } from "@/lib/utils"
import useScroll from "@/lib/useScroll"
import { RiMenuLine, RiCloseLine, RiArrowRightLine } from "@remixicon/react"
import Link from "next/link"
import { useState } from "react"

const navigation = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Browse", href: "/browse" },
  { name: "Compare", href: "/compare" },
  { name: "Tools", href: "/tools" },
]

export function Navbar() {
  const scrolled = useScroll(50)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-gray-200/80 bg-white/90 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/90"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
          <div className="flex size-8 sm:size-9 items-center justify-center rounded-lg sm:rounded-xl bg-gray-900 dark:bg-white transition-transform group-hover:scale-105">
            <Logo className="size-4 sm:size-5 text-white dark:text-gray-900" />
          </div>
          <span className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-white">
            TrackMySubscriptions
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-600 rounded-lg transition-colors hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">
              Get Started
              <RiArrowRightLine className="size-3.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="flex size-9 sm:size-10 items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <RiCloseLine className="size-5 text-gray-900 dark:text-white" />
          ) : (
            <RiMenuLine className="size-5 text-gray-900 dark:text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute inset-x-0 top-full border-t border-gray-200/80 bg-white/95 backdrop-blur-xl px-4 py-4 sm:py-6 md:hidden dark:border-gray-800 dark:bg-gray-950/95">
          <div className="flex flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2.5 sm:py-3 text-sm sm:text-base font-medium text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 sm:gap-3 pt-4 sm:pt-6 mt-2 sm:mt-4 border-t border-gray-200 dark:border-gray-800">
              <Button variant="secondary" asChild className="justify-center">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild className="justify-center">
                <Link href="/register">
                  Get Started
                  <RiArrowRightLine className="ml-1.5 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
