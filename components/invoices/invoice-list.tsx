"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PlusCircle, Edit, Trash2, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { formatCurrency } from "@/utils/format"
import type { Database } from "@/types/supabase"

type Invoice = Database["public"]["Tables"]["invoices"]["Row"]
type Client = Database["public"]["Tables"]["clients"]["Row"]

export function InvoiceList() {
  const [invoices, setInvoices] = useState<(Invoice & { client_name?: string })[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // Fetch invoices
        const { data: invoicesData, error: invoicesError } = await supabase
          .from("invoices")
          .select("*")
          .order("issue_date", { ascending: false })

        if (invoicesError) {
          throw invoicesError
        }

        // Fetch clients to get names
        const { data: clientsData, error: clientsError } = await supabase.from("clients").select("id, name")

        if (clientsError) {
          throw clientsError
        }

        // Create a map of client IDs to names
        const clientMap = new Map<string, string>()
        clientsData.forEach((client: Client) => {
          clientMap.set(client.id, client.name)
        })

        // Add client names to invoices
        const invoicesWithClientNames = invoicesData.map((invoice) => ({
          ...invoice,
          client_name: invoice.client_id ? clientMap.get(invoice.client_id) || "Unknown Client" : "No Client",
        }))

        setInvoices(invoicesWithClientNames)
      } catch (error: any) {
        toast({
          title: "Error fetching invoices",
          description: error.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [toast])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      try {
        const { error } = await supabase.from("invoices").delete().eq("id", id)

        if (error) {
          throw error
        }

        setInvoices(invoices.filter((invoice) => invoice.id !== id))
        toast({
          title: "Invoice deleted",
          description: "The invoice has been deleted successfully.",
        })
      } catch (error: any) {
        toast({
          title: "Error deleting invoice",
          description: error.message,
          variant: "destructive",
        })
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "overdue":
        return <Badge className="bg-red-500">Overdue</Badge>
      default:
        return <Badge className="bg-gray-500">{status}</Badge>
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Invoices</CardTitle>
        <Button onClick={() => router.push("/dashboard/invoices/new")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="mb-4 text-muted-foreground">No invoices found</p>
            <Button onClick={() => router.push("/dashboard/invoices/new")}>Create your first invoice</Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                  <TableCell>{invoice.client_name}</TableCell>
                  <TableCell>{new Date(invoice.issue_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                  <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/dashboard/invoices/${invoice.id}/view`)}
                      >
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => router.push(`/dashboard/invoices/${invoice.id}`)}
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDelete(invoice.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
