"use client"

import type React from "react"

import { format } from "date-fns"
import { FileText, ImagePlus } from "lucide-react"
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
  pdfAttachment?: File | null // Add this line
}

export function ClassicTemplate({
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
  pdfAttachment, // Add this line
}: InvoiceTemplateProps) {
  return (
    <div
      className="relative min-h-[800px] w-full overflow-hidden rounded-lg border bg-white p-8 shadow-sm"
      onMouseMove={onStampDragMove}
      onMouseUp={onStampDragEnd}
      onMouseDown={onStampDragStart}
    >
      {/* Invoice Header */}
      <div className="mb-8 flex justify-between">
        <div>
          {invoiceData.logo ? (
            <img
              src={invoiceData.logo || "/placeholder.svg"}
              alt="Company Logo"
              className="mb-4 max-h-20 max-w-[200px] object-contain"
            />
          ) : (
            <div className="mb-4 h-16 w-40 rounded-md bg-gray-100 flex items-center justify-center text-gray-400">
              <ImagePlus className="h-8 w-8" />
            </div>
          )}
          <div className="text-gray-700">
            <p className="font-bold">{invoiceData.companyName}</p>
            <p className="whitespace-pre-line text-sm">{invoiceData.companyAddress}</p>
            <p className="text-sm">{invoiceData.companyPhone}</p>
            <p className="text-sm">{invoiceData.companyEmail}</p>
            <p className="text-sm">{invoiceData.companyWebsite}</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
          <p className="text-gray-600">
            <span className="font-semibold">Invoice #:</span> {invoiceData.invoiceNumber}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Date:</span>{" "}
            {invoiceData.date ? format(invoiceData.date, "MMMM d, yyyy") : "Not set"}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Due Date:</span>{" "}
            {invoiceData.dueDate ? format(invoiceData.dueDate, "MMMM d, yyyy") : "Not set"}
          </p>
          <div
            className={`mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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

      {/* Client Info */}
      <div className="mb-8">
        <h3 className="mb-2 font-bold text-gray-800">Bill To:</h3>
        {invoiceData.client ? (
          <div className="text-gray-700">
            <p className="font-semibold">{clientData.name}</p>
            <p>{clientData.company}</p>
            <p className="whitespace-pre-line">{clientData.address}</p>
            <p>{clientData.email}</p>
            <p>{clientData.phone}</p>
          </div>
        ) : (
          <div className="text-gray-400 italic">No client selected</div>
        )}
      </div>

      {/* Invoice Items */}
      <div className="mb-8 overflow-hidden rounded-md border border-gray-200">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b border-gray-200 py-3 px-4 text-left font-semibold text-gray-800">Description</th>
              <th className="border-b border-gray-200 py-3 px-4 text-right font-semibold text-gray-800">Quantity</th>
              <th className="border-b border-gray-200 py-3 px-4 text-right font-semibold text-gray-800">Price</th>
              <th className="border-b border-gray-200 py-3 px-4 text-right font-semibold text-gray-800">Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="border-b border-gray-200 py-3 px-4 text-gray-700">
                  {item.description || "Item description"}
                </td>
                <td className="border-b border-gray-200 py-3 px-4 text-right text-gray-700">{item.quantity}</td>
                <td className="border-b border-gray-200 py-3 px-4 text-right text-gray-700">
                  ${item.price.toFixed(2)}
                </td>
                <td className="border-b border-gray-200 py-3 px-4 text-right text-gray-700">
                  ${item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mb-8 flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between border-b border-gray-200 py-2">
            <span className="font-medium text-gray-600">Subtotal:</span>
            <span className="text-gray-800">${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 py-2">
            <span className="font-medium text-gray-600">Tax (10%):</span>
            <span className="text-gray-800">${calculateTax().toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-2 text-lg font-bold">
            <span className="text-gray-800">Total:</span>
            <span className="text-gray-800">${calculateTotal().toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-8">
        <h3 className="mb-2 font-bold text-gray-800">Notes:</h3>
        <p className="text-sm text-gray-600">{invoiceData.notes}</p>
      </div>

      {/* Payment Terms */}
      <div className="mb-8">
        <h3 className="mb-2 font-bold text-gray-800">Payment Terms:</h3>
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

      {pdfAttachment && (
        <div className="mb-8">
          <h3 className="mb-2 font-bold text-gray-800">Attachments:</h3>
          <div className="flex items-center gap-2 p-2 rounded-md border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30 w-fit">
            <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {pdfAttachment.name || "Additional Documentation.pdf"}
            </span>
          </div>
        </div>
      )}

      {/* Bank Account Details */}
      <div className="mb-8">
        <h3 className="mb-2 font-bold text-gray-800">Bank Account Details:</h3>
        <div className="text-sm text-gray-600">
          <p>Bank Name: {invoiceData.bankName || "Your Bank Name"}</p>
          <p>Account Name: {invoiceData.accountName || "Your Account Name"}</p>
          <p>Account Number: {invoiceData.accountNumber || "Your Account Number"}</p>
          <p>Routing Number: {invoiceData.routingNumber || "Your Routing Number"}</p>
          {invoiceData.swiftCode && <p>SWIFT/BIC: {invoiceData.swiftCode}</p>}
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
