"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const pathname = usePathname()

  // Don't show header on login and signup pages
  if (pathname === "/login" || pathname === "/sign-up") {
    return null
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-xl font-bold">
            Quotlyo
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className={`text-sm ${pathname === "/dashboard" ? "font-medium" : ""}`}>
              Dashboard
            </Link>
            <Link
              href="/dashboard/invoices"
              className={`text-sm ${pathname.includes("/invoices") ? "font-medium" : ""}`}
            >
              Invoices
            </Link>
            <Link href="/dashboard/clients" className={`text-sm ${pathname.includes("/clients") ? "font-medium" : ""}`}>
              Clients
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <SignOutButton />
        </div>
      </div>
    </header>
  )
}
