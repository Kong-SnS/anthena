"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const sampleOrder = {
  orderNumber: "ANT-SAMPLE001",
  items: [
    { name: "Bloomie 2 Boxes", quantity: 1, price: 229 },
  ],
  subtotal: 229,
  shippingCost: 0,
  total: 229,
}

const sampleShipping = {
  orderNumber: "ANT-SAMPLE001",
  trackingNumber: "CITYLINK123456789",
  courierName: "City-Link Express",
  trackingUrl: "https://app.easyparcel.com/tools/easytrack/details?courier=City-Link_Express&awb=CITYLINK123456789",
}

const sampleInvoice = {
  invoiceNumber: "INV-2026-0001",
  orderNumber: "ANT-SAMPLE001",
  customerName: "Sarah Ahmad",
  issuedDate: "5 April 2026",
  items: [
    { name: "Bloomie 2 Boxes", quantity: 1, price: 229 },
  ],
  subtotal: 229,
  shippingCost: 0,
  total: 229,
}

// Replicate email templates inline for preview
function emailWrapper(content: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f5f0ed;font-family:Arial,sans-serif">
  <div style="max-width:600px;margin:0 auto;background:#ffffff">
    <div style="background:linear-gradient(135deg,#ffdde1,#ee9ca7);padding:32px 24px;text-align:center">
      <h1 style="color:white;font-size:28px;font-weight:400;letter-spacing:0.2em;margin:0;text-transform:uppercase">ATHENA</h1>
      <p style="color:rgba(255,255,255,0.8);font-size:12px;letter-spacing:0.15em;margin:8px 0 0;text-transform:uppercase">Premium Women's Wellness</p>
    </div>
    <div style="padding:40px 32px">
      ${content}
    </div>
    <div style="background:#faf8f5;border-top:1px solid #f0e8e0;padding:24px 32px;text-align:center">
      <p style="color:#b8a090;font-size:12px;margin:0;letter-spacing:0.05em">Athena Healthcare (PG0565925W)</p>
      <p style="color:#b8a090;font-size:12px;margin:6px 0 0">WhatsApp: 012-643 1737 | woosisterstrading@gmail.com</p>
      <div style="margin-top:16px">
        <a href="https://www.instagram.com/bloomie_int/" style="color:#ee9ca7;font-size:12px;text-decoration:none;letter-spacing:0.05em">Follow us @bloomie_int</a>
      </div>
      <p style="color:#d0c0b0;font-size:11px;margin:16px 0 0">You received this email because you placed an order with Athena.</p>
    </div>
  </div>
</body>
</html>`
}

function generateOrderConfirmation() {
  const { orderNumber, items, subtotal, shippingCost, total } = sampleOrder
  const itemRows = items.map(i => `
    <tr>
      <td style="padding:14px 12px;border-bottom:1px solid #f0e8e0;font-size:14px;color:#1a1215">${i.name}</td>
      <td style="padding:14px 12px;border-bottom:1px solid #f0e8e0;text-align:center;font-size:14px;color:#8a7a6a">${i.quantity}</td>
      <td style="padding:14px 12px;border-bottom:1px solid #f0e8e0;text-align:right;font-size:14px;color:#1a1215;font-weight:500">RM ${i.price.toFixed(2)}</td>
    </tr>`).join("")

  return emailWrapper(`
    <div style="text-align:center;margin-bottom:32px">
      <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#ffdde1,#ee9ca7);margin:0 auto 16px;line-height:56px;color:white;font-size:24px">✓</div>
      <h2 style="font-size:24px;font-weight:400;color:#1a1215;margin:0;letter-spacing:0.02em">Order Confirmed</h2>
      <p style="color:#8a7a6a;font-size:14px;margin:10px 0 0">Thank you for your purchase!</p>
      <p style="color:#ee9ca7;font-size:13px;font-weight:500;margin:6px 0 0;letter-spacing:0.1em;text-transform:uppercase">Order #${orderNumber}</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:24px 0">
      <thead><tr style="background:#faf8f5"><th style="padding:10px 12px;text-align:left;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#b8a090;font-weight:500">Product</th><th style="padding:10px 12px;text-align:center;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#b8a090;font-weight:500">Qty</th><th style="padding:10px 12px;text-align:right;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#b8a090;font-weight:500">Price</th></tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <div style="background:#faf8f5;padding:16px 20px;margin:24px 0">
      <table style="width:100%">
        <tr><td style="padding:4px 0;color:#8a7a6a;font-size:13px">Subtotal</td><td style="padding:4px 0;color:#1a1215;font-size:13px;text-align:right">RM ${subtotal.toFixed(2)}</td></tr>
        <tr><td style="padding:4px 0;color:#8a7a6a;font-size:13px">Shipping</td><td style="padding:4px 0;color:#1a1215;font-size:13px;text-align:right">${shippingCost === 0 ? "FREE" : "RM " + shippingCost.toFixed(2)}</td></tr>
      </table>
      <div style="border-top:2px solid #ee9ca7;padding-top:12px;margin-top:8px"><table style="width:100%"><tr><td style="color:#1a1215;font-size:16px;font-weight:600">Total</td><td style="color:#1a1215;font-size:16px;font-weight:600;text-align:right">RM ${total.toFixed(2)}</td></tr></table></div>
    </div>
    <p style="color:#8a7a6a;font-size:13px;line-height:1.7;margin-top:24px">We will notify you once your order has been shipped. If you have any questions, feel free to WhatsApp us at <strong>012-643 1737</strong>.</p>
    <div style="text-align:center;margin-top:32px">
      <a href="#" style="display:inline-block;background:linear-gradient(135deg,#ffdde1,#ee9ca7);color:white;text-decoration:none;padding:12px 32px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;font-weight:500">Contact Us</a>
    </div>
  `)
}

function generateShippingUpdate() {
  const { orderNumber, trackingNumber, courierName, trackingUrl } = sampleShipping
  return emailWrapper(`
    <div style="text-align:center;margin-bottom:32px">
      <div style="width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#ffdde1,#ee9ca7);margin:0 auto 16px;line-height:56px;color:white;font-size:24px">📦</div>
      <h2 style="font-size:24px;font-weight:400;color:#1a1215;margin:0;letter-spacing:0.02em">Your Order is On Its Way!</h2>
      <p style="color:#8a7a6a;font-size:14px;margin:10px 0 0">Great news — your order has been shipped</p>
      <p style="color:#ee9ca7;font-size:13px;font-weight:500;margin:6px 0 0;letter-spacing:0.1em;text-transform:uppercase">Order #${orderNumber}</p>
    </div>
    <div style="background:#faf8f5;padding:24px;margin:24px 0">
      <table style="width:100%">
        <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px;width:120px">Courier</td><td style="padding:8px 0;color:#1a1215;font-size:14px;font-weight:500">${courierName}</td></tr>
        <tr><td style="padding:8px 0;color:#8a7a6a;font-size:13px">Tracking No.</td><td style="padding:8px 0;color:#1a1215;font-size:14px;font-weight:500;letter-spacing:0.05em">${trackingNumber}</td></tr>
      </table>
    </div>
    <div style="text-align:center;margin:24px 0">
      <a href="${trackingUrl}" style="display:inline-block;background:linear-gradient(135deg,#ffdde1,#ee9ca7);color:white;text-decoration:none;padding:14px 40px;font-size:12px;letter-spacing:0.15em;text-transform:uppercase;font-weight:500">Track Your Parcel</a>
    </div>
    <p style="color:#8a7a6a;font-size:13px;line-height:1.7;margin-top:24px">You can track your parcel using the tracking number above on the courier's website. Delivery typically takes 2-4 business days.</p>
    <p style="color:#8a7a6a;font-size:13px;line-height:1.7">If you have any questions, WhatsApp us at <strong>012-643 1737</strong>.</p>
  `)
}

function generateInvoice() {
  const { invoiceNumber, orderNumber, customerName, issuedDate, items, subtotal, shippingCost, total } = sampleInvoice
  const itemRows = items.map(i => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #f0e8e0;font-size:13px;color:#1a1215">${i.name}</td>
      <td style="padding:12px;border-bottom:1px solid #f0e8e0;text-align:center;font-size:13px;color:#8a7a6a">${i.quantity}</td>
      <td style="padding:12px;border-bottom:1px solid #f0e8e0;text-align:right;font-size:13px;color:#1a1215">RM ${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`).join("")

  return emailWrapper(`
    <div style="text-align:center;margin-bottom:32px">
      <h2 style="font-size:24px;font-weight:400;color:#1a1215;margin:0;letter-spacing:0.02em">Invoice</h2>
      <p style="color:#ee9ca7;font-size:13px;font-weight:500;margin:10px 0 0;letter-spacing:0.1em;text-transform:uppercase">${invoiceNumber}</p>
    </div>
    <div style="background:#faf8f5;padding:20px;margin-bottom:24px">
      <table style="width:100%">
        <tr><td style="padding:6px 0;color:#8a7a6a;font-size:13px;width:100px">Order</td><td style="padding:6px 0;color:#1a1215;font-size:13px;font-weight:500">#${orderNumber}</td></tr>
        <tr><td style="padding:6px 0;color:#8a7a6a;font-size:13px">Date</td><td style="padding:6px 0;color:#1a1215;font-size:13px">${issuedDate}</td></tr>
        <tr><td style="padding:6px 0;color:#8a7a6a;font-size:13px">Bill To</td><td style="padding:6px 0;color:#1a1215;font-size:13px;font-weight:500">${customerName}</td></tr>
      </table>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:24px 0">
      <thead><tr style="background:#faf8f5"><th style="padding:10px 12px;text-align:left;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#b8a090;font-weight:500">Item</th><th style="padding:10px 12px;text-align:center;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#b8a090;font-weight:500">Qty</th><th style="padding:10px 12px;text-align:right;font-size:11px;letter-spacing:0.1em;text-transform:uppercase;color:#b8a090;font-weight:500">Amount</th></tr></thead>
      <tbody>${itemRows}</tbody>
    </table>
    <div style="background:#faf8f5;padding:16px 20px;margin:24px 0">
      <table style="width:100%">
        <tr><td style="padding:4px 0;color:#8a7a6a;font-size:13px">Subtotal</td><td style="padding:4px 0;color:#1a1215;font-size:13px;text-align:right">RM ${subtotal.toFixed(2)}</td></tr>
        <tr><td style="padding:4px 0;color:#8a7a6a;font-size:13px">Shipping</td><td style="padding:4px 0;color:#1a1215;font-size:13px;text-align:right">${shippingCost === 0 ? "FREE" : "RM " + shippingCost.toFixed(2)}</td></tr>
      </table>
      <div style="border-top:2px solid #ee9ca7;padding-top:12px;margin-top:8px"><table style="width:100%"><tr><td style="color:#1a1215;font-size:16px;font-weight:600">Total</td><td style="color:#1a1215;font-size:16px;font-weight:600;text-align:right">RM ${total.toFixed(2)}</td></tr></table></div>
    </div>
    <p style="color:#8a7a6a;font-size:13px;line-height:1.7;text-align:center;margin-top:24px">Thank you for your purchase! If you have any questions, WhatsApp us at <strong>012-643 1737</strong>.</p>
  `)
}

const templates = [
  { id: "order-confirmation", label: "Order Confirmation", generate: generateOrderConfirmation },
  { id: "shipping-update", label: "Shipping Update", generate: generateShippingUpdate },
  { id: "invoice", label: "Invoice", generate: generateInvoice },
]

export default function EmailPreviewPage() {
  const [active, setActive] = useState("order-confirmation")
  const template = templates.find((t) => t.id === active)!

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Email Templates</h1>

      <div className="flex gap-3 mb-6">
        {templates.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={`px-4 py-2 text-sm rounded transition-colors ${
              active === t.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{template.label} Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-[#f5f0ed] p-6 rounded-lg">
            <div
              className="mx-auto"
              style={{ maxWidth: 600 }}
              dangerouslySetInnerHTML={{ __html: template.generate() }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
