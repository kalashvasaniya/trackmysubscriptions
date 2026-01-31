import { Providers } from "@/components/Providers"
import { SidebarProvider, SidebarTrigger } from "@/components/Sidebar"
import { DashboardSidebar } from "@/components/ui/navigation/DashboardSidebar"
import { Breadcrumbs } from "@/components/ui/navigation/Breadcrumbs"
import type { Metadata } from "next"
import localFont from "next/font/local"
import { cookies } from "next/headers"
import "../globals.css"
import { siteConfig } from "../siteConfig"

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
  metadataBase: new URL("https://trackmysubscriptions.com"),
  title: `Dashboard | ${siteConfig.name}`,
  description: siteConfig.description,
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full bg-gray-50 antialiased dark:bg-gray-950`}
      >
        <Providers>
          <SidebarProvider defaultOpen={defaultOpen}>
            <DashboardSidebar />
            <div className="w-full">
              <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950">
                <SidebarTrigger className="-ml-1" />
                <div className="mr-2 h-4 w-px bg-gray-200 dark:bg-gray-800" />
                <Breadcrumbs />
              </header>
              <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            </div>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  )
}
