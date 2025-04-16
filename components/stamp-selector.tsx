"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Slider } from "@/components/ui/slider"
import { Stamp, type StampColor, type StampShape } from "@/components/ui/stamp"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const PRESET_STAMPS = [
  {
    id: "business-oval",
    shape: "oval" as StampShape,
    color: "blue" as StampColor,
    businessName: "BUSINESS PRO",
    businessDetails: ["Professional Business Solutions", "Tel: 123-456-7890", "info@businesspro.com"],
    showDate: false,
  },
  {
    id: "paid-circle",
    shape: "circle" as StampShape,
    color: "red" as StampColor,
    customText: "PAID",
    showDate: true,
  },
  {
    id: "approved-rectangle",
    shape: "rectangle" as StampShape,
    color: "green" as StampColor,
    customText: "APPROVED",
    showDate: true,
  },
  {
    id: "received-square",
    shape: "square" as StampShape,
    color: "black" as StampColor,
    customText: "RECEIVED",
    showDate: true,
  },
]

export interface StampSelectorProps {
  onSelectStamp: (stampConfig: any) => void
  className?: string
}

export function StampSelector({ onSelectStamp, className }: StampSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [customStamp, setCustomStamp] = useState({
    shape: "rectangle" as StampShape,
    color: "blue" as StampColor,
    borderWidth: 2,
    rotation: 0,
    showDate: false,
    dateFormat: "DD/MM/YYYY",
    businessName: "",
    businessDetails: ["", "", ""],
    customText: "",
  })

  const handlePresetSelect = (preset: any) => {
    setSelectedPreset(preset.id)
    onSelectStamp(preset)
  }

  const handleCustomStampChange = (key: string, value: any) => {
    const updatedStamp = { ...customStamp, [key]: value }
    setCustomStamp(updatedStamp)
    setSelectedPreset(null)
    onSelectStamp(updatedStamp)
  }

  const handleBusinessDetailChange = (index: number, value: string) => {
    const updatedDetails = [...customStamp.businessDetails]
    updatedDetails[index] = value
    handleCustomStampChange("businessDetails", updatedDetails)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={className}>
          Select Stamp <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <Tabs defaultValue="presets">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Preset Stamps</TabsTrigger>
            <TabsTrigger value="custom">Custom Stamp</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              {PRESET_STAMPS.map((preset) => (
                <Card
                  key={preset.id}
                  className={`cursor-pointer border-2 transition-all hover:border-primary ${selectedPreset === preset.id ? "border-primary" : "border-border"}`}
                  onClick={() => handlePresetSelect(preset)}
                >
                  <CardContent className="flex flex-col items-center justify-center p-4">
                    <Stamp
                      shape={preset.shape}
                      color={preset.color}
                      businessName={preset.businessName}
                      businessDetails={preset.businessDetails}
                      customText={preset.customText}
                      showDate={preset.showDate}
                      className="transform scale-75"
                    />
                    {selectedPreset === preset.id && (
                      <div className="absolute right-2 top-2">
                        <Check className="h-4 w-4 text-primary" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="flex justify-center pb-4">
                <Stamp
                  shape={customStamp.shape}
                  color={customStamp.color}
                  borderWidth={customStamp.borderWidth}
                  rotation={customStamp.rotation}
                  showDate={customStamp.showDate}
                  dateFormat={customStamp.dateFormat}
                  businessName={customStamp.businessName || "YOUR BUSINESS"}
                  businessDetails={customStamp.businessDetails.filter((d) => d)}
                  customText={customStamp.customText}
                  className="transform scale-90"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stamp-shape">Shape</Label>
                  <Select value={customStamp.shape} onValueChange={(value) => handleCustomStampChange("shape", value)}>
                    <SelectTrigger id="stamp-shape">
                      <SelectValue placeholder="Select shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rectangle">Rectangle</SelectItem>
                      <SelectItem value="oval">Oval</SelectItem>
                      <SelectItem value="circle">Circle</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stamp-color">Color</Label>
                  <Select value={customStamp.color} onValueChange={(value) => handleCustomStampChange("color", value)}>
                    <SelectTrigger id="stamp-color">
                      <SelectValue placeholder="Select color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="blue">Blue</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  value={customStamp.businessName}
                  onChange={(e) => handleCustomStampChange("businessName", e.target.value)}
                  placeholder="Enter business name"
                />
              </div>

              <div className="space-y-2">
                <Label>Business Details</Label>
                <div className="space-y-2">
                  {customStamp.businessDetails.map((detail, index) => (
                    <Input
                      key={index}
                      value={detail}
                      onChange={(e) => handleBusinessDetailChange(index, e.target.value)}
                      placeholder={`Detail line ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-text">Custom Text</Label>
                <Input
                  id="custom-text"
                  value={customStamp.customText}
                  onChange={(e) => handleCustomStampChange("customText", e.target.value)}
                  placeholder="E.g., PAID, APPROVED, etc."
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-date" className="flex items-center space-x-2">
                  <span>Show Date</span>
                </Label>
                <Switch
                  id="show-date"
                  checked={customStamp.showDate}
                  onCheckedChange={(checked) => handleCustomStampChange("showDate", checked)}
                />
              </div>

              {customStamp.showDate && (
                <div className="space-y-2">
                  <Label htmlFor="date-format">Date Format</Label>
                  <Select
                    value={customStamp.dateFormat}
                    onValueChange={(value) => handleCustomStampChange("dateFormat", value)}
                  >
                    <SelectTrigger id="date-format">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rotation">Rotation</Label>
                  <span className="text-sm text-muted-foreground">{customStamp.rotation}°</span>
                </div>
                <Slider
                  id="rotation"
                  min={-45}
                  max={45}
                  step={1}
                  value={[customStamp.rotation]}
                  onValueChange={(value) => handleCustomStampChange("rotation", value[0])}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="border-width">Border Width</Label>
                  <span className="text-sm text-muted-foreground">{customStamp.borderWidth}px</span>
                </div>
                <Slider
                  id="border-width"
                  min={1}
                  max={5}
                  step={1}
                  value={[customStamp.borderWidth]}
                  onValueChange={(value) => handleCustomStampChange("borderWidth", value[0])}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}
