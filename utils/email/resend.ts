import { Resend } from "resend"

// Initialize Resend with API key
const resendApiKey = process.env.RESEND_API_KEY
export const resend = new Resend(resendApiKey)

// Check if Resend is properly configured
export const isResendConfigured = !!resendApiKey

// Default sender email
export const defaultFrom = "notifications@quotlyo.com"
