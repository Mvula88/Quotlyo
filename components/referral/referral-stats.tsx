"use client"

import { Users, CheckCircle, Clock, Gift, ArrowRightLeft } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/ui/animated-counter"

interface ReferralStatsProps {
  stats: {
    totalReferrals: number
    completedReferrals: number
    pendingReferrals: number
    totalRewards: number
    conversionRate: number
  }
}

export function ReferralStats({ stats }: ReferralStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold">
                  <AnimatedCounter value={stats.totalReferrals} />
                </h3>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Completed</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold">
                  <AnimatedCounter value={stats.completedReferrals} />
                </h3>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold">
                  <AnimatedCounter value={stats.pendingReferrals} />
                </h3>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Rewards</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold">
                  $<AnimatedCounter value={stats.totalRewards} />
                </h3>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <Gift className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold">
                  <AnimatedCounter value={Math.round(stats.conversionRate)} />%
                </h3>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
              <ArrowRightLeft className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
