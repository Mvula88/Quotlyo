"use client"

import type React from "react"

import { useState } from "react"
import { Share2, Copy, ArrowRight, Users, Gift, Mail, Award, CheckCircle, Bell } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { PremiumButton } from "@/components/ui/premium-button"
import { ReferralStats } from "@/components/referral/referral-stats"
import { ReferralHistory } from "@/components/referral/referral-history"
import type { Referral } from "@/types/affiliate"

// Mock referrals data
const referrals: Referral[] = [
  {
    id: "ref-001",
    referrerId: "user-123",
    referrerName: "John Doe",
    referrerEmail: "john@example.com",
    refereeEmail: "alice@example.com",
    refereeName: "Alice Smith",
    refereeId: "user-456",
    status: "completed",
    dateInvited: "2023-04-05",
    dateRegistered: "2023-04-06",
    dateCompleted: "2023-04-10",
    rewardAmount: 25,
    rewardStatus: "paid",
    purchaseAmount: 199,
    notes: "Upgraded to Premium plan",
  },
  {
    id: "ref-002",
    referrerId: "user-123",
    referrerName: "John Doe",
    referrerEmail: "john@example.com",
    refereeEmail: "bob@example.com",
    refereeName: "Bob Johnson",
    refereeId: "user-789",
    status: "completed",
    dateInvited: "2023-04-15",
    dateRegistered: "2023-04-16",
    dateCompleted: "2023-04-20",
    rewardAmount: 25,
    rewardStatus: "paid",
    purchaseAmount: 99,
    notes: "Subscribed to Basic plan",
  },
  {
    id: "ref-003",
    referrerId: "user-123",
    referrerName: "John Doe",
    referrerEmail: "john@example.com",
    refereeEmail: "charlie@example.com",
    status: "invited",
    dateInvited: "2023-05-01",
  },
  {
    id: "ref-004",
    referrerId: "user-123",
    referrerName: "John Doe",
    referrerEmail: "john@example.com",
    refereeEmail: "dave@example.com",
    refereeName: "Dave Williams",
    refereeId: "user-101",
    status: "registered",
    dateInvited: "2023-05-05",
    dateRegistered: "2023-05-07",
  },
]

