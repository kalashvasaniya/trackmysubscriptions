import { Providers } from "@/components/Providers"
import localFont from "next/font/local"
import "../globals.css"

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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
