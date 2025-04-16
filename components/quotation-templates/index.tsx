import type React from "react"
import { ClassicTemplate } from "./classic-template"
import type { TemplateId } from "@/components/template-selector"

export interface QuotationTemplateProps {
  templateId: TemplateId
  quotationData: any
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
}

export function QuotationTemplate({
  templateId,
  quotationData,
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
}: QuotationTemplateProps) {
  const templateProps = {
    quotationData,
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
  }

  // For now, we only have the classic template for quotations
  // We'll add more templates in the future
  return <ClassicTemplate {...templateProps} />
}
