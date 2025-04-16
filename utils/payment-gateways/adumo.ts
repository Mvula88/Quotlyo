/**
 * Adumo Online Virtual Payment Gateway Integration
 * Based on: https://developers.adumoonline.com/virtual.php
 */

// These would come from environment variables in production
const ADUMO_MERCHANT_ID = process.env.ADUMO_MERCHANT_ID || "test_merchant_id"
const ADUMO_API_KEY = process.env.ADUMO_API_KEY || "test_api_key"
const ADUMO_PAYMENT_URL = process.env.ADUMO_PAYMENT_URL || "https://secure.adumoonline.com/paymentpage"
const ADUMO_SUCCESS_URL = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`
  : "http://localhost:3000/payment/success"
const ADUMO_FAILURE_URL = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/payment/failure`
  : "http://localhost:3000/payment/failure"

export interface AdumoPaymentConfig {
  merchantId: string
  apiKey: string
  paymentUrl: string
  appUrl: string
}

export interface AdumoPaymentData {
  invoiceId: string
  transactionId: string
  amount: number
  currency: string
  customerName: string
  customerEmail: string
  description: string
  returnUrl: string
  cancelUrl: string
}

export interface AdumoPaymentParams {
  amount: number
  currency: string
  reference: string
  description: string
  customerEmail: string
  customerName: string
  invoiceId: string
}

/**
 * Generate a unique transaction ID
 */
function generateTransactionId(): string {
  return `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

/**
 * Calculate the signature for the payment request
 */
function calculateSignature(params: Record<string, string>, apiKey: string): string {
  // In a real implementation, you would create a hash of the parameters and API key
  // This is a simplified example - replace with actual signature calculation method
  const paramsString = Object.entries(params)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([_, value]) => value)
    .join("")

  // In production, use a proper hashing algorithm like HMAC-SHA256
  return btoa(`${paramsString}${apiKey}`)
}

/**
 * Prepare payment form data for Adumo Virtual Payment
 */
export function prepareAdumoPayment(params: AdumoPaymentParams) {
  // Format amount to cents (Adumo expects amount in cents)
  const amountInCents = Math.round(params.amount * 100)

  const transactionId = generateTransactionId()

  const paymentParams = {
    merchantId: ADUMO_MERCHANT_ID,
    transactionId: transactionId,
    amount: amountInCents.toString(),
    currency: params.currency,
    reference: params.reference,
    description: params.description,
    customerEmail: params.customerEmail,
    customerName: params.customerName,
    invoiceId: params.invoiceId,
    successUrl: ADUMO_SUCCESS_URL,
    failureUrl: ADUMO_FAILURE_URL,
    timestamp: Date.now().toString(),
  }

  // Calculate signature for security
  const signature = calculateSignature(paymentParams, ADUMO_API_KEY)

  return {
    url: ADUMO_PAYMENT_URL,
    method: "POST",
    params: {
      ...paymentParams,
      signature,
    },
  }
}

/**
 * Verify the payment response from Adumo
 */
export function verifyAdumoPaymentResponse(responseData: any): boolean {
  // In a real implementation, you would verify the signature from the response
  // This is a simplified example
  if (!responseData || !responseData.transactionId || !responseData.status) {
    return false
  }

  // Verify signature
  const receivedSignature = responseData.signature
  const calculatedSignature = calculateSignature(
    Object.fromEntries(Object.entries(responseData).filter(([key]) => key !== "signature")),
    ADUMO_API_KEY,
  )

  return receivedSignature === calculatedSignature
}

export function generateAdumoPaymentForm(config: AdumoPaymentConfig, paymentData: AdumoPaymentData) {
  // Generate a timestamp for the request
  const timestamp = new Date().toISOString()

  // Create the payment form data
  const formData = {
    merchantId: config.merchantId,
    amount: paymentData.amount.toFixed(2),
    currency: paymentData.currency,
    transactionId: paymentData.transactionId,
    timestamp: timestamp,
    description: paymentData.description,
    customerName: paymentData.customerName,
    customerEmail: paymentData.customerEmail,
    returnUrl: paymentData.returnUrl,
    cancelUrl: paymentData.cancelUrl,
    // Add a signature using the API key (implementation depends on Adumo's requirements)
    signature: generateSignature(
      config.apiKey,
      config.merchantId,
      paymentData.transactionId,
      paymentData.amount.toFixed(2),
      timestamp,
    ),
  }

  return {
    url: config.paymentUrl,
    formData,
  }
}

// Generate a signature for the payment request
// Note: This is a placeholder implementation - you'll need to implement this according to Adumo's documentation
function generateSignature(
  apiKey: string,
  merchantId: string,
  transactionId: string,
  amount: string,
  timestamp: string,
): string {
  // In a real implementation, you would use a crypto library to generate a hash
  // For example: crypto.createHmac('sha256', apiKey).update(`${merchantId}|${transactionId}|${amount}|${timestamp}`).digest('hex')

  // This is a placeholder - replace with actual implementation based on Adumo's requirements
  return `SIGNATURE_PLACEHOLDER_${merchantId}_${transactionId}_${timestamp}`
}

export function validateAdumoCallback(config: AdumoPaymentConfig, callbackData: any): boolean {
  // Validate the callback data from Adumo
  // This is a placeholder - implement according to Adumo's documentation

  // In a real implementation, you would verify the signature from the callback
  // For example: verify that callbackData.signature matches your calculated signature

  return true // Placeholder - replace with actual validation
}
