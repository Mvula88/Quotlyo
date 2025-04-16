export interface Affiliate {
  id: string
  name: string
  email: string
  company?: string
  website?: string
  commissionRate: number
  status: "active" | "pending" | "inactive"
  dateJoined: string
  totalReferrals: number
  totalCommission: number
  paymentMethod?: "paypal" | "bank_transfer" | "crypto" | "check"
  paymentDetails?: {
    paypal?: string
    bankName?: string
    accountNumber?: string
    routingNumber?: string
    cryptoAddress?: string
    mailingAddress?: string
  }
  customTrackingCode?: string
  marketingMaterials: MarketingMaterial[]
  performanceStats: {
    clickThroughRate: number
    conversionRate: number
    avgCommissionPerReferral: number
  }
  lastPaymentDate?: string
  lastPaymentAmount?: number
  notes?: string
}

export interface MarketingMaterial {
  id: string
  type: "banner" | "email_template" | "landing_page" | "social_media"
  name: string
  url: string
  description?: string
  clickCount: number
  conversionCount: number
}

export interface ReferralProgram {
  active: boolean
  rewardType: "fixed" | "percentage" | "credits" | "tiered"
  rewardAmount: number
  rewardTiers?: {
    level: number
    threshold: number
    reward: number
  }[]
  dualSided: boolean
  referrerReward: number
  refereeReward: number
  expirationDays: number
  minimumPurchase?: number
  restrictedToProducts?: string[]
  customMessage?: string
}

export interface Referral {
  id: string
  referrerId: string
  referrerName: string
  referrerEmail: string
  refereeId?: string
  refereeName?: string
  refereeEmail: string
  status: "invited" | "registered" | "completed" | "expired"
  dateInvited: string
  dateRegistered?: string
  dateCompleted?: string
  rewardAmount?: number
  rewardStatus?: "pending" | "paid" | "rejected"
  purchaseAmount?: number
  notes?: string
}

export interface AffiliateStats {
  totalAffiliates: number
  activeAffiliates: number
  totalReferrals: number
  conversionRate: number
  totalCommissionPaid: number
  pendingCommissions: number
}
