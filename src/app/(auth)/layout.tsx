import { Providers } from "@/components/Providers"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "../globals.css"
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Sign In | TrackMySubscriptions",
  description: "Sign in to manage your subscriptions",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

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

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-full items-center justify-center bg-gray-50 antialiased dark:bg-gray-950`}
      >
        <Providers>
          <ErrorBoundary>{children}</ErrorBoundary>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
