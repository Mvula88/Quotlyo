export interface Plan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  billingInterval: string
  features: PlanFeatures
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PlanFeatures {
  maxInvoices: number
  maxClients: number
  maxQuotations: number
  premiumTemplates: boolean
  recurringInvoices: boolean
  autoReminders: boolean
  multiCurrency: boolean
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  planName: string
  planPrice: number
  status: SubscriptionStatus
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  canceledAt?: string
  trialStart?: string
  trialEnd?: string
  features: PlanFeatures
  createdAt: string
  updatedAt: string
}

export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing" | "incomplete" | "incomplete_expired"

export interface SubscriptionInvoice {
  id: string
  subscriptionId: string
  amount: number
  currency: string
  status: "pending" | "paid" | "failed" | "refunded"
  billingReason: string
  invoicePdfUrl?: string
  periodStart: string
  periodEnd: string
  paidAt?: string
  createdAt: string
  updatedAt: string
}
