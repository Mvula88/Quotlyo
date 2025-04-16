"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, DollarSign, Globe, Shield, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AffiliateSignupPage() {
  const [activeTab, setActiveTab] = useState("about")
  const [formStep, setFormStep] = useState(1)

  const handleNextStep = () => {
    setFormStep(formStep + 1)
  }

  const handlePrevStep = () => {
    setFormStep(formStep - 1)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Submit form data
    // Redirect to success page
    window.location.href = "/affiliate-signup/success"
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-background px-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/quotlyo_full_logo.png" alt="Quotlyo Logo" width={180} height={50} className="h-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold md:text-4xl">Become a Quotlyo Affiliate Partner</h1>
            <p className="mt-2 text-muted-foreground">
              Join our affiliate program and earn commissions by referring businesses to Quotlyo
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-1">
              <div className="sticky top-24 space-y-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-1">
                    <TabsTrigger value="about">About the Program</TabsTrigger>
                    <TabsTrigger value="benefits">Benefits</TabsTrigger>
                    <TabsTrigger value="faq">FAQ</TabsTrigger>
                  </TabsList>
                  <TabsContent value="about" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">How It Works</h3>
                      <p className="text-sm text-muted-foreground">
                        Our affiliate program allows you to earn recurring commissions by referring businesses to
                        Quotlyo. You'll receive 15% of the monthly subscription fee for the lifetime of the customer.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Who Can Join</h3>
                      <p className="text-sm text-muted-foreground">
                        We welcome bloggers, content creators, influencers, business consultants, and anyone with an
                        audience of business owners or professionals who could benefit from our invoicing and quotation
                        platform.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Getting Started</h3>
                      <p className="text-sm text-muted-foreground">
                        Fill out the application form, and our team will review your submission. Once approved, you'll
                        get access to your affiliate dashboard with tracking links, marketing materials, and performance
                        stats.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="benefits" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <DollarSign className="h-3 w-3" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">15% Recurring Commission</h3>
                          <p className="text-xs text-muted-foreground">
                            Earn 15% of the monthly subscription fee for the lifetime of each customer you refer.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <Globe className="h-3 w-3" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Marketing Materials</h3>
                          <p className="text-xs text-muted-foreground">
                            Access professional banners, email templates, and social media content to promote Quotlyo.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <Shield className="h-3 w-3" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Reliable Tracking</h3>
                          <p className="text-xs text-muted-foreground">
                            Our system accurately tracks all referrals and conversions with a 90-day cookie window.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                          <Users className="h-3 w-3" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium">Dedicated Support</h3>
                          <p className="text-xs text-muted-foreground">
                            Get personalized support from our affiliate team to maximize your earnings.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="faq" className="space-y-4 pt-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium">How much can I earn?</h3>
                        <p className="text-xs text-muted-foreground">
                          You earn 15% of the monthly subscription fee for each customer you refer, for as long as they
                          remain a customer. For example, if you refer a customer on the Professional plan ($79/month),
                          you'll earn $11.85 per month.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">When do I get paid?</h3>
                        <p className="text-xs text-muted-foreground">
                          Commissions are paid monthly, with a 30-day holding period. Payments are made via PayPal, bank
                          transfer, or cryptocurrency.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">Is there a minimum payout threshold?</h3>
                        <p className="text-xs text-muted-foreground">
                          Yes, the minimum payout threshold is $50. If your balance is below $50, it will roll over to
                          the next month.
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium">How long does the application process take?</h3>
                        <p className="text-xs text-muted-foreground">
                          We typically review applications within 2-3 business days. You'll receive an email
                          notification once your application is approved.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>Need Help?</CardTitle>
                    <CardDescription>Contact our affiliate team for assistance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <p>Email: affiliates@quotlyo.com</p>
                      <p className="mt-1">Phone: (555) 123-4567</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Affiliate Application</CardTitle>
                <CardDescription>Please complete the form below to apply for our affiliate program</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  {formStep === 1 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="John Smith" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="john@example.com" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company/Website Name</Label>
                        <Input id="company" placeholder="Your Company or Website" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="website">Website URL</Label>
                        <Input id="website" type="url" placeholder="https://yourwebsite.com" />
                      </div>
                    </div>
                  )}

                  {formStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="audience">Describe Your Audience</Label>
                        <Textarea
                          id="audience"
                          placeholder="Tell us about your audience, their demographics, interests, etc."
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="promotion">How Will You Promote Quotlyo?</Label>
                        <Textarea
                          id="promotion"
                          placeholder="Describe how you plan to promote Quotlyo to your audience"
                          rows={3}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="experience">Affiliate Marketing Experience</Label>
                        <Select defaultValue="some">
                          <SelectTrigger id="experience">
                            <SelectValue placeholder="Select your experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">No experience</SelectItem>
                            <SelectItem value="some">Some experience</SelectItem>
                            <SelectItem value="experienced">Experienced</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment">Preferred Payment Method</Label>
                        <Select defaultValue="paypal">
                          <SelectTrigger id="payment">
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="paypal">PayPal</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="crypto">Cryptocurrency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {formStep === 3 && (
                    <div className="space-y-4">
                      <div className="rounded-lg bg-muted p-4">
                        <h3 className="mb-2 font-medium">Terms and Conditions</h3>
                        <div className="max-h-48 overflow-y-auto text-sm text-muted-foreground">
                          <p>
                            By submitting this application, you agree to the Quotlyo Affiliate Program Terms and
                            Conditions. These include but are not limited to:
                          </p>
                          <ul className="list-inside list-disc space-y-1 pt-2">
                            <li>Maintaining accurate and up-to-date information</li>
                            <li>Not engaging in spam or deceptive marketing practices</li>
                            <li>Not bidding on Quotlyo branded keywords</li>
                            <li>Complying with all applicable laws and regulations</li>
                            <li>Allowing 30 days for commission payments</li>
                            <li>Accepting that Quotlyo may terminate the affiliate relationship at any time</li>
                          </ul>
                          <p className="pt-2">For the complete terms and conditions, please visit our website.</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-2">
                        <input type="checkbox" id="terms" className="mt-1 h-4 w-4 rounded border-gray-300" required />
                        <Label htmlFor="terms" className="text-sm font-normal">
                          I have read and agree to the Quotlyo Affiliate Program Terms and Conditions
                        </Label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <input type="checkbox" id="communications" className="mt-1 h-4 w-4 rounded border-gray-300" />
                        <Label htmlFor="communications" className="text-sm font-normal">
                          I would like to receive affiliate program updates, tips, and promotional materials
                        </Label>
                      </div>
                    </div>
                  )}
                </form>
              </CardContent>
              <CardFooter className="flex justify-between">
                {formStep > 1 && (
                  <Button variant="outline" onClick={handlePrevStep}>
                    Back
                  </Button>
                )}
                {formStep < 3 ? (
                  <Button onClick={handleNextStep} className="ml-auto">
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit" onClick={handleSubmit} className="ml-auto">
                    Submit Application
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Image src="/quotlyo_favicon.png" alt="Quotlyo Logo" width={24} height={24} />
              <span className="text-sm font-medium">© 2023 Quotlyo. All rights reserved.</span>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <Link href="/terms" className="hover:underline">
                Terms
              </Link>
              <Link href="/privacy" className="hover:underline">
                Privacy
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
