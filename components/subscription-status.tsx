"use client"

import { useSubscription } from "@/contexts/subscription-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { CrownIcon, AlertCircle } from "lucide-react"

export function SubscriptionStatus() {
  const { subscription, isPro, isLoading } = useSubscription()
  const router = useRouter()

  if (isLoading) {
    return null
  }

  // If user is on Pro plan and not cancelling, don't show anything
  if (isPro && !subscription?.cancelAtPeriodEnd) {
    return null
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card
      className={`mb-6 ${subscription?.cancelAtPeriodEnd ? "border-yellow-400 bg-yellow-50" : "border-emerald-400 bg-emerald-50"}`}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          {subscription?.cancelAtPeriodEnd ? (
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
          ) : (
            <CrownIcon className="h-5 w-5 mr-2 text-emerald-500" />
          )}
          <div>
            {subscription?.cancelAtPeriodEnd ? (
              <p className="text-sm font-medium text-yellow-700">
                Your Pro subscription will end on {formatDate(subscription.currentPeriodEnd)}
              </p>
            ) : (
              <p className="text-sm font-medium text-emerald-700">Upgrade to Pro to unlock all premium features</p>
            )}
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => router.push("/dashboard/settings/subscription")}
          variant={subscription?.cancelAtPeriodEnd ? "outline" : "default"}
          className={
            !subscription?.cancelAtPeriodEnd
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
              : ""
          }
        >
          {subscription?.cancelAtPeriodEnd ? "Manage Subscription" : "Upgrade Now"}
        </Button>
      </CardContent>
    </Card>
  )
}
