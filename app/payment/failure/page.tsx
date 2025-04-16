import { redirect } from "next/navigation"
import { handlePaymentFailure } from "@/app/actions/payment-actions"

export default async function PaymentFailurePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Convert searchParams to FormData
  const formData = new FormData()
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string") {
      formData.append(key, value)
    } else if (Array.isArray(value)) {
      value.forEach((v) => formData.append(key, v))
    }
  })

  // Process the payment failure
  await handlePaymentFailure(formData)

  // This should not be reached as handlePaymentFailure will redirect
  redirect("/dashboard/invoices")
}
