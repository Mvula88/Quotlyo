import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdumoPaymentButton } from "@/components/payment/adumo-payment-button"

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  // Fetch invoice details
  const { data: invoice, error } = await supabase.from("invoices").select("*").eq("id", params.id).single()

  if (error || !invoice) {
    notFound()
  }

  // Fetch client details
  const { data: client } = await supabase.from("clients").select("*").eq("id", invoice.client_id).single()

  const isPaid = invoice.status === "paid"

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Invoice {invoice.number}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
              <CardDescription>View and manage invoice information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Invoice Number</h3>
                    <p>{invoice.number}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <p className={`capitalize ${getStatusColor(invoice.status)}`}>{invoice.status}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Date</h3>
                    <p>{invoice.date}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                    <p>{invoice.due_date}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Client</h3>
                  <p>
                    {client?.name} ({client?.company})
                  </p>
                  <p className="text-sm text-muted-foreground">{client?.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Amount</h3>
                  <p className="text-xl font-bold">{invoice.amount}</p>
                </div>

                {/* Display invoice items if available */}
                {invoice.items && Array.isArray(invoice.items) && invoice.items.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Items</h3>
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Description</th>
                          <th className="text-right py-2">Quantity</th>
                          <th className="text-right py-2">Price</th>
                          <th className="text-right py-2">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoice.items.map((item: any, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{item.description}</td>
                            <td className="text-right py-2">{item.quantity}</td>
                            <td className="text-right py-2">${item.price.toFixed(2)}</td>
                            <td className="text-right py-2">${item.total.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <CardDescription>Process payment for this invoice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <h3 className="font-medium mb-1">Amount Due</h3>
                  <p className="text-2xl font-bold">{invoice.amount}</p>
                </div>

                {isPaid ? (
                  <div className="p-4 rounded-lg bg-green-50 text-green-700">
                    <p className="font-medium">This invoice has been paid.</p>
                    <p className="text-sm">Thank you for your payment!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Click the button below to process payment for this invoice using Adumo Online secure payment
                      gateway.
                    </p>

                    <AdumoPaymentButton invoiceId={invoice.id} amount={invoice.amount} className="w-full" />

                    <p className="text-xs text-muted-foreground text-center">Secured by Adumo Online Payment Gateway</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "paid":
      return "text-green-600"
    case "pending":
      return "text-amber-600"
    case "overdue":
      return "text-red-600"
    case "processing":
      return "text-blue-600"
    default:
      return "text-gray-600"
  }
}
