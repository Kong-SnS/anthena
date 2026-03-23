import { jsPDF } from "jspdf"

interface InvoiceData {
  invoiceNumber: string
  orderNumber: string
  issuedAt: string
  customerName: string
  customerEmail: string
  items: { name: string; quantity: number; unitPrice: number }[]
  subtotal: number
  shippingCost: number
  total: number
}

export function generateInvoicePDF(data: InvoiceData): string {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(24)
  doc.setFont("helvetica", "normal")
  doc.text("ANTHENA", 20, 30)

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text("Premium Health Supplements", 20, 38)

  // Invoice info
  doc.setFontSize(16)
  doc.setTextColor(0)
  doc.text(`Invoice ${data.invoiceNumber}`, 20, 60)

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Order: #${data.orderNumber}`, 20, 70)
  doc.text(`Date: ${new Date(data.issuedAt).toLocaleDateString("en-MY")}`, 20, 77)

  // Bill to
  doc.setTextColor(0)
  doc.setFontSize(10)
  doc.text("Bill To:", 130, 60)
  doc.setTextColor(100)
  doc.text(data.customerName, 130, 68)
  doc.text(data.customerEmail, 130, 75)

  // Table header
  const startY = 95
  doc.setFillColor(245, 245, 245)
  doc.rect(20, startY - 6, 170, 10, "F")
  doc.setTextColor(0)
  doc.setFontSize(9)
  doc.text("Item", 22, startY)
  doc.text("Qty", 120, startY)
  doc.text("Price", 140, startY)
  doc.text("Amount", 165, startY)

  // Table rows
  let y = startY + 12
  data.items.forEach((item) => {
    doc.setTextColor(60)
    doc.text(item.name, 22, y)
    doc.text(item.quantity.toString(), 122, y)
    doc.text(`RM ${item.unitPrice.toFixed(2)}`, 140, y)
    doc.text(`RM ${(item.unitPrice * item.quantity).toFixed(2)}`, 165, y)
    y += 9
  })

  // Totals
  y += 5
  doc.setDrawColor(230)
  doc.line(120, y, 190, y)
  y += 10

  doc.setTextColor(100)
  doc.text("Subtotal", 130, y)
  doc.setTextColor(0)
  doc.text(`RM ${data.subtotal.toFixed(2)}`, 165, y)
  y += 8

  doc.setTextColor(100)
  doc.text("Shipping", 130, y)
  doc.setTextColor(0)
  doc.text(`RM ${data.shippingCost.toFixed(2)}`, 165, y)
  y += 3

  doc.setDrawColor(230)
  doc.line(120, y + 3, 190, y + 3)
  y += 12

  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Total", 130, y)
  doc.text(`RM ${data.total.toFixed(2)}`, 162, y)

  // Footer
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(150)
  doc.text("Thank you for your purchase! — Anthena", 20, 275)

  return doc.output("datauristring")
}
