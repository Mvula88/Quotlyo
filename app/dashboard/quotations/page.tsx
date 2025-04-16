"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpDown, ChevronDown, Download, MoreHorizontal, Plus, Send } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

// Define the quotation type
type Quotation = {
  id: string
  number: string
  client: string
  amount: string
  status: "Sent" | "Accepted" | "Pending" | "Declined"
  date: string
}

export default function QuotationsPage() {
  // Sample quotation data
  const [quotations, setQuotations] = useState<Quotation[]>([
    {
      id: "1",
      number: "QT-001",
      client: "Acme Inc.",
      amount: "$2,500.00",
      status: "Sent",
      date: "2023-04-11",
    },
    {
      id: "2",
      number: "QT-002",
      client: "Globex Corp.",
      amount: "$4,800.00",
      status: "Accepted",
      date: "2023-04-05",
    },
    {
      id: "3",
      number: "QT-003",
      client: "Stark Industries",
      amount: "$7,200.00",
      status: "Pending",
      date: "2023-03-28",
    },
    {
      id: "4",
      number: "QT-004",
      client: "Wayne Enterprises",
      amount: "$5,400.00",
      status: "Declined",
      date: "2023-03-15",
    },
    {
      id: "5",
      number: "QT-005",
      client: "Umbrella Corp.",
      amount: "$3,200.00",
      status: "Sent",
      date: "2023-03-10",
    },
  ])

  // State for dialogs
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [convertDialogOpen, setConvertDialogOpen] = useState(false)
  const [sendDialogOpen, setSendDialogOpen] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)

  // State for convert dialog
  const [convertData, setConvertData] = useState({
    invoiceNumber: "",
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    notes: "",
  })

  // Handle view details
  const handleViewDetails = (quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setViewDialogOpen(true)
  }

  // Handle edit quotation
  const handleEditQuotation = (quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setEditDialogOpen(true)
  }

  // Handle convert to invoice
  const handleConvertToInvoice = (quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setConvertData({
      ...convertData,
      invoiceNumber: `INV-${quotation.number.split("-")[1]}`,
    })
    setConvertDialogOpen(true)
  }

  // Handle download PDF
  const handleDownloadPDF = (quotation: Quotation) => {
    // In a real app, this would generate and download a PDF
    toast({
      title: "PDF Downloaded",
      description: `Quotation ${quotation.number} has been downloaded.`,
    })
  }

  // Handle send to client
  const handleSendToClient = (quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setSendDialogOpen(true)
  }

  // Handle save edited quotation
  const handleSaveQuotation = () => {
    if (selectedQuotation) {
      setQuotations(quotations.map((q) => (q.id === selectedQuotation.id ? selectedQuotation : q)))
      setEditDialogOpen(false)
      toast({
        title: "Quotation Updated",
        description: `Quotation ${selectedQuotation.number} has been updated.`,
      })
    }
  }

  // Handle convert confirmation
  const handleConvertConfirm = () => {
    if (selectedQuotation) {
      // Create a new invoice from the quotation
      const newInvoice = {
        id: `inv-${Date.now()}`,
        number: convertData.invoiceNumber,
        client: selectedQuotation.client,
        amount: selectedQuotation.amount,
        status: "Pending" as const,
        date: convertData.invoiceDate,
        convertedFrom: selectedQuotation.number,
      }

      // Get existing converted invoices from localStorage or initialize empty array
      const existingInvoices = JSON.parse(localStorage.getItem("convertedInvoices") || "[]")

      // Add the new invoice
      const updatedInvoices = [...existingInvoices, newInvoice]

      // Save to localStorage
      localStorage.setItem("convertedInvoices", JSON.stringify(updatedInvoices))

      // Update quotation status to "Accepted" if it's not already
      if (selectedQuotation.status !== "Accepted") {
        const updatedQuotation = { ...selectedQuotation, status: "Accepted" as const }
        setQuotations(quotations.map((q) => (q.id === selectedQuotation.id ? updatedQuotation : q)))
      }

      setConvertDialogOpen(false)
      toast({
        title: "Quotation Converted",
        description: (
          <div>
            <p>
              Quotation {selectedQuotation.number} has been converted to invoice {convertData.invoiceNumber}.
            </p>
            <p className="mt-2">
              <Link href="/dashboard/invoices" className="underline text-blue-600">
                View in Invoices
              </Link>
            </p>
          </div>
        ),
      })
    }
  }

  // Handle send confirmation
  const handleSendConfirm = () => {
    if (selectedQuotation) {
      // In a real app, this would send an email
      setSendDialogOpen(false)
      toast({
        title: "Quotation Sent",
        description: `Quotation ${selectedQuotation.number} has been sent to the client.`,
      })
    }
  }

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Sent":
        return "bg-blue-100 text-blue-800"
      case "Accepted":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Declined":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Quotations</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/quotations/new">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Quotation
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quotation Management</CardTitle>
              <CardDescription>Create, view, and manage all your quotations in one place.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Input placeholder="Search quotations..." className="h-9 w-[250px]" />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="ml-auto">
                        Columns <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem checked>Quote #</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked>Client</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked>Amount</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked>Status</DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem checked>Date</DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">
                        <div className="flex items-center space-x-1">
                          <span>Quote #</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Client</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Amount</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Status</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center space-x-1">
                          <span>Date</span>
                          <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotations.map((quotation) => (
                      <TableRow key={quotation.id}>
                        <TableCell className="font-medium">{quotation.number}</TableCell>
                        <TableCell>{quotation.client}</TableCell>
                        <TableCell>{quotation.amount}</TableCell>
                        <TableCell>
                          <div
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${getStatusBadgeClass(quotation.status)}`}
                          >
                            {quotation.status}
                          </div>
                        </TableCell>
                        <TableCell>{quotation.date}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleViewDetails(quotation)}>
                                View details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditQuotation(quotation)}>
                                Edit quotation
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleConvertToInvoice(quotation)}>
                                Convert to invoice
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDownloadPDF(quotation)}>
                                Download PDF
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleSendToClient(quotation)}>
                                Send to client
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* View Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Quotation Details</DialogTitle>
            <DialogDescription>Detailed information about quotation {selectedQuotation?.number}.</DialogDescription>
          </DialogHeader>
          {selectedQuotation && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quote-number">Quotation Number</Label>
                  <div id="quote-number" className="text-sm mt-1">
                    {selectedQuotation.number}
                  </div>
                </div>
                <div>
                  <Label htmlFor="quote-date">Date</Label>
                  <div id="quote-date" className="text-sm mt-1">
                    {selectedQuotation.date}
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="quote-client">Client</Label>
                <div id="quote-client" className="text-sm mt-1">
                  {selectedQuotation.client}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quote-amount">Amount</Label>
                  <div id="quote-amount" className="text-sm mt-1">
                    {selectedQuotation.amount}
                  </div>
                </div>
                <div>
                  <Label htmlFor="quote-status">Status</Label>
                  <div id="quote-status" className="text-sm mt-1">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${getStatusBadgeClass(selectedQuotation.status)}`}
                    >
                      {selectedQuotation.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setViewDialogOpen(false)
                if (selectedQuotation) handleEditQuotation(selectedQuotation)
              }}
            >
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Quotation Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Quotation</DialogTitle>
            <DialogDescription>Make changes to quotation {selectedQuotation?.number}.</DialogDescription>
          </DialogHeader>
          {selectedQuotation && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-number">Quotation Number</Label>
                  <Input
                    id="edit-number"
                    value={selectedQuotation.number}
                    onChange={(e) => setSelectedQuotation({ ...selectedQuotation, number: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-date">Date</Label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={selectedQuotation.date}
                    onChange={(e) => setSelectedQuotation({ ...selectedQuotation, date: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-client">Client</Label>
                <Input
                  id="edit-client"
                  value={selectedQuotation.client}
                  onChange={(e) => setSelectedQuotation({ ...selectedQuotation, client: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Amount</Label>
                  <Input
                    id="edit-amount"
                    value={selectedQuotation.amount}
                    onChange={(e) => setSelectedQuotation({ ...selectedQuotation, amount: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select
                    value={selectedQuotation.status}
                    onValueChange={(value) =>
                      setSelectedQuotation({
                        ...selectedQuotation,
                        status: value as "Sent" | "Accepted" | "Pending" | "Declined",
                      })
                    }
                  >
                    <SelectTrigger id="edit-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sent">Sent</SelectItem>
                      <SelectItem value="Accepted">Accepted</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Declined">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveQuotation}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert to Invoice Dialog */}
      <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Convert to Invoice</DialogTitle>
            <DialogDescription>Convert quotation {selectedQuotation?.number} to an invoice.</DialogDescription>
          </DialogHeader>
          {selectedQuotation && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-number">Invoice Number</Label>
                <Input
                  id="invoice-number"
                  value={convertData.invoiceNumber}
                  onChange={(e) => setConvertData({ ...convertData, invoiceNumber: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-date">Invoice Date</Label>
                <Input
                  id="invoice-date"
                  type="date"
                  value={convertData.invoiceDate}
                  onChange={(e) => setConvertData({ ...convertData, invoiceDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-due-date">Due Date</Label>
                <Input
                  id="invoice-due-date"
                  type="date"
                  value={convertData.dueDate}
                  onChange={(e) => setConvertData({ ...convertData, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoice-notes">Additional Notes</Label>
                <Textarea
                  id="invoice-notes"
                  placeholder="Add any additional notes for the invoice..."
                  value={convertData.notes}
                  onChange={(e) => setConvertData({ ...convertData, notes: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConvertConfirm}>Convert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send to Client Dialog */}
      <Dialog open={sendDialogOpen} onOpenChange={setSendDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Send to Client</DialogTitle>
            <DialogDescription>
              Send quotation {selectedQuotation?.number} to {selectedQuotation?.client}.
            </DialogDescription>
          </DialogHeader>
          {selectedQuotation && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="client-email">Client Email</Label>
                <Input id="client-email" type="email" placeholder="client@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-subject">Subject</Label>
                <Input id="email-subject" defaultValue={`Quotation ${selectedQuotation.number} from Quotlyo`} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-message">Message</Label>
                <Textarea
                  id="email-message"
                  placeholder="Add a message to the client..."
                  defaultValue={`Dear ${selectedQuotation.client},\n\nPlease find attached quotation ${selectedQuotation.number} for your review.\n\nBest regards,\nYour Name\nQuotlyo`}
                  rows={6}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="attach-pdf" className="rounded border-gray-300" defaultChecked />
                <Label htmlFor="attach-pdf" className="text-sm">
                  Attach PDF
                </Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendConfirm}>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
