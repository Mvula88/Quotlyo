"use client"

import type React from "react"
import { useSubscription } from "@/contexts/subscription-context"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { LockIcon } from "lucide-react"

interface FeatureGateProps {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { hasFeature, isLoading } = useSubscription()
  const router = useRouter()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const hasAccess = hasFeature(feature as any)

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  return (
    <Card className="text-center p-6">
      <CardHeader>
        <div className="mx-auto bg-muted rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
          <LockIcon className="h-6 w-6" />
        </div>
        <CardTitle>Premium Feature</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This feature is only available on the Pro plan. Upgrade now to unlock all premium features.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => router.push("/dashboard/settings/subscription")}
          className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
        >
          Upgrade to Pro
        </Button>
      </CardFooter>
    </Card>
  )
}
