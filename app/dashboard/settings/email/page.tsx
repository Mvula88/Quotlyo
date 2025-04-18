"use client"

import { useState } from "react"
import { Mail, Send, Settings, Info } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { sendTestEmail } from "@/app/actions/email-actions"

const formSchema = z.object({
  fromEmail: z.string().email({ message: "Please enter a valid email address" }),
  fromName: z.string().min(2, { message: "Name must be at least 2 characters" }),
  replyTo: z.string().email({ message: "Please enter a valid email address" }).optional().or(z.literal("")),
  testEmail: z.string().email({ message: "Please enter a valid email address" }).optional().or(z.literal("")),
})

export default function EmailSettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isSendingTest, setIsSendingTest] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromEmail: "notifications@quotlyo.com",
      fromName: "Quotlyo",
      replyTo: "support@quotlyo.com",
      testEmail: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would save to a database
    toast({
      title: "Email settings saved",
      description: "Your email settings have been updated successfully.",
    })
  }

  const handleSendTestEmail = async (templateType: "reminder" | "receipt") => {
    const testEmail = form.getValues("testEmail")

    if (!testEmail) {
      toast({
        title: "Email required",
        description: "Please enter an email address to send the test to.",
        variant: "destructive",
      })
      return
    }

    setIsSendingTest(true)
    try {
      const result = await sendTestEmail(testEmail, templateType)

      if (result.success) {
        toast({
          title: "Test email sent",
          description: `A test ${templateType} email has been sent to ${testEmail}`,
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Error sending test email:", error)
      toast({
        title: "Failed to send test email",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSendingTest(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Email Settings</h2>
        <p className="text-muted-foreground">
          Configure your email settings for invoices, quotations, and client communications.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <Settings className="mr-2 h-4 w-4" />
            General Settings
          </TabsTrigger>
          <TabsTrigger value="templates">
            <Mail className="mr-2 h-4 w-4" />
            Email Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <CardDescription>Configure the sender details for all outgoing emails.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fromEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>The email address that will appear as the sender.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fromName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>The name that will appear as the sender.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="replyTo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reply-To Email (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          If clients reply to automated emails, their response will go to this address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit">Save Settings</Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resend Integration</CardTitle>
              <CardDescription>Quotlyo uses Resend for beautiful, responsive email templates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-blue-50 p-4 border border-blue-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">About Resend</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Resend is an email API for developers that allows you to send emails from your application using
                        React components. This enables beautiful, responsive emails that match your brand.
                      </p>
                    </div>
                    <div className="mt-4">
                      <a
                        href="https://resend.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        Learn more about Resend →
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-email">Send Test Email</Label>
                <div className="flex space-x-2">
                  <Input
                    id="test-email"
                    type="email"
                    placeholder="Enter email address for test"
                    {...form.register("testEmail")}
                    disabled={isSendingTest}
                  />
                  <Button variant="outline" onClick={() => handleSendTestEmail("reminder")} disabled={isSendingTest}>
                    {isSendingTest ? (
                      <span className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        Test Reminder
                      </span>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => handleSendTestEmail("receipt")} disabled={isSendingTest}>
                    {isSendingTest ? (
                      <span className="flex items-center">
                        <Mail className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Send className="mr-2 h-4 w-4" />
                        Test Receipt
                      </span>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Send a test email to preview how your emails will look.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Preview and manage your email templates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Invoice Reminder</h3>
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Sent to remind clients about upcoming, due, or overdue invoices.
                  </p>
                  <div className="aspect-video bg-slate-100 rounded-md overflow-hidden">
                    <img
                      src="/professional-invoice-reminder.png"
                      alt="Invoice reminder template"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Payment Receipt</h3>
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">Sent to confirm payment receipt for invoices.</p>
                  <div className="aspect-video bg-slate-100 rounded-md overflow-hidden">
                    <img
                      src="/simple-payment-receipt.png"
                      alt="Payment receipt template"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Quotation Sent</h3>
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Sent when a new quotation is created for a client.
                  </p>
                  <div className="aspect-video bg-slate-100 rounded-md overflow-hidden">
                    <img
                      src="/professional-quotation-template.png"
                      alt="Quotation template"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">Welcome Email</h3>
                    <Button variant="outline" size="sm">
                      Preview
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Sent to new clients when they are added to your account.
                  </p>
                  <div className="aspect-video bg-slate-100 rounded-md overflow-hidden">
                    <img
                      src="/welcome-email-concept.png"
                      alt="Welcome email template"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Email templates are built with React components for beautiful, responsive designs.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
