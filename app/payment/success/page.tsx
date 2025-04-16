"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Loader2 } from "lucide-react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [invoiceId, setInvoiceId] = useState<string | null>(null)
  const [invoiceNumber, setInvoiceNumber] = useState<string | null>(null)

  useEffect(() => {
    const processPaymentSuccess = async () => {
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

    processPaymentSuccess()
  }, [searchParams, router])

  const handleViewInvoice = () => {
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
            <CardTitle>Processing Payment</CardTitle>
            <CardDescription>Please wait while we confirm your payment...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-destructive">Payment Error</CardTitle>
            <CardDescription>There was a problem processing your payment</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => router.push("/dashboard/invoices")}>Return to Invoices</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle>Payment Successful!</CardTitle>
          <CardDescription>
            {invoiceNumber
              ? `Your payment for Invoice #${invoiceNumber} has been processed successfully.`
              : "Your payment has been processed successfully."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p>Thank you for your payment. A receipt has been sent to your email address.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={handleViewInvoice}>View Invoice</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
