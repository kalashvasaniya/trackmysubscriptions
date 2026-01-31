"use client"
import { Divider } from "@/components/Divider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarLink,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/Sidebar"
import { siteConfig } from "@/app/siteConfig"
import {
  RiDashboardLine,
  RiFileListLine,
  RiCalendarLine,
  RiPieChartLine,
  RiSettings4Line,
  RiFolderLine,
  RiPriceTag3Line,
  RiBankCardLine,
} from "@remixicon/react"
import { usePathname } from "next/navigation"
import * as React from "react"
import { Logo } from "@/components/Logo"
import { UserProfile } from "./UserProfile"

const mainNavigation = [
  {
    name: "Dashboard",
    href: siteConfig.baseLinks.dashboard,
    icon: RiDashboardLine,
  },
  {
    name: "Subscriptions",
    href: siteConfig.baseLinks.subscriptions,
    icon: RiFileListLine,
  },
  {
    name: "Calendar",
    href: siteConfig.baseLinks.calendar,
    icon: RiCalendarLine,
  },
  {
    name: "Analytics",
    href: siteConfig.baseLinks.analytics,
    icon: RiPieChartLine,
  },
]

const organizationNavigation = [
  {
    name: "Folders",
    href: "/folders",
    icon: RiFolderLine,
  },
  {
    name: "Tags",
    href: "/tags",
    icon: RiPriceTag3Line,
  },
  {
    name: "Payment Methods",
    href: "/payment-methods",
    icon: RiBankCardLine,
  },
]

const settingsNavigation = [
  {
    name: "Settings",
    href: siteConfig.baseLinks.settings,
    icon: RiSettings4Line,
  },
]

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard"
    }
    return pathname.startsWith(href)
  }

  return (
    <Sidebar {...props} className="bg-gray-50 dark:bg-gray-925">
      <SidebarHeader className="px-3 py-4">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-blue-500 p-1.5 shadow-sm">
            <Logo className="size-6 text-white" />
          </span>
          <div>
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-50">
              SubTracker
            </span>
            <span className="block text-xs text-gray-600 dark:text-gray-400">
              Subscription Manager
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarLink
                    href={item.href}
                    isActive={isActive(item.href)}
                    icon={item.icon}
                  >
                    {item.name}
                  </SidebarLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="px-3">
          <Divider className="my-0 py-0" />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-500">
              Organization
            </p>
            <SidebarMenu className="space-y-1">
              {organizationNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarLink
                    href={item.href}
                    isActive={isActive(item.href)}
                    icon={item.icon}
                  >
                    {item.name}
                  </SidebarLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="px-3">
          <Divider className="my-0 py-0" />
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {settingsNavigation.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarLink
                    href={item.href}
                    isActive={isActive(item.href)}
                    icon={item.icon}
                  >
                    {item.name}
                  </SidebarLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="border-t border-gray-200 dark:border-gray-800" />
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  )
}
