"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { motion } from "framer-motion"
import { Share2, Printer } from "lucide-react"
import type { Order } from "@/lib/sample-data"

interface OrderBillProps {
  isOpen: boolean
  onClose: () => void
  order: Order | undefined
}

export default function OrderBill({ isOpen, onClose, order }: OrderBillProps) {
  if (!order) return null

  const handlePrint = () => {
    // Add print-specific styles
    const style = document.createElement('style')
    style.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        .bill-content, .bill-content * {
          visibility: visible;
        }
        .bill-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          padding: 20px;
        }
        .no-print {
          display: none !important;
        }
      }
    `
    document.head.appendChild(style)

    window.print()

    // Remove the styles after printing
    document.head.removeChild(style)
  }

  // Generate a payment URL (this would be replaced with your actual payment gateway URL)
  const paymentUrl = `https://payment.example.com/order/${order.id}?amount=${order.totalPrice}`

  // Safely format numbers
  const formatPrice = (price: number) => {
    try {
      return price.toFixed(2)
    } catch (error) {
      console.error("Error formatting price:", error)
      return "0.00"
    }
  }

  // Calculate totals
  const subtotal = order.totalPrice || 0
  const tax = subtotal * 0.1
  const total = subtotal + tax

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="no-print">
          <DialogTitle className="text-xl gradient-text">Order Bill</DialogTitle>
          <DialogDescription>View and print your order bill</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Bill Preview */}
          <div className="bill-content rounded-lg border p-4 space-y-4">
            <div className="text-center">
              <h2 className="text-lg font-bold">Restaurant Name</h2>
              <p className="text-sm text-slate-500">123 Main Street, Anytown, USA</p>
              <p className="text-xs text-slate-400">Tel: (555) 123-4567</p>
              <p className="text-xs text-slate-400">Tax ID: 12-3456789</p>
            </div>

            <div className="flex justify-between text-sm">
              <span>Order #{order.id.slice(-4)}</span>
              <span>{order.createdAt.toLocaleDateString()}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span>Table</span>
              <span>{order.tableNumber}</span>
            </div>

            <div className="border-t pt-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    <th className="pb-2">Item</th>
                    <th className="text-right pb-2">Qty</th>
                    <th className="text-right pb-2">Price</th>
                    <th className="text-right pb-2">Total</th>
                  </tr>
                </thead>
                <tbody className="border-t">
                  {order.items.map((item, index) => (
                    <tr key={`${item.id}-${index}`} className="border-b">
                      <td className="py-2">{item.name}</td>
                      <td className="text-right py-2">{item.quantity}</td>
                      <td className="text-right py-2">${formatPrice(item.price)}</td>
                      <td className="text-right py-2">${formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="pt-2 text-right font-medium">Subtotal:</td>
                    <td className="pt-2 text-right font-medium">${formatPrice(subtotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="pt-2 text-right font-medium">Tax (10%):</td>
                    <td className="pt-2 text-right font-medium">${formatPrice(tax)}</td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="pt-2 text-right font-bold">Total:</td>
                    <td className="pt-2 text-right font-bold">${formatPrice(total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="text-center text-xs text-slate-500">
              <p>Thank you for dining with us!</p>
              <p>Please visit again</p>
            </div>

            {/* Payment QR Code */}
            <div className="qr-code-print mt-4 flex flex-col items-center space-y-2">
              <h3 className="text-sm font-medium">Scan to Pay</h3>
              <QRCodeSVG
                value={paymentUrl}
                size={120}
                level="L"
                includeMargin
                className="bg-white p-2 rounded-lg"
              />
              <p className="text-xs text-slate-500">Scan this QR code to make payment</p>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-between gap-2 no-print">
            <Button variant="outline" className="w-full" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print Bill
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigator.share?.({
              title: "Order Bill",
              text: `Order #${order.id.slice(-4)} - Total: $${formatPrice(total)}`,
              url: paymentUrl
            }).catch(() => {})}>
              <Share2 className="mr-2 h-4 w-4" />
              Share Bill
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 