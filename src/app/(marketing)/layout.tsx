import { Providers } from "@/components/Providers"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "../globals.css"
import { siteConfig } from "../siteConfig"
import { Navbar } from "@/components/landing/Navbar"
import { Footer } from "@/components/landing/Footer"

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})

const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://subtracker.app"),
  title: siteConfig.name,
  description: siteConfig.description,
  keywords: [
    "Subscription Tracker",
    "Manage Subscriptions",
    "Billing Management",
    "Expense Tracking",
  ],
  authors: [
    {
      name: "SubTracker",
      url: "https://subtracker.app",
    },
  ],
  creator: "SubTracker",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    creator: "@subtracker",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white antialiased dark:bg-gray-950`}
      >
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
