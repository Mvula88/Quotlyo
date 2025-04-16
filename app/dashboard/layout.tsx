"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  FileText,
  Home,
  Menu,
  Sparkles,
  Stamp,
  Users,
  X,
  Share2,
  Shield,
  Lightbulb,
  CreditCard,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Import the ThemeToggle component at the top of the file
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"

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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()

  // Check if the screen is mobile
  useEffect(() => {
    const checkScreenSize = () => {
      setIsCollapsed(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  const links = [
    {
      name: t("nav.dashboard"),
      href: "/dashboard",
      icon: Home,
    },
    {
      name: t("nav.invoices"),
      href: "/dashboard/invoices",
      icon: FileText,
    },
    {
      name: t("nav.quotations"),
      href: "/dashboard/quotations",
      icon: FileText,
    },
    {
      name: t("nav.clients"),
      href: "/dashboard/clients",
      icon: Users,
    },
    {
      name: t("nav.stampManager"),
      href: "/dashboard/stamp-manager",
      icon: Stamp,
    },
    {
      name: t("nav.premiumFeatures"),
      href: "/dashboard/premium-features",
      icon: Sparkles,
      isPremium: true,
    },
    {
      name: t("nav.reports"),
      href: "/dashboard/reports",
      icon: BarChart3,
    },
    {
      name: t("nav.referralProgram"),
      href: "/dashboard/referral-program",
      icon: Share2,
    },
    {
      name: t("nav.featureRequests"),
      href: "/dashboard/feature-requests",
      icon: Lightbulb,
    },
    {
      name: t("nav.adminDashboard"),
      href: "/admin",
      icon: Shield,
      isAdmin: true,
    },
    {
      name: t("nav.paymentSettings"),
      href: "/dashboard/settings/payment-gateways",
      icon: CreditCard,
    },
  ]

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex-1 items-start">
        <Sidebar isCollapsed={isCollapsed} links={links} className="fixed top-0 z-30 hidden h-screen lg:flex" />

        {/* Desktop header - Added this new section */}
        <div className="fixed top-4 right-4 z-40 hidden lg:flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>

        {/* Mobile header */}
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 lg:hidden">
          <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <MobileSidebar links={links} pathname={pathname} setIsMobileOpen={setIsMobileOpen} />
            </SheetContent>
          </Sheet>
          <div className="flex items-center justify-center flex-1">
            <Image src="/quotlyo_favicon.png" alt="Quotlyo Logo" width={30} height={30} className="mr-2" />
            <span className="font-semibold">{t("app.name")}</span>
          </div>
          <div className="flex items-center gap-1">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>

        <main className={cn("flex-1 transition-all", isCollapsed ? "lg:pl-[80px]" : "lg:pl-[280px]")}>{children}</main>
      </div>
    </div>
  )
}

function Sidebar({ className, isCollapsed, links }: SidebarProps) {
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

function MobileSidebar({ links, pathname, setIsMobileOpen }) {
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
