"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { CalendarIcon, ImagePlus, Plus, Trash, Upload, Download } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { PremiumButton } from "@/components/ui/premium-button"
import { Calendar } from "@/components/ui/calendar"
import { CardContent } from "@/components/ui/card"
import { MotionCard } from "@/components/ui/motion-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { StampSelector } from "@/components/stamp-selector"
import { TemplateSelector, type TemplateId } from "@/components/template-selector"
import { InvoiceTemplate } from "@/components/invoice-templates"
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border"
// First, import the FileUpload component at the top of the file
import { FileUpload } from "@/components/ui/file-upload"
import { toast } from "@/components/ui/use-toast"

export default function NewInvoicePage() {
  // Invoice data state
  // Update the invoiceData state to include pdfAttachment
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: "INV-001",
    date: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    status: "draft",
    client: "",
    paymentTerms: "net30",
    notes: "Thank you for your business!",
    companyName: "Your Company Name",
    companyAddress: "123 Business Street\nBusiness City, 12345",
    companyPhone: "(555) 123-4567",
    companyEmail: "contact@yourcompany.com",
    companyWebsite: "www.yourcompany.com",
    logo: null,
    // Add bank account fields
    bankName: "Bank of Business",
    accountName: "Your Company Name",
    accountNumber: "1234567890",
    routingNumber: "987654321",
    swiftCode: "",
    // Add a new field to the invoiceData state for the PDF attachment
    pdfAttachment: null,
  })

  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("classic")
  const [isLoaded, setIsLoaded] = useState(false)

  // Client data state
  const [clientData, setClientData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    address: "",
  })

  // Items state
  const [items, setItems] = useState([{ id: 1, description: "", quantity: 1, price: 0, total: 0 }])

  // Stamp state
  const [stampConfig, setStampConfig] = useState<any | null>(null)
  const [stampPosition, setStampPosition] = useState({ x: 70, y: 30 })
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Update client data when client selection changes
  useEffect(() => {
    if (invoiceData.client) {
      // In a real app, this would fetch client data from an API
      const clientInfo = {
        acme: {
          name: "John Smith",
          company: "Acme Inc.",
          email: "john@acmeinc.com",
          phone: "(555) 123-4567",
          address: "123 Acme Street\nAcme City, AC 12345",
        },
        globex: {
          name: "Jane Doe",
          company: "Globex Corp.",
          email: "jane@globexcorp.com",
          phone: "(555) 987-6543",
          address: "456 Globex Avenue\nGlobex City, GX 67890",
        },
        stark: {
          name: "Tony Stark",
          company: "Stark Industries",
          email: "tony@starkindustries.com",
          phone: "(555) 111-2222",
          address: "789 Stark Tower\nNew York, NY 10001",
        },
        wayne: {
          name: "Bruce Wayne",
          company: "Wayne Enterprises",
          email: "bruce@wayneenterprises.com",
          phone: "(555) 333-4444",
          address: "1 Wayne Manor\nGotham City, GC 43210",
        },
        umbrella: {
          name: "Albert Wesker",
          company: "Umbrella Corp.",
          email: "wesker@umbrellacorp.com",
          phone: "(555) 555-6666",
          address: "555 Umbrella Road\nRaccoon City, RC 98765",
        },
      }[invoiceData.client]

      if (clientInfo) {
        setClientData(clientInfo)
      }
    }
  }, [invoiceData.client])

  // Calculate totals
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.1 // 10% tax
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  // Item management
  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1
    setItems([...items, { id: newId, description: "", quantity: 1, price: 0, total: 0 }])
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateItem = (id: number, field: string, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Recalculate total if quantity or price changes
          if (field === "quantity" || field === "price") {
            updatedItem.total = Number(updatedItem.quantity) * Number(updatedItem.price)
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  // Stamp management
  const handleStampSelect = (config: any) => {
    setStampConfig(config)
  }

  const handleStampDragStart = (e: React.MouseEvent) => {
    if (stampConfig) {
      setIsDragging(true)
    }
  }

  const handleStampDragMove = (e: React.MouseEvent) => {
    if (isDragging && stampConfig) {
      const container = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - container.left) / container.width) * 100
      const y = ((e.clientY - container.top) / container.height) * 100
      setStampPosition({ x, y })
    }
  }

  const handleStampDragEnd = () => {
    setIsDragging(false)
  }

  // Logo management
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setInvoiceData({
          ...invoiceData,
          logo: event.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setInvoiceData({
      ...invoiceData,
      logo: null,
    })
  }

  // Update invoice data
  const updateInvoiceData = (field: string, value: any) => {
    setInvoiceData({
      ...invoiceData,
      [field]: value,
    })
  }

  // Add a function to handle PDF attachment changes
  const handlePdfAttachmentChange = (file: File | null) => {
    setInvoiceData({
      ...invoiceData,
      pdfAttachment: file,
    })
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const handleSaveInvoice = () => {
    // Validate required fields
    if (!invoiceData.invoiceNumber || !clientData.name || items[0].description === "") {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields before saving.",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would save to a database
    // For now, we'll just show a success message
    toast({
      title: "Invoice saved",
      description: `Invoice ${invoiceData.invoiceNumber} has been saved successfully.`,
    })

    // Redirect to invoices list after a short delay
    setTimeout(() => {
      window.location.href = "/dashboard/invoices"
    }, 1500)
  }

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    toast({
      title: "PDF Downloaded",
      description: `Invoice ${invoiceData.invoiceNumber} has been downloaded as a PDF.`,
    })
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 lg:p-8">
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight gradient-text">Create New Invoice</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/invoices">
              <Button variant="outline" className="border-premium-200 hover:bg-premium-50">
                Cancel
              </Button>
            </Link>
            <PremiumButton variant="premium" onClick={handleSaveInvoice}>
              Save Invoice
            </PremiumButton>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          variants={container}
          initial="hidden"
          animate={isLoaded ? "show" : "hidden"}
        >
          {/* Left side - Form */}
          <motion.div className="space-y-6" variants={item}>
            <AnimatedGradientBorder>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4 bg-background/80">
                  <TabsTrigger
                    value="details"
                    className="data-[state=active]:bg-premium-600 data-[state=active]:text-white"
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="client"
                    className="data-[state=active]:bg-premium-600 data-[state=active]:text-white"
                  >
                    Client
                  </TabsTrigger>
                  <TabsTrigger
                    value="items"
                    className="data-[state=active]:bg-premium-600 data-[state=active]:text-white"
                  >
                    Items
                  </TabsTrigger>
                  <TabsTrigger
                    value="design"
                    className="data-[state=active]:bg-premium-600 data-[state=active]:text-white"
                  >
                    Design
                  </TabsTrigger>
                </TabsList>

                {/* Details Tab */}
                <TabsContent value="details" className="space-y-4">
                  <MotionCard>
                    <CardContent className="pt-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="invoice-number">Invoice Number</Label>
                          <Input
                            id="invoice-number"
                            value={invoiceData.invoiceNumber}
                            onChange={(e) => updateInvoiceData("invoiceNumber", e.target.value)}
                            className="border-premium-100 focus-visible:ring-premium-500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="date">Invoice Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className="w-full justify-start text-left font-normal border-premium-100 hover:bg-premium-50"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 text-premium-600" />
                                {invoiceData.date ? format(invoiceData.date, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 animate-in slide-in-from-top-1">
                              <Calendar
                                mode="single"
                                selected={invoiceData.date}
                                onSelect={(date) => date && updateInvoiceData("date", date)}
                                initialFocus
                                className="rounded-md border border-premium-100"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="due-date">Due Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className="w-full justify-start text-left font-normal border-premium-100 hover:bg-premium-50"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4 text-premium-600" />
                                {invoiceData.dueDate ? format(invoiceData.dueDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 animate-in slide-in-from-top-1">
                              <Calendar
                                mode="single"
                                selected={invoiceData.dueDate}
                                onSelect={(date) => date && updateInvoiceData("dueDate", date)}
                                initialFocus
                                className="rounded-md border border-premium-100"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={invoiceData.status}
                            onValueChange={(value) => updateInvoiceData("status", value)}
                          >
                            <SelectTrigger id="status" className="border-premium-100">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent className="animate-in slide-in-from-top-1">
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="overdue">Overdue</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment-terms">Payment Terms</Label>
                        <Select
                          value={invoiceData.paymentTerms}
                          onValueChange={(value) => updateInvoiceData("paymentTerms", value)}
                        >
                          <SelectTrigger id="payment-terms" className="border-premium-100">
                            <SelectValue placeholder="Select terms" />
                          </SelectTrigger>
                          <SelectContent className="animate-in slide-in-from-top-1">
                            <SelectItem value="net15">Net 15</SelectItem>
                            <SelectItem value="net30">Net 30</SelectItem>
                            <SelectItem value="net60">Net 60</SelectItem>
                            <SelectItem value="due-receipt">Due on Receipt</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={invoiceData.notes}
                          onChange={(e) => updateInvoiceData("notes", e.target.value)}
                          placeholder="Enter any additional notes..."
                          className="border-premium-100 focus-visible:ring-premium-500"
                        />
                      </div>
                      {/* Add this inside the CardContent in the Details tab, after the notes field: */}
                      <div className="space-y-2">
                        <Label htmlFor="pdf-attachment">Attach PDF Document</Label>
                        <FileUpload onFileChange={handlePdfAttachmentChange} accept=".pdf" maxSize={5} />
                        <p className="text-xs text-muted-foreground">
                          Attach additional documentation, terms, or supporting files (Max 5MB)
                        </p>
                      </div>
                      {/* Add Bank Account Details section */}
                      <div className="space-y-4 pt-4 border-t border-premium-100/30">
                        <h3 className="text-lg font-medium gradient-text">Bank Account Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="bank-name">Bank Name</Label>
                            <Input
                              id="bank-name"
                              value={invoiceData.bankName || ""}
                              onChange={(e) => updateInvoiceData("bankName", e.target.value)}
                              className="border-premium-100 focus-visible:ring-premium-500"
                              placeholder="Enter bank name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="account-name">Account Name</Label>
                            <Input
                              id="account-name"
                              value={invoiceData.accountName || ""}
                              onChange={(e) => updateInvoiceData("accountName", e.target.value)}
                              className="border-premium-100 focus-visible:ring-premium-500"
                              placeholder="Enter account name"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="account-number">Account Number</Label>
                            <Input
                              id="account-number"
                              value={invoiceData.accountNumber || ""}
                              onChange={(e) => updateInvoiceData("accountNumber", e.target.value)}
                              className="border-premium-100 focus-visible:ring-premium-500"
                              placeholder="Enter account number"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="routing-number">Routing Number/BRANCH CODE (Optional)</Label>
                            <Input
                              id="routing-number"
                              value={invoiceData.routingNumber || ""}
                              onChange={(e) => updateInvoiceData("routingNumber", e.target.value)}
                              className="border-premium-100 focus-visible:ring-premium-500"
                              placeholder="Enter routing number or branch code"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="swift-code">SWIFT/BIC (Optional)</Label>
                          <Input
                            id="swift-code"
                            value={invoiceData.swiftCode || ""}
                            onChange={(e) => updateInvoiceData("swiftCode", e.target.value)}
                            className="border-premium-100 focus-visible:ring-premium-500"
                            placeholder="Enter SWIFT/BIC code"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </MotionCard>
                </TabsContent>

                {/* Client Tab */}
                <TabsContent value="client" className="space-y-4">
                  <MotionCard>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="client">Select Client</Label>
                        <Select
                          value={invoiceData.client}
                          onValueChange={(value) => updateInvoiceData("client", value)}
                        >
                          <SelectTrigger id="client" className="border-premium-100">
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                          <SelectContent className="animate-in slide-in-from-top-1">
                            <SelectItem value="acme">Acme Inc.</SelectItem>
                            <SelectItem value="globex">Globex Corp.</SelectItem>
                            <SelectItem value="stark">Stark Industries</SelectItem>
                            <SelectItem value="wayne">Wayne Enterprises</SelectItem>
                            <SelectItem value="umbrella">Umbrella Corp.</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {invoiceData.client && (
                        <div className="space-y-4 pt-4">
                          <div className="space-y-2">
                            <Label htmlFor="client-name">Client Name</Label>
                            <Input id="client-name" value={clientData.name} disabled className="bg-premium-50/50" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="client-company">Company</Label>
                            <Input
                              id="client-company"
                              value={clientData.company}
                              disabled
                              className="bg-premium-50/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="client-email">Email</Label>
                            <Input id="client-email" value={clientData.email} disabled className="bg-premium-50/50" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="client-phone">Phone</Label>
                            <Input id="client-phone" value={clientData.phone} disabled className="bg-premium-50/50" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="client-address">Address</Label>
                            <Textarea
                              id="client-address"
                              value={clientData.address}
                              disabled
                              className="bg-premium-50/50"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </MotionCard>
                </TabsContent>

                {/* Items Tab */}
                <TabsContent value="items" className="space-y-4">
                  <MotionCard>
                    <CardContent className="pt-6">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-premium-50/50">
                            <TableHead className="w-[50%]">Description</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {items.map((item) => (
                            <TableRow key={item.id} className="animate-enter">
                              <TableCell>
                                <Input
                                  placeholder="Item description"
                                  value={item.description}
                                  onChange={(e) => updateItem(item.id, "description", e.target.value)}
                                  className="border-premium-100"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value))}
                                  className="border-premium-100"
                                />
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.price}
                                  onChange={(e) => updateItem(item.id, "price", Number.parseFloat(e.target.value))}
                                  className="border-premium-100"
                                />
                              </TableCell>
                              <TableCell className="font-medium">${item.total.toFixed(2)}</TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeItem(item.id)}
                                  disabled={items.length === 1}
                                  className="hover:bg-red-50 hover:text-red-500"
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addItem}
                          className="border-premium-200 hover:bg-premium-50"
                        >
                          <Plus className="mr-2 h-4 w-4 text-premium-600" />
                          Add Item
                        </Button>
                      </div>

                      <div className="mt-6 space-y-2 text-right">
                        <div className="flex justify-between">
                          <span className="font-medium">Subtotal:</span>
                          <span>${calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-medium">Tax (10%):</span>
                          <span>${calculateTax().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-premium-700">
                          <span>Total:</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </MotionCard>
                </TabsContent>

                {/* Design Tab */}
                <TabsContent value="design" className="space-y-4">
                  <MotionCard>
                    <CardContent className="pt-6 space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium gradient-text">Template</h3>
                        <TemplateSelector
                          type="invoice"
                          selectedTemplate={selectedTemplate}
                          onSelectTemplate={setSelectedTemplate}
                          isPremiumUser={false}
                          className="w-full border-premium-100 hover:bg-premium-50"
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-medium gradient-text">Company Information</h3>
                        <div className="space-y-2">
                          <Label htmlFor="company-name">Company Name</Label>
                          <Input
                            id="company-name"
                            value={invoiceData.companyName}
                            onChange={(e) => updateInvoiceData("companyName", e.target.value)}
                            className="border-premium-100"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company-address">Company Address</Label>
                          <Textarea
                            id="company-address"
                            value={invoiceData.companyAddress}
                            onChange={(e) => updateInvoiceData("companyAddress", e.target.value)}
                            className="border-premium-100"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="company-phone">Phone</Label>
                            <Input
                              id="company-phone"
                              value={invoiceData.companyPhone}
                              onChange={(e) => updateInvoiceData("companyPhone", e.target.value)}
                              className="border-premium-100"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company-email">Email</Label>
                            <Input
                              id="company-email"
                              value={invoiceData.companyEmail}
                              onChange={(e) => updateInvoiceData("companyEmail", e.target.value)}
                              className="border-premium-100"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company-website">Website</Label>
                          <Input
                            id="company-website"
                            value={invoiceData.companyWebsite}
                            onChange={(e) => updateInvoiceData("companyWebsite", e.target.value)}
                            className="border-premium-100"
                          />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-premium-100/30">
                        <h3 className="text-lg font-medium gradient-text">Logo</h3>
                        <div className="flex items-center gap-4">
                          {invoiceData.logo ? (
                            <div className="relative h-20 w-40 border rounded-md overflow-hidden border-premium-200 shadow-sm">
                              <img
                                src={invoiceData.logo || "/placeholder.svg"}
                                alt="Company Logo"
                                className="h-full w-full object-contain"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={removeLogo}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex h-20 w-40 items-center justify-center rounded-md border border-dashed border-premium-200 bg-premium-50/30">
                              <ImagePlus className="h-8 w-8 text-premium-400" />
                            </div>
                          )}
                          <div>
                            <Label htmlFor="logo-upload" className="cursor-pointer">
                              <div className="flex items-center gap-2 text-premium-600 hover:text-premium-700 transition-colors">
                                <Upload className="h-4 w-4" />
                                <span>Upload Logo</span>
                              </div>
                            </Label>
                            <Input
                              id="logo-upload"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleLogoUpload}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Recommended size: 300x150px, PNG or JPG
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-premium-100/30">
                        <h3 className="text-lg font-medium gradient-text">Stamp</h3>
                        <div className="flex items-center space-x-2">
                          <StampSelector onSelectStamp={handleStampSelect} />
                          {stampConfig && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setStampConfig(null)}
                              className="border-premium-200 hover:bg-premium-50"
                            >
                              Remove Stamp
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </MotionCard>
                </TabsContent>
              </Tabs>
            </AnimatedGradientBorder>
          </motion.div>

          {/* Right side - Preview */}
          <motion.div className="sticky top-20 self-start" variants={item}>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-medium gradient-text">Invoice Preview</h3>
              <PremiumButton variant="premium" size="sm" onClick={handleDownloadPDF}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </PremiumButton>
            </div>

            <AnimatedGradientBorder>
              <InvoiceTemplate
                templateId={selectedTemplate}
                invoiceData={invoiceData}
                clientData={clientData}
                items={items}
                calculateSubtotal={calculateSubtotal}
                calculateTax={calculateTax}
                calculateTotal={calculateTotal}
                stampConfig={stampConfig}
                stampPosition={stampPosition}
                isDragging={isDragging}
                onStampDragStart={handleStampDragStart}
                onStampDragMove={handleStampDragMove}
                onStampDragEnd={handleStampDragEnd}
                // Add this line:
                pdfAttachment={invoiceData.pdfAttachment}
              />
            </AnimatedGradientBorder>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
