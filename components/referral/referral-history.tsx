"use client"

import { useState } from "react"
import { format } from "date-fns"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Referral } from "@/types/affiliate"

interface ReferralHistoryProps {
  referrals: Referral[]
}

export function ReferralHistory({ referrals }: ReferralHistoryProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredReferrals = statusFilter === "all" ? referrals : referrals.filter((r) => r.status === statusFilter)

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    return format(new Date(dateString), "MMM d, yyyy")
  }

  // Get initials from a name string
  const getInitials = (name?: string) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "registered":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Registered</Badge>
      case "invited":
        return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Invited</Badge>
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Expired</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Referral History</CardTitle>
        <CardDescription>Track the status of people you've referred to Quotlyo</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={statusFilter} onValueChange={setStatusFilter} className="mb-4">
          <TabsList>
            <TabsTrigger value="all">All ({referrals.length})</TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({referrals.filter((r) => r.status === "completed").length})
            </TabsTrigger>
            <TabsTrigger value="registered">
              Registered ({referrals.filter((r) => r.status === "registered").length})
            </TabsTrigger>
            <TabsTrigger value="invited">
              Invited ({referrals.filter((r) => r.status === "invited").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredReferrals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="rounded-full bg-muted p-3">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold">No referrals found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You don't have any {statusFilter !== "all" ? statusFilter : ""} referrals yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReferrals.map((referral, index) => (
              <div key={referral.id}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between py-2">
                  <div className="flex items-center mb-2 md:mb-0">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage
                        src={`/avatars/0${index + 1}.png`}
                        alt={referral.refereeName || referral.refereeEmail}
                      />
                      <AvatarFallback>{getInitials(referral.refereeName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
                        <p className="text-sm font-medium">{referral.refereeName || referral.refereeEmail}</p>
                        {getStatusBadge(referral.status)}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">Invited: {formatDate(referral.dateInvited)}</p>
                        {referral.dateRegistered && (
                          <p className="text-xs text-muted-foreground">
                            • Registered: {formatDate(referral.dateRegistered)}
                          </p>
                        )}
                        {referral.dateCompleted && (
                          <p className="text-xs text-muted-foreground">
                            • Completed: {formatDate(referral.dateCompleted)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center">
                    {referral.status === "completed" && (
                      <div className="text-right mr-4">
                        <p className="text-xs text-muted-foreground">Reward</p>
                        <p className="text-sm font-medium">${referral.rewardAmount?.toFixed(2)}</p>
                      </div>
                    )}

                    {referral.status === "invited" && (
                      <Button size="sm" variant="outline">
                        Remind
                      </Button>
                    )}

                    {referral.status === "registered" && (
                      <Button size="sm" variant="outline">
                        Send Offer
                      </Button>
                    )}

                    {referral.status === "completed" && (
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    )}
                  </div>
                </div>
                {index < filteredReferrals.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
