"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CalendarIcon, ImagePlus, Plus, Trash, Upload, Download } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { StampSelector } from "@/components/stamp-selector"
import { TemplateSelector, type TemplateId } from "@/components/template-selector"
import { QuotationTemplate } from "@/components/quotation-templates"
import { toast } from "@/components/ui/use-toast"

export default function NewQuotationPage() {
  // Quotation data state
  const [quotationData, setQuotationData] = useState({
    quotationNumber: "QT-001",
    date: new Date(),
    validUntil: new Date(new Date().setDate(new Date().getDate() + 30)),
    status: "draft",
    client: "",
    paymentTerms: "net30",
    notes: "This quotation is valid for 30 days from the date of issue.",
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
  })

  // Template state
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("classic")

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

  // Update client data when client selection changes
  useEffect(() => {
    if (quotationData.client) {
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
      }[quotationData.client]

      if (clientInfo) {
        setClientData(clientInfo)
      }
    }
  }, [quotationData.client])

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
        setQuotationData({
          ...quotationData,
          logo: event.target?.result as string,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setQuotationData({
      ...quotationData,
      logo: null,
    })
  }

  // Update quotation data
  const updateQuotationData = (field: string, value: any) => {
    setQuotationData({
      ...quotationData,
      [field]: value,
    })
  }

  const handleSaveQuotation = () => {
    // Validate required fields
    if (!quotationData.quotationNumber || !clientData.name || items[0].description === "") {
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
      title: "Quotation saved",
      description: `Quotation ${quotationData.quotationNumber} has been saved successfully.`,
    })

    // Redirect to quotations list after a short delay
    setTimeout(() => {
      window.location.href = "/dashboard/quotations"
    }, 1500)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex-1 p-4 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold tracking-tight">Create New Quotation</h2>
          <div className="flex items-center space-x-2">
            <Link href="/dashboard/quotations">
              <Button variant="outline">Cancel</Button>
            </Link>
            <Button onClick={handleSaveQuotation}>Save Quotation</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left side - Form */}
          <div className="space-y-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid grid-cols-4 mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="client">Client</TabsTrigger>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
              </TabsList>

              {/* Quotation Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quotation-number">Quotation Number</Label>
                        <Input
                          id="quotation-number"
                          value={quotationData.quotationNumber}
                          onChange={(e) => updateQuotationData("quotationNumber", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="date">Quotation Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {quotationData.date ? format(quotationData.date, "PPP") : <span>Pick a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={quotationData.date}
                              onSelect={(date) => date && updateQuotationData("date", date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="valid-until">Valid Until</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {quotationData.validUntil ? (
                                format(quotationData.validUntil, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={quotationData.validUntil}
                              onSelect={(date) => date && updateQuotationData("validUntil", date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={quotationData.status}
                          onValueChange={(value) => updateQuotationData("status", value)}
                        >
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="sent">Sent</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="declined">Declined</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="payment-terms">Payment Terms</Label>
                      <Select
                        value={quotationData.paymentTerms}
                        onValueChange={(value) => updateQuotationData("paymentTerms", value)}
                      >
                        <SelectTrigger id="payment-terms">
                          <SelectValue placeholder="Select terms" />
                        </SelectTrigger>
                        <SelectContent>
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
                        value={quotationData.notes}
                        onChange={(e) => updateQuotationData("notes", e.target.value)}
                        placeholder="Enter any additional notes..."
                      />
                    </div>
                    {/* Add Bank Account Details section */}
                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="text-lg font-medium">Bank Account Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bank-name">Bank Name</Label>
                          <Input
                            id="bank-name"
                            value={quotationData.bankName || ""}
                            onChange={(e) => updateQuotationData("bankName", e.target.value)}
                            placeholder="Enter bank name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="account-name">Account Name</Label>
                          <Input
                            id="account-name"
                            value={quotationData.accountName || ""}
                            onChange={(e) => updateQuotationData("accountName", e.target.value)}
                            placeholder="Enter account name"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="account-number">Account Number</Label>
                          <Input
                            id="account-number"
                            value={quotationData.accountNumber || ""}
                            onChange={(e) => updateQuotationData("accountNumber", e.target.value)}
                            placeholder="Enter account number"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="routing-number">Routing Number/BRANCH CODE (Optional)</Label>
                          <Input
                            id="routing-number"
                            value={quotationData.routingNumber || ""}
                            onChange={(e) => updateQuotationData("routingNumber", e.target.value)}
                            placeholder="Enter routing number or branch code"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="swift-code">SWIFT/BIC (Optional)</Label>
                        <Input
                          id="swift-code"
                          value={quotationData.swiftCode || ""}
                          onChange={(e) => updateQuotationData("swiftCode", e.target.value)}
                          placeholder="Enter SWIFT/BIC code"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Client Tab */}
              <TabsContent value="client" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="client">Select Client</Label>
                      <Select
                        value={quotationData.client}
                        onValueChange={(value) => updateQuotationData("client", value)}
                      >
                        <SelectTrigger id="client">
                          <SelectValue placeholder="Select client" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="acme">Acme Inc.</SelectItem>
                          <SelectItem value="globex">Globex Corp.</SelectItem>
                          <SelectItem value="stark">Stark Industries</SelectItem>
                          <SelectItem value="wayne">Wayne Enterprises</SelectItem>
                          <SelectItem value="umbrella">Umbrella Corp.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {quotationData.client && (
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <Label htmlFor="client-name">Client Name</Label>
                          <Input id="client-name" value={clientData.name} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client-company">Company</Label>
                          <Input id="client-company" value={clientData.company} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client-email">Email</Label>
                          <Input id="client-email" value={clientData.email} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client-phone">Phone</Label>
                          <Input id="client-phone" value={clientData.phone} disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="client-address">Address</Label>
                          <Textarea id="client-address" value={clientData.address} disabled />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Items Tab */}
              <TabsContent value="items" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50%]">Description</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Input
                                placeholder="Item description"
                                value={item.description}
                                onChange={(e) => updateItem(item.id, "description", e.target.value)}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => updateItem(item.id, "quantity", Number.parseInt(e.target.value))}
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.price}
                                onChange={(e) => updateItem(item.id, "price", Number.parseFloat(e.target.value))}
                              />
                            </TableCell>
                            <TableCell>${item.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeItem(item.id)}
                                disabled={items.length === 1}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" onClick={addItem}>
                        <Plus className="mr-2 h-4 w-4" />
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
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total:</span>
                        <span>${calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Design Tab */}
              <TabsContent value="design" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Template</h3>
                      <TemplateSelector
                        type="quotation"
                        selectedTemplate={selectedTemplate}
                        onSelectTemplate={setSelectedTemplate}
                        isPremiumUser={false}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Company Information</h3>
                      <div className="space-y-2">
                        <Label htmlFor="company-name">Company Name</Label>
                        <Input
                          id="company-name"
                          value={quotationData.companyName}
                          onChange={(e) => updateQuotationData("companyName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-address">Company Address</Label>
                        <Textarea
                          id="company-address"
                          value={quotationData.companyAddress}
                          onChange={(e) => updateQuotationData("companyAddress", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company-phone">Phone</Label>
                          <Input
                            id="company-phone"
                            value={quotationData.companyPhone}
                            onChange={(e) => updateQuotationData("companyPhone", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company-email">Email</Label>
                          <Input
                            id="company-email"
                            value={quotationData.companyEmail}
                            onChange={(e) => updateQuotationData("companyEmail", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company-website">Website</Label>
                        <Input
                          id="company-website"
                          value={quotationData.companyWebsite}
                          onChange={(e) => updateQuotationData("companyWebsite", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="text-lg font-medium">Logo</h3>
                      <div className="flex items-center gap-4">
                        {quotationData.logo ? (
                          <div className="relative h-20 w-40 border rounded-md overflow-hidden">
                            <img
                              src={quotationData.logo || "/placeholder.svg"}
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
                          <div className="flex h-20 w-40 items-center justify-center rounded-md border border-dashed">
                            <ImagePlus className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <Label htmlFor="logo-upload" className="cursor-pointer">
                            <div className="flex items-center gap-2">
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
                          <p className="text-xs text-muted-foreground mt-1">Recommended size: 300x150px, PNG or JPG</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <h3 className="text-lg font-medium">Stamp</h3>
                      <div className="flex items-center space-x-2">
                        <StampSelector onSelectStamp={handleStampSelect} />
                        {stampConfig && (
                          <Button variant="outline" size="sm" onClick={() => setStampConfig(null)}>
                            Remove Stamp
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right side - Preview */}
          <div className="sticky top-20 self-start">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-medium">Quotation Preview</h3>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>

            <QuotationTemplate
              templateId={selectedTemplate}
              quotationData={quotationData}
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
            />
          </div>
        </div>
      </main>
    </div>
  )
}
