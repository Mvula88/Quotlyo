"use client"

import type React from "react"

import { format } from "date-fns"
import { ImagePlus } from "lucide-react"
import { Stamp } from "@/components/ui/stamp"

export interface InvoiceTemplateProps {
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
  pdfAttachment?: string | null
}

export function MinimalTemplate({
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
  return (
    <div
      className="relative min-h-[800px] w-full overflow-hidden rounded-lg border bg-white p-8 shadow-sm"
      onMouseMove={onStampDragMove}
      onMouseUp={onStampDragEnd}
      onMouseDown={onStampDragStart}
    >
      {/* Invoice Header */}
      <div className="mb-12 flex justify-between items-center">
        <div>
          {invoiceData.logo ? (
            <img
              src={invoiceData.logo || "/placeholder.svg"}
              alt="Company Logo"
              className="max-h-16 max-w-[160px] object-contain"
            />
          ) : (
            <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
              <ImagePlus className="h-6 w-6" />
            </div>
          )}
        </div>
        <div className="text-right">
          <h2 className="text-xl font-medium text-gray-800">INVOICE</h2>
          <p className="text-sm text-gray-500 mt-1">#{invoiceData.invoiceNumber}</p>
        </div>
      </div>

      {/* Company and Client Info */}
      <div className="mb-10 grid grid-cols-2 gap-8">
        <div>
          <p className="text-xs uppercase text-gray-500 mb-1">From</p>
          <p className="font-medium">{invoiceData.companyName}</p>
          <div className="text-sm text-gray-600 mt-1">
            <p className="whitespace-pre-line">{invoiceData.companyAddress}</p>
            <p>{invoiceData.companyEmail}</p>
            <p>{invoiceData.companyPhone}</p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase text-gray-500 mb-1">Bill To</p>
          {invoiceData.client ? (
            <div>
              <p className="font-medium">{clientData.name}</p>
              <p className="text-sm">{clientData.company}</p>
              <div className="text-sm text-gray-600 mt-1">
                <p className="whitespace-pre-line">{clientData.address}</p>
                <p>{clientData.email}</p>
                <p>{clientData.phone}</p>
              </div>
            </div>
          ) : (
            <div className="text-gray-400 italic">No client selected</div>
          )}
        </div>
      </div>

      {/* Invoice Details */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs uppercase text-gray-500 mb-1">Issue Date</p>
          <p className="text-sm">{invoiceData.date ? format(invoiceData.date, "MMMM d, yyyy") : "Not set"}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-500 mb-1">Due Date</p>
          <p className="text-sm">{invoiceData.dueDate ? format(invoiceData.dueDate, "MMMM d, yyyy") : "Not set"}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-500 mb-1">Status</p>
          <div
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
              invoiceData.status === "paid"
                ? "bg-green-100 text-green-800"
                : invoiceData.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : invoiceData.status === "overdue"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
            }`}
          >
            {invoiceData.status.charAt(0).toUpperCase() + invoiceData.status.slice(1)}
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-2 text-left text-xs font-medium uppercase text-gray-500">Description</th>
              <th className="py-2 text-right text-xs font-medium uppercase text-gray-500">Qty</th>
              <th className="py-2 text-right text-xs font-medium uppercase text-gray-500">Price</th>
              <th className="py-2 text-right text-xs font-medium uppercase text-gray-500">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100">
                <td className="py-3 text-sm text-gray-800">{item.description || "Item description"}</td>
                <td className="py-3 text-right text-sm text-gray-800">{item.quantity}</td>
                <td className="py-3 text-right text-sm text-gray-800">${item.price.toFixed(2)}</td>
                <td className="py-3 text-right text-sm font-medium text-gray-800">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mb-8 flex justify-end">
        <div className="w-64">
          <div className="flex justify-between py-1 text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="text-gray-800">${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span className="text-gray-600">Tax (10%):</span>
            <span className="text-gray-800">${calculateTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 py-2 mt-1 font-medium">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-8 text-sm">
        <p className="text-xs uppercase text-gray-500 mb-1">Notes</p>
        <p className="text-gray-600">{invoiceData.notes}</p>
      </div>

      {/* Payment Terms */}
      <div className="text-sm">
        <p className="text-xs uppercase text-gray-500 mb-1">Payment Terms</p>
        <p className="text-gray-600">
          {invoiceData.paymentTerms === "net15"
            ? "Payment due within 15 days"
            : invoiceData.paymentTerms === "net30"
              ? "Payment due within 30 days"
              : invoiceData.paymentTerms === "net60"
                ? "Payment due within 60 days"
                : "Payment due upon receipt"}
        </p>
      </div>

      {/* Bank Account Details */}
      <div className="text-sm mt-6">
        <p className="text-xs uppercase text-gray-500 mb-1">Bank Account Details</p>
        <div className="text-gray-600">
          <p>Bank: {invoiceData.bankName || "Your Bank Name"}</p>
          <p>Account: {invoiceData.accountName || "Your Account Name"}</p>
          <p>Number: {invoiceData.accountNumber || "Your Account Number"}</p>
          <p>Routing: {invoiceData.routingNumber || "Your Routing Number"}</p>
          {invoiceData.swiftCode && <p>SWIFT/BIC: {invoiceData.swiftCode}</p>}
        </div>
      </div>

      {/* PDF Attachment */}
      {pdfAttachment && (
        <div className="mt-6">
          <p className="text-xs uppercase text-gray-500 mb-1">PDF Attachment</p>
          <a href={pdfAttachment} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            View PDF
          </a>
        </div>
      )}

      {/* Stamp */}
      {stampConfig && (
        <div
          className={`absolute cursor-${isDragging ? "grabbing" : "grab"}`}
          style={{
            left: `${stampPosition.x}%`,
            top: `${stampPosition.y}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        >
          <Stamp
            shape={stampConfig.shape}
            color={stampConfig.color}
            borderWidth={stampConfig.borderWidth}
            rotation={stampConfig.rotation}
            showDate={stampConfig.showDate}
            dateFormat={stampConfig.dateFormat}
            businessName={stampConfig.businessName}
            businessDetails={stampConfig.businessDetails?.filter((d: string) => d)}
            customText={stampConfig.customText}
          />
        </div>
      )}
    </div>
  )
}
