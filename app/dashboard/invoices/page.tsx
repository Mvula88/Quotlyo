import { InvoiceList } from "@/components/invoices/invoice-list"

export default function InvoicesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-6 text-3xl font-bold">Invoices</h1>
      <InvoiceList />
    </div>
  )
}
