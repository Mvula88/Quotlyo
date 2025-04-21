"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { createClient } from "@/utils/supabase/client"
import type { Subscription, PlanFeatures } from "@/types/subscription"

interface SubscriptionContextType {
  subscription: Subscription | null
  isLoading: boolean
  error: Error | null
  isPro: boolean
  hasFeature: (featureName: keyof PlanFeatures) => boolean
  refreshSubscription: () => Promise<void>
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchSubscription = async () => {
    try {
      setIsLoading(true)
      const supabase = createClient()

      // Refresh the schema cache
      await supabase.auth.getSession()

      const { data, error } = await supabase.rpc("get_user_subscription")

      if (error) throw error

      if (data && data.length > 0) {
        setSubscription(data[0] as unknown as Subscription)
      } else {
        setSubscription(null)
      }
    } catch (err) {
      console.error("Error fetching subscription:", err)
      setError(err instanceof Error ? err : new Error("Failed to fetch subscription"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscription()
  }, [])

  const isPro = Boolean(
    subscription &&
      subscription.planName === "Pro" &&
      subscription.status === "active" &&
      new Date(subscription.currentPeriodEnd) > new Date(),
  )

  const hasFeature = (featureName: keyof PlanFeatures): boolean => {
    if (!subscription || !subscription.features) return false

    const feature = subscription.features[featureName]

    if (typeof feature === "boolean") {
      return feature
    }

    if (typeof feature === "number") {
      return feature > 0
    }

    return false
  }

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isLoading,
        error,
        isPro,
        hasFeature,
        refreshSubscription: fetchSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const context = useContext(SubscriptionContext)
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider")
  }
  return context
}
