"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FileText, Home, Menu, Settings, Shield, Users, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/utils/supabase/client"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageSelector } from "@/components/language-selector"
import { useLanguage } from "@/contexts/language-context"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()
  const supabase = createClient()

  const links = [
    {
      name: t("nav.dashboard"),
      href: "/admin",
      icon: Home,
    },
    {
      name: t("nav.adminDashboard"),
      href: "/admin/users",
      icon: Users,
    },
    {
      name: t("nav.invoices"),
      href: "/admin/invoices",
      icon: FileText,
    },
    {
      name: t("nav.reports"),
      href: "/admin/reports",
      icon: BarChart3,
    },
    {
      name: t("settings.title"),
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  return (
    <div className="flex min-h-screen w-full flex-col">
      <div className="flex-1 items-start">
        <Sidebar links={links} className="fixed top-0 z-30 hidden h-screen lg:flex" />

        {/* Desktop header */}
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
            <Shield className="h-5 w-5 mr-2 text-red-500" />
            <span className="font-semibold">{t("nav.adminDashboard")}</span>
          </div>
          <div className="flex items-center gap-1">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>

        <main className="lg:pl-[280px]">{children}</main>
      </div>
    </div>
  )
}

function Sidebar({ className, links }: { className?: string; links: any[] }) {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <aside className={cn("flex w-[280px] flex-col border-r bg-background", className)}>
      <div className="flex h-16 items-center border-b px-4">
        <div className="flex w-full items-center gap-2">
          <Shield className="h-6 w-6 text-red-500" />
          <span className="font-semibold text-lg">{t("nav.adminDashboard")}</span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 p-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex h-10 items-center gap-2 rounded-md px-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                pathname === link.href && "bg-red-600 text-white",
              )}
            >
              <link.icon className={cn("h-5 w-5", pathname === link.href && "text-white")} />
              <span className={cn(pathname === link.href && "text-white")}>{link.name}</span>
            </Link>
          ))}
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
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-red-500" />
          <span className="font-semibold">{t("nav.adminDashboard")}</span>
        </div>
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
                pathname === link.href && "bg-red-600 text-white",
              )}
            >
              <link.icon className={cn("h-5 w-5", pathname === link.href && "text-white")} />
              <span className={cn(pathname === link.href && "text-white")}>{link.name}</span>
            </Link>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
