"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, CreditCard, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PaymentGatewaysPage() {
  const [adumoSettings, setAdumoSettings] = useState({
    merchantId: process.env.ADUMO_MERCHANT_ID || "",
    apiKey: process.env.ADUMO_API_KEY ? "********" : "",
    paymentUrl: process.env.ADUMO_PAYMENT_URL || "https://secure.adumoonline.com/paymentpage",
  })
  const [appUrl, setAppUrl] = useState(process.env.NEXT_PUBLIC_APP_URL || "")
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const handleSaveSettings = async () => {
    setIsSaving(true)
    setSaveStatus("idle")
    setStatusMessage("")

    try {
      // Simulate API call to save settings
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSaveStatus("success")
      setStatusMessage("Payment gateway settings saved successfully!")
    } catch (error) {
      console.error("Failed to save settings:", error)
      setSaveStatus("error")
      setStatusMessage(error instanceof Error ? error.message : "Failed to save settings")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Payment Gateway Settings</h1>

      <Tabs defaultValue="adumo">
        <TabsList className="mb-6">
          <TabsTrigger value="adumo">Adumo Online</TabsTrigger>
          <TabsTrigger value="other" disabled>
            Other Gateways
          </TabsTrigger>
        </TabsList>

        <TabsContent value="adumo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Adumo Online Payment Gateway
              </CardTitle>
              <CardDescription>
                Configure your Adumo Online Virtual Payment Gateway integration settings.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="merchantId">Merchant ID</Label>
                    <Input
                      id="merchantId"
                      placeholder="Your Adumo Merchant ID"
                      value={adumoSettings.merchantId}
                      onChange={(e) => setAdumoSettings({ ...adumoSettings, merchantId: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Your Adumo API Key"
                      value={adumoSettings.apiKey}
                      onChange={(e) => setAdumoSettings({ ...adumoSettings, apiKey: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentUrl">Payment URL</Label>
                  <Input
                    id="paymentUrl"
                    placeholder="Adumo Payment URL"
                    value={adumoSettings.paymentUrl}
                    onChange={(e) => setAdumoSettings({ ...adumoSettings, paymentUrl: e.target.value })}
                  />
                  <p className="text-sm text-muted-foreground">Default: https://secure.adumoonline.com/paymentpage</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appUrl">Your Application URL</Label>
                  <Input
                    id="appUrl"
                    placeholder="Your Application URL"
                    value={appUrl}
                    onChange={(e) => setAppUrl(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    This is used for callback URLs after payment processing
                  </p>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Environment Variables</h3>
                <p className="text-sm mb-4">
                  Add these environment variables to your Vercel project for the integration to work properly:
                </p>
                <div className="space-y-2 font-mono text-sm">
                  <div className="bg-background p-2 rounded">
                    ADUMO_MERCHANT_ID={adumoSettings.merchantId || "your-merchant-id"}
                  </div>
                  <div className="bg-background p-2 rounded">
                    ADUMO_API_KEY={adumoSettings.apiKey ? "********" : "your-api-key"}
                  </div>
                  <div className="bg-background p-2 rounded">ADUMO_PAYMENT_URL={adumoSettings.paymentUrl}</div>
                  <div className="bg-background p-2 rounded">NEXT_PUBLIC_APP_URL={appUrl}</div>
                </div>
              </div>

              {saveStatus !== "idle" && (
                <Alert variant={saveStatus === "success" ? "default" : "destructive"}>
                  {saveStatus === "success" ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  <AlertTitle>{saveStatus === "success" ? "Success" : "Error"}</AlertTitle>
                  <AlertDescription>{statusMessage}</AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">How to Add Environment Variables to Vercel</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Go to your Vercel project dashboard</li>
          <li>Click on "Settings" in the top navigation</li>
          <li>Select "Environment Variables" from the left sidebar</li>
          <li>Add each of the variables shown above</li>
          <li>Make sure to select all environments (Production, Preview, Development)</li>
          <li>Click "Save" to apply the changes</li>
          <li>Redeploy your application for the changes to take effect</li>
        </ol>
      </div>
    </div>
  )
}
