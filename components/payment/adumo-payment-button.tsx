"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditCard, Loader2 } from "lucide-react"

interface AdumoPaymentButtonProps {
  invoiceId: string
  amount?: string
  disabled?: boolean
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function AdumoPaymentButton({
  invoiceId,
  amount,
  disabled = false,
  variant = "default",
  size = "default",
  className = "",
}: AdumoPaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      // For demo purposes, we'll simulate a payment process
      // In a real implementation, you would call your API here
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to the success page (in a real implementation, this would be handled by your payment gateway)
      window.location.href = `/payment/success?transaction_id=demo-transaction-${Date.now()}`
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setIsProcessing(false)
    }
  }

  return (
    <div className={className}>
      <Button
        onClick={handlePayment}
        disabled={disabled || isProcessing}
        variant={variant}
        size={size}
        className="flex items-center gap-2"
      >
        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        {isProcessing ? "Processing..." : amount ? `Pay ${amount}` : "Pay Now"}
      </Button>

      {error && <p className="text-sm text-destructive mt-2">Error: {error}</p>}
    </div>
  )
}
