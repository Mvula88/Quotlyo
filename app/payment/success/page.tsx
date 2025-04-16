import { redirect } from "next/navigation"
import { handlePaymentSuccess } from "@/app/actions/payment-actions"

export default async function PaymentSuccessPage({
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

  // Process the payment success
  await handlePaymentSuccess(formData)

  // This should not be reached as handlePaymentSuccess will redirect
  redirect("/dashboard/invoices")
}
