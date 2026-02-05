import { Providers } from "@/components/Providers"
import { SidebarProvider, SidebarTrigger } from "@/components/Sidebar"
import { DashboardSidebar } from "@/components/ui/navigation/DashboardSidebar"
import { Breadcrumbs } from "@/components/ui/navigation/Breadcrumbs"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { siteConfig } from "../siteConfig"

export const metadata: Metadata = {
  title: {
    default: `Dashboard | ${siteConfig.name}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  robots: {
    index: false,
    follow: false,
  },
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.email) {
    redirect("/login")
  }

  const cookieStore = await cookies()
  // Default sidebar open; only closed when user explicitly set it to "false"
  const defaultOpen = cookieStore.get("sidebar:state")?.value !== "false"

  return (
    <div className="h-full min-h-screen bg-gray-50 dark:bg-gray-950">
      <Providers>
        <SidebarProvider defaultOpen={defaultOpen}>
          <DashboardSidebar />
          <div className="w-full">
            <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950">
              <SidebarTrigger className="-ml-1" />
              <div className="mr-2 h-4 w-px bg-gray-200 dark:bg-gray-800" />
              <Breadcrumbs />
            </header>
            <main className="min-h-[calc(100vh-4rem)]">
              <ErrorBoundary>{children}</ErrorBoundary>
            </main>
          </div>
        </SidebarProvider>
      </Providers>
    </div>
  )
}
