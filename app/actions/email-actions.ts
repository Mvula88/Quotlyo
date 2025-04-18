"use server"
import { createClient } from "@/utils/supabase/server"
import { resend, defaultFrom, isResendConfigured } from "@/utils/email/resend"
import InvoiceReminderEmail from "@/emails/invoice-reminder"
import InvoiceReceiptEmail from "@/emails/invoice-receipt"

/**
 * Send an invoice reminder email
 */
export async function sendInvoiceReminder(invoiceId: string, reminderType: "upcoming" | "due" | "overdue") {
  try {
    if (!isResendConfigured) {
      throw new Error("Resend API key is not configured")
    }

    // Fetch invoice details from database
    const supabase = createClient()
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select("*, clients(*)")
      .eq("id", invoiceId)
      .single()

    if (invoiceError || !invoice) {
      throw new Error("Invoice not found")
    }

    // Get company settings
    const { data: settings, error: settingsError } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "company_info")
      .single()

    if (settingsError) {
      console.error("Error fetching company settings:", settingsError)
    }

    const companyInfo = settings?.value || {
      name: "Quotlyo Inc.",
      email: "contact@quotlyo.com",
      phone: "+1-555-123-4567",
    }

    // Format due date
    const dueDate = new Date(invoice.due_date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Generate invoice link
    const invoiceLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/invoices/${invoiceId}`

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: defaultFrom,
      to: invoice.clients.email,
      subject: `Invoice ${invoice.invoice_number} from ${companyInfo.name} - ${reminderType === "overdue" ? "Overdue" : "Payment Reminder"}`,
      react: InvoiceReminderEmail({
        clientName: invoice.clients.name,
        invoiceNumber: invoice.invoice_number,
        amount: `$${invoice.amount}`,
        dueDate,
        status: reminderType,
        invoiceLink,
        companyName: companyInfo.name,
        companyEmail: companyInfo.email,
        companyPhone: companyInfo.phone,
      }),
    })

    if (error) {
      throw error
    }

    // Log the reminder in the database
    await supabase.from("email_logs").insert({
      type: "invoice_reminder",
      recipient: invoice.clients.email,
      subject: `Invoice ${invoice.invoice_number} - ${reminderType} Reminder`,
      related_id: invoiceId,
      status: "sent",
      metadata: {
        reminderType,
        invoiceNumber: invoice.invoice_number,
        clientName: invoice.clients.name,
      },
    })

    return { success: true, data }
  } catch (error) {
    console.error("Error sending invoice reminder:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Send a payment receipt email
 */
export async function sendPaymentReceipt(paymentId: string) {
  try {
    if (!isResendConfigured) {
      throw new Error("Resend API key is not configured")
    }

    // Fetch payment details from database
    const supabase = createClient()
    const { data: payment, error: paymentError } = await supabase
      .from("payment_transactions")
      .select("*, invoices(*, clients(*))")
      .eq("id", paymentId)
      .single()

    if (paymentError || !payment) {
      throw new Error("Payment not found")
    }

    // Get company settings
    const { data: settings, error: settingsError } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "company_info")
      .single()

    if (settingsError) {
      console.error("Error fetching company settings:", settingsError)
    }

    const companyInfo = settings?.value || {
      name: "Quotlyo Inc.",
      email: "contact@quotlyo.com",
      phone: "+1-555-123-4567",
    }

    // Format payment date
    const paymentDate = new Date(payment.completed_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Generate invoice link
    const invoiceLink = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/invoices/${payment.invoice_id}`

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: defaultFrom,
      to: payment.invoices.clients.email,
      subject: `Payment Receipt for Invoice ${payment.invoices.invoice_number} from ${companyInfo.name}`,
      react: InvoiceReceiptEmail({
        clientName: payment.invoices.clients.name,
        invoiceNumber: payment.invoices.invoice_number,
        amount: `$${payment.amount}`,
        paymentDate,
        paymentMethod: payment.gateway.charAt(0).toUpperCase() + payment.gateway.slice(1).replace("_", " "),
        transactionId: payment.transaction_id,
        invoiceLink,
        companyName: companyInfo.name,
        companyEmail: companyInfo.email,
        companyPhone: companyInfo.phone,
      }),
    })

    if (error) {
      throw error
    }

    // Log the receipt in the database
    await supabase.from("email_logs").insert({
      type: "payment_receipt",
      recipient: payment.invoices.clients.email,
      subject: `Payment Receipt for Invoice ${payment.invoices.invoice_number}`,
      related_id: payment.invoice_id,
      status: "sent",
      metadata: {
        invoiceNumber: payment.invoices.invoice_number,
        clientName: payment.invoices.clients.name,
        amount: payment.amount,
        transactionId: payment.transaction_id,
      },
    })

    return { success: true, data }
  } catch (error) {
    console.error("Error sending payment receipt:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Send a test email
 */
export async function sendTestEmail(email: string, templateType: "reminder" | "receipt") {
  try {
    if (!isResendConfigured) {
      throw new Error("Resend API key is not configured")
    }

    // Get company settings
    const supabase = createClient()
    const { data: settings, error: settingsError } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "company_info")
      .single()

    if (settingsError) {
      console.error("Error fetching company settings:", settingsError)
    }

    const companyInfo = settings?.value || {
      name: "Quotlyo Inc.",
      email: "contact@quotlyo.com",
      phone: "+1-555-123-4567",
    }

    let data, error

    if (templateType === "reminder") {
      // Send test reminder email
      ;({ data, error } = await resend.emails.send({
        from: defaultFrom,
        to: email,
        subject: `[TEST] Invoice Reminder from ${companyInfo.name}`,
        react: InvoiceReminderEmail({
          clientName: "Test Client",
          invoiceNumber: "INV-TEST-001",
          amount: "$1,250.00",
          dueDate: "May 15, 2023",
          status: "upcoming",
          invoiceLink: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/invoices/test`,
          companyName: companyInfo.name,
          companyEmail: companyInfo.email,
          companyPhone: companyInfo.phone,
        }),
      }))
    } else {
      // Send test receipt email
      ;({ data, error } = await resend.emails.send({
        from: defaultFrom,
        to: email,
        subject: `[TEST] Payment Receipt from ${companyInfo.name}`,
        react: InvoiceReceiptEmail({
          clientName: "Test Client",
          invoiceNumber: "INV-TEST-001",
          amount: "$1,250.00",
          paymentDate: "May 10, 2023",
          paymentMethod: "Credit Card",
          transactionId: "TXN-TEST-12345",
          invoiceLink: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/invoices/test`,
          companyName: companyInfo.name,
          companyEmail: companyInfo.email,
          companyPhone: companyInfo.phone,
        }),
      }))
    }

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error sending test email:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
