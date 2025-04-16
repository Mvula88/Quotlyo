"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import {
  Check,
  Download,
  Plus,
  Save,
  Trash2,
  Copy,
  Undo,
  FileText,
  Layers,
  RotateCcw,
  ChevronRight,
  Search,
  Star,
  Eye,
  CloudUpload,
  History,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StampComponent } from "@/components/ui/stamp"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"

// Sample document for preview
const SAMPLE_DOCUMENT = {
  title: "Invoice #1234",
  date: "April 12, 2023",
  client: "Acme Corporation",
  items: [
    { name: "Web Design", price: "$1,200.00" },
    { name: "Development", price: "$2,400.00" },
    { name: "Hosting (Annual)", price: "$240.00" },
  ],
  total: "$3,840.00",
}

// Stamp templates
const STAMP_TEMPLATES = [
  {
    id: "paid-premium",
    name: "Premium Paid",
    shape: "circle",
    color: "#D32F2F",
    businessName: "QUOTLYO",
    customText: "PAID",
    showDate: true,
    featured: true,
    category: "payment",
  },
  {
    id: "approved-modern",
    name: "Modern Approval",
    shape: "rectangle",
    color: "#388E3C",
    businessName: "QUOTLYO",
    customText: "APPROVED",
    showDate: true,
    featured: true,
    category: "approval",
  },
  {
    id: "pending-elegant",
    name: "Elegant Pending",
    shape: "oval",
    color: "#1976D2",
    businessName: "QUOTLYO",
    customText: "PENDING",
    showDate: true,
    category: "status",
  },
  {
    id: "confidential-secure",
    name: "Secure Confidential",
    shape: "rectangle",
    color: "#7B1FA2",
    businessName: "QUOTLYO",
    customText: "CONFIDENTIAL",
    showDate: false,
    category: "security",
  },
  {
    id: "draft-simple",
    name: "Simple Draft",
    shape: "square",
    color: "#455A64",
    businessName: "QUOTLYO",
    customText: "DRAFT",
    showDate: true,
    category: "status",
  },
  {
    id: "void-bold",
    name: "Bold Void",
    shape: "circle",
    color: "#D32F2F",
    businessName: "QUOTLYO",
    customText: "VOID",
    showDate: true,
    category: "cancellation",
  },
]

// Color options
const COLOR_OPTIONS = [
  { name: "Red", value: "#D32F2F" },
  { name: "Blue", value: "#1976D2" },
  { name: "Green", value: "#388E3C" },
  { name: "Purple", value: "#7B1FA2" },
  { name: "Amber", value: "#FFA000" },
  { name: "Slate", value: "#455A64" },
]

