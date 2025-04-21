"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { prepareAdumoPayment } from "@/utils/payment-gateways/adumo"

export async function upgradeToProPlan(formData: FormData) {
  try {
    const supabase = createClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("User not authenticated")

    // Get the Pro plan
    const { data: plans, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("name", "Pro")
      .eq("is_active", true)
      .single()

    if (planError || !plans) throw new Error("Pro plan not found")

    // Get current subscription
    const { data: currentSub, error: subError } = await supabase.rpc("get_user_subscription")

    if (subError) throw new Error("Error fetching current subscription")

    // Create a payment reference
    const paymentReference = `sub_upgrade_${user.id}_${Date.now()}`

    // Prepare payment parameters
    const paymentParams = {
      amount: plans.price,
      currency: plans.currency,
      reference: paymentReference,
      description: `Upgrade to ${plans.name} Plan`,
      customerEmail: user.email || "",
      customerName: user.user_metadata?.full_name || user.email || "Customer",
      planId: plans.id,
      userId: user.id,
    }

    // Get payment form data
    const paymentData = prepareAdumoPayment(paymentParams)

    // Store transaction details for later verification
    await supabase.from("payment_transactions").insert({
      transaction_id: paymentData.params.transactionId,
      amount: paymentParams.amount,
      currency: paymentParams.currency,
      status: "initiated",
      gateway: "adumo",
      metadata: {
        ...paymentData.params,
        type: "subscription_upgrade",
        plan_id: plans.id,
        user_id: user.id,
      },
    })

    // Return the payment data to be used by the client
    return {
      success: true,
      paymentData,
    }
  } catch (error) {
    console.error("Subscription upgrade error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function handleSubscriptionPaymentSuccess(formData: FormData) {
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

    // Extract metadata
    const metadata = transaction.metadata
    if (metadata.type !== "subscription_upgrade") {
      throw new Error("Invalid transaction type")
    }

    const planId = metadata.plan_id
    const userId = metadata.user_id

    // Get the plan details
    const { data: plan, error: planError } = await supabase.from("plans").select("*").eq("id", planId).single()

    if (planError || !plan) {
      throw new Error("Plan not found")
    }

    // Calculate subscription period
    const startDate = new Date()
    const endDate = new Date()

    if (plan.billing_interval === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1)
    } else if (plan.billing_interval === "yearly") {
      endDate.setFullYear(endDate.getFullYear() + 1)
    }

    // Get current subscription
    const { data: currentSub } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("current_period_end", { ascending: false })
      .limit(1)

    // Update or create subscription
    if (currentSub && currentSub.length > 0) {
      await supabase
        .from("subscriptions")
        .update({
          plan_id: planId,
          status: "active",
          current_period_start: startDate.toISOString(),
          current_period_end: endDate.toISOString(),
          cancel_at_period_end: false,
          canceled_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentSub[0].id)
    } else {
      await supabase.from("subscriptions").insert({
        user_id: userId,
        plan_id: planId,
        status: "active",
        current_period_start: startDate.toISOString(),
        current_period_end: endDate.toISOString(),
      })
    }

    // Create subscription invoice
    await supabase.from("subscription_invoices").insert({
      subscription_id: currentSub && currentSub.length > 0 ? currentSub[0].id : null, // Will be updated after subscription creation
      amount: transaction.amount,
      currency: transaction.currency,
      status: "paid",
      billing_reason: "subscription_create",
      period_start: startDate.toISOString(),
      period_end: endDate.toISOString(),
      paid_at: new Date().toISOString(),
    })

    // Revalidate paths
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/settings/subscription")

    // Redirect to success page
    redirect("/dashboard/settings/subscription?upgraded=true")
  } catch (error) {
    console.error("Subscription payment success handling error:", error)
    redirect("/dashboard/settings/subscription?error=payment")
  }
}

export async function cancelSubscription() {
  try {
    const supabase = createClient()

    // Get current subscription
    const { data: currentSub, error: subError } = await supabase.rpc("get_user_subscription")

    if (subError || !currentSub || currentSub.length === 0) {
      throw new Error("No active subscription found")
    }

    // Update subscription to cancel at period end
    await supabase
      .from("subscriptions")
      .update({
        cancel_at_period_end: true,
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", currentSub[0].id)

    // Revalidate paths
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/settings/subscription")

    return { success: true }
  } catch (error) {
    console.error("Subscription cancellation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
