"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { processInvoicePayment } from "@/app/actions/payment-actions"
import { CreditCard, Loader2 } from "lucide-react"

interface AdumoPaymentButtonProps {
  invoiceId: string
  disabled?: boolean
  variant?: "default" | "outline" | "secondary" | "destructive" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function AdumoPaymentButton({
  invoiceId,
  disabled = false,
  variant = "default",
  size = "default",
}: AdumoPaymentButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const result = await processInvoicePayment(invoiceId)

      if (!result.success) {
        setError(result.error || "Payment processing failed")
        return
      }

      // Create a form to submit to Adumo
      const form = document.createElement("form")
      form.method = "POST"
      form.action = result.paymentUrl
      form.style.display = "none"

      // Add form fields
      Object.entries(result.formData).forEach(([key, value]) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = String(value)
        form.appendChild(input)
      })

      // Add the form to the document and submit it
      document.body.appendChild(form)
      form.submit()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col">
      <Button
        onClick={handlePayment}
        disabled={disabled || isProcessing}
        variant={variant}
        size={size}
        className="flex items-center gap-2"
      >
        {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
        {isProcessing ? "Processing..." : "Pay Now"}
      </Button>

      {error && <p className="text-sm text-destructive mt-2">Error: {error}</p>}
    </div>
  )
}
