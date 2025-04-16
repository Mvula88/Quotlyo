"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { processInvoicePayment } from "@/app/actions/payment-actions"
import { Loader2 } from "lucide-react"

interface AdumoPaymentButtonProps {
  invoiceId: string
  amount: string
  className?: string
}

export function AdumoPaymentButton({ invoiceId, amount, className }: AdumoPaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePayment = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("invoiceId", invoiceId)

      const result = await processInvoicePayment(formData)

      if (!result.success) {
        setError(result.error || "Payment processing failed")
        setIsLoading(false)
        return
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
      console.error("Payment error:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className={className}>
      <Button
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ${amount}`
        )}
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
