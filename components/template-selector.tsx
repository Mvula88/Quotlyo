"use client"

import { useState } from "react"
import { Check, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export type TemplateType = "invoice" | "quotation"
export type TemplateId = "classic" | "modern" | "minimal" | "professional" | "creative" | "corporate"

export interface TemplateInfo {
  id: TemplateId
  name: string
  description: string
  thumbnail: string
  isPremium?: boolean
}

const TEMPLATES: Record<TemplateType, TemplateInfo[]> = {
  invoice: [
    {
      id: "classic",
      name: "Classic",
      description: "Traditional invoice layout with a clean, professional design",
      thumbnail: "/templates/classic-invoice.png",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Contemporary design with a fresh, sleek appearance",
      thumbnail: "/templates/modern-invoice.png",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple, uncluttered design focusing on essential information",
      thumbnail: "/templates/minimal-invoice.png",
    },
    {
      id: "professional",
      name: "Professional",
      description: "Sophisticated design for established businesses",
      thumbnail: "/templates/professional-invoice.png",
      isPremium: true,
    },
    {
      id: "creative",
      name: "Creative",
      description: "Bold, colorful design for creative industries",
      thumbnail: "/templates/creative-invoice.png",
      isPremium: true,
    },
    {
      id: "corporate",
      name: "Corporate",
      description: "Formal design for corporate environments",
      thumbnail: "/templates/corporate-invoice.png",
      isPremium: true,
    },
  ],
  quotation: [
    {
      id: "classic",
      name: "Classic",
      description: "Traditional quotation layout with a clean, professional design",
      thumbnail: "/templates/classic-quotation.png",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Contemporary design with a fresh, sleek appearance",
      thumbnail: "/templates/modern-quotation.png",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple, uncluttered design focusing on essential information",
      thumbnail: "/templates/minimal-quotation.png",
    },
    {
      id: "professional",
      name: "Professional",
      description: "Sophisticated design for established businesses",
      thumbnail: "/templates/professional-quotation.png",
      isPremium: true,
    },
    {
      id: "creative",
      name: "Creative",
      description: "Bold, colorful design for creative industries",
      thumbnail: "/templates/creative-quotation.png",
      isPremium: true,
    },
    {
      id: "corporate",
      name: "Corporate",
      description: "Formal design for corporate environments",
      thumbnail: "/templates/corporate-quotation.png",
      isPremium: true,
    },
  ],
}

export interface TemplateSelectorProps {
  type: TemplateType
  selectedTemplate: TemplateId
  onSelectTemplate: (templateId: TemplateId) => void
  isPremiumUser?: boolean
  className?: string
}

export function TemplateSelector({
  type,
  selectedTemplate,
  onSelectTemplate,
  isPremiumUser = false,
  className,
}: TemplateSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const templates = TEMPLATES[type]
  const selectedTemplateInfo = templates.find((t) => t.id === selectedTemplate) || templates[0]

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={className}>
          Template: {selectedTemplateInfo.name} <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[600px] p-0" align="start">
        <Tabs defaultValue="all" className="w-full">
          <div className="border-b px-3">
            <TabsList className="h-12">
              <TabsTrigger value="all" className="text-xs">
                All Templates
              </TabsTrigger>
              <TabsTrigger value="free" className="text-xs">
                Free
              </TabsTrigger>
              <TabsTrigger value="premium" className="text-xs">
                Premium
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate === template.id}
                  isPremiumUser={isPremiumUser}
                  onSelect={() => {
                    onSelectTemplate(template.id)
                    setIsOpen(false)
                  }}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="free" className="p-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              {templates
                .filter((t) => !t.isPremium)
                .map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate === template.id}
                    isPremiumUser={isPremiumUser}
                    onSelect={() => {
                      onSelectTemplate(template.id)
                      setIsOpen(false)
                    }}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="premium" className="p-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              {templates
                .filter((t) => t.isPremium)
                .map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    isSelected={selectedTemplate === template.id}
                    isPremiumUser={isPremiumUser}
                    onSelect={() => {
                      onSelectTemplate(template.id)
                      setIsOpen(false)
                    }}
                  />
                ))}
            </div>

            {!isPremiumUser && (
              <div className="mt-4 rounded-md bg-muted p-4 text-center">
                <p className="text-sm font-medium">Upgrade to Premium to access all templates</p>
                <Button size="sm" className="mt-2">
                  Upgrade Now
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  )
}

interface TemplateCardProps {
  template: TemplateInfo
  isSelected: boolean
  isPremiumUser: boolean
  onSelect: () => void
}

function TemplateCard({ template, isSelected, isPremiumUser, onSelect }: TemplateCardProps) {
  const isLocked = template.isPremium && !isPremiumUser

  return (
    <Card
      className={`cursor-pointer overflow-hidden transition-all hover:border-primary ${
        isSelected ? "border-primary" : "border-border"
      } ${isLocked ? "opacity-70" : ""}`}
      onClick={isLocked ? undefined : onSelect}
    >
      <div className="relative">
        <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
          <img
            src={template.thumbnail || `/placeholder.svg?height=225&width=300&text=${template.name}`}
            alt={template.name}
            className="h-full w-full object-cover"
          />
        </div>

        {isSelected && (
          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="h-4 w-4" />
          </div>
        )}

        {template.isPremium && (
          <div className="absolute left-2 top-2 rounded-md bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-800">
            Premium
          </div>
        )}

        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <Button size="sm" variant="secondary">
              Upgrade to Unlock
            </Button>
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <div className="space-y-1">
          <h3 className="font-medium">{template.name}</h3>
          <p className="text-xs text-muted-foreground">{template.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
