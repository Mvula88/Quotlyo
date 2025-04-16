import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PaymentErrorPage() {
  return (
    <div className="container mx-auto py-12 max-w-md">
      <Card className="border-amber-200 shadow-lg">
        <CardHeader className="bg-amber-50 border-b border-amber-100">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-16 w-16 text-amber-500" />
          </div>
          <CardTitle className="text-center text-2xl text-amber-700">Payment Error</CardTitle>
          <CardDescription className="text-center text-amber-600">
            Something went wrong with your payment
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-4 px-6">
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              We encountered an unexpected error while processing your payment. This could be due to a temporary system
              issue.
            </p>

            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-sm text-amber-700">
                If you're unsure whether your payment went through, please check your email for a payment confirmation
                or contact our support team.
              </p>
            </div>

            <div className="flex flex-col space-y-2 pt-4">
              <Button asChild>
                <Link href="/dashboard/invoices">Return to Invoices</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/support">Contact Support</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
