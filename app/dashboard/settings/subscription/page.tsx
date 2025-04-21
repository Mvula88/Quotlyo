"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, XCircle, AlertCircle, CreditCard } from "lucide-react"
import { useSubscription } from "@/contexts/subscription-context"
import { getPlans, getSubscriptionInvoices } from "@/services/subscription-service"
import { upgradeToProPlan, cancelSubscription } from "@/app/actions/subscription-actions"
import type { Plan, SubscriptionInvoice } from "@/types/subscription"

export default function SubscriptionPage() {
  const { subscription, isLoading: isLoadingSubscription, refreshSubscription, isPro } = useSubscription()
  const [plans, setPlans] = useState<Plan[]>([])
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpgrading, setIsUpgrading] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const upgraded = searchParams.get("upgraded")
  const errorParam = searchParams.get("error")

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const [plansData, invoicesData] = await Promise.all([getPlans(), getSubscriptionInvoices()])
        setPlans(plansData)
        setInvoices(invoicesData)

        if (upgraded) {
          setSuccess("Your subscription has been successfully upgraded to Pro!")
        }

        if (errorParam) {
          setError("There was an error processing your payment. Please try again.")
        }
      } catch (err) {
        console.error("Error loading subscription data:", err)
        setError("Failed to load subscription data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [upgraded, errorParam])

  const handleUpgrade = async () => {
    try {
      setIsUpgrading(true)
      setError(null)

      const proPlan = plans.find((p) => p.name === "Pro")
      if (!proPlan) {
        throw new Error("Pro plan not found")
      }

      const formData = new FormData()

      const result = await upgradeToProPlan(formData)

      if (!result.success) {
        throw new Error(result.error || "Failed to process upgrade")
      }

      // Create a form to submit to Adumo
      const form = document.createElement("form")
      form.method = result.paymentData.method
      form.action = result.paymentData.url
      form.style.display = "none"

      // Add all parameters as hidden fields
      Object.entries(result.paymentData.params).forEach(([key, value]) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = String(value)
        form.appendChild(input)
      })

      // Add form to body and submit
      document.body.appendChild(form)
      form.submit()
    } catch (err) {
      console.error("Upgrade error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setIsUpgrading(false)
    }
  }

  const handleCancel = async () => {
    try {
      setIsCancelling(true)
      setError(null)

      const result = await cancelSubscription()

      if (!result.success) {
        throw new Error(result.error || "Failed to cancel subscription")
      }

      await refreshSubscription()
      setSuccess("Your subscription has been cancelled and will end at the current billing period.")
    } catch (err) {
      console.error("Cancellation error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsCancelling(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  if (isLoading || isLoadingSubscription) {
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6">Subscription Settings</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Subscription Settings</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6">
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="current">
        <TabsList className="mb-6">
          <TabsTrigger value="current">Current Plan</TabsTrigger>
          <TabsTrigger value="plans">Available Plans</TabsTrigger>
          <TabsTrigger value="billing">Billing History</TabsTrigger>
        </TabsList>

        <TabsContent value="current">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {subscription?.planName || "Free"} Plan
                    {subscription?.cancelAtPeriodEnd && (
                      <Badge variant="outline" className="ml-2 text-yellow-600 bg-yellow-100">
                        Cancelling
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>Your current subscription details</CardDescription>
                </div>
                <Badge className={isPro ? "bg-emerald-500" : "bg-blue-500"}>{isPro ? "PRO" : "FREE"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Plan Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-medium">
                        {subscription?.planPrice
                          ? formatCurrency(subscription.planPrice, subscription.features.multiCurrency ? "USD" : "USD")
                          : "Free"}
                        {subscription?.planPrice ? `/${subscription.features.multiCurrency ? "month" : "month"}` : ""}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium">{subscription?.status || "Active"}</span>
                    </div>
                    {subscription && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Current Period Ends</span>
                        <span className="font-medium">{formatDate(subscription.currentPeriodEnd)}</span>
                      </div>
                    )}
                    {subscription?.cancelAtPeriodEnd && (
                      <div className="flex justify-between text-yellow-600">
                        <span>Cancels On</span>
                        <span className="font-medium">{formatDate(subscription.currentPeriodEnd)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Features</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Invoices</span>
                      <span className="font-medium">
                        {subscription?.features.maxInvoices === -1
                          ? "Unlimited"
                          : `${subscription?.features.maxInvoices || 10} max`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Clients</span>
                      <span className="font-medium">
                        {subscription?.features.maxClients === -1
                          ? "Unlimited"
                          : `${subscription?.features.maxClients || 5} max`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quotations</span>
                      <span className="font-medium">
                        {subscription?.features.maxQuotations === -1
                          ? "Unlimited"
                          : `${subscription?.features.maxQuotations || 5} max`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Premium Templates</span>
                      <span>
                        {subscription?.features.premiumTemplates ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Recurring Invoices</span>
                      <span>
                        {subscription?.features.recurringInvoices ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Auto Reminders</span>
                      <span>
                        {subscription?.features.autoReminders ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Multi-Currency</span>
                      <span>
                        {subscription?.features.multiCurrency ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isPro ? (
                subscription?.cancelAtPeriodEnd ? (
                  <div className="text-sm text-muted-foreground">
                    Your subscription will end on {formatDate(subscription.currentPeriodEnd)}
                  </div>
                ) : (
                  <Button variant="outline" onClick={handleCancel} disabled={isCancelling}>
                    {isCancelling ? "Cancelling..." : "Cancel Subscription"}
                  </Button>
                )
              ) : (
                <Button
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                  className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                >
                  {isUpgrading ? "Processing..." : "Upgrade to Pro"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="plans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={plan.name === "Pro" ? "border-emerald-500 shadow-md" : ""}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{plan.name}</CardTitle>
                    {plan.name === "Pro" && <Badge className="bg-emerald-500">RECOMMENDED</Badge>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">
                      {plan.price === 0 ? "Free" : formatCurrency(plan.price, plan.currency)}
                    </span>
                    {plan.price > 0 && <span className="text-muted-foreground">/{plan.billingInterval}</span>}
                  </div>

                  <Separator className="my-4" />

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span>
                        {plan.features.maxInvoices === -1
                          ? "Unlimited invoices"
                          : `${plan.features.maxInvoices} invoices`}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span>
                        {plan.features.maxClients === -1 ? "Unlimited clients" : `${plan.features.maxClients} clients`}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      <span>
                        {plan.features.maxQuotations === -1
                          ? "Unlimited quotations"
                          : `${plan.features.maxQuotations} quotations`}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {plan.features.premiumTemplates ? (
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2 text-red-500" />
                      )}
                      <span>Premium templates</span>
                    </div>
                    <div className="flex items-center">
                      {plan.features.recurringInvoices ? (
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2 text-red-500" />
                      )}
                      <span>Recurring invoices</span>
                    </div>
                    <div className="flex items-center">
                      {plan.features.autoReminders ? (
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2 text-red-500" />
                      )}
                      <span>Auto reminders</span>
                    </div>
                    <div className="flex items-center">
                      {plan.features.multiCurrency ? (
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2 text-red-500" />
                      )}
                      <span>Multi-currency support</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {plan.name === "Pro" && !isPro ? (
                    <Button
                      className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                      onClick={handleUpgrade}
                      disabled={isUpgrading}
                    >
                      {isUpgrading ? "Processing..." : "Upgrade Now"}
                    </Button>
                  ) : plan.name === "Pro" && isPro ? (
                    <Button className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button className="w-full" variant="outline" disabled>
                      Current Plan
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing History</CardTitle>
              <CardDescription>Your subscription invoices and payment history</CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No billing history available</div>
              ) : (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div className="flex items-center">
                        <div className="mr-4 bg-muted p-2 rounded-full">
                          <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="font-medium">{formatCurrency(invoice.amount, invoice.currency)}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(invoice.periodStart)} - {formatDate(invoice.periodEnd)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Badge
                          variant={invoice.status === "paid" ? "default" : "outline"}
                          className={invoice.status === "paid" ? "bg-green-500" : ""}
                        >
                          {invoice.status.toUpperCase()}
                        </Badge>
                        {invoice.invoicePdfUrl && (
                          <Button variant="ghost" size="sm" className="ml-2" asChild>
                            <a href={invoice.invoicePdfUrl} target="_blank" rel="noopener noreferrer">
                              Download
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
