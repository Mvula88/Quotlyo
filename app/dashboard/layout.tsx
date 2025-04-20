"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Sparkles, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Import the ThemeToggle component at the top of the file
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"
import { ScrollToTop } from "@/components/scroll-to-top"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { Settings, FileText, Home, Users, FileCheck, BarChart3, Lightbulb, Stamp } from "lucide-react"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { UserNav } from "@/components/user-nav"
// Import the GlobalAdBanner component at the top of the file:
import { GlobalAdBanner } from "@/components/global-ad-banner"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed: boolean
  links: {
    name: string
    href: string
    icon: React.ComponentType<{ className?: string }>
    isPremium?: boolean
    isAdmin?: boolean
  }[]
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Invoices",
      href: "/dashboard/invoices",
      icon: FileText,
    },
    {
      name: "Quotations",
      href: "/dashboard/quotations",
      icon: FileCheck,
    },
    {
      name: "Clients",
      href: "/dashboard/clients",
      icon: Users,
    },
    {
      name: "Reports",
      href: "/dashboard/reports",
      icon: BarChart3,
    },
    {
      name: "Feature Requests",
      href: "/dashboard/feature-requests",
      icon: Lightbulb,
    },
    {
      name: "Stamp Manager",
      href: "/dashboard/stamp-manager",
      icon: Stamp,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <>
      <GlobalAdBanner />
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <MobileNav />
          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/quotlyo_full_logo.png" alt="Quotlyo Logo" className="h-8 w-auto" />
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <ThemeToggle />
              <UserNav />
              <SignOutButton />
            </div>
          </div>
        </header>
        <div className="flex flex-1">
          <Sidebar links={links} className="hidden lg:block" />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
        <ScrollToTop />
      </div>
    </>
  )
}

function SidebarOld({ className, isCollapsed, links }: SidebarProps) {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-background",
        isCollapsed ? "w-[80px] items-center" : "w-[280px]",
        className,
      )}
    >
      <div className={cn("flex h-16 items-center border-b px-4", isCollapsed && "justify-center px-0")}>
        {isCollapsed ? (
          <Image src="/quotlyo_favicon.png" alt="Quotlyo Logo" width={40} height={40} />
        ) : (
          <div className="flex w-full items-center justify-between">
            <Image src="/quotlyo_full_logo.png" alt="Quotlyo Logo" width={160} height={48} className="h-auto" />
          </div>
        )}
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-2">
          <TooltipProvider delayDuration={0}>
            {links.map((link) => (
              <Tooltip key={link.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex h-10 items-center gap-2 rounded-md px-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      pathname === link.href && "bg-blue-600 text-white",
                      link.isAdmin && "mt-4 border-t pt-4",
                      isCollapsed && "h-10 w-10 justify-center p-0",
                    )}
                  >
                    <link.icon
                      className={cn(
                        "h-5 w-5",
                        pathname === link.href ? "text-white" : link.isPremium && "text-premium-600",
                        link.isAdmin && "text-red-500",
                      )}
                    />
                    {!isCollapsed && (
                      <span
                        className={cn(
                          pathname === link.href ? "text-white" : link.isPremium && "text-premium-600 font-medium",
                          link.isAdmin && "text-red-500 font-medium",
                        )}
                      >
                        {link.name}
                        {link.isPremium && <Sparkles className="ml-1 inline-block h-3 w-3 text-premium-600" />}
                      </span>
                    )}
                  </Link>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right">{link.name}</TooltipContent>}
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </ScrollArea>
    </aside>
  )
}

function MobileSidebarOld({ links, pathname, setIsMobileOpen }) {
  const { t } = useLanguage()

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-14 items-center justify-between border-b px-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileOpen(false)}>
          <Image src="/quotlyo_full_logo.png" alt="Quotlyo Logo" width={140} height={40} className="h-auto" />
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(false)}>
          <X className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-1 p-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex h-12 items-center gap-3 rounded-md px-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                pathname === link.href && "bg-blue-600 text-white",
                link.isAdmin && "mt-4 border-t pt-4",
              )}
            >
              <link.icon
                className={cn(
                  "h-5 w-5",
                  pathname === link.href ? "text-white" : link.isPremium && "text-premium-600",
                  link.isAdmin && "text-red-500",
                )}
              />
              <span
                className={cn(
                  pathname === link.href ? "text-white" : link.isPremium && "text-premium-600 font-medium",
                  link.isAdmin && "text-red-500 font-medium",
                )}
              >
                {link.name}
                {link.isPremium && <Sparkles className="ml-1 inline-block h-3 w-3 text-premium-600" />}
              </span>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
