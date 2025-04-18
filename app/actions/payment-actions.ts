import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { prepareAdumoPayment } from "@/utils/payment-gateways/adumo"
import { createClient } from "@/utils/supabase/server"

/**
 * Process payment for an invoice using Adumo Online
 */
export async function processInvoicePayment(formData: FormData) {
  try {
    // Get invoice ID from form data
    const invoiceId = formData.get("invoiceId") as string

    if (!invoiceId) {
      throw new Error("Invoice ID is required")
    }

    // Fetch invoice details from database
    const supabase = createClient()
    const { data: invoice, error } = await supabase.from("invoices").select("*").eq("id", invoiceId).single()

    if (error || !invoice) {
      throw new Error("Invoice not found")
    }

    // Get client details
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("id", invoice.client_id)
      .single()

    if (clientError || !client) {
      throw new Error("Client not found")
    }

    // Prepare payment parameters
    const paymentParams = {
      amount: Number.parseFloat(invoice.amount.replace(/[^0-9.]/g, "")), // Remove currency symbol
      currency: "USD", // This should come from your settings or invoice
      reference: invoice.number,
      description: `Payment for Invoice ${invoice.number}`,
      customerEmail: client.email,
      customerName: client.name,
      invoiceId: invoice.id,
    }

    // Get payment form data
    const paymentData = prepareAdumoPayment(paymentParams)

    // Update invoice status to 'processing'
    await supabase.from("invoices").update({ status: "processing" }).eq("id", invoiceId)

    // Store transaction details for later verification
    await supabase.from("payment_transactions").insert({
      invoice_id: invoice.id,
      transaction_id: paymentData.params.transactionId,
      amount: paymentParams.amount,
      currency: paymentParams.currency,
      status: "initiated",
      gateway: "adumo",
      metadata: paymentData.params,
    })

    // Revalidate the invoices page
    revalidatePath("/dashboard/invoices")

    // Return the payment data to be used by the client
    return {
      success: true,
      paymentData,
    }
  } catch (error) {
    console.error("Payment processing error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Handle successful payment callback
 */
export async function handlePaymentSuccess(formData: FormData) {
  try {
    const transactionId = formData.get("transactionId") as string
    const status = formData.get("status") as string

    if (!transactionId || status !== "success") {
      throw new Error("Invalid payment response")
    }

    const supabase = createClient()

    // Find the transaction
    const { data: transaction, error } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("transaction_id", transactionId)
      .single()

    if (error || !transaction) {
      throw new Error("Transaction not found")
    }

    // Update transaction status
    await supabase
      .from("payment_transactions")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        response_data: Object.fromEntries(formData.entries()),
      })
      .eq("id", transaction.id)

    // Update invoice status
    await supabase.from("invoices").update({ status: "paid" }).eq("id", transaction.invoice_id)

    // Revalidate the invoices page
    revalidatePath("/dashboard/invoices")

    // Redirect to success page
    redirect(`/dashboard/invoices/payment-success?reference=${transaction.invoice_id}`)
  } catch (error) {
    console.error("Payment success handling error:", error)
    redirect("/dashboard/invoices/payment-error")
  }
}

/**
 * Handle failed payment callback
 */
export async function handlePaymentFailure(formData: FormData) {
  try {
    const transactionId = formData.get("transactionId") as string
    const status = formData.get("status") as string
    const errorCode = formData.get("errorCode") as string
    const errorMessage = formData.get("errorMessage") as string

    if (!transactionId) {
      throw new Error("Invalid payment response")
    }

    const supabase = createClient()

    // Find the transaction
    const { data: transaction, error } = await supabase
      .from("payment_transactions")
      .select("*")
      .eq("transaction_id", transactionId)
      .single()

    if (error || !transaction) {
      throw new Error("Transaction not found")
    }

    // Update transaction status
    await supabase
      .from("payment_transactions")
      .update({
        status: "failed",
        completed_at: new Date().toISOString(),
        response_data: Object.fromEntries(formData.entries()),
        error_code: errorCode,
        error_message: errorMessage,
      })
      .eq("id", transaction.id)

    // Update invoice status back to pending
    await supabase.from("invoices").update({ status: "pending" }).eq("id", transaction.invoice_id)

    // Revalidate the invoices page
    revalidatePath("/dashboard/invoices")

    // Redirect to failure page
    redirect(`/dashboard/invoices/payment-failed?reference=${transaction.invoice_id}&error=${errorCode}`)
  } catch (error) {
    console.error("Payment failure handling error:", error)
    redirect("/dashboard/invoices/payment-error")
  }
}
