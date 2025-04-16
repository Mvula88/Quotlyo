"use server"

import { createClient } from "@/utils/supabase/server"
import { type AdumoPaymentConfig, generateAdumoPaymentForm } from "@/utils/payment-gateways/adumo"
import { v4 as uuidv4 } from "uuid"
import { revalidatePath } from "next/cache"

// Get Adumo configuration from environment variables
function getAdumoConfig(): AdumoPaymentConfig {
  return {
    merchantId: process.env.ADUMO_MERCHANT_ID || "",
    apiKey: process.env.ADUMO_API_KEY || "",
    paymentUrl: process.env.ADUMO_PAYMENT_URL || "https://secure.adumoonline.com/paymentpage",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "",
  }
}

// Process an invoice payment using Adumo
export async function processInvoicePayment(invoiceId: string) {
  try {
    const supabase = createClient()

    // Get the invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("*, clients(*)")
      .eq("id", invoiceId)
      .single()

    if (invoiceError || !invoice) {
      throw new Error(`Invoice not found: ${invoiceError?.message || "Unknown error"}`)
    }

    // Get client details
    const client = invoice.clients
    if (!client) {
      throw new Error("Client information not found for this invoice")
    }

    // Create a unique transaction ID
    const transactionId = `INV-${invoice.number}-${uuidv4().substring(0, 8)}`

    // Parse the amount (assuming it's stored as a string in the format "$X,XXX.XX")
    const numericAmount = Number.parseFloat(invoice.amount.replace(/[^0-9.-]+/g, ""))

    if (isNaN(numericAmount)) {
      throw new Error(`Invalid invoice amount: ${invoice.amount}`)
    }

    // Create a payment transaction record
    const { data: transaction, error: transactionError } = await supabase
      .from("payment_transactions")
      .insert({
        invoice_id: invoiceId,
        transaction_id: transactionId,
        amount: numericAmount,
        currency: "USD", // Default currency - you might want to make this configurable
        status: "pending",
        gateway: "adumo",
        metadata: {
          invoice_number: invoice.number,
          client_name: client.name,
          client_email: client.email,
        },
      })
      .select()
      .single()

    if (transactionError) {
      throw new Error(`Failed to create payment transaction: ${transactionError.message}`)
    }

    // Get Adumo configuration
    const adumoConfig = getAdumoConfig()

    if (!adumoConfig.merchantId || !adumoConfig.apiKey) {
      throw new Error("Adumo payment gateway is not properly configured")
    }

    // Generate the payment form data
    const paymentForm = generateAdumoPaymentForm(adumoConfig, {
      invoiceId,
      transactionId,
      amount: numericAmount,
      currency: "USD", // Default currency
      customerName: client.name,
      customerEmail: client.email,
      description: `Payment for Invoice #${invoice.number}`,
      returnUrl: `${adumoConfig.appUrl}/payment/success?transaction_id=${transactionId}`,
      cancelUrl: `${adumoConfig.appUrl}/payment/failure?transaction_id=${transactionId}`,
    })

    // Return the payment form data to be submitted by the client
    return {
      success: true,
      paymentUrl: paymentForm.url,
      formData: paymentForm.formData,
      transactionId,
    }
  } catch (error) {
    console.error("Payment processing error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Update a payment transaction status
export async function updatePaymentTransaction(transactionId: string, status: string, responseData?: any) {
  try {
    const supabase = createClient()

    // Update the transaction record
    const { data, error } = await supabase
      .from("payment_transactions")
      .update({
        status,
        response_data: responseData || null,
        completed_at: status === "completed" ? new Date().toISOString() : null,
      })
      .eq("transaction_id", transactionId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update transaction: ${error.message}`)
    }

    // If payment was successful, update the invoice status
    if (status === "completed" && data) {
      const { error: invoiceError } = await supabase
        .from("invoices")
        .update({ status: "paid" })
        .eq("id", data.invoice_id)

      if (invoiceError) {
        console.error(`Failed to update invoice status: ${invoiceError.message}`)
      }

      // Revalidate the invoice page
      revalidatePath(`/dashboard/invoices/${data.invoice_id}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Transaction update error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}

// Get payment transaction by ID
export async function getPaymentTransaction(transactionId: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("payment_transactions")
      .select("*, invoices(*)")
      .eq("transaction_id", transactionId)
      .single()

    if (error) {
      throw new Error(`Transaction not found: ${error.message}`)
    }

    return { success: true, data }
  } catch (error) {
    console.error("Get transaction error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
