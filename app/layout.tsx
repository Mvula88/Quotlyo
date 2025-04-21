import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { SubscriptionProvider } from "@/contexts/subscription-context"
import { MetadataUpdater } from "./metadata"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Quotlyo - Invoice & Quotation Platform",
  description: "Create professional invoices and quotations with ease",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <SubscriptionProvider>
              <MetadataUpdater />
              {children}
            </SubscriptionProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
