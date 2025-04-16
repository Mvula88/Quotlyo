import Link from "next/link"
import { XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PaymentFailedPage({
  searchParams,
}: {
  searchParams: { reference?: string; error?: string }
}) {
  const reference = searchParams.reference || "Unknown"
  const error = searchParams.error || "Unknown error"

  return (
    <div className="container mx-auto py-12 max-w-md">
      <Card className="border-red-200 shadow-lg">
        <CardHeader className="bg-red-50 border-b border-red-100">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-500" />
          </div>
          <CardTitle className="text-center text-2xl text-red-700">Payment Failed</CardTitle>
          <CardDescription className="text-center text-red-600">We couldn't process your payment</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 pb-4 px-6">
          <div className="space-y-4">
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-700 font-medium">Invoice Reference</p>
              <p className="text-lg font-mono">{reference}</p>
            </div>

            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-700 font-medium">Error</p>
              <p className="text-sm font-mono">{error}</p>
            </div>

            <p className="text-sm text-gray-600">Please try again or contact support if the problem persists.</p>

            <div className="flex flex-col space-y-2 pt-4">
              <Button asChild>
                <Link href={`/dashboard/invoices/${reference}`}>Try Again</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/invoices">Return to Invoices</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
