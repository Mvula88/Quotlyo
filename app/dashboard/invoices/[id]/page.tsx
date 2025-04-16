import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AdumoPaymentButton } from "@/components/payment/adumo-payment-button"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, Download, Send } from "lucide-react"

// Mock data for demonstration
const mockInvoice = {
  id: "invoice-123",
  number: "INV-2023-001",
  status: "pending",
  amount: "$1,250.00",
  date: "2023-05-15",
  due_date: "2023-06-15",
  client_id: "client-123",
  items: [
    {
      description: "Website Design",
      quantity: 1,
      price: "$1,000.00",
      total: "$1,000.00",
    },
    {
      description: "Logo Design",
      quantity: 1,
      price: "$250.00",
      total: "$250.00",
    },
  ],
  clients: {
    name: "John Doe",
    company: "Acme Inc",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St\nSuite 100\nAnytown, CA 12345",
  },
}

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  // In a real implementation, you would fetch the invoice from your database
  // For demo purposes, we'll use mock data
  const invoice = mockInvoice

  // Determine if invoice is payable (not paid or cancelled)
  const isPayable = invoice.status !== "paid" && invoice.status !== "cancelled"

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/invoices">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Invoice #{invoice.number}</h1>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
            <CardDescription>Invoice #{invoice.number}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                <div
                  className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
                  ${
                    invoice.status === "paid"
                      ? "bg-green-100 text-green-800"
                      : invoice.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : invoice.status === "overdue"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Amount</h3>
                <p className="mt-1 text-lg font-semibold">{invoice.amount}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Invoice Date</h3>
                <p className="mt-1">{invoice.date}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Due Date</h3>
                <p className="mt-1">{invoice.due_date}</p>
              </div>
            </div>

            <Separator className="my-6" />

            <h3 className="font-medium mb-4">Items</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left font-medium">Description</th>
                    <th className="px-4 py-2 text-right font-medium">Quantity</th>
                    <th className="px-4 py-2 text-right font-medium">Price</th>
                    <th className="px-4 py-2 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.length > 0 ? (
                    invoice.items.map((item: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="px-4 py-2">{item.description}</td>
                        <td className="px-4 py-2 text-right">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">{item.price}</td>
                        <td className="px-4 py-2 text-right">{item.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-2 text-center text-muted-foreground">
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <td colSpan={3} className="px-4 py-2 text-right font-medium">
                      Total
                    </td>
                    <td className="px-4 py-2 text-right font-bold">{invoice.amount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Name</h3>
                <p className="mt-1">{invoice.clients.name}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Company</h3>
                <p className="mt-1">{invoice.clients.company}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                <p className="mt-1">{invoice.clients.email}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Phone</h3>
                <p className="mt-1">{invoice.clients.phone}</p>
              </div>
              <div>
                <h3 className="font-medium text-sm text-muted-foreground">Address</h3>
                <p className="mt-1 whitespace-pre-line">{invoice.clients.address}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/dashboard/clients/${invoice.client_id}`}>View Client</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {isPayable && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Payment Options</CardTitle>
            <CardDescription>Pay this invoice using one of the following methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <AdumoPaymentButton invoiceId={invoice.id} amount={invoice.amount} size="lg" />
              {/* Add other payment methods here if needed */}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
