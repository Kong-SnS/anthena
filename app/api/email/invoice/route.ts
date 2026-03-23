import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/mailgun"
import { verifyAdmin } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin()
    if (!auth.authorized) return auth.response!

    const { invoice_id } = await request.json()

    const supabase = createAdminClient()
    const { data: invoice } = await supabase
      .from("invoices")
      .select("*, order:orders(*, customer:customers(email, name), order_items(*))")
      .eq("id", invoice_id)
      .single()

    if (!invoice || !invoice.order?.customer?.email) {
      return NextResponse.json({ error: "Invoice or customer not found" }, { status: 404 })
    }

    const order = invoice.order
    const items = order.order_items || []
    const itemRows = items
      .map((i: { product_name: string; quantity: number; unit_price: number }) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i.product_name}</td><td style="padding:8px;text-align:center;border-bottom:1px solid #eee">${i.quantity}</td><td style="padding:8px;text-align:right;border-bottom:1px solid #eee">RM ${(i.unit_price * i.quantity).toFixed(2)}</td></tr>`
      )
      .join("")

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h1>Invoice ${invoice.invoice_number}</h1>
        <p>Order: #${order.order_number}</p>
        <p>Date: ${new Date(invoice.issued_at).toLocaleDateString("en-MY")}</p>
        <p>Bill To: ${order.customer.name}</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <thead><tr style="background:#f9fafb"><th style="padding:8px;text-align:left">Item</th><th style="padding:8px;text-align:center">Qty</th><th style="padding:8px;text-align:right">Amount</th></tr></thead>
          <tbody>${itemRows}</tbody>
        </table>
        <p style="text-align:right"><strong>Subtotal:</strong> RM ${Number(order.subtotal).toFixed(2)}</p>
        <p style="text-align:right"><strong>Shipping:</strong> RM ${Number(order.shipping_cost).toFixed(2)}</p>
        <p style="text-align:right;font-size:18px"><strong>Total: RM ${Number(order.total).toFixed(2)}</strong></p>
        <p style="color:#6b7280;font-size:14px;margin-top:24px">Thank you for your purchase! - Anthena</p>
      </div>
    `

    const result = await sendEmail({
      to: order.customer.email,
      subject: `Invoice ${invoice.invoice_number} - Anthena`,
      html,
    })

    await supabase.from("email_logs").insert({
      order_id: order.id,
      customer_id: order.customer_id,
      to_email: order.customer.email,
      subject: `Invoice ${invoice.invoice_number} - Anthena`,
      template: "invoice",
      mailgun_message_id: result.id || null,
      status: "sent",
    })

    await supabase
      .from("invoices")
      .update({ sent_at: new Date().toISOString() })
      .eq("id", invoice_id)

    return NextResponse.json({ status: "sent" })
  } catch (err) {
    console.error("Invoice email error:", err)
    return NextResponse.json({ error: "Failed to send invoice" }, { status: 500 })
  }
}
