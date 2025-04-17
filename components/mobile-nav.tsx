"use client"

import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { SignOutButton } from "./auth/sign-out-button"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
    },
    {
      href: "/dashboard/invoices",
      label: "Invoices",
    },
    {
      href: "/dashboard/quotations",
      label: "Quotations",
    },
    {
      href: "/dashboard/clients",
      label: "Clients",
    },
    {
      href: "/dashboard/reports",
      label: "Reports",
    },
    {
      href: "/dashboard/feature-requests",
      label: "Feature Requests",
    },
    {
      href: "/dashboard/premium-features",
      label: "Premium Features",
    },
    {
      href: "/dashboard/stamp-manager",
      label: "Stamp Manager",
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="flex flex-col gap-4 py-4">
          <div className="px-4">
            <img src="/quotlyo_full_logo.png" alt="Quotlyo Logo" className="h-8 w-auto" />
          </div>
          <div className="flex flex-col gap-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === route.href ? "bg-accent text-accent-foreground" : "text-foreground",
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>
          <div className="mt-auto px-4">
            <SignOutButton variant="outline" className="w-full justify-start" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
