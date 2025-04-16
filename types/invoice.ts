// Invoice related types
export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  price: number
  total: number
}

export interface Invoice {
  id: string
  number: string
  client: string
  clientId: string
  amount: string
  status: string
  date: string
  dueDate: string
  items?: InvoiceItem[]
}

// Reminder related types
export interface ReminderSettings {
  enabled: boolean
  sendBefore: number
  sendOn: boolean
  sendAfter: boolean
  afterDays: number[]
}

// Recurring invoice related types
export type RecurringInterval = "weekly" | "monthly" | "quarterly" | "yearly" | "custom"

export interface RecurringInvoice {
  id: string
  name: string
  clientId: string
  client: string
  interval: RecurringInterval
  frequency: number
  startDate: string
  nextInvoiceDate: string
  lastInvoiceDate?: string
  baseInvoice: Invoice
  active: boolean
  dayOfMonth?: number
  dayOfWeek?: number
}

// Currency and tax related types
export interface Currency {
  code: string
  name: string
  symbol: string
  rate: number
}

export interface TaxRate {
  id: string
  name: string
  rate: number
  country: string
  region?: string
  default: boolean
}
