"use client"

import { useState } from "react"
import { Bell, Globe, Repeat } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AutoReminders } from "@/components/features/auto-reminders"
import { RecurringInvoices } from "@/components/features/recurring-invoices"
import { MultiCurrencyTax } from "@/components/features/multi-currency-tax"

export default function PremiumFeaturesPage() {
  const [activeTab, setActiveTab] = useState("auto-reminders")

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Premium Features</h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="auto-reminders" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Auto-Reminders</span>
              <span className="inline sm:hidden">Reminders</span>
            </TabsTrigger>
            <TabsTrigger value="recurring-invoices" className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              <span className="hidden sm:inline">Recurring Invoices</span>
              <span className="inline sm:hidden">Recurring</span>
            </TabsTrigger>
            <TabsTrigger value="multi-currency-tax" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Multi-Currency & Tax</span>
              <span className="inline sm:hidden">Currency/Tax</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auto-reminders">
            <AutoReminders />
          </TabsContent>

          <TabsContent value="recurring-invoices">
            <RecurringInvoices />
          </TabsContent>

          <TabsContent value="multi-currency-tax">
            <MultiCurrencyTax />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
