"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import type { ReferralProgram } from "@/types/affiliate"

export default function AffiliateSettingsPage() {
  const [activeTab, setActiveTab] = useState("program")
  const [settings, setSettings] = useState<ReferralProgram>({
    active: true,
    rewardType: "fixed",
    rewardAmount: 25,
    dualSided: true,
    referrerReward: 25,
    refereeReward: 20,
    expirationDays: 30,
    minimumPurchase: 99,
    customMessage: "Join Quotlyo using my referral link and get 20% off your first 3 months. I'll earn a reward too!",
  })

  const handleSaveSettings = () => {
    // In a real app, this would save to a database
    toast({
      title: "Settings saved",
      description: "Your affiliate program settings have been updated successfully.",
    })
  }

  // Dummy variables for email templates
  const referrer_name = "John Doe"
  const company_name = "Quotlyo"
  const referral_link = "https://quotlyo.com/referral/123"
  const user_name = "Jane Smith"
  const referee_name = "Peter Jones"
  const reward_amount = "$25" // Declared reward_amount
  const total_rewards = "$100" // Declared total_rewards

  return (
    <div className="flex w-full flex-col">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold tracking-tight">Affiliate Program Settings</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/affiliate-management">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Affiliates
              </Button>
            </Link>
            <Button onClick={handleSaveSettings}>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="program">Program Settings</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="emails">Email Templates</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>

          <TabsContent value="program" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Configure your affiliate program's basic settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="program-active"
                    checked={settings.active}
                    onCheckedChange={(checked) => setSettings({ ...settings, active: checked })}
                  />
                  <Label htmlFor="program-active">Affiliate Program Active</Label>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="commission-type">Commission Type</Label>
                    <RadioGroup
                      id="commission-type"
                      value={settings.rewardType}
                      onValueChange={(value) =>
                        setSettings({ ...settings, rewardType: value as "fixed" | "percentage" | "credits" | "tiered" })
                      }
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fixed" id="fixed" />
                        <Label htmlFor="fixed">Fixed Amount</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="percentage" id="percentage" />
                        <Label htmlFor="percentage">Percentage of Sale</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credits" id="credits" />
                        <Label htmlFor="credits">Account Credits</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="tiered" id="tiered" />
                        <Label htmlFor="tiered">Tiered Rewards</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    {settings.rewardType === "fixed" && (
                      <div className="space-y-2">
                        <Label htmlFor="reward-amount">Reward Amount ($)</Label>
                        <Input
                          id="reward-amount"
                          type="number"
                          min="0"
                          step="0.01"
                          value={settings.rewardAmount}
                          onChange={(e) =>
                            setSettings({ ...settings, rewardAmount: Number.parseFloat(e.target.value) || 0 })
                          }
                        />
                      </div>
                    )}

                    {settings.rewardType === "percentage" && (
                      <div className="space-y-2">
                        <Label htmlFor="reward-percentage">Commission Percentage (%)</Label>
                        <Input
                          id="reward-percentage"
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={settings.rewardAmount}
                          onChange={(e) =>
                            setSettings({ ...settings, rewardAmount: Number.parseFloat(e.target.value) || 0 })
                          }
                        />
                      </div>
                    )}

                    {settings.rewardType === "credits" && (
                      <div className="space-y-2">
                        <Label htmlFor="reward-credits">Credit Amount</Label>
                        <Input
                          id="reward-credits"
                          type="number"
                          min="0"
                          value={settings.rewardAmount}
                          onChange={(e) =>
                            setSettings({ ...settings, rewardAmount: Number.parseFloat(e.target.value) || 0 })
                          }
                        />
                      </div>
                    )}

                    {settings.rewardType === "tiered" && (
                      <div className="space-y-2">
                        <Label>Tiered Rewards Structure</Label>
                        <p className="text-sm text-muted-foreground">Configure tier levels in the Rewards tab</p>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="dual-sided">Dual-Sided Rewards</Label>
                    <Switch
                      id="dual-sided"
                      checked={settings.dualSided}
                      onCheckedChange={(checked) => setSettings({ ...settings, dualSided: checked })}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, both the referrer and the referee receive rewards
                  </p>
                </div>

                {settings.dualSided && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="referrer-reward">Referrer Reward ($)</Label>
                      <Input
                        id="referrer-reward"
                        type="number"
                        min="0"
                        step="0.01"
                        value={settings.referrerReward}
                        onChange={(e) =>
                          setSettings({ ...settings, referrerReward: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                      <p className="text-xs text-muted-foreground">Amount the person who refers receives</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="referee-reward">Referee Reward ($)</Label>
                      <Input
                        id="referee-reward"
                        type="number"
                        min="0"
                        step="0.01"
                        value={settings.refereeReward}
                        onChange={(e) =>
                          setSettings({ ...settings, refereeReward: Number.parseFloat(e.target.value) || 0 })
                        }
                      />
                      <p className="text-xs text-muted-foreground">Amount the person who is referred receives</p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="expiration-days">Referral Expiration (Days)</Label>
                  <Input
                    id="expiration-days"
                    type="number"
                    min="0"
                    value={settings.expirationDays}
                    onChange={(e) => setSettings({ ...settings, expirationDays: Number.parseInt(e.target.value) || 0 })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Number of days until a referral link expires (0 = never expires)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimum-purchase">Minimum Purchase Amount ($)</Label>
                  <Input
                    id="minimum-purchase"
                    type="number"
                    min="0"
                    step="0.01"
                    value={settings.minimumPurchase}
                    onChange={(e) =>
                      setSettings({ ...settings, minimumPurchase: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                  <p className="text-sm text-muted-foreground">
                    Minimum purchase amount required for a referral to be eligible for commission
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Settings</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Commission Rules</CardTitle>
                <CardDescription>Set specific rules for when commissions are earned</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="commission-trigger">Commission Trigger</Label>
                  <Select defaultValue="purchase">
                    <SelectTrigger id="commission-trigger">
                      <SelectValue placeholder="Select when commissions are earned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="signup">When user creates an account</SelectItem>
                      <SelectItem value="purchase">When user makes first purchase</SelectItem>
                      <SelectItem value="subscription">When user subscribes to a plan</SelectItem>
                      <SelectItem value="manual">Manual approval only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eligible-products">Eligible Products/Plans</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="eligible-products">
                      <SelectValue placeholder="Select eligible products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All products and plans</SelectItem>
                      <SelectItem value="premium">Premium plans only</SelectItem>
                      <SelectItem value="basic">Basic plans only</SelectItem>
                      <SelectItem value="select">Select specific products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="first-order-only">First Order Only</Label>
                    <Switch id="first-order-only" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, affiliates only earn commission on the referee's first purchase
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="recurring-commissions">Recurring Commissions</Label>
                    <Switch id="recurring-commissions" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, affiliates earn commission on recurring subscription payments
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Referral Widget</CardTitle>
                <CardDescription>Customize how the referral widget appears on your site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="widget-position">Widget Position</Label>
                    <Select defaultValue="bottom-right">
                      <SelectTrigger id="widget-position">
                        <SelectValue placeholder="Select widget position" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bottom-right">Bottom Right</SelectItem>
                        <SelectItem value="bottom-left">Bottom Left</SelectItem>
                        <SelectItem value="top-right">Top Right</SelectItem>
                        <SelectItem value="top-left">Top Left</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="widget-style">Widget Style</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger id="widget-style">
                        <SelectValue placeholder="Select widget style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                        <SelectItem value="prominent">Prominent</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="widget-text">Widget Text</Label>
                  <Input id="widget-text" defaultValue="Refer a friend and get $25!" />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="primary-color">Primary Color</Label>
                    <div className="flex">
                      <Input id="primary-color" type="color" defaultValue="#3B82F6" className="w-12 p-1 h-10" />
                      <Input defaultValue="#3B82F6" className="flex-1 rounded-l-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="text-color">Text Color</Label>
                    <div className="flex">
                      <Input id="text-color" type="color" defaultValue="#FFFFFF" className="w-12 p-1 h-10" />
                      <Input defaultValue="#FFFFFF" className="flex-1 rounded-l-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="background-color">Background Color</Label>
                    <div className="flex">
                      <Input id="background-color" type="color" defaultValue="#F9FAFB" className="w-12 p-1 h-10" />
                      <Input defaultValue="#F9FAFB" className="flex-1 rounded-l-none" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Landing Page</CardTitle>
                <CardDescription>Customize the referral landing page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="landing-title">Page Title</Label>
                  <Input id="landing-title" defaultValue="Join Quotlyo and get 20% off your first 3 months" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landing-description">Description</Label>
                  <Textarea
                    id="landing-description"
                    rows={3}
                    defaultValue="Your friend thought you might like Quotlyo! Sign up using their referral link and you'll get 20% off your first 3 months."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-message">Custom Referral Message</Label>
                  <Textarea
                    id="custom-message"
                    rows={3}
                    value={settings.customMessage}
                    onChange={(e) => setSettings({ ...settings, customMessage: e.target.value })}
                    placeholder="Enter a default message that referrers can customize when sharing"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emails" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Templates</CardTitle>
                <CardDescription>Customize the emails sent during the referral process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="send-invitation-emails">Send Invitation Emails</Label>
                    <Switch id="send-invitation-emails" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, emails will be sent to people invited through the referral program
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invitation-subject">Invitation Email Subject</Label>
                  <Input id="invitation-subject" defaultValue={`${referrer_name} has invited you to try Quotlyo`} />
                  <p className="text-xs text-muted-foreground mt-1">
                    <Info className="inline h-3 w-3 mr-1" />
                    Available variables: {{ referrer_name }}, {{ company_name }}, {{ referral_link }}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invitation-body">Invitation Email Body</Label>
                  <Textarea
                    id="invitation-body"
                    rows={6}
                    defaultValue={`Hi there,

${referrer_name} thought you might be interested in Quotlyo - a platform that helps businesses create professional quotations and invoices in just 60 seconds.

They've sent you a special referral link which gives you 20% off your first 3 months:
${referral_link}

Best regards,
The Quotlyo Team`}
                  />
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="send-reward-emails">Send Reward Notification Emails</Label>
                    <Switch id="send-reward-emails" defaultChecked />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When enabled, emails will be sent when referral rewards are earned
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reward-subject">Reward Email Subject</Label>
                  <Input id="reward-subject" defaultValue="You've earned a referral reward!" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reward-body">Reward Email Body</Label>
                  <Textarea
                    id="reward-body"
                    rows={6}
                    defaultValue={`Congratulations ${user_name}!

Your referral of ${referee_name} has been completed and you've earned a reward of ${reward_amount}.

Thank you for spreading the word about Quotlyo!

Best regards,
The Quotlyo Team`}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    <Info className="inline h-3 w-3 mr-1" />
                    Available variables: {{ user_name }}, {{ referee_name }}, {{ reward_amount }}, {{ total_rewards }}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="mr-2">
                  Preview Emails
                </Button>
                <Button onClick={handleSaveSettings}>Save Templates</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="integration" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Integration Settings</CardTitle>
                <CardDescription>Configure how the affiliate program integrates with other systems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="tracking-method">Tracking Method</Label>
                  <Select defaultValue="url">
                    <SelectTrigger id="tracking-method">
                      <SelectValue placeholder="Select tracking method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="url">URL Parameter</SelectItem>
                      <SelectItem value="cookie">Cookie Only</SelectItem>
                      <SelectItem value="both">URL Parameter + Cookie</SelectItem>
                      <SelectItem value="account">Account Based</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    How referrals will be tracked when users visit your site
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="url-parameter">URL Parameter Name</Label>
                  <Input id="url-parameter" defaultValue="ref" />
                  <p className="text-sm text-muted-foreground">
                    The URL parameter used for tracking referrals (e.g., example.com?ref=CODE)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cookie-duration">Cookie Duration (Days)</Label>
                  <Input id="cookie-duration" type="number" min="1" defaultValue="30" />
                  <p className="text-sm text-muted-foreground">
                    How long the referral cookie will be stored in the user's browser
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="api-integration">API Integration</Label>
                  <div className="rounded-md border p-4 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Webhook Notifications</p>
                        <Switch id="webhook-enabled" defaultChecked={false} />
                      </div>
                      <p className="text-sm text-muted-foreground">Receive webhook notifications for referral events</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="webhook-url">Webhook URL</Label>
                      <Input id="webhook-url" placeholder="https://yourdomain.com/webhook/referrals" disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <div className="flex">
                        <Input
                          id="api-key"
                          type="password"
                          defaultValue="sk_live_51NmHT5BXcR..."
                          className="flex-1 rounded-r-none"
                          disabled
                        />
                        <Button variant="secondary" className="rounded-l-none">
                          Regenerate
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveSettings}>Save Integration Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
