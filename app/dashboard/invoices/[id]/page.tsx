import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdumoPaymentButton } from "@/components/payment/adumo-payment-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Download, Send } from "lucide-react"

// Mock data for demonstration
// const mockInvoice = {
//   id: "invoice-123",
//   number: "INV-2023-001",
//   status: "pending",
//   amount: "$1,250.00",
//   date: "2023-05-15",
//   due_date: "2023-06-15",
//   client_id: "client-123",
//   items: [
//     {
//       description: "Website Design",
//       quantity: 1,
//       price: "$1,000.00",
//       total: "$1,000.00",
//     },
//     {
//       description: "Logo Design",
//       quantity: 1,
//       price: "$250.00",
//       total: "$250.00",
//     },
//   ],
//   clients: {
//     name: "John Doe",
//     company: "Acme Inc",
//     email: "john@example.com",
//     phone: "+1 (555) 123-4567",
//     address: "123 Main St\nSuite 100\nAnytown, CA 12345",
//   },
// }

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  // Mock invoice data
  const invoice = {
    id: params.id,
    number: "INV-2023-001",
    amount: "$1,250.00",
    status: "pending",
  }

  // Determine if invoice is payable (not paid or cancelled)
  const isPayable = invoice.status !== "paid" && invoice.status !== "cancelled"

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/invoices">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Invoice #{invoice.number}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" size="sm">
            <Send className="mr-2 h-4 w-4" />
            Send to Client
          </Button>
          {isPayable && <AdumoPaymentButton invoiceId={invoice.id} amount={invoice.amount} />}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p>{invoice.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Amount</p>
                <p className="text-xl font-bold">{invoice.amount}</p>
              </div>
              <div className="pt-4">
                <AdumoPaymentButton invoiceId={invoice.id} amount={invoice.amount} className="w-full" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button asChild className="w-full">
                <Link href="/dashboard/invoices">Back to Invoices</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