export default function ReferralProgramPage() {
  const [activeTab, setActiveTab] = useState("share")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState(
    "I've been using Quotlyo for my business and thought you might find it useful too! Sign up using my referral link and we'll both get a reward.",
  )

  const referralLink = "https://quotlyo.com/signup?ref=JOHN25"
  const referralCode = "JOHN25"

  const copyToClipboard = (text: string, type: "link" | "code" = "link") => {
    navigator.clipboard.writeText(text)
    toast({
      title: `${type === "link" ? "Referral link" : "Referral code"} copied!`,
      description: `The ${type} has been copied to your clipboard.`,
    })
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      toast({
        title: "Email is required",
        description: "Please enter an email address to invite.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Invitation sent!",
      description: `Your invitation has been sent to ${email}.`,
    })
    setEmail("")
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Referral Program</h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="share">
              <Share2 className="mr-2 h-4 w-4" />
              Share & Invite
            </TabsTrigger>
            <TabsTrigger value="stats">
              <Users className="mr-2 h-4 w-4" />
              My Referrals
            </TabsTrigger>
            <TabsTrigger value="rewards">
              <Gift className="mr-2 h-4 w-4" />
              Rewards
            </TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-7">
              <Card className="md:col-span-4">
                <CardHeader>
                  <CardTitle>Share Your Referral Link</CardTitle>
                  <CardDescription>
                    Invite friends and colleagues to join Quotlyo and earn rewards when they sign up
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Your unique referral link</div>
                    <div className="flex">
                      <Input readOnly value={referralLink} className="flex-1 rounded-r-none" />
                      <Button
                        variant="secondary"
                        className="rounded-l-none"
                        onClick={() => copyToClipboard(referralLink)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Or use referral code</div>
                    <div className="flex">
                      <Input readOnly value={referralCode} className="flex-1 rounded-r-none" />
                      <Button
                        variant="secondary"
                        className="rounded-l-none"
                        onClick={() => copyToClipboard(referralCode, "code")}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <Button className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      Share via Email
                    </Button>
                    <Button variant="outline" className="w-full">
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M24 12.0733C24 5.40541 18.6274 0 12 0C5.37258 0 0 5.40541 0 12.0733C0 18.1022 4.38823 23.0962 10.125 24V15.5651H7.07813V12.0733H10.125V9.41343C10.125 6.38755 11.9165 4.71615 14.6576 4.71615C15.9705 4.71615 17.3438 4.95195 17.3438 4.95195V7.92313H15.8306C14.3399 7.92313 13.875 8.85381 13.875 9.80864V12.0733H17.2031L16.6711 15.5651H13.875V24C19.6118 23.0962 24 18.1022 24 12.0733Z"
                          fill="#1877F2"
                        />
                      </svg>
                      Share on Facebook
                    </Button>
                    <Button variant="outline" className="w-full">
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M7.55016 21.7502C16.6045 21.7502 21.5583 14.2469 21.5583 7.74211C21.5583 7.53117 21.5536 7.31554 21.5442 7.10461C22.5079 6.40768 23.3395 5.54977 24 4.5553C23.1025 4.9546 22.1496 5.21538 21.1739 5.32822C22.2013 4.71253 22.9705 3.74656 23.3391 2.60608C22.3726 3.17993 21.3156 3.58301 20.2134 3.80085C19.4708 3.01181 18.489 2.48936 17.4197 2.3143C16.3504 2.13923 15.2532 2.32129 14.2977 2.83234C13.3423 3.34339 12.5818 4.15495 12.1338 5.14156C11.6859 6.12816 11.5754 7.23486 11.8195 8.29054C9.86249 8.19233 7.94794 7.68395 6.19998 6.79834C4.45203 5.91274 2.90969 4.66968 1.67297 3.14976C1.0444 4.23349 0.852057 5.5153 1.13503 6.73585C1.418 7.95639 2.15506 9.02436 3.19641 9.71959C2.41463 9.69517 1.64998 9.48468 0.965625 9.10592V9.1671C0.964925 10.3044 1.3581 11.4068 2.07831 12.287C2.79852 13.1672 3.80132 13.7708 4.91625 13.9952C4.19206 14.1934 3.43198 14.2222 2.69484 14.0796C3.00945 15.0577 3.62157 15.9131 4.44577 16.5266C5.26997 17.14 6.26512 17.4808 7.29234 17.5015C5.54842 18.8714 3.39417 19.6144 1.17656 19.6109C0.783287 19.6103 0.390399 19.5861 0 19.5387C2.25286 20.984 4.87353 21.7516 7.55016 21.7502Z"
                          fill="#1DA1F2"
                        />
                      </svg>
                      Share on Twitter
                    </Button>
                    <Button variant="outline" className="w-full">
                      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M22.2234 0H1.77187C0.792187 0 0 0.773438 0 1.72969V22.2656C0 23.2219 0.792187 24 1.77187 24H22.2234C23.2031 24 24 23.2219 24 22.2703V1.72969C24 0.773438 23.2031 0 22.2234 0ZM7.12031 20.4516H3.55781V8.99531H7.12031V20.4516ZM5.33906 7.43438C4.19531 7.43438 3.27188 6.51094 3.27188 5.37187C3.27188 4.23281 4.19531 3.30937 5.33906 3.30937C6.47813 3.30937 7.40156 4.23281 7.40156 5.37187C7.40156 6.50625 6.47813 7.43438 5.33906 7.43438ZM20.4516 20.4516H16.8937V14.8828C16.8937 13.5562 16.8703 11.8453 15.0422 11.8453C13.1906 11.8453 12.9094 13.2937 12.9094 14.7891V20.4516H9.35625V8.99531H12.7687V10.5609H12.8156C13.2891 9.66094 14.4516 8.70938 16.1813 8.70938C19.7859 8.70938 20.4516 11.0813 20.4516 14.1656V20.4516Z"
                          fill="#0A66C2"
                        />
                      </svg>
                      Share on LinkedIn
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-3">
                <CardHeader>
                  <CardTitle>Email Invitation</CardTitle>
                  <CardDescription>Invite specific friends, colleagues, or clients via email</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInvite} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Friend's Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="message" className="text-sm font-medium">
                        Message (optional)
                      </label>
                      <textarea
                        id="message"
                        className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Add a personal message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Mail className="mr-2 h-4 w-4" />
                      Send Invitation
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Learn how to earn rewards by referring friends and colleagues to Quotlyo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div className="grid gap-6 md:grid-cols-4" variants={container} initial="hidden" animate="show">
                  <motion.div variants={item} className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                      <Share2 className="h-7 w-7 text-blue-600" />
                    </div>
                    <h3 className="mb-2 text-base font-medium">1. Share Your Link</h3>
                    <p className="text-sm text-muted-foreground">
                      Share your unique referral link with friends and colleagues
                    </p>
                  </motion.div>

                  <motion.div variants={item} className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                      <Users className="h-7 w-7 text-green-600" />
                    </div>
                    <h3 className="mb-2 text-base font-medium">2. They Sign Up</h3>
                    <p className="text-sm text-muted-foreground">Your referrals create an account using your link</p>
                  </motion.div>

                  <motion.div variants={item} className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
                      <CheckCircle className="h-7 w-7 text-purple-600" />
                    </div>
                    <h3 className="mb-2 text-base font-medium">3. They Subscribe</h3>
                    <p className="text-sm text-muted-foreground">
                      When they subscribe to a paid plan, the referral is complete
                    </p>
                  </motion.div>

                  <motion.div variants={item} className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                      <Gift className="h-7 w-7 text-amber-600" />
                    </div>
                    <h3 className="mb-2 text-base font-medium">4. Earn Rewards</h3>
                    <p className="text-sm text-muted-foreground">
                      You both receive rewards - cash, credits, or discounts
                    </p>
                  </motion.div>
                </motion.div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <ReferralStats
              stats={{
                totalReferrals: referrals.length,
                completedReferrals: referrals.filter((r) => r.status === "completed").length,
                pendingReferrals: referrals.filter((r) => r.status !== "completed").length,
                totalRewards: referrals.reduce((acc, r) => acc + (r.rewardAmount || 0), 0),
                conversionRate: (referrals.filter((r) => r.status === "completed").length / referrals.length) * 100,
              }}
            />

            <ReferralHistory referrals={referrals} />
          </TabsContent>

          <TabsContent value="rewards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Rewards</CardTitle>
                <CardDescription>Track and manage the rewards you've earned from referrals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border p-4 mb-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-medium">Total Rewards Earned</h3>
                      <p className="text-sm text-muted-foreground">From all your completed referrals</p>
                    </div>
                    <div className="text-3xl font-bold text-blue-600">$50.00</div>
                  </div>
                </div>

                <h3 className="text-lg font-medium mb-4">Reward History</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="/avatars/01.png" alt="Alice Smith" />
                        <AvatarFallback>AS</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Alice Smith</p>
                        <p className="text-xs text-muted-foreground">Completed on April 10, 2023</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">$25.00</p>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="/avatars/02.png" alt="Bob Johnson" />
                        <AvatarFallback>BJ</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Bob Johnson</p>
                        <p className="text-xs text-muted-foreground">Completed on April 20, 2023</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">$25.00</p>
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="/avatars/04.png" alt="Dave Williams" />
                        <AvatarFallback>DW</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Dave Williams</p>
                        <p className="text-xs text-muted-foreground">Registered on May 7, 2023</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">$25.00</p>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <Button variant="outline">
                  <Bell className="mr-2 h-4 w-4" />
                  Set Reward Alerts
                </Button>
                <Button>
                  <Gift className="mr-2 h-4 w-4" />
                  Claim Rewards
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Program Benefits</CardTitle>
                <CardDescription>Learn about the rewards you and your friends can earn</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <Gift className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium">For You (Referrer)</h3>
                        <p className="text-sm text-muted-foreground">
                          Earn $25 cash or account credit for each successful referral
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                        <Award className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Tier Benefits</h3>
                        <p className="text-sm text-muted-foreground">
                          Unlock special bonuses after 5+ successful referrals
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium">For Your Friends (Referee)</h3>
                        <p className="text-sm text-muted-foreground">
                          They get 20% off their first 3 months of subscription
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                        <CheckCircle className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-medium">Reward Conditions</h3>
                        <p className="text-sm text-muted-foreground">
                          Rewards are paid when your referral subscribes to any paid plan
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Award className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Upgrade for More Rewards</h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>Premium users can earn up to $40 per referral and offer bigger discounts to friends.</p>
                      </div>
                      <div className="mt-4">
                        <PremiumButton variant="premium" size="sm">
                          <span>Upgrade to Premium</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </PremiumButton>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
