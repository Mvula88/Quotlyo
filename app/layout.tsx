import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { MetadataUpdater } from "./metadata"
import { createClient } from "@/utils/supabase/server"
import { UserNav } from "@/components/user-nav"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quotlyo - Invoice & Quotation Platform",
  description: "Create professional invoices and quotations with ease",
    generator: 'v0.dev'
}

async function getSession() {
  const supabase = createClient()
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

async function getUserDetails() {
  const supabase = createClient()
  const { data: user } = await supabase.auth.getUser()
  if (user && user.user) {
    const { data: profile } = await supabase.from("clients").select("*").eq("email", user.user.email).single()
    return profile
  }
  return null
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const userDetails = await getUserDetails()

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <MetadataUpdater />
            <UserNav session={session} userDetails={userDetails} />
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
