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
  pdfAttachment: string | null
}

export function ModernTemplate({
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
      className="relative min-h-[800px] w-full overflow-hidden rounded-lg border bg-white shadow-sm"
      onMouseMove={onStampDragMove}
      onMouseUp={onStampDragEnd}
      onMouseDown={onStampDragStart}
    >
      {/* Header Bar */}
      <div className="bg-gray-900 p-6 text-white">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">INVOICE</h2>
          <div className="text-right">
            <p className="text-sm opacity-80">Invoice #: {invoiceData.invoiceNumber}</p>
            <p className="text-sm opacity-80">
              Date: {invoiceData.date ? format(invoiceData.date, "MMMM d, yyyy") : "Not set"}
            </p>
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Company and Client Info */}
        <div className="grid grid-cols-2 gap-8 mb-10">
          <div>
            <div className="flex items-center mb-4">
              {invoiceData.logo ? (
                <img
                  src={invoiceData.logo || "/placeholder.svg"}
                  alt="Company Logo"
                  className="max-h-16 max-w-[160px] object-contain mr-4"
                />
              ) : (
                <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 mr-4">
                  <ImagePlus className="h-8 w-8" />
                </div>
              )}
              <div>
                <h3 className="font-bold text-lg">{invoiceData.companyName}</h3>
                <p className="text-sm text-gray-500">From</p>
              </div>
            </div>
            <div className="text-gray-700 text-sm">
              <p className="whitespace-pre-line">{invoiceData.companyAddress}</p>
              <p>{invoiceData.companyPhone}</p>
              <p>{invoiceData.companyEmail}</p>
              <p>{invoiceData.companyWebsite}</p>
            </div>
          </div>

          <div>
            <div className="mb-4">
              <h3 className="font-bold text-lg">{clientData.company || "Client"}</h3>
              <p className="text-sm text-gray-500">Bill To</p>
            </div>
            {invoiceData.client ? (
              <div className="text-gray-700 text-sm">
                <p className="font-medium">{clientData.name}</p>
                <p className="whitespace-pre-line">{clientData.address}</p>
                <p>{clientData.email}</p>
                <p>{clientData.phone}</p>
              </div>
            ) : (
              <div className="text-gray-400 italic">No client selected</div>
            )}
          </div>
        </div>

        {/* Status and Due Date */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm text-gray-500">Due Date</p>
            <p className="font-medium">
              {invoiceData.dueDate ? format(invoiceData.dueDate, "MMMM d, yyyy") : "Not set"}
            </p>
          </div>
          <div>
            <div
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
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
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border-b border-gray-200 py-3 px-4 text-left font-semibold text-gray-700">
                  Description
                </th>
                <th className="border-b border-gray-200 py-3 px-4 text-right font-semibold text-gray-700">Quantity</th>
                <th className="border-b border-gray-200 py-3 px-4 text-right font-semibold text-gray-700">Price</th>
                <th className="border-b border-gray-200 py-3 px-4 text-right font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200 last:border-0">
                  <td className="py-4 px-4 text-gray-700">{item.description || "Item description"}</td>
                  <td className="py-4 px-4 text-right text-gray-700">{item.quantity}</td>
                  <td className="py-4 px-4 text-right text-gray-700">${item.price.toFixed(2)}</td>
                  <td className="py-4 px-4 text-right text-gray-700 font-medium">${item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mb-8 flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (10%):</span>
              <span>${calculateTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Notes and Terms */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Notes:</h3>
            <p className="text-sm text-gray-600">{invoiceData.notes}</p>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Payment Terms:</h3>
            <p className="text-sm text-gray-600">
              {invoiceData.paymentTerms === "net15"
                ? "Payment due within 15 days"
                : invoiceData.paymentTerms === "net30"
                  ? "Payment due within 30 days"
                  : invoiceData.paymentTerms === "net60"
                    ? "Payment due within 60 days"
                    : "Payment due upon receipt"}
            </p>
          </div>
        </div>

        {/* Bank Account Details */}
        <div className="mb-8 border-t border-gray-200 pt-4">
          <h3 className="font-bold text-gray-800 mb-2">Bank Account Details:</h3>
          <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
            <p>Bank Name: {invoiceData.bankName || "Your Bank Name"}</p>
            <p>Account Name: {invoiceData.accountName || "Your Account Name"}</p>
            <p>Account Number: {invoiceData.accountNumber || "Your Account Number"}</p>
            <p>Routing Number: {invoiceData.routingNumber || "Your Routing Number"}</p>
            {invoiceData.swiftCode && <p>SWIFT/BIC: {invoiceData.swiftCode}</p>}
          </div>
        </div>

        {/* PDF Attachment */}
        {pdfAttachment && (
          <div className="mb-8 border-t border-gray-200 pt-4">
            <h3 className="font-bold text-gray-800 mb-2">PDF Attachment:</h3>
            <a href={pdfAttachment} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
              View PDF
            </a>
          </div>
        )}

        {/* Thank You Message */}
        <div className="text-center text-gray-500 text-sm mt-12">
          <p>Thank you for your business!</p>
        </div>
      </div>

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
