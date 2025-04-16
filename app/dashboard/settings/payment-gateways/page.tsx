"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function PaymentGatewaysPage() {
  const [merchantId, setMerchantId] = useState("")
  const [apiKey, setApiKey] = useState("")

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Payment Gateway Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Adumo Payment Gateway</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="merchantId">Merchant ID</Label>
              <Input
                id="merchantId"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                placeholder="Enter your Adumo Merchant ID"
              />
            </div>

            <div>
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Adumo API Key"
              />
            </div>

            <Button className="w-full">Save Settings</Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Environment Variables</h2>
        <p className="mb-2">Add these to your Vercel project:</p>
        <pre className="bg-muted p-4 rounded overflow-x-auto">
          <code>
            ADUMO_MERCHANT_ID={merchantId || "your-merchant-id"}
            {"\n"}
            ADUMO_API_KEY=********{"\n"}
            ADUMO_PAYMENT_URL=https://secure.adumoonline.com/paymentpage{"\n"}
            NEXT_PUBLIC_APP_URL=https://your-app-url.vercel.app
          </code>
        </pre>
      </div>
    </div>
  )
}
