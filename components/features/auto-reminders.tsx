"use client"

import { useState } from "react"
import { Check, Clock, Mail, Settings } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import type { ReminderSettings } from "@/types/invoice"

export function AutoReminders() {
  const [activeTab, setActiveTab] = useState("settings")
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({
    enabled: false,
    sendBefore: 3,
    sendOn: true,
    sendAfter: true,
    afterDays: [3, 7, 14],
  })

  const [emailTemplate, setEmailTemplate] = useState({
    subject: "Invoice #{{invoice_number}} from {{company_name}} - Payment Reminder",
    body: `Dear {{client_name}},

We hope this email finds you well. This is a friendly reminder that invoice #{{invoice_number}} for {{amount}} is {{status}}.

Invoice Details:
- Invoice Number: {{invoice_number}}
- Amount Due: {{amount}}
- Due Date: {{due_date}}
- Status: {{status}}

You can view and pay your invoice online at: {{invoice_link}}

If you have already made the payment, please disregard this reminder.

Thank you for your business!

Best regards,
{{company_name}}
{{company_email}}
{{company_phone}}`,
  })

  const handleToggleReminders = (checked: boolean) => {
    setReminderSettings({ ...reminderSettings, enabled: checked })
    toast({
      title: checked ? "Auto-reminders enabled" : "Auto-reminders disabled",
      description: checked
        ? "Clients will now receive automatic reminders for their invoices"
        : "Automatic reminders have been turned off",
    })
  }

  const handleSaveSettings = () => {
    // In a real app, this would save to a database
    toast({
      title: "Reminder settings saved",
      description: "Your auto-reminder settings have been updated successfully.",
    })
  }

  const handleSaveTemplate = () => {
    // In a real app, this would save to a database
    toast({
      title: "Email template saved",
      description: "Your reminder email template has been updated successfully.",
    })
  }

  const handleTestEmail = () => {
    // In a real app, this would send a test email
    toast({
      title: "Test email sent",
      description: "A test reminder email has been sent to your email address.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Auto-Reminders</h2>
          <p className="text-muted-foreground">Automatically email clients when invoices are due or overdue.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Switch checked={reminderSettings.enabled} onCheckedChange={handleToggleReminders} id="auto-reminders" />
          <Label htmlFor="auto-reminders">{reminderSettings.enabled ? "Enabled" : "Disabled"}</Label>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Reminder Settings
          </TabsTrigger>
          <TabsTrigger value="template">
            <Mail className="mr-2 h-4 w-4" />
            Email Template
          </TabsTrigger>
          <TabsTrigger value="history">
            <Clock className="mr-2 h-4 w-4" />
            Reminder History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reminder Schedule</CardTitle>
              <CardDescription>Configure when to send reminders to clients about their invoices.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Before Due Date</Label>
                    <p className="text-sm text-muted-foreground">Send a reminder before the invoice is due</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      className="w-16"
                      value={reminderSettings.sendBefore}
                      onChange={(e) =>
                        setReminderSettings({
                          ...reminderSettings,
                          sendBefore: Number.parseInt(e.target.value) || 0,
                        })
                      }
                    />
                    <span>days before</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>On Due Date</Label>
                    <p className="text-sm text-muted-foreground">Send a reminder on the day the invoice is due</p>
                  </div>
                  <Switch
                    checked={reminderSettings.sendOn}
                    onCheckedChange={(checked) =>
                      setReminderSettings({
                        ...reminderSettings,
                        sendOn: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>After Due Date</Label>
                    <p className="text-sm text-muted-foreground">Send reminders after the invoice is overdue</p>
                  </div>
                  <Switch
                    checked={reminderSettings.sendAfter}
                    onCheckedChange={(checked) =>
                      setReminderSettings({
                        ...reminderSettings,
                        sendAfter: checked,
                      })
                    }
                  />
                </div>

                {reminderSettings.sendAfter && (
                  <div className="space-y-2 rounded-md border p-4">
                    <Label>Days after due date</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Send reminders on these days after the due date
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[1, 3, 7, 14, 30].map((day) => (
                        <Button
                          key={day}
                          variant={reminderSettings.afterDays.includes(day) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const newDays = reminderSettings.afterDays.includes(day)
                              ? reminderSettings.afterDays.filter((d) => d !== day)
                              : [...reminderSettings.afterDays, day].sort((a, b) => a - b)
                            setReminderSettings({
                              ...reminderSettings,
                              afterDays: newDays,
                            })
                          }}
                        >
                          {reminderSettings.afterDays.includes(day) && <Check className="mr-1 h-3 w-3" />}
                          {day} {day === 1 ? "day" : "days"}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="template" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Template</CardTitle>
              <CardDescription>Customize the reminder emails sent to your clients.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-subject">Email Subject</Label>
                <Input
                  id="email-subject"
                  value={emailTemplate.subject}
                  onChange={(e) =>
                    setEmailTemplate({
                      ...emailTemplate,
                      subject: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Available variables: {`{{invoice_number}}`}, {`{{company_name}}`}, {`{{amount}}`}, {`{{due_date}}`}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-body">Email Body</Label>
                <textarea
                  id="email-body"
                  className="min-h-[300px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={emailTemplate.body}
                  onChange={(e) =>
                    setEmailTemplate({
                      ...emailTemplate,
                      body: e.target.value,
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Available variables: {`{{client_name}}`}, {`{{invoice_number}}`}, {`{{amount}}`}, {`{{due_date}}`},{" "}
                  {`{{status}}`}, {`{{invoice_link}}`}, {`{{company_name}}`}, {`{{company_email}}`},{" "}
                  {`{{company_phone}}`}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleTestEmail}>
                Send Test Email
              </Button>
              <Button onClick={handleSaveTemplate}>Save Template</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reminder History</CardTitle>
              <CardDescription>View a history of all reminders sent to clients.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="flex flex-col">
                  {[
                    {
                      client: "Acme Inc.",
                      invoice: "INV-001",
                      type: "Overdue",
                      date: "2023-05-15 09:30 AM",
                      status: "Sent",
                    },
                    {
                      client: "Wayne Enterprises",
                      invoice: "INV-004",
                      type: "Due Today",
                      date: "2023-05-12 10:15 AM",
                      status: "Sent",
                    },
                    {
                      client: "Stark Industries",
                      invoice: "INV-003",
                      type: "Upcoming",
                      date: "2023-05-10 02:45 PM",
                      status: "Sent",
                    },
                  ].map((reminder, index) => (
                    <div key={index} className="flex items-center justify-between border-b p-4 last:border-0">
                      <div className="space-y-1">
                        <p className="font-medium">{reminder.client}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <span>Invoice {reminder.invoice}</span>
                          <span className="mx-2">•</span>
                          <span>{reminder.type} Reminder</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{reminder.date}</p>
                        <p className="text-xs text-green-600">{reminder.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Reminders
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
