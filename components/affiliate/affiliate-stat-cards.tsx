"use client"

import { UserCheck, Users, ArrowRightLeft, PercentCircle, DollarSign, AlertCircle } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import type { AffiliateStats } from "@/types/affiliate"

interface AffiliateStatCardsProps {
  stats: AffiliateStats
}

export function AffiliateStatCards({ stats }: AffiliateStatCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Affiliates</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold">
                  <AnimatedCounter value={stats.totalAffiliates} />
                </h3>
                <p className="ml-2 text-xs text-emerald-500">
                  <span className="font-medium">+{stats.activeAffiliates}</span> Active
                </p>
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
              <p className="text-sm font-medium text-muted-foreground">Total Referrals</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold">
                  <AnimatedCounter value={stats.totalReferrals} />
                </h3>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
              <ArrowRightLeft className="h-5 w-5 text-green-600" />
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
                  <AnimatedCounter value={stats.conversionRate} decimals={1} />%
                </h3>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
              <PercentCircle className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Commission Paid</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold">
                  $<AnimatedCounter value={Math.floor(stats.totalCommissionPaid)} />
                </h3>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Commissions</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold">
                  $<AnimatedCounter value={Math.floor(stats.pendingCommissions)} />
                </h3>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Affiliates</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold">
                  <AnimatedCounter value={stats.activeAffiliates} />
                </h3>
                <p className="ml-2 text-xs text-muted-foreground">
                  of <span className="font-medium">{stats.totalAffiliates}</span>
                </p>
              </div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
              <UserCheck className="h-5 w-5 text-indigo-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
