"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, Loader2 } from "lucide-react"

export default function PaymentFailurePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [invoiceId, setInvoiceId] = useState<string | null>(null)
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null)

  useEffect(() => {
    const processPaymentFailure = async () => {
      try {
        const transactionId = searchParams.get("transaction_id")

        if (!transactionId) {
          setError("Transaction ID is missing")
          setIsLoading(false)
          return
        }

        // Simulate API call to update transaction status
        // In a real implementation, you would call your API here
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // For demo purposes, we'll just set some sample data
        setInvoiceId("sample-invoice-id")
        setInvoiceNumber("INV-2023-001")

        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
        setIsLoading(false)
      }
    }

    processPaymentFailure()
  }, [searchParams, router])

  const handleRetry = () => {
    if (invoiceId) {
      router.push(`/dashboard/invoices/${invoiceId}`)
    } else {
      router.push("/dashboard/invoices")
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Processing</CardTitle>
            <CardDescription>Please wait while we update your payment status...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-destructive" />
          </div>
          <CardTitle>Payment Failed</CardTitle>
          <CardDescription>
            {invoiceNumber
              ? `Your payment for Invoice #${invoiceNumber} was not completed.`
              : "Your payment was not completed."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>The payment process was cancelled or encountered an error. No charges have been made to your account.</p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={handleRetry} variant="default">
            Try Again
          </Button>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