// Recent documents
const RECENT_DOCUMENTS = [
  { id: "doc1", name: "Invoice #1234", type: "invoice", date: "Today" },
  { id: "doc2", name: "Quotation #567", type: "quotation", date: "Yesterday" },
  { id: "doc3", name: "Contract #890", type: "contract", date: "Apr 10" },
]

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function StampManagerPage() {
  const [activeTab, setActiveTab] = useState("create")
  const [stampData, setStampData] = useState({
    businessName: "QUOTLYO",
    text: "PAID",
    date: new Date().toISOString().split("T")[0],
    shape: "circle",
    color: "#D32F2F",
    size: "medium",
    rotation: 0,
    opacity: 100,
    borderWidth: 3,
    borderStyle: "dashed",
    showShadow: false,
    showDate: true,
    dateFormat: "DD/MM/YYYY",
    position: "center",
  })
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [stampHistory, setStampHistory] = useState<any[]>([])
  const [documentPreview, setDocumentPreview] = useState(false)
  const [stampPosition, setStampPosition] = useState({ x: 50, y: 50 })
  const [isDragging, setIsDragging] = useState(false)
  const [recentStamps, setRecentStamps] = useState<any[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const documentRef = useRef<HTMLDivElement>(null)

  const handleChange = (field: string, value: any) => {
    setStampData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template.id)
    setStampData((prev) => ({
      ...prev,
      businessName: template.businessName,
      text: template.customText,
      shape: template.shape,
      color: template.color,
      showDate: template.showDate,
    }))
  }

  const handleDragStart = (e: React.MouseEvent) => {
    if (!documentPreview) return
    setIsDragging(true)
  }

  const handleDragMove = (e: React.MouseEvent) => {
    if (!isDragging || !documentRef.current) return

    const rect = documentRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setStampPosition({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    })
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const handleUndo = () => {
    if (stampHistory.length > 1) {
      const previousState = stampHistory[stampHistory.length - 2]
      setStampData(previousState)
      setStampHistory((prev) => prev.slice(0, -1))
    }
  }

  const filteredTemplates = STAMP_TEMPLATES.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.customText.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleSaveStamp = () => {
    // In a real app, this would save to a database
    toast({
      title: "Stamp saved",
      description: "Your custom stamp has been saved to your library.",
    })

    // Reset the form or navigate to another page
    // For now, we'll just close the dialog
    setIsDialogOpen(false)
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <motion.main className="flex-1 space-y-8 p-8" initial="hidden" animate="show" variants={containerVariants}>
        <motion.div className="flex items-center justify-between" variants={itemVariants}>
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Stamp Manager
            </h2>
            <p className="text-muted-foreground mt-1">Create, customize and manage your business stamps</p>
          </div>
          <div className="flex items-center space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <History className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>History</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={handleUndo} disabled={stampHistory.length <= 1}>
                    <Undo className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Undo</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="default"
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Stamp
            </Button>
          </div>
        </motion.div>

        <Tabs defaultValue="create" className="space-y-8" onValueChange={setActiveTab}>
          <motion.div variants={itemVariants}>
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="create" className="flex items-center">
                <Plus className="mr-2 h-4 w-4" />
                Create
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center">
                <Layers className="mr-2 h-4 w-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="library" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                My Library
              </TabsTrigger>
              <TabsTrigger value="apply" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Apply Stamps
              </TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="create" className="space-y-8">
            {/* Two-column layout for Stamp Details and Live Preview */}
            <motion.div
              className="grid gap-8 lg:grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {/* Left Column - Stamp Form */}
              <motion.div variants={itemVariants} className="space-y-8">
                <Card className="border-border/40 shadow-md">
                  <CardHeader className="pb-4">
                    <CardTitle>Stamp Details</CardTitle>
                    <CardDescription>Customize your stamp appearance and content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="businessName" className="text-base">
                        Business Name
                      </Label>
                      <Input
                        id="businessName"
                        value={stampData.businessName}
                        onChange={(e) => handleChange("businessName", e.target.value)}
                        placeholder="Enter your business name"
                        className="border-border/40 focus-visible:ring-primary/70 h-10"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="text" className="text-base">
                        Stamp Text
                      </Label>
                      <Input
                        id="text"
                        value={stampData.text}
                        onChange={(e) => handleChange("text", e.target.value)}
                        placeholder="e.g., PAID, APPROVED, RECEIVED"
                        className="border-border/40 focus-visible:ring-primary/70 h-10"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="show-date" className="flex items-center space-x-2 text-base">
                          <span>Show Date</span>
                        </Label>
                        <Switch
                          id="show-date"
                          checked={stampData.showDate}
                          onCheckedChange={(checked) => handleChange("showDate", checked)}
                        />
                      </div>
                    </div>

                    {stampData.showDate && (
                      <div className="space-y-3">
                        <Label htmlFor="date" className="text-base">
                          Date
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={stampData.date}
                          onChange={(e) => handleChange("date", e.target.value)}
                          className="border-border/40 focus-visible:ring-primary/70 h-10"
                        />
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label className="text-base">Shape</Label>
                      <div className="grid grid-cols-4 gap-3">
                        {["circle", "square", "rectangle", "oval"].map((shape) => (
                          <Button
                            key={shape}
                            type="button"
                            variant={stampData.shape === shape ? "default" : "outline"}
                            className={cn(
                              "h-10 w-full capitalize border-border/40",
                              stampData.shape === shape && "bg-primary hover:bg-primary/90",
                            )}
                            onClick={() => handleChange("shape", shape)}
                          >
                            {shape}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base">Color</Label>
                      <div className="flex flex-wrap gap-3">
                        {COLOR_OPTIONS.map((color) => (
                          <Button
                            key={color.value}
                            variant={stampData.color === color.value ? "default" : "outline"}
                            className="w-10 h-10 p-0 rounded-full border-border/40"
                            style={{ backgroundColor: color.value }}
                            onClick={() => handleChange("color", color.value)}
                          >
                            <span className="sr-only">{color.name}</span>
                            {stampData.color === color.value && <Check className="h-4 w-4 text-white" />}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base">Size</Label>
                      <RadioGroup
                        defaultValue={stampData.size}
                        onValueChange={(value) => handleChange("size", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="small" id="small" />
                          <Label htmlFor="small">Small</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medium" id="medium" />
                          <Label htmlFor="medium">Medium</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="large" id="large" />
                          <Label htmlFor="large">Large</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 shadow-md">
                  <CardHeader className="pb-4">
                    <CardTitle>Advanced Options</CardTitle>
                    <CardDescription>Fine-tune your stamp appearance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="rotation" className="text-base">
                          Rotation
                        </Label>
                        <span className="text-sm text-muted-foreground">{stampData.rotation}°</span>
                      </div>
                      <Slider
                        id="rotation"
                        min={-45}
                        max={45}
                        step={1}
                        value={[stampData.rotation]}
                        onValueChange={(value) => handleChange("rotation", value[0])}
                        className="py-2"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="opacity" className="text-base">
                          Opacity
                        </Label>
                        <span className="text-sm text-muted-foreground">{stampData.opacity}%</span>
                      </div>
                      <Slider
                        id="opacity"
                        min={20}
                        max={100}
                        step={5}
                        value={[stampData.opacity]}
                        onValueChange={(value) => handleChange("opacity", value[0])}
                        className="py-2"
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="border-width" className="text-base">
                          Border Width
                        </Label>
                        <span className="text-sm text-muted-foreground">{stampData.borderWidth}px</span>
                      </div>
                      <Slider
                        id="border-width"
                        min={1}
                        max={5}
                        step={1}
                        value={[stampData.borderWidth]}
                        onValueChange={(value) => handleChange("borderWidth", value[0])}
                        className="py-2"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base">Border Style</Label>
                      <Select
                        value={stampData.borderStyle}
                        onValueChange={(value) => handleChange("borderStyle", value)}
                      >
                        <SelectTrigger className="border-border/40 focus-visible:ring-primary/70 h-10">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="dashed">Dashed</SelectItem>
                          <SelectItem value="dotted">Dotted</SelectItem>
                          <SelectItem value="double">Double</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-shadow" className="flex items-center space-x-2 text-base">
                        <span>Add Shadow Effect</span>
                      </Label>
                      <Switch
                        id="show-shadow"
                        checked={stampData.showShadow}
                        onCheckedChange={(checked) => handleChange("showShadow", checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Right Column - Preview */}
              <motion.div variants={itemVariants}>
                <Card className="border-border/40 shadow-md h-full flex flex-col">
                  <CardHeader className="pb-4">
                    <CardTitle>Live Preview</CardTitle>
                    <CardDescription>See how your stamp will look</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col items-center justify-center space-y-8">
                    <div className="bg-white p-10 rounded-md shadow-sm w-full flex justify-center items-center min-h-[300px]">
                      <div
                        className={cn("relative transition-all duration-300", stampData.showShadow && "drop-shadow-xl")}
                        style={{ opacity: stampData.opacity / 100 }}
                      >
                        <StampComponent
                          businessName={stampData.businessName}
                          customText={stampData.text}
                          date={stampData.date}
                          shape={stampData.shape as any}
                          color={stampData.color.replace("#", "") as any}
                          size={stampData.size as any}
                          rotation={stampData.rotation}
                          borderWidth={stampData.borderWidth}
                          showDate={stampData.showDate}
                          dateFormat={stampData.dateFormat as any}
                          className={cn(
                            "transition-all duration-300",
                            stampData.borderStyle === "solid" && "border-solid",
                            stampData.borderStyle === "dotted" && "border-dotted",
                            stampData.borderStyle === "double" && "border-double",
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center">
                      <Button variant="outline" className="border-border/40">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                      <Button variant="outline" className="border-border/40">
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </Button>
                      <Button variant="outline" className="border-border/40">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                      <Button onClick={handleSaveStamp}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add to Library
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Document Preview Section - Full Width Below the Two Columns */}
            <motion.div variants={itemVariants}>
              <Card className="border-border/40 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Document Preview</CardTitle>
                      <CardDescription>See how your stamp looks on documents</CardDescription>
                    </div>
                    <Switch checked={documentPreview} onCheckedChange={setDocumentPreview} />
                  </div>
                </CardHeader>
                <CardContent>
                  {documentPreview ? (
                    <div
                      className="bg-white rounded-md shadow-sm w-full h-[400px] relative overflow-hidden"
                      ref={documentRef}
                      onMouseDown={handleDragStart}
                      onMouseMove={handleDragMove}
                      onMouseUp={handleDragEnd}
                      onMouseLeave={handleDragEnd}
                    >
                      <div className="p-8 font-serif">
                        <div className="text-center mb-8">
                          <h3 className="text-2xl font-bold mb-1">{SAMPLE_DOCUMENT.title}</h3>
                          <p className="text-gray-500">{SAMPLE_DOCUMENT.date}</p>
                        </div>

                        <div className="mb-6">
                          <p className="font-bold">Bill To:</p>
                          <p>{SAMPLE_DOCUMENT.client}</p>
                          <p>123 Business Ave.</p>
                          <p>Business City, BC 12345</p>
                        </div>

                        <table className="w-full mb-6 border-collapse">
                          <thead>
                            <tr className="border-b border-gray-300">
                              <th className="text-left py-2">Item</th>
                              <th className="text-right py-2">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {SAMPLE_DOCUMENT.items.map((item, i) => (
                              <tr key={i} className="border-b border-gray-200">
                                <td className="py-2">{item.name}</td>
                                <td className="text-right py-2">{item.price}</td>
                              </tr>
                            ))}
                            <tr className="font-bold">
                              <td className="pt-4">Total</td>
                              <td className="text-right pt-4">{SAMPLE_DOCUMENT.total}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div
                        className="absolute transition-all duration-200"
                        style={{
                          top: `${stampPosition.y}%`,
                          left: `${stampPosition.x}%`,
                          transform: "translate(-50%, -50%)",
                          cursor: isDragging ? "grabbing" : "grab",
                          opacity: stampData.opacity / 100,
                        }}
                      >
                        <StampComponent
                          businessName={stampData.businessName}
                          customText={stampData.text}
                          date={stampData.date}
                          shape={stampData.shape as any}
                          color={stampData.color.replace("#", "") as any}
                          size={stampData.size as any}
                          rotation={stampData.rotation}
                          borderWidth={stampData.borderWidth}
                          showDate={stampData.showDate}
                          dateFormat={stampData.dateFormat as any}
                          className={cn(
                            "transition-all duration-300",
                            stampData.borderStyle === "solid" && "border-solid",
                            stampData.borderStyle === "dotted" && "border-dotted",
                            stampData.borderStyle === "double" && "border-double",
                          )}
                        />
                      </div>

                      {isDragging && (
                        <div className="absolute inset-0 bg-primary/5 flex items-center justify-center pointer-events-none">
                          <p className="text-sm text-primary/70 font-medium">Drag to position stamp on document</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 h-[300px]">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Eye className="h-8 w-8 text-primary/60" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Enable Document Preview</h3>
                        <p className="text-muted-foreground max-w-lg mx-auto">
                          See how your stamp will look on actual documents and position it with drag & drop
                        </p>
                      </div>
                      <Button variant="outline" className="mt-2" onClick={() => setDocumentPreview(true)}>
                        Enable Preview
                      </Button>
                    </div>
                  )}
                </CardContent>
                {documentPreview && (
                  <CardFooter className="border-t pt-4 flex justify-between">
                    <div className="flex space-x-3">
                      <Select defaultValue="invoice">
                        <SelectTrigger className="w-[180px] border-border/40">
                          <SelectValue placeholder="Document type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="invoice">Invoice</SelectItem>
                          <SelectItem value="quotation">Quotation</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="receipt">Receipt</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Button size="sm">Apply to Document</Button>
                    </div>
                  </CardFooter>
                )}
              </Card>
            </motion.div>

            {/* Recent Stamps */}
            <motion.div variants={itemVariants}>
              <Card className="border-border/40 shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle>Recently Used Stamps</CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary">
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {STAMP_TEMPLATES.slice(0, 5).map((template, i) => (
                      <Card key={i} className="border-border/40 hover:border-primary/50 cursor-pointer transition-all">
                        <CardContent className="p-4 flex flex-col items-center">
                          <div className="py-2">
                            <StampComponent
                              businessName={template.businessName}
                              customText={template.customText}
                              shape={template.shape as any}
                              color={template.color.replace("#", "") as any}
                              showDate={template.showDate}
                              size="small"
                            />
                          </div>
                          <p className="text-xs text-center mt-2 font-medium">{template.name}</p>
                          <p className="text-xs text-muted-foreground">Today</p>
                        </CardContent>
                      </Card>
                    ))}

                    <Card className="border-dashed border-border/40 hover:border-primary/50 cursor-pointer transition-all">
                      <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                        <Plus className="h-8 w-8 text-muted-foreground mb-1" />
                        <p className="text-xs text-muted-foreground">Create New</p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-8">
            <motion.div className="grid gap-8" variants={containerVariants} initial="hidden" animate="show">
              <motion.div variants={itemVariants}>
                <Card className="border-border/40 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <CardTitle>Stamp Templates</CardTitle>
                      <div className="flex space-x-3">
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="search"
                            placeholder="Search templates..."
                            className="pl-8 border-border/40 w-[200px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                          <SelectTrigger className="w-[150px] border-border/40">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="payment">Payment</SelectItem>
                            <SelectItem value="approval">Approval</SelectItem>
                            <SelectItem value="status">Status</SelectItem>
                            <SelectItem value="security">Security</SelectItem>
                            <SelectItem value="cancellation">Cancellation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {filteredTemplates.map((template, i) => (
                        <motion.div
                          key={template.id}
                          variants={itemVariants}
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <Card
                            className={cn(
                              "border-border/40 hover:border-primary/50 cursor-pointer transition-all overflow-hidden",
                              selectedTemplate === template.id && "border-primary",
                            )}
                            onClick={() => handleTemplateSelect(template)}
                          >
                            <CardContent className="p-6 flex flex-col items-center">
                              {template.featured && (
                                <Badge className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600">
                                  <Star className="h-3 w-3 mr-1 fill-current" />
                                  Featured
                                </Badge>
                              )}
                              <div className="py-4">
                                <StampComponent
                                  businessName={template.businessName}
                                  customText={template.customText}
                                  shape={template.shape as any}
                                  color={template.color.replace("#", "") as any}
                                  showDate={template.showDate}
                                  size="medium"
                                />
                              </div>
                              <p className="text-sm font-medium mt-3">{template.name}</p>
                              <Badge variant="outline" className="mt-2 text-xs">
                                {template.category}
                              </Badge>
                            </CardContent>
                            <CardFooter className="p-3 bg-muted/30 flex justify-between">
                              <Button variant="ghost" size="sm" className="text-xs h-8">
                                Preview
                              </Button>
                              <Button variant="ghost" size="sm" className="text-xs h-8">
                                Use
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="library" className="space-y-8">
            <motion.div className="grid gap-8" variants={containerVariants} initial="hidden" animate="show">
              <motion.div variants={itemVariants}>
                <Card className="border-border/40 shadow-md">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle>Your Stamp Library</CardTitle>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Stamp
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      <Card className="border-dashed border-border/40 hover:border-primary/50 cursor-pointer transition-all">
                        <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                          <Plus className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">Create New Stamp</p>
                        </CardContent>
                      </Card>

                      {STAMP_TEMPLATES.slice(0, 7).map((template, i) => (
                        <Card
                          key={i}
                          className="border-border/40 hover:border-primary/50 cursor-pointer transition-all relative overflow-hidden"
                        >
                          <CardContent className="p-6 flex flex-col items-center">
                            <div className="absolute top-2 right-2 flex space-x-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Check className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="py-4">
                              <StampComponent
                                businessName={template.businessName}
                                customText={template.customText}
                                shape={template.shape as any}
                                color={template.color.replace("#", "") as any}
                                showDate={template.showDate}
                                size="medium"
                              />
                            </div>
                            <p className="text-sm font-medium mt-3">{template.name}</p>
                          </CardContent>
                          <CardFooter className="p-3 bg-muted/30 flex justify-between">
                            <Button variant="ghost" size="sm" className="text-xs h-8">
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                            <Button variant="ghost" size="sm" className="text-xs h-8">
                              <Copy className="h-3 w-3 mr-1" />
                              Duplicate
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="apply" className="space-y-8">
            <motion.div
              className="grid gap-8 lg:grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              <motion.div variants={itemVariants} className="lg:col-span-1">
                <Card className="border-border/40 shadow-md h-full">
                  <CardHeader className="pb-4">
                    <CardTitle>Recent Documents</CardTitle>
                    <CardDescription>Select a document to apply stamps</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Input type="search" placeholder="Search documents..." className="border-border/40" />

                      <ScrollArea className="h-[400px] pr-4">
                        <div className="space-y-3 mt-4">
                          {RECENT_DOCUMENTS.map((doc, i) => (
                            <Card key={i} className="border-border/40 hover:bg-muted/30 cursor-pointer transition-all">
                              <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                  <div className="w-12 h-12 rounded bg-primary/10 flex items-center justify-center mr-4">
                                    <FileText className="h-6 w-6 text-primary/70" />
                                  </div>
                                  <div>
                                    <p className="font-medium">{doc.name}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{doc.type}</p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <Badge variant="outline" className="mr-2">
                                    {doc.date}
                                  </Badge>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <ChevronRight className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="border-border/40 shadow-md h-full">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Document Preview</CardTitle>
                        <CardDescription>Drag and drop stamps onto the document</CardDescription>
                      </div>
                      <div className="flex space-x-3">
                        <Button variant="outline" size="sm">
                          <CloudUpload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                        <Button size="sm">
                          <Save className="mr-2 h-4 w-4" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center p-8 text-center h-[400px] bg-muted/30">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-primary/60" />
                    </div>
                    <h3 className="text-lg font-medium">Select a document to preview</h3>
                    <p className="text-muted-foreground max-w-md mt-2">
                      Choose a document from the list or upload a new one to apply stamps
                    </p>
                    <div className="flex space-x-3 mt-6">
                      <Button variant="outline">Browse Files</Button>
                      <Button>Upload Document</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.main>
    </div>
  )
}
