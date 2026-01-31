"use client"

import { Button } from "@/components/Button"
import { cx } from "@/lib/utils"
import useScroll from "@/lib/useScroll"
import { RiMenuLine, RiCloseLine } from "@remixicon/react"
import Link from "next/link"
import { useState } from "react"
import { Logo } from "@/components/Logo"

const navigation = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Pricing", href: "#pricing" },
]

export function Navbar() {
  const scrolled = useScroll(50)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 transition-all duration-200",
        scrolled
          ? "border-b border-gray-200 bg-white/80 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-950/80"
          : "bg-transparent",
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-md bg-blue-500 p-1.5">
            <Logo className="size-6 text-white" />
          </span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            SubTracker
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get Started Free</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <RiCloseLine className="size-6 text-gray-900 dark:text-white" />
          ) : (
            <RiMenuLine className="size-6 text-gray-900 dark:text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-4 md:hidden dark:border-gray-800 dark:bg-gray-950">
          <div className="flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-600 dark:text-gray-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4">
              <Button variant="secondary" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
