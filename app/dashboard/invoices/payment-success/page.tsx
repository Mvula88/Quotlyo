import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { reference?: string }
}) {
  const reference = searchParams.reference || "Unknown"

  return (
    <div className="container mx-auto py-12 max-w-md">
      <Card className="border-green-200 shadow-lg">
        <CardHeader className="bg-green-50 border-b border-green-100">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center text-2xl text-green-700">Payment Successful</CardTitle>
          <CardDescription className="text-center text-green-600">
            Your payment has been processed successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-4 px-6">
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-700 font-medium">Invoice Reference</p>
              <p className="text-lg font-mono">{reference}</p>
            </div>

            <p className="text-sm text-gray-600">
              A confirmation email has been sent to your registered email address. Thank you for your payment.
            </p>

            <div className="flex flex-col space-y-2 pt-4">
              <Button asChild>
                <Link href="/dashboard/invoices">Return to Invoices</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/dashboard/invoices/${reference}`}>View Invoice Details</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
