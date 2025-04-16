import type React from "react"
import { ClassicTemplate } from "./classic-template"
import { ModernTemplate } from "./modern-template"
import { MinimalTemplate } from "./minimal-template"
import type { TemplateId } from "@/components/template-selector"

export interface InvoiceTemplateProps {
  templateId: TemplateId
  invoiceData: any
  clientData: any
  items: any[]
  calculateSubtotal: () => number
  calculateTax: () => number
  calculateTotal: () => number
  stampConfig: any
  stampPosition: { x: number; y: number }
  isDragging: boolean
  onStampDragStart: (e: React.MouseEvent) => void
  onStampDragMove: (e: React.MouseEvent) => void
  onStampDragEnd: () => void
  pdfAttachment?: File | null
}

export function InvoiceTemplate({
  templateId,
  invoiceData,
  clientData,
  items,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  stampConfig,
  stampPosition,
  isDragging,
  onStampDragStart,
  onStampDragMove,
  onStampDragEnd,
  pdfAttachment,
}: InvoiceTemplateProps) {
  const templateProps = {
    invoiceData,
    clientData,
    items,
    calculateSubtotal,
    calculateTax,
    calculateTotal,
    stampConfig,
    stampPosition,
    isDragging,
    onStampDragStart,
    onStampDragMove,
    onStampDragEnd,
    pdfAttachment,
  }

  switch (templateId) {
    case "modern":
      return <ModernTemplate {...templateProps} />
    case "minimal":
      return <MinimalTemplate {...templateProps} />
    case "professional":
    case "creative":
    case "corporate":
      // For premium templates, fallback to classic if not available
      return <ClassicTemplate {...templateProps} />
    case "classic":
    default:
      return <ClassicTemplate {...templateProps} />
  }
}
