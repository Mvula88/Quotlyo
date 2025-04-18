"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, FileText, Home, Settings, Users, FileCheck, Stamp, Lightbulb } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Dashboard",
    },
    {
      href: "/dashboard/invoices",
      icon: FileText,
      label: "Invoices",
    },
    {
      href: "/dashboard/quotations",
      icon: FileCheck,
      label: "Quotations",
    },
    {
      href: "/dashboard/clients",
      icon: Users,
      label: "Clients",
    },
    {
      href: "/dashboard/reports",
      icon: BarChart3,
      label: "Reports",
    },
    {
      href: "/dashboard/feature-requests",
      icon: Lightbulb,
      label: "Feature Requests",
    },
    {
      href: "/dashboard/stamp-manager",
      icon: Stamp,
      label: "Stamp Manager",
    },
    {
      href: "/dashboard/settings",
      icon: Settings,
      label: "Settings",
    },
  ]

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground",
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
