"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Users, Link2, DollarSign, BarChart3, Copy, CheckCircle, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { AffiliateCommissionChart } from "@/components/affiliate/affiliate-commission-chart"

export default function AffiliatePortalPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [copied, setCopied] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const affiliateLink = "https://quotlyo.com/?ref=AF12345"
  const affiliateStats = {
    totalReferrals: 32,
    pendingReferrals: 5,
    totalCommission: 2450.75,
    pendingCommission: 350.25,
    conversionRate: 5.8,
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Affiliate Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Link href="/affiliate-portal/settings">
              <Button variant="outline">Settings</Button>
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="referrals">Referrals</TabsTrigger>
            <TabsTrigger value="commissions">Commissions</TabsTrigger>
            <TabsTrigger value="marketing">Marketing Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{affiliateStats.totalReferrals}</div>
                  <p className="text-xs text-muted-foreground">{affiliateStats.pendingReferrals} pending approval</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${affiliateStats.totalCommission.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">
                    ${affiliateStats.pendingCommission.toFixed(2)} pending
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{affiliateStats.conversionRate}%</div>
                  <p className="text-xs text-muted-foreground">+0.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">15%</div>
                  <p className="text-xs text-muted-foreground">Per successful referral</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Affiliate Link</CardTitle>
                <CardDescription>Share this link to earn commissions on referrals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input value={affiliateLink} readOnly className="font-mono text-sm" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(affiliateLink)}
                    className="shrink-0"
                  >
                    {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Link2 className="mr-2 h-4 w-4" />
                  Get More Links
                </Button>
                <Link href="/affiliate-portal/marketing-tools">
                  <Button size="sm">
                    Marketing Materials
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Commission Trend</CardTitle>
                  <CardDescription>Your commission earnings over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <AffiliateCommissionChart />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Referrals</CardTitle>
                  <CardDescription>Your most recent referrals</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-green-100 p-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">John Smith</p>
                        <p className="text-xs text-muted-foreground">Premium Plan - $79/month</p>
                      </div>
                      <div className="text-sm font-medium">$11.85</div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-green-100 p-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Sarah Johnson</p>
                        <p className="text-xs text-muted-foreground">Enterprise Plan - $199/month</p>
                      </div>
                      <div className="text-sm font-medium">$29.85</div>
                    </div>
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-yellow-100 p-2">
                        <Clock className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Michael Brown</p>
                        <p className="text-xs text-muted-foreground">Pending approval</p>
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">Pending</div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href="/affiliate-portal/referrals">
                    <Button variant="outline" className="w-full">
                      View All Referrals
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="referrals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Referrals</CardTitle>
                <CardDescription>Track all your referrals and their status</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Referrals content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Commission History</CardTitle>
                <CardDescription>Track your commission earnings and payments</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Commission history content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Materials</CardTitle>
                <CardDescription>Access banners, email templates, and other marketing resources</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Marketing materials content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
