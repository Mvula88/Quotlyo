import { createClient } from "@/utils/supabase/client"
import type { Plan, Subscription, SubscriptionInvoice } from "@/types/subscription"

export async function getPlans(): Promise<Plan[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true })

  if (error) throw error

  return data.map((plan) => ({
    id: plan.id,
    name: plan.name,
    description: plan.description,
    price: plan.price,
    currency: plan.currency,
    billingInterval: plan.billing_interval,
    features: {
      maxInvoices: plan.features.max_invoices,
      maxClients: plan.features.max_clients,
      maxQuotations: plan.features.max_quotations,
      premiumTemplates: plan.features.premium_templates,
      recurringInvoices: plan.features.recurring_invoices,
      autoReminders: plan.features.auto_reminders,
      multiCurrency: plan.features.multi_currency,
    },
    isActive: plan.is_active,
    createdAt: plan.created_at,
    updatedAt: plan.updated_at,
  }))
}

export async function getCurrentSubscription(): Promise<Subscription | null> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc("get_user_subscription")

  if (error) throw error
  if (!data || data.length === 0) return null

  const sub = data[0]
  return {
    id: sub.id,
    userId: sub.user_id,
    planId: sub.plan_id,
    planName: sub.plan_name,
    planPrice: sub.plan_price,
    status: sub.status,
    currentPeriodEnd: sub.current_period_end,
    cancelAtPeriodEnd: sub.cancel_at_period_end || false,
    features: {
      maxInvoices: sub.features.max_invoices,
      maxClients: sub.features.max_clients,
      maxQuotations: sub.features.max_quotations,
      premiumTemplates: sub.features.premium_templates,
      recurringInvoices: sub.features.recurring_invoices,
      autoReminders: sub.features.auto_reminders,
      multiCurrency: sub.features.multi_currency,
    },
    createdAt: sub.created_at,
    updatedAt: sub.updated_at,
  }
}

export async function getSubscriptionInvoices(): Promise<SubscriptionInvoice[]> {
  const supabase = createClient()
  const { data: subscription } = await supabase.rpc("get_user_subscription")

  if (!subscription || subscription.length === 0) return []

  const { data, error } = await supabase
    .from("subscription_invoices")
    .select("*")
    .eq("subscription_id", subscription[0].id)
    .order("created_at", { ascending: false })

  if (error) throw error

  return data.map((invoice) => ({
    id: invoice.id,
    subscriptionId: invoice.subscription_id,
    amount: invoice.amount,
    currency: invoice.currency,
    status: invoice.status,
    billingReason: invoice.billing_reason,
    invoicePdfUrl: invoice.invoice_pdf_url,
    periodStart: invoice.period_start,
    periodEnd: invoice.period_end,
    paidAt: invoice.paid_at,
    createdAt: invoice.created_at,
    updatedAt: invoice.updated_at,
  }))
}

export async function hasFeature(featureName: string): Promise<boolean> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc("has_premium_feature", { feature_name: featureName })

  if (error) throw error
  return !!data
}
